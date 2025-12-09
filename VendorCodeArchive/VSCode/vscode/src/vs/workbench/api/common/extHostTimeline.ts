//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { UriComponents, URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostTimelineShape, MainThreadTimelineShape, IMainContext, MainContext } from './extHost.protocol.js';
import { Timeline, TimelineItem, TimelineOptions, TimelineProvider } from '../../contrib/timeline/common/timeline.js';
import { IDisposable, toDisposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ThemeIcon, MarkdownString as MarkdownStringType } from './extHostTypes.js';
import { MarkdownString } from './extHostTypeConverters.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { isString } from '../../../base/common/types.js';
import { isProposedApiEnabled } from '../../services/extensions/common/extensions.js';

export interface IExtHostTimeline extends ExtHostTimelineShape {
	readonly _serviceBrand: undefined;
	$getTimeline(id: string, uri: UriComponents, options: vscode.TimelineOptions, token: vscode.CancellationToken): Promise<Timeline | undefined>;
}

export const IExtHostTimeline = createDecorator<IExtHostTimeline>('IExtHostTimeline');

export class ExtHostTimeline implements IExtHostTimeline {
	declare readonly _serviceBrand: undefined;

	private _proxy: MainThreadTimelineShape;

	private _providers = new Map<string, { provider: TimelineProvider; extension: ExtensionIdentifier }>();

	private _itemsBySourceAndUriMap = new Map<string, Map<string | undefined, Map<string, vscode.TimelineItem>>>();

	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadTimeline);

		commands.registerArgumentProcessor({
			processArgument: (arg, extension) => {
				if (arg && arg.$mid === MarshalledId.TimelineActionContext) {
					if (this._providers.get(arg.source) && extension && isProposedApiEnabled(extension, 'timeline')) {
						const uri = arg.uri === undefined ? undefined : URI.revive(arg.uri);
						return this._itemsBySourceAndUriMap.get(arg.source)?.get(getUriKey(uri))?.get(arg.handle);
					} else {
						return undefined;
					}
				}
				return arg;
			}
		});
	}

	async $getTimeline(id: string, uri: UriComponents, options: vscode.TimelineOptions, token: vscode.CancellationToken): Promise<Timeline | undefined> {
		const item = this._providers.get(id);
		return item?.provider.provideTimeline(URI.revive(uri), options, token);
	}

	registerTimelineProvider(scheme: string | string[], provider: vscode.TimelineProvider, extensionId: ExtensionIdentifier, commandConverter: CommandsConverter): IDisposable {
		const timelineDisposables = new DisposableStore();

		const convertTimelineItem = this.convertTimelineItem(provider.id, commandConverter, timelineDisposables).bind(this);

		let disposable: IDisposable | undefined;
		if (provider.onDidChange) {
			disposable = provider.onDidChange(e => this._proxy.$emitTimelineChangeEvent({ uri: undefined, reset: true, ...e, id: provider.id }), this);
		}

		const itemsBySourceAndUriMap = this._itemsBySourceAndUriMap;
		return this.registerTimelineProviderCore({
			...provider,
			scheme: scheme,
			onDidChange: undefined,
			async provideTimeline(uri: URI, options: TimelineOptions, token: CancellationToken) {
				if (options?.resetCache) {
					timelineDisposables.clear();

					// For now, only allow the caching of a single Uri
					// itemsBySourceAndUriMap.get(provider.id)?.get(getUriKey(uri))?.clear();
					itemsBySourceAndUriMap.get(provider.id)?.clear();
				}

				const result = await provider.provideTimeline(uri, options, token);
				if (result === undefined || result === null) {
					return undefined;
				}

				// TODO: Should we bother converting all the data if we aren't caching? Meaning it is being requested by an extension?

				const convertItem = convertTimelineItem(uri, options);
				return {
					...result,
					source: provider.id,
					items: result.items.map(convertItem)
				};
			},
			dispose() {
				for (const sourceMap of itemsBySourceAndUriMap.values()) {
					sourceMap.get(provider.id)?.clear();
				}

				disposable?.dispose();
				timelineDisposables.dispose();
			}
		}, extensionId);
	}

	private convertTimelineItem(source: string, commandConverter: CommandsConverter, disposables: DisposableStore) {
		return (uri: URI, options?: TimelineOptions) => {
			let items: Map<string, vscode.TimelineItem> | undefined;
			if (options?.cacheResults) {
				let itemsByUri = this._itemsBySourceAndUriMap.get(source);
				if (itemsByUri === undefined) {
					itemsByUri = new Map();
					this._itemsBySourceAndUriMap.set(source, itemsByUri);
				}

				const uriKey = getUriKey(uri);
				items = itemsByUri.get(uriKey);
				if (items === undefined) {
					items = new Map();
					itemsByUri.set(uriKey, items);
				}
			}

			return (item: vscode.TimelineItem): TimelineItem => {
				const { iconPath, ...props } = item;

				const handle = `${source}|${item.id ?? item.timestamp}`;
				items?.set(handle, item);

				let icon;
				let iconDark;
				let themeIcon;
				if (item.iconPath) {
					if (iconPath instanceof ThemeIcon) {
						themeIcon = { id: iconPath.id, color: iconPath.color };
					}
					else if (URI.isUri(iconPath)) {
						icon = iconPath;
						iconDark = iconPath;
					}
					else {
						({ light: icon, dark: iconDark } = iconPath as { light: URI; dark: URI });
					}
				}

				let tooltip;
				if (MarkdownStringType.isMarkdownString(props.tooltip)) {
					tooltip = MarkdownString.from(props.tooltip);
				}
				else if (isString(props.tooltip)) {
					tooltip = props.tooltip;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				}
				// TODO @jkearl, remove once migration complete.
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				else if (MarkdownStringType.isMarkdownString((props as any).detail)) {
					console.warn('Using deprecated TimelineItem.detail, migrate to TimelineItem.tooltip');
					tooltip = MarkdownString.from((props as any).detail);
				}
				else if (isString((props as any).detail)) {
					console.warn('Using deprecated TimelineItem.detail, migrate to TimelineItem.tooltip');
					tooltip = (props as any).detail;
				}

				return {
					...props,
					id: props.id ?? undefined,
					handle: handle,
					source: source,
					command: item.command ? commandConverter.toInternal(item.command, disposables) : undefined,
					icon: icon,
					iconDark: iconDark,
					themeIcon: themeIcon,
					tooltip,
					accessibilityInformation: item.accessibilityInformation
				};
			};
		};
	}

	private registerTimelineProviderCore(provider: TimelineProvider, extension: ExtensionIdentifier): IDisposable {
		// console.log(`ExtHostTimeline#registerTimelineProvider: id=${provider.id}`);

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 190: Error message without production error code - breaks React bundle size optimization
//   2. Line 190: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const existing = this._providers.get(provider.id);
		if (existing) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 214: Error message without production error code - breaks React bundle size optimization
//   2. Line 214: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Timeline Provider ${provider.id} already exists.`);
		}

		this._proxy.$registerTimelineProvider({
			id: provider.id,
			label: provider.label,
			scheme: provider.scheme
		});
		this._providers.set(provider.id, { provider, extension });

		return toDisposable(() => {
			for (const sourceMap of this._itemsBySourceAndUriMap.values()) {
				sourceMap.get(provider.id)?.clear();
			}

			this._providers.delete(provider.id);
			this._proxy.$unregisterTimelineProvider(provider.id);
			provider.dispose();
		});
	}
}

function getUriKey(uri: URI | undefined): string | undefined {
	return uri?.toString();
}
