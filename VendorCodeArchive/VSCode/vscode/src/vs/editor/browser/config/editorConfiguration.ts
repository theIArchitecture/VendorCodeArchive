//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../../base/browser/browser.js';
import * as arrays from '../../../base/common/arrays.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as objects from '../../../base/common/objects.js';
import * as platform from '../../../base/common/platform.js';
import { ElementSizeObserver } from './elementSizeObserver.js';
import { FontMeasurements } from './fontMeasurements.js';
import { migrateOptions } from './migrateOptions.js';
import { TabFocus } from './tabFocus.js';
import { ComputeOptionsMemory, ConfigurationChangedEvent, EditorOption, editorOptionsRegistry, FindComputedEditorOptionValueById, IComputedEditorOptions, IEditorOptions, IEnvironmentalOptions } from '../../common/config/editorOptions.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { BareFontInfo, FontInfo, IValidatedEditorOptions } from '../../common/config/fontInfo.js';
import { IDimension } from '../../common/core/2d/dimension.js';
import { IEditorConfiguration } from '../../common/config/editorConfiguration.js';
import { AccessibilitySupport, IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { getWindow, getWindowById } from '../../../base/browser/dom.js';
import { PixelRatio } from '../../../base/browser/pixelRatio.js';
import { MenuId } from '../../../platform/actions/common/actions.js';
import { InputMode } from '../../common/inputMode.js';

export interface IEditorConstructionOptions extends IEditorOptions {
	/**
	 * The initial editor dimension (to avoid measuring the container).
	 */
	dimension?: IDimension;
	/**
	 * Place overflow widgets inside an external DOM node.
	 * Defaults to an internal DOM node.
	 */
	overflowWidgetsDomNode?: HTMLElement;
}

export class EditorConfiguration extends Disposable implements IEditorConfiguration {

	private _onDidChange = this._register(new Emitter<ConfigurationChangedEvent>());
	public readonly onDidChange: Event<ConfigurationChangedEvent> = this._onDidChange.event;

	private _onDidChangeFast = this._register(new Emitter<ConfigurationChangedEvent>());
	public readonly onDidChangeFast: Event<ConfigurationChangedEvent> = this._onDidChangeFast.event;

	public readonly isSimpleWidget: boolean;
	public readonly contextMenuId: MenuId;
	private readonly _containerObserver: ElementSizeObserver;

	private _isDominatedByLongLines: boolean = false;
	private _viewLineCount: number = 1;
	private _lineNumbersDigitCount: number = 1;
	private _reservedHeight: number = 0;
	private _glyphMarginDecorationLaneCount: number = 1;
	private _targetWindowId: number;

	private readonly _computeOptionsMemory: ComputeOptionsMemory = new ComputeOptionsMemory();
	/**
	 * Raw options as they were passed in and merged with all calls to `updateOptions`.
	 */
	private readonly _rawOptions: IEditorOptions;
	/**
	 * Validated version of `_rawOptions`.
	 */
	private _validatedOptions: ValidatedEditorOptions;
	/**
	 * Complete options which are a combination of passed in options and env values.
	 */
	public options: ComputedEditorOptions;

	constructor(
		isSimpleWidget: boolean,
		contextMenuId: MenuId,
		options: Readonly<IEditorConstructionOptions>,
		container: HTMLElement | null,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this.isSimpleWidget = isSimpleWidget;
		this.contextMenuId = contextMenuId;
		this._containerObserver = this._register(new ElementSizeObserver(container, options.dimension));
		this._targetWindowId = getWindow(container).vscodeWindowId;

		this._rawOptions = deepCloneAndMigrateOptions(options);
		this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
		this.options = this._computeOptions();

		if (this.options.get(EditorOption.automaticLayout)) {
			this._containerObserver.startObserving();
		}

		this._register(EditorZoom.onDidChangeZoomLevel(() => this._recomputeOptions()));
		this._register(TabFocus.onDidChangeTabFocus(() => this._recomputeOptions()));
		this._register(this._containerObserver.onDidChange(() => this._recomputeOptions()));
		this._register(FontMeasurements.onDidChange(() => this._recomputeOptions()));
		this._register(PixelRatio.getInstance(getWindow(container)).onDidChange(() => this._recomputeOptions()));
		this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => this._recomputeOptions()));
		this._register(InputMode.onDidChangeInputMode(() => this._recomputeOptions()));
	}

	private _recomputeOptions(): void {
		const newOptions = this._computeOptions();
		const changeEvent = EditorOptionsUtil.checkEquals(this.options, newOptions);
		if (changeEvent === null) {
			// nothing changed!
			return;
		}

		this.options = newOptions;
		this._onDidChangeFast.fire(changeEvent);
		this._onDidChange.fire(changeEvent);
	}

	private _computeOptions(): ComputedEditorOptions {
		const partialEnv = this._readEnvConfiguration();
		const bareFontInfo = BareFontInfo.createFromValidatedSettings(this._validatedOptions, partialEnv.pixelRatio, this.isSimpleWidget);
		const fontInfo = this._readFontInfo(bareFontInfo);
		const env: IEnvironmentalOptions = {
			memory: this._computeOptionsMemory,
			outerWidth: partialEnv.outerWidth,
			outerHeight: partialEnv.outerHeight - this._reservedHeight,
			fontInfo: fontInfo,
			extraEditorClassName: partialEnv.extraEditorClassName,
			isDominatedByLongLines: this._isDominatedByLongLines,
			viewLineCount: this._viewLineCount,
			lineNumbersDigitCount: this._lineNumbersDigitCount,
			emptySelectionClipboard: partialEnv.emptySelectionClipboard,
			pixelRatio: partialEnv.pixelRatio,
			tabFocusMode: this._validatedOptions.get(EditorOption.tabFocusMode) || TabFocus.getTabFocusMode(),
			inputMode: InputMode.getInputMode(),
			accessibilitySupport: partialEnv.accessibilitySupport,
			glyphMarginDecorationLaneCount: this._glyphMarginDecorationLaneCount,
			editContextSupported: partialEnv.editContextSupported
		};
		return EditorOptionsUtil.computeOptions(this._validatedOptions, env);
	}

	protected _readEnvConfiguration(): IEnvConfiguration {
		return {
			extraEditorClassName: getExtraEditorClassName(),
			outerWidth: this._containerObserver.getWidth(),
			outerHeight: this._containerObserver.getHeight(),
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			emptySelectionClipboard: browser.isWebKit || browser.isFirefox,
			pixelRatio: PixelRatio.getInstance(getWindowById(this._targetWindowId, true).window).value,
			editContextSupported: typeof (globalThis as any).EditContext === 'function',
			accessibilitySupport: (
				this._accessibilityService.isScreenReaderOptimized()
					? AccessibilitySupport.Enabled
					: this._accessibilityService.getAccessibilitySupport()
			)
		};
	}

	protected _readFontInfo(bareFontInfo: BareFontInfo): FontInfo {
		return FontMeasurements.readFontInfo(getWindowById(this._targetWindowId, true).window, bareFontInfo);
	}

	public getRawOptions(): IEditorOptions {
		return this._rawOptions;
	}

	public updateOptions(_newOptions: Readonly<IEditorOptions>): void {
		const newOptions = deepCloneAndMigrateOptions(_newOptions);

		const didChange = EditorOptionsUtil.applyUpdate(this._rawOptions, newOptions);
		if (!didChange) {
			return;
		}

		this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
		this._recomputeOptions();
	}

	public observeContainer(dimension?: IDimension): void {
		this._containerObserver.observe(dimension);
	}

	public setIsDominatedByLongLines(isDominatedByLongLines: boolean): void {
		if (this._isDominatedByLongLines === isDominatedByLongLines) {
			return;
		}
		this._isDominatedByLongLines = isDominatedByLongLines;
		this._recomputeOptions();
	}

	public setModelLineCount(modelLineCount: number): void {
		const lineNumbersDigitCount = digitCount(modelLineCount);
		if (this._lineNumbersDigitCount === lineNumbersDigitCount) {
			return;
		}
		this._lineNumbersDigitCount = lineNumbersDigitCount;
		this._recomputeOptions();
	}

	public setViewLineCount(viewLineCount: number): void {
		if (this._viewLineCount === viewLineCount) {
			return;
		}
		this._viewLineCount = viewLineCount;
		this._recomputeOptions();
	}

	public setReservedHeight(reservedHeight: number) {
		if (this._reservedHeight === reservedHeight) {
			return;
		}
		this._reservedHeight = reservedHeight;
		this._recomputeOptions();
	}

	public setGlyphMarginDecorationLaneCount(decorationLaneCount: number): void {
		if (this._glyphMarginDecorationLaneCount === decorationLaneCount) {
			return;
		}
		this._glyphMarginDecorationLaneCount = decorationLaneCount;
		this._recomputeOptions();
	}
}

function digitCount(n: number): number {
	let r = 0;
	while (n) {
		n = Math.floor(n / 10);
		r++;
	}
	return r ? r : 1;
}

function getExtraEditorClassName(): string {
	let extra = '';
	if (browser.isSafari || browser.isWebkitWebView) {
		// See https://github.com/microsoft/vscode/issues/108822
		extra += 'no-minimap-shadow ';
		extra += 'enable-user-select ';
	} else {
		// Use user-select: none in all browsers except Safari and native macOS WebView
		extra += 'no-user-select ';
	}
	if (platform.isMacintosh) {
		extra += 'mac ';
	}
	return extra;
}

export interface IEnvConfiguration {
	extraEditorClassName: string;
	outerWidth: number;
	outerHeight: number;
	emptySelectionClipboard: boolean;
	pixelRatio: number;
	accessibilitySupport: AccessibilitySupport;
	editContextSupported: boolean;
}

class ValidatedEditorOptions implements IValidatedEditorOptions {
	private readonly _values: any[] = [];
	public _read<T>(option: EditorOption): T {
		return this._values[option];
	}
	public get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._values[id];
	}
	public _write<T>(option: EditorOption, value: T): void {
		this._values[option] = value;
	}
}

export class ComputedEditorOptions implements IComputedEditorOptions {
	private readonly _values: any[] = [];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 273: Error message without production error code - breaks React bundle size optimization
//   2. Line 273: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	public _read<T>(id: EditorOption): T {
		if (id >= this._values.length) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 292: Error message without production error code - breaks React bundle size optimization
//   2. Line 292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Cannot read uninitialized value');
		}
		return this._values[id];
	}
	public get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._read(id);
	}
	public _write<T>(id: EditorOption, value: T): void {
		this._values[id] = value;
	}
}

class EditorOptionsUtil {

	public static validateOptions(options: IEditorOptions): ValidatedEditorOptions {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const result = new ValidatedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			const value = (editorOption.name === '_never_' ? undefined : (options as any)[editorOption.name]);
			result._write(editorOption.id, editorOption.validate(value));
		}
		return result;
	}

	public static computeOptions(options: ValidatedEditorOptions, env: IEnvironmentalOptions): ComputedEditorOptions {
		const result = new ComputedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			result._write(editorOption.id, editorOption.compute(env, result, options._read(editorOption.id)));
		}
		return result;
	}

	private static _deepEquals<T>(a: T, b: T): boolean {
		if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
			return a === b;
		}
		if (Array.isArray(a) || Array.isArray(b)) {
			return (Array.isArray(a) && Array.isArray(b) ? arrays.equals(a, b) : false);
		}
		if (Object.keys(a as unknown as object).length !== Object.keys(b as unknown as object).length) {
			return false;
		}
		for (const key in a) {
			if (!EditorOptionsUtil._deepEquals(a[key], b[key])) {
				return false;
			}
		}
		return true;
	}

	public static checkEquals(a: ComputedEditorOptions, b: ComputedEditorOptions): ConfigurationChangedEvent | null {
		const result: boolean[] = [];
		let somethingChanged = false;
		for (const editorOption of editorOptionsRegistry) {
			const changed = !EditorOptionsUtil._deepEquals(a._read(editorOption.id), b._read(editorOption.id));
			result[editorOption.id] = changed;
			if (changed) {
				somethingChanged = true;
			}
		}
		return (somethingChanged ? new ConfigurationChangedEvent(result) : null);
	}

	/**
	 * Returns true if something changed.
	 * Modifies `options`.
	*/
	public static applyUpdate(options: IEditorOptions, update: Readonly<IEditorOptions>): boolean {
		let changed = false;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		for (const editorOption of editorOptionsRegistry) {
			if (update.hasOwnProperty(editorOption.name)) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				const result = editorOption.applyUpdate((options as any)[editorOption.name], (update as any)[editorOption.name]);
				(options as any)[editorOption.name] = result.newValue;
				changed = changed || result.didChange;
			}
		}
		return changed;
	}
}

function deepCloneAndMigrateOptions(_options: Readonly<IEditorOptions>): IEditorOptions {
	const options = objects.deepClone(_options);
	migrateOptions(options);
	return options;
}
