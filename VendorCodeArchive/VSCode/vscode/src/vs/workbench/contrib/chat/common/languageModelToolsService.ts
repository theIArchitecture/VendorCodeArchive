//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Location } from '../../../../editor/common/languages.js';
import { ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IChatExtensionsContent, IChatToolInputInvocationData, IChatTodoListContent, type IChatTerminalToolInvocationData } from './chatService.js';
import { PromptElementJSON, stringifyPromptElementJSON } from './tools/promptTsxTypes.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { derived, IObservable, IReader, ITransaction, ObservableSet } from '../../../../base/common/observable.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { localize } from '../../../../nls.js';
import { LanguageModelPartAudience } from './languageModels.js';

export interface IToolData {
	id: string;
	source: ToolDataSource;
	toolReferenceName?: string;
	icon?: { dark: URI; light?: URI } | ThemeIcon;
	when?: ContextKeyExpression;
	tags?: string[];
	displayName: string;
	userDescription?: string;
	modelDescription: string;
	inputSchema?: IJSONSchema;
	canBeReferencedInPrompt?: boolean;
	/**
	 * True if the tool runs in the (possibly remote) workspace, false if it runs
	 * on the host, undefined if known.
	 */
	runsInWorkspace?: boolean;
	alwaysDisplayInputOutput?: boolean;
}

export interface IToolProgressStep {
	readonly message: string | IMarkdownString | undefined;
	readonly increment?: number;
	readonly total?: number;
}

export type ToolProgress = IProgress<IToolProgressStep>;

export type ToolDataSource =
	| {
		type: 'extension';
		label: string;
		extensionId: ExtensionIdentifier;
	}
	| {
		type: 'mcp';
		label: string;
		serverLabel: string | undefined;
		instructions: string | undefined;
		collectionId: string;
		definitionId: string;
	}
	| {
		type: 'user';
		label: string;
		file: URI;
	}
	| {
		type: 'internal';
		label: string;
	};

export namespace ToolDataSource {

	export const Internal: ToolDataSource = { type: 'internal', label: 'Built-In' };

	export function toKey(source: ToolDataSource): string {
		switch (source.type) {
			case 'extension': return `extension:${source.extensionId.value}`;
			case 'mcp': return `mcp:${source.collectionId}:${source.definitionId}`;
			case 'user': return `user:${source.file.toString()}`;
			case 'internal': return 'internal';
		}
	}

	export function equals(a: ToolDataSource, b: ToolDataSource): boolean {
		return toKey(a) === toKey(b);
	}

	export function classify(source: ToolDataSource): { readonly ordinal: number; readonly label: string } {
		if (source.type === 'internal') {
			return { ordinal: 1, label: localize('builtin', 'Built-In') };
		} else if (source.type === 'mcp') {
			return { ordinal: 2, label: localize('mcp', 'MCP Server: {0}', source.label) };
		} else if (source.type === 'user') {
			return { ordinal: 0, label: localize('user', 'User Defined') };
		} else {
			return { ordinal: 3, label: localize('ext', 'Extension: {0}', source.label) };
		}
	}
}

export interface IToolInvocation {
	callId: string;
	toolId: string;
	parameters: Object;
	tokenBudget?: number;
	context: IToolInvocationContext | undefined;
	chatRequestId?: string;
	chatInteractionId?: string;
	toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatTodoListContent;
	modelId?: string;
}

export interface IToolInvocationContext {
	sessionId: string;
}

export function isToolInvocationContext(obj: any): obj is IToolInvocationContext {
	return typeof obj === 'object' && typeof obj.sessionId === 'string';
}

export interface IToolInvocationPreparationContext {
	parameters: any;
	chatRequestId?: string;
	chatSessionId?: string;
	chatInteractionId?: string;
}

export type ToolInputOutputBase = {
	/** Mimetype of the value, optional */
	mimeType?: string;
	/** URI of the resource on the MCP server. */
	uri?: URI;
	/** If true, this part came in as a resource reference rather than direct data. */
	asResource?: boolean;
};

export type ToolInputOutputEmbedded = ToolInputOutputBase & {
	type: 'embed';
	value: string;
	/** If true, value is text. If false or not given, value is base64 */
	isText?: boolean;
};

export type ToolInputOutputReference = ToolInputOutputBase & { type: 'ref'; uri: URI };

export interface IToolResultInputOutputDetails {
	readonly input: string;
	readonly output: (ToolInputOutputEmbedded | ToolInputOutputReference)[];
	readonly isError?: boolean;
}

export interface IToolResultOutputDetails {
	readonly output: { type: 'data'; mimeType: string; value: VSBuffer };
}

export function isToolResultInputOutputDetails(obj: any): obj is IToolResultInputOutputDetails {
	return typeof obj === 'object' && typeof obj?.input === 'string' && (typeof obj?.output === 'string' || Array.isArray(obj?.output));
}

export function isToolResultOutputDetails(obj: any): obj is IToolResultOutputDetails {
	return typeof obj === 'object' && typeof obj?.output === 'object' && typeof obj?.output?.mimeType === 'string' && obj?.output?.type === 'data';
}

export interface IToolResult {
	content: (IToolResultPromptTsxPart | IToolResultTextPart | IToolResultDataPart)[];
	toolResultMessage?: string | IMarkdownString;
	toolResultDetails?: Array<URI | Location> | IToolResultInputOutputDetails | IToolResultOutputDetails;
	toolResultError?: string;
}

export function toolResultHasBuffers(result: IToolResult): boolean {
	return result.content.some(part => part.kind === 'data');
}

export interface IToolResultPromptTsxPart {
	kind: 'promptTsx';
	value: unknown;
}

export function stringifyPromptTsxPart(part: IToolResultPromptTsxPart): string {
	return stringifyPromptElementJSON(part.value as PromptElementJSON);
}

export interface IToolResultTextPart {
	kind: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
}

export interface IToolResultDataPart {
	kind: 'data';
	value: {
		mimeType: string;
		data: VSBuffer;
	};
	audience?: LanguageModelPartAudience[];
}

export interface IToolConfirmationMessages {
	title: string | IMarkdownString;
	message: string | IMarkdownString;
	disclaimer?: string | IMarkdownString;
	allowAutoConfirm?: boolean;
	terminalCustomActions?: IToolConfirmationAction[];
}

export interface IToolConfirmationAction {
	label: string;
	tooltip?: string;
	data: any;
}

export interface IPreparedToolInvocation {
	invocationMessage?: string | IMarkdownString;
	pastTenseMessage?: string | IMarkdownString;
	originMessage?: string | IMarkdownString;
	confirmationMessages?: IToolConfirmationMessages;
	presentation?: 'hidden' | undefined;
	toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatTodoListContent;
}

export interface IToolImpl {
	invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult>;
	prepareToolInvocation?(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined>;
}

export type IToolAndToolSetEnablementMap = ReadonlyMap<IToolData | ToolSet, boolean>;

export class ToolSet {

	protected readonly _tools = new ObservableSet<IToolData>();

	protected readonly _toolSets = new ObservableSet<ToolSet>();

	/**
	 * A homogenous tool set only contains tools from the same source as the tool set itself
	 */
	readonly isHomogenous: IObservable<boolean>;

	constructor(
		readonly id: string,
		readonly referenceName: string,
		readonly icon: ThemeIcon,
		readonly source: ToolDataSource,
		readonly description?: string,
	) {

		this.isHomogenous = derived(r => {
			return !Iterable.some(this._tools.observable.read(r), tool => !ToolDataSource.equals(tool.source, this.source))
				&& !Iterable.some(this._toolSets.observable.read(r), toolSet => !ToolDataSource.equals(toolSet.source, this.source));
		});
	}

	addTool(data: IToolData, tx?: ITransaction): IDisposable {
		this._tools.add(data, tx);
		return toDisposable(() => {
			this._tools.delete(data);
		});
	}

	addToolSet(toolSet: ToolSet, tx?: ITransaction): IDisposable {
		if (toolSet === this) {
			return Disposable.None;
		}
		this._toolSets.add(toolSet, tx);
		return toDisposable(() => {
			this._toolSets.delete(toolSet);
		});
	}

	getTools(r?: IReader): Iterable<IToolData> {
		return Iterable.concat(
			this._tools.observable.read(r),
			...Iterable.map(this._toolSets.observable.read(r), toolSet => toolSet.getTools(r))
		);
	}
}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 292: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 292: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding



// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 327: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 327: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 345: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 356: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 360: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 360: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 367: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 378: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 389: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 393: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 393: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 404: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 404: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 411: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 415: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 415: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 422: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 426: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 426: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 433: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 444: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 448: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 448: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 455: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 459: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 459: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 466: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 470: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 470: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 477: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 481: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 481: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 488: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 492: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 492: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 499: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 503: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 503: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 510: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 514: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 514: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 521: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 525: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 525: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 532: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 536: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 536: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 543: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 547: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 547: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 554: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 558: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 558: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 565: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 569: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 569: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILanguageModelToolsService = createDecorator<ILanguageModelToolsService>('ILanguageModelToolsService');

export type CountTokensCallback = (input: string, token: CancellationToken) => Promise<number>;

export interface ILanguageModelToolsService {
	_serviceBrand: undefined;
	onDidChangeTools: Event<void>;
	registerToolData(toolData: IToolData): IDisposable;
	registerToolImplementation(id: string, tool: IToolImpl): IDisposable;
	flushToolChanges(): void;
	getTools(): Iterable<Readonly<IToolData>>;
	getTool(id: string): IToolData | undefined;
	getToolByName(name: string, includeDisabled?: boolean): IToolData | undefined;
	invokeTool(invocation: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult>;
	setToolAutoConfirmation(toolId: string, scope: 'workspace' | 'profile' | 'memory', autoConfirm?: boolean): void;
	resetToolAutoConfirmation(): void;
	cancelToolCallsForRequest(requestId: string): void;
	toToolEnablementMap(toolOrToolSetNames: Set<string>): Record<string, boolean>;
	toToolAndToolSetEnablementMap(toolOrToolSetNames: readonly string[] | undefined): IToolAndToolSetEnablementMap;

	readonly toolSets: IObservable<Iterable<ToolSet>>;
	getToolSet(id: string): ToolSet | undefined;
	getToolSetByName(name: string): ToolSet | undefined;
	createToolSet(source: ToolDataSource, id: string, referenceName: string, options?: { icon?: ThemeIcon; description?: string }): ToolSet & IDisposable;
}

export function createToolInputUri(toolOrId: IToolData | string): URI {
	if (typeof toolOrId !== 'string') {
		toolOrId = toolOrId.id;
	}
	return URI.from({ scheme: Schemas.inMemory, path: `/lm/tool/${toolOrId}/tool_input.json` });
}

export function createToolSchemaUri(toolOrId: IToolData | string): URI {
	if (typeof toolOrId !== 'string') {
		toolOrId = toolOrId.id;
	}
	return URI.from({ scheme: Schemas.vscode, authority: 'schemas', path: `/lm/tool/${toolOrId}` });
}
