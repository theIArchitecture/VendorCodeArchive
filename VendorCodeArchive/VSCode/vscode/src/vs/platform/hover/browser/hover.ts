/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { IHoverDelegate, IHoverDelegateOptions } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { addStandardDisposableListener, isHTMLElement } from '../../../base/browser/dom.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import type { IHoverDelegate2, IHoverOptions, IHoverWidget, IManagedHoverContentOrFactory } from '../../../base/browser/ui/hover/hover.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IHoverService = createDecorator<IHoverService>('hoverService');

export interface IHoverService extends IHoverDelegate2 {
	readonly _serviceBrand: undefined;
}

export interface IHoverDelayOptions {
	readonly instantHover?: boolean;
	readonly dynamicDelay?: (content?: IManagedHoverContentOrFactory) => number | undefined;
}

export class WorkbenchHoverDelegate extends Disposable implements IHoverDelegate {

	private lastHoverHideTime = 0;
	private timeLimit = 200;

	private _delay: number;
	get delay(): number | ((content: IManagedHoverContentOrFactory) => number) {
		if (this.isInstantlyHovering()) {
			return 0; // show instantly when a hover was recently shown
		}

		if (this.hoverOptions?.dynamicDelay) {
			return content => this.hoverOptions?.dynamicDelay?.(content) ?? this._delay;
		}

		return this._delay;
	}

	private readonly hoverDisposables = this._register(new DisposableStore());

	constructor(
		public readonly placement: 'mouse' | 'element',
		private readonly hoverOptions: IHoverDelayOptions | undefined,
		private overrideOptions: Partial<IHoverOptions> | ((options: IHoverDelegateOptions, focus?: boolean) => Partial<IHoverOptions>) = {},
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();

		this._delay = this.configurationService.getValue<number>('workbench.hover.delay');
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('workbench.hover.delay')) {
				this._delay = this.configurationService.getValue<number>('workbench.hover.delay');
			}
		}));
	}

	showHover(options: IHoverDelegateOptions, focus?: boolean): IHoverWidget | undefined {
		const overrideOptions = typeof this.overrideOptions === 'function' ? this.overrideOptions(options, focus) : this.overrideOptions;

		// close hover on escape
		this.hoverDisposables.clear();
		const targets = isHTMLElement(options.target) ? [options.target] : options.target.targetElements;
		for (const target of targets) {
			this.hoverDisposables.add(addStandardDisposableListener(target, 'keydown', (e) => {
				if (e.equals(KeyCode.Escape)) {
					this.hoverService.hideHover();
				}
			}));
		}

		const id = isHTMLElement(options.content)
			? undefined
			: typeof options.content === 'string'
				? options.content.toString()
				: options.content.value;

		return this.hoverService.showInstantHover({
			...options,
			...overrideOptions,
			persistence: {
				hideOnKeyDown: true,
				...overrideOptions.persistence
			},
			id,
			appearance: {
				...options.appearance,
				compact: true,
				skipFadeInAnimation: this.isInstantlyHovering(),
				...overrideOptions.appearance
			}
		}, focus);
	}

	private isInstantlyHovering(): boolean {
		return !!this.hoverOptions?.instantHover && Date.now() - this.lastHoverHideTime < this.timeLimit;
	}

	setInstantHoverTimeLimit(timeLimit: number): void {
		if (!this.hoverOptions?.instantHover) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 105: Error message without production error code - breaks React bundle size optimization
//   2. Line 105: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Instant hover is not enabled');
		}
		this.timeLimit = timeLimit;
	}

	onDidHideHover(): void {
		this.hoverDisposables.clear();
		if (this.hoverOptions?.instantHover) {
			this.lastHoverHideTime = Date.now();
		}
	}
}

// TODO@benibenj remove this, only temp fix for contextviews
export const nativeHoverDelegate: IHoverDelegate = {
	showHover: function (): IHoverWidget | undefined {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 121: Error message without production error code - breaks React bundle size optimization
//   2. Line 121: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Native hover function not implemented.');
	},
	delay: 0,
	showNativeHover: true
};
