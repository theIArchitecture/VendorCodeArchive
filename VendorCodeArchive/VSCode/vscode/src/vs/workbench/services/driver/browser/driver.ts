//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getClientArea, getTopLeftOffset, isHTMLDivElement, isHTMLTextAreaElement } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { language, locale } from '../../../../base/common/platform.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import localizedStrings from '../../../../platform/languagePacks/common/localizedStrings.js';
import { ILogFile, getLogs } from '../../../../platform/log/browser/log.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IWindowDriver, IElement, ILocaleInfo, ILocalizedStrings } from '../common/driver.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import type { Terminal as XtermTerminal } from '@xterm/xterm';

export class BrowserWindowDriver implements IWindowDriver {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ILogService private readonly logService: ILogService
	) {
	}

	async getLogs(): Promise<ILogFile[]> {
		return getLogs(this.fileService, this.environmentService);
	}

	async whenWorkbenchRestored(): Promise<void> {
		this.logService.info('[driver] Waiting for restored lifecycle phase...');
		await this.lifecycleService.when(LifecyclePhase.Restored);
		this.logService.info('[driver] Restored lifecycle phase reached. Waiting for contributions...');
		await Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).whenRestored;
		this.logService.info('[driver] Workbench contributions created.');
	}

	async setValue(selector: string, text: string): Promise<void> {
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			return Promise.reject(new Error(`Element not found: ${selector}`));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		}

		const inputElement = element as HTMLInputElement;
		inputElement.value = text;

		const event = new Event('input', { bubbles: true, cancelable: true });
		inputElement.dispatchEvent(event);
	}

	async isActiveElement(selector: string): Promise<boolean> {
		const element = mainWindow.document.querySelector(selector);

		if (element !== mainWindow.document.activeElement) {
			const chain: string[] = [];
			let el = mainWindow.document.activeElement;

			while (el) {
				const tagName = el.tagName;
				const id = el.id ? `#${el.id}` : '';
				const classes = coalesce(el.className.split(/\s+/g).map(c => c.trim())).map(c => `.${c}`).join('');
				chain.unshift(`${tagName}${id}${classes}`);

				el = el.parentElement;
			}

			throw new Error(`Active element not found. Current active element is '${chain.join(' > ')}'. Looking for ${selector}`);
		}

		return true;
	}

	async getElements(selector: string, recursive: boolean): Promise<IElement[]> {
		const query = mainWindow.document.querySelectorAll(selector);
		const result: IElement[] = [];
		for (let i = 0; i < query.length; i++) {
			const element = query.item(i);
			result.push(this.serializeElement(element, recursive));
		}

		return result;
	}

	private serializeElement(element: Element, recursive: boolean): IElement {
		const attributes = Object.create(null);

		for (let j = 0; j < element.attributes.length; j++) {
			const attr = element.attributes.item(j);
			if (attr) {
				attributes[attr.name] = attr.value;
			}
		}

		const children: IElement[] = [];

		if (recursive) {
			for (let i = 0; i < element.children.length; i++) {
				const child = element.children.item(i);
				if (child) {
					children.push(this.serializeElement(child, true));
				}
			}
		}

		const { left, top } = getTopLeftOffset(element as HTMLElement);

		return {
			tagName: element.tagName,
			className: element.className,
			textContent: element.textContent || '',
			attributes,
			children,
			left,
			top
		};
	}

	async getElementXY(selector: string, xoffset?: number, yoffset?: number): Promise<{ x: number; y: number }> {
		const offset = typeof xoffset === 'number' && typeof yoffset === 'number' ? { x: xoffset, y: yoffset } : undefined;
		return this._getElementXY(selector, offset);
	}

	async typeInEditor(selector: string, text: string): Promise<void> {
		const element = mainWindow.document.querySelector(selector);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 134: Error message without production error code - breaks React bundle size optimization
//   2. Line 134: Error message without production error code - breaks React bundle size optimization
//   3. Line 140: Error message without production error code - breaks React bundle size optimization
//   4. Line 140: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!element) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 155: Error message without production error code - breaks React bundle size optimization
//   2. Line 155: Error message without production error code - breaks React bundle size optimization
//   3. Line 161: Error message without production error code - breaks React bundle size optimization
//   4. Line 161: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 167: Error message without production error code - breaks React bundle size optimization
//   2. Line 167: Error message without production error code - breaks React bundle size optimization
//   3. Line 173: Error message without production error code - breaks React bundle size optimization
//   4. Line 173: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 179: Error message without production error code - breaks React bundle size optimization
//   2. Line 179: Error message without production error code - breaks React bundle size optimization
//   3. Line 185: Error message without production error code - breaks React bundle size optimization
//   4. Line 185: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 191: Error message without production error code - breaks React bundle size optimization
//   2. Line 191: Error message without production error code - breaks React bundle size optimization
//   3. Line 197: Error message without production error code - breaks React bundle size optimization
//   4. Line 197: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 203: Error message without production error code - breaks React bundle size optimization
//   2. Line 203: Error message without production error code - breaks React bundle size optimization
//   3. Line 209: Error message without production error code - breaks React bundle size optimization
//   4. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 215: Error message without production error code - breaks React bundle size optimization
//   2. Line 215: Error message without production error code - breaks React bundle size optimization
//   3. Line 221: Error message without production error code - breaks React bundle size optimization
//   4. Line 221: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Editor not found: ${selector}`);
		}
		if (isHTMLDivElement(element)) {
			// Edit context is enabled
			const editContext = element.editContext;
			if (!editContext) {
				throw new Error(`Edit context not found: ${selector}`);
			}
			const selectionStart = editContext.selectionStart;
			const selectionEnd = editContext.selectionEnd;
			const event = new TextUpdateEvent('textupdate', {
				updateRangeStart: selectionStart,
				updateRangeEnd: selectionEnd,
				text,
				selectionStart: selectionStart + text.length,
				selectionEnd: selectionStart + text.length,
				compositionStart: 0,
				compositionEnd: 0
			});
			editContext.dispatchEvent(event);
		} else if (isHTMLTextAreaElement(element)) {
			const start = element.selectionStart;
			const newStart = start + text.length;
			const value = element.value;
			const newValue = value.substr(0, start) + text + value.substr(start);

			element.value = newValue;
			element.setSelectionRange(newStart, newStart);

			const event = new Event('input', { 'bubbles': true, 'cancelable': true });
			element.dispatchEvent(event);
		}
	}

	async getEditorSelection(selector: string): Promise<{ selectionStart: number; selectionEnd: number }> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 171: Error message without production error code - breaks React bundle size optimization
//   2. Line 171: Error message without production error code - breaks React bundle size optimization
//   3. Line 176: Error message without production error code - breaks React bundle size optimization
//   4. Line 176: Error message without production error code - breaks React bundle size optimization
//   5. Line 182: Error message without production error code - breaks React bundle size optimization
//   6. Line 182: Error message without production error code - breaks React bundle size optimization
//   7. Line 190: Error message without production error code - breaks React bundle size optimization
//   8. Line 190: Error message without production error code - breaks React bundle size optimization
//   9. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 196: Error message without production error code - breaks React bundle size optimization
//   11. Line 196: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const element = mainWindow.document.querySelector(selector);
		if (!element) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 211: Error message without production error code - breaks React bundle size optimization
//   2. Line 211: Error message without production error code - breaks React bundle size optimization
//   3. Line 216: Error message without production error code - breaks React bundle size optimization
//   4. Line 216: Error message without production error code - breaks React bundle size optimization
//   5. Line 222: Error message without production error code - breaks React bundle size optimization
//   6. Line 222: Error message without production error code - breaks React bundle size optimization
//   7. Line 230: Error message without production error code - breaks React bundle size optimization
//   8. Line 230: Error message without production error code - breaks React bundle size optimization
//   9. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 236: Error message without production error code - breaks React bundle size optimization
//   11. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 242: Error message without production error code - breaks React bundle size optimization
//   2. Line 242: Error message without production error code - breaks React bundle size optimization
//   3. Line 247: Error message without production error code - breaks React bundle size optimization
//   4. Line 247: Error message without production error code - breaks React bundle size optimization
//   5. Line 253: Error message without production error code - breaks React bundle size optimization
//   6. Line 253: Error message without production error code - breaks React bundle size optimization
//   7. Line 261: Error message without production error code - breaks React bundle size optimization
//   8. Line 261: Error message without production error code - breaks React bundle size optimization
//   9. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 267: Error message without production error code - breaks React bundle size optimization
//   11. Line 267: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 273: Error message without production error code - breaks React bundle size optimization
//   2. Line 273: Error message without production error code - breaks React bundle size optimization
//   3. Line 278: Error message without production error code - breaks React bundle size optimization
//   4. Line 278: Error message without production error code - breaks React bundle size optimization
//   5. Line 284: Error message without production error code - breaks React bundle size optimization
//   6. Line 284: Error message without production error code - breaks React bundle size optimization
//   7. Line 292: Error message without production error code - breaks React bundle size optimization
//   8. Line 292: Error message without production error code - breaks React bundle size optimization
//   9. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 298: Error message without production error code - breaks React bundle size optimization
//   11. Line 298: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 304: Error message without production error code - breaks React bundle size optimization
//   2. Line 304: Error message without production error code - breaks React bundle size optimization
//   3. Line 309: Error message without production error code - breaks React bundle size optimization
//   4. Line 309: Error message without production error code - breaks React bundle size optimization
//   5. Line 315: Error message without production error code - breaks React bundle size optimization
//   6. Line 315: Error message without production error code - breaks React bundle size optimization
//   7. Line 323: Error message without production error code - breaks React bundle size optimization
//   8. Line 323: Error message without production error code - breaks React bundle size optimization
//   9. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 329: Error message without production error code - breaks React bundle size optimization
//   11. Line 329: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 335: Error message without production error code - breaks React bundle size optimization
//   2. Line 335: Error message without production error code - breaks React bundle size optimization
//   3. Line 340: Error message without production error code - breaks React bundle size optimization
//   4. Line 340: Error message without production error code - breaks React bundle size optimization
//   5. Line 346: Error message without production error code - breaks React bundle size optimization
//   6. Line 346: Error message without production error code - breaks React bundle size optimization
//   7. Line 354: Error message without production error code - breaks React bundle size optimization
//   8. Line 354: Error message without production error code - breaks React bundle size optimization
//   9. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 360: Error message without production error code - breaks React bundle size optimization
//   11. Line 360: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 366: Error message without production error code - breaks React bundle size optimization
//   2. Line 366: Error message without production error code - breaks React bundle size optimization
//   3. Line 371: Error message without production error code - breaks React bundle size optimization
//   4. Line 371: Error message without production error code - breaks React bundle size optimization
//   5. Line 377: Error message without production error code - breaks React bundle size optimization
//   6. Line 377: Error message without production error code - breaks React bundle size optimization
//   7. Line 385: Error message without production error code - breaks React bundle size optimization
//   8. Line 385: Error message without production error code - breaks React bundle size optimization
//   9. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 391: Error message without production error code - breaks React bundle size optimization
//   11. Line 391: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Editor not found: ${selector}`);
		}
		if (isHTMLDivElement(element)) {
			const editContext = element.editContext;
			if (!editContext) {
				throw new Error(`Edit context not found: ${selector}`);
			}
			return { selectionStart: editContext.selectionStart, selectionEnd: editContext.selectionEnd };
		} else if (isHTMLTextAreaElement(element)) {
			return { selectionStart: element.selectionStart, selectionEnd: element.selectionEnd };
		} else {
			throw new Error(`Unknown type of element: ${selector}`);
		}
	}

	async getTerminalBuffer(selector: string): Promise<string[]> {
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			throw new Error(`Terminal not found: ${selector}`);
		}

		const xterm = (element as any).xterm;

		if (!xterm) {
			throw new Error(`Xterm not found: ${selector}`);
		}

		const lines: string[] = [];
		for (let i = 0; i < xterm.buffer.active.length; i++) {
			lines.push(xterm.buffer.active.getLine(i)!.translateToString(true));
		}

		return lines;
	}

	async writeInTerminal(selector: string, text: string): Promise<void> {
		const element = mainWindow.document.querySelector(selector);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 211: Error message without production error code - breaks React bundle size optimization
//   2. Line 211: Error message without production error code - breaks React bundle size optimization
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 217: Error message without production error code - breaks React bundle size optimization
//   5. Line 217: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!element) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 264: Error message without production error code - breaks React bundle size optimization
//   2. Line 264: Error message without production error code - breaks React bundle size optimization
//   3. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 270: Error message without production error code - breaks React bundle size optimization
//   5. Line 270: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 308: Error message without production error code - breaks React bundle size optimization
//   2. Line 308: Error message without production error code - breaks React bundle size optimization
//   3. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 314: Error message without production error code - breaks React bundle size optimization
//   5. Line 314: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 352: Error message without production error code - breaks React bundle size optimization
//   2. Line 352: Error message without production error code - breaks React bundle size optimization
//   3. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 358: Error message without production error code - breaks React bundle size optimization
//   5. Line 358: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 396: Error message without production error code - breaks React bundle size optimization
//   2. Line 396: Error message without production error code - breaks React bundle size optimization
//   3. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 402: Error message without production error code - breaks React bundle size optimization
//   5. Line 402: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 440: Error message without production error code - breaks React bundle size optimization
//   2. Line 440: Error message without production error code - breaks React bundle size optimization
//   3. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 446: Error message without production error code - breaks React bundle size optimization
//   5. Line 446: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 484: Error message without production error code - breaks React bundle size optimization
//   2. Line 484: Error message without production error code - breaks React bundle size optimization
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 490: Error message without production error code - breaks React bundle size optimization
//   5. Line 490: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Element not found: ${selector}`);
		}

		const xterm = (element as any).xterm as (XtermTerminal | undefined);

		if (!xterm) {
			throw new Error(`Xterm not found: ${selector}`);
		}

		xterm.input(text);
	}

	getLocaleInfo(): Promise<ILocaleInfo> {
		return Promise.resolve({
			language: language,
			locale: locale
		});
	}

	getLocalizedStrings(): Promise<ILocalizedStrings> {
		return Promise.resolve({
			open: localizedStrings.open,
			close: localizedStrings.close,
			find: localizedStrings.find
		});
	}

	protected async _getElementXY(selector: string, offset?: { x: number; y: number }): Promise<{ x: number; y: number }> {
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			return Promise.reject(new Error(`Element not found: ${selector}`));
		}

		const { left, top } = getTopLeftOffset(element as HTMLElement);
		const { width, height } = getClientArea(element as HTMLElement);
		let x: number, y: number;

		if (offset) {
			x = left + offset.x;
			y = top + offset.y;
		} else {
			x = left + (width / 2);
			y = top + (height / 2);
		}

		x = Math.round(x);
		y = Math.round(y);

		return { x, y };
	}
}

export function registerWindowDriver(instantiationService: IInstantiationService): void {
	Object.assign(mainWindow, { driver: instantiationService.createInstance(BrowserWindowDriver) });
}
