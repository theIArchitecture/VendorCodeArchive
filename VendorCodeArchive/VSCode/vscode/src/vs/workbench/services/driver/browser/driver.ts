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

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
//   3. Line 233: Error message without production error code - breaks React bundle size optimization
//   4. Line 233: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 239: Error message without production error code - breaks React bundle size optimization
//   2. Line 239: Error message without production error code - breaks React bundle size optimization
//   3. Line 245: Error message without production error code - breaks React bundle size optimization
//   4. Line 245: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 251: Error message without production error code - breaks React bundle size optimization
//   2. Line 251: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Error message without production error code - breaks React bundle size optimization
//   4. Line 257: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 263: Error message without production error code - breaks React bundle size optimization
//   2. Line 263: Error message without production error code - breaks React bundle size optimization
//   3. Line 269: Error message without production error code - breaks React bundle size optimization
//   4. Line 269: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 275: Error message without production error code - breaks React bundle size optimization
//   2. Line 275: Error message without production error code - breaks React bundle size optimization
//   3. Line 281: Error message without production error code - breaks React bundle size optimization
//   4. Line 281: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 287: Error message without production error code - breaks React bundle size optimization
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 293: Error message without production error code - breaks React bundle size optimization
//   4. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 299: Error message without production error code - breaks React bundle size optimization
//   2. Line 299: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Error message without production error code - breaks React bundle size optimization
//   4. Line 305: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 311: Error message without production error code - breaks React bundle size optimization
//   2. Line 311: Error message without production error code - breaks React bundle size optimization
//   3. Line 317: Error message without production error code - breaks React bundle size optimization
//   4. Line 317: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 323: Error message without production error code - breaks React bundle size optimization
//   2. Line 323: Error message without production error code - breaks React bundle size optimization
//   3. Line 329: Error message without production error code - breaks React bundle size optimization
//   4. Line 329: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 335: Error message without production error code - breaks React bundle size optimization
//   2. Line 335: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
//   4. Line 341: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 347: Error message without production error code - breaks React bundle size optimization
//   2. Line 347: Error message without production error code - breaks React bundle size optimization
//   3. Line 353: Error message without production error code - breaks React bundle size optimization
//   4. Line 353: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 359: Error message without production error code - breaks React bundle size optimization
//   2. Line 359: Error message without production error code - breaks React bundle size optimization
//   3. Line 365: Error message without production error code - breaks React bundle size optimization
//   4. Line 365: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 371: Error message without production error code - breaks React bundle size optimization
//   2. Line 371: Error message without production error code - breaks React bundle size optimization
//   3. Line 377: Error message without production error code - breaks React bundle size optimization
//   4. Line 377: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 383: Error message without production error code - breaks React bundle size optimization
//   2. Line 383: Error message without production error code - breaks React bundle size optimization
//   3. Line 389: Error message without production error code - breaks React bundle size optimization
//   4. Line 389: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 395: Error message without production error code - breaks React bundle size optimization
//   2. Line 395: Error message without production error code - breaks React bundle size optimization
//   3. Line 401: Error message without production error code - breaks React bundle size optimization
//   4. Line 401: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 407: Error message without production error code - breaks React bundle size optimization
//   2. Line 407: Error message without production error code - breaks React bundle size optimization
//   3. Line 413: Error message without production error code - breaks React bundle size optimization
//   4. Line 413: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 419: Error message without production error code - breaks React bundle size optimization
//   2. Line 419: Error message without production error code - breaks React bundle size optimization
//   3. Line 425: Error message without production error code - breaks React bundle size optimization
//   4. Line 425: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 431: Error message without production error code - breaks React bundle size optimization
//   2. Line 431: Error message without production error code - breaks React bundle size optimization
//   3. Line 437: Error message without production error code - breaks React bundle size optimization
//   4. Line 437: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 443: Error message without production error code - breaks React bundle size optimization
//   2. Line 443: Error message without production error code - breaks React bundle size optimization
//   3. Line 449: Error message without production error code - breaks React bundle size optimization
//   4. Line 449: Error message without production error code - breaks React bundle size optimization
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

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 397: Error message without production error code - breaks React bundle size optimization
//   2. Line 397: Error message without production error code - breaks React bundle size optimization
//   3. Line 402: Error message without production error code - breaks React bundle size optimization
//   4. Line 402: Error message without production error code - breaks React bundle size optimization
//   5. Line 408: Error message without production error code - breaks React bundle size optimization
//   6. Line 408: Error message without production error code - breaks React bundle size optimization
//   7. Line 416: Error message without production error code - breaks React bundle size optimization
//   8. Line 416: Error message without production error code - breaks React bundle size optimization
//   9. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 422: Error message without production error code - breaks React bundle size optimization
//   11. Line 422: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 428: Error message without production error code - breaks React bundle size optimization
//   2. Line 428: Error message without production error code - breaks React bundle size optimization
//   3. Line 433: Error message without production error code - breaks React bundle size optimization
//   4. Line 433: Error message without production error code - breaks React bundle size optimization
//   5. Line 439: Error message without production error code - breaks React bundle size optimization
//   6. Line 439: Error message without production error code - breaks React bundle size optimization
//   7. Line 447: Error message without production error code - breaks React bundle size optimization
//   8. Line 447: Error message without production error code - breaks React bundle size optimization
//   9. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 453: Error message without production error code - breaks React bundle size optimization
//   11. Line 453: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 459: Error message without production error code - breaks React bundle size optimization
//   2. Line 459: Error message without production error code - breaks React bundle size optimization
//   3. Line 464: Error message without production error code - breaks React bundle size optimization
//   4. Line 464: Error message without production error code - breaks React bundle size optimization
//   5. Line 470: Error message without production error code - breaks React bundle size optimization
//   6. Line 470: Error message without production error code - breaks React bundle size optimization
//   7. Line 478: Error message without production error code - breaks React bundle size optimization
//   8. Line 478: Error message without production error code - breaks React bundle size optimization
//   9. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 484: Error message without production error code - breaks React bundle size optimization
//   11. Line 484: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 490: Error message without production error code - breaks React bundle size optimization
//   2. Line 490: Error message without production error code - breaks React bundle size optimization
//   3. Line 495: Error message without production error code - breaks React bundle size optimization
//   4. Line 495: Error message without production error code - breaks React bundle size optimization
//   5. Line 501: Error message without production error code - breaks React bundle size optimization
//   6. Line 501: Error message without production error code - breaks React bundle size optimization
//   7. Line 509: Error message without production error code - breaks React bundle size optimization
//   8. Line 509: Error message without production error code - breaks React bundle size optimization
//   9. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 515: Error message without production error code - breaks React bundle size optimization
//   11. Line 515: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 521: Error message without production error code - breaks React bundle size optimization
//   2. Line 521: Error message without production error code - breaks React bundle size optimization
//   3. Line 526: Error message without production error code - breaks React bundle size optimization
//   4. Line 526: Error message without production error code - breaks React bundle size optimization
//   5. Line 532: Error message without production error code - breaks React bundle size optimization
//   6. Line 532: Error message without production error code - breaks React bundle size optimization
//   7. Line 540: Error message without production error code - breaks React bundle size optimization
//   8. Line 540: Error message without production error code - breaks React bundle size optimization
//   9. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 546: Error message without production error code - breaks React bundle size optimization
//   11. Line 546: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 552: Error message without production error code - breaks React bundle size optimization
//   2. Line 552: Error message without production error code - breaks React bundle size optimization
//   3. Line 557: Error message without production error code - breaks React bundle size optimization
//   4. Line 557: Error message without production error code - breaks React bundle size optimization
//   5. Line 563: Error message without production error code - breaks React bundle size optimization
//   6. Line 563: Error message without production error code - breaks React bundle size optimization
//   7. Line 571: Error message without production error code - breaks React bundle size optimization
//   8. Line 571: Error message without production error code - breaks React bundle size optimization
//   9. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 577: Error message without production error code - breaks React bundle size optimization
//   11. Line 577: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 583: Error message without production error code - breaks React bundle size optimization
//   2. Line 583: Error message without production error code - breaks React bundle size optimization
//   3. Line 588: Error message without production error code - breaks React bundle size optimization
//   4. Line 588: Error message without production error code - breaks React bundle size optimization
//   5. Line 594: Error message without production error code - breaks React bundle size optimization
//   6. Line 594: Error message without production error code - breaks React bundle size optimization
//   7. Line 602: Error message without production error code - breaks React bundle size optimization
//   8. Line 602: Error message without production error code - breaks React bundle size optimization
//   9. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 608: Error message without production error code - breaks React bundle size optimization
//   11. Line 608: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 614: Error message without production error code - breaks React bundle size optimization
//   2. Line 614: Error message without production error code - breaks React bundle size optimization
//   3. Line 619: Error message without production error code - breaks React bundle size optimization
//   4. Line 619: Error message without production error code - breaks React bundle size optimization
//   5. Line 625: Error message without production error code - breaks React bundle size optimization
//   6. Line 625: Error message without production error code - breaks React bundle size optimization
//   7. Line 633: Error message without production error code - breaks React bundle size optimization
//   8. Line 633: Error message without production error code - breaks React bundle size optimization
//   9. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 639: Error message without production error code - breaks React bundle size optimization
//   11. Line 639: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 645: Error message without production error code - breaks React bundle size optimization
//   2. Line 645: Error message without production error code - breaks React bundle size optimization
//   3. Line 650: Error message without production error code - breaks React bundle size optimization
//   4. Line 650: Error message without production error code - breaks React bundle size optimization
//   5. Line 656: Error message without production error code - breaks React bundle size optimization
//   6. Line 656: Error message without production error code - breaks React bundle size optimization
//   7. Line 664: Error message without production error code - breaks React bundle size optimization
//   8. Line 664: Error message without production error code - breaks React bundle size optimization
//   9. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 670: Error message without production error code - breaks React bundle size optimization
//   11. Line 670: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 676: Error message without production error code - breaks React bundle size optimization
//   2. Line 676: Error message without production error code - breaks React bundle size optimization
//   3. Line 681: Error message without production error code - breaks React bundle size optimization
//   4. Line 681: Error message without production error code - breaks React bundle size optimization
//   5. Line 687: Error message without production error code - breaks React bundle size optimization
//   6. Line 687: Error message without production error code - breaks React bundle size optimization
//   7. Line 695: Error message without production error code - breaks React bundle size optimization
//   8. Line 695: Error message without production error code - breaks React bundle size optimization
//   9. Line 698: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 701: Error message without production error code - breaks React bundle size optimization
//   11. Line 701: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 707: Error message without production error code - breaks React bundle size optimization
//   2. Line 707: Error message without production error code - breaks React bundle size optimization
//   3. Line 712: Error message without production error code - breaks React bundle size optimization
//   4. Line 712: Error message without production error code - breaks React bundle size optimization
//   5. Line 718: Error message without production error code - breaks React bundle size optimization
//   6. Line 718: Error message without production error code - breaks React bundle size optimization
//   7. Line 726: Error message without production error code - breaks React bundle size optimization
//   8. Line 726: Error message without production error code - breaks React bundle size optimization
//   9. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 732: Error message without production error code - breaks React bundle size optimization
//   11. Line 732: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 738: Error message without production error code - breaks React bundle size optimization
//   2. Line 738: Error message without production error code - breaks React bundle size optimization
//   3. Line 743: Error message without production error code - breaks React bundle size optimization
//   4. Line 743: Error message without production error code - breaks React bundle size optimization
//   5. Line 749: Error message without production error code - breaks React bundle size optimization
//   6. Line 749: Error message without production error code - breaks React bundle size optimization
//   7. Line 757: Error message without production error code - breaks React bundle size optimization
//   8. Line 757: Error message without production error code - breaks React bundle size optimization
//   9. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 763: Error message without production error code - breaks React bundle size optimization
//   11. Line 763: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 769: Error message without production error code - breaks React bundle size optimization
//   2. Line 769: Error message without production error code - breaks React bundle size optimization
//   3. Line 774: Error message without production error code - breaks React bundle size optimization
//   4. Line 774: Error message without production error code - breaks React bundle size optimization
//   5. Line 780: Error message without production error code - breaks React bundle size optimization
//   6. Line 780: Error message without production error code - breaks React bundle size optimization
//   7. Line 788: Error message without production error code - breaks React bundle size optimization
//   8. Line 788: Error message without production error code - breaks React bundle size optimization
//   9. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 794: Error message without production error code - breaks React bundle size optimization
//   11. Line 794: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 800: Error message without production error code - breaks React bundle size optimization
//   2. Line 800: Error message without production error code - breaks React bundle size optimization
//   3. Line 805: Error message without production error code - breaks React bundle size optimization
//   4. Line 805: Error message without production error code - breaks React bundle size optimization
//   5. Line 811: Error message without production error code - breaks React bundle size optimization
//   6. Line 811: Error message without production error code - breaks React bundle size optimization
//   7. Line 819: Error message without production error code - breaks React bundle size optimization
//   8. Line 819: Error message without production error code - breaks React bundle size optimization
//   9. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 825: Error message without production error code - breaks React bundle size optimization
//   11. Line 825: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 831: Error message without production error code - breaks React bundle size optimization
//   2. Line 831: Error message without production error code - breaks React bundle size optimization
//   3. Line 836: Error message without production error code - breaks React bundle size optimization
//   4. Line 836: Error message without production error code - breaks React bundle size optimization
//   5. Line 842: Error message without production error code - breaks React bundle size optimization
//   6. Line 842: Error message without production error code - breaks React bundle size optimization
//   7. Line 850: Error message without production error code - breaks React bundle size optimization
//   8. Line 850: Error message without production error code - breaks React bundle size optimization
//   9. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 856: Error message without production error code - breaks React bundle size optimization
//   11. Line 856: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 862: Error message without production error code - breaks React bundle size optimization
//   2. Line 862: Error message without production error code - breaks React bundle size optimization
//   3. Line 867: Error message without production error code - breaks React bundle size optimization
//   4. Line 867: Error message without production error code - breaks React bundle size optimization
//   5. Line 873: Error message without production error code - breaks React bundle size optimization
//   6. Line 873: Error message without production error code - breaks React bundle size optimization
//   7. Line 881: Error message without production error code - breaks React bundle size optimization
//   8. Line 881: Error message without production error code - breaks React bundle size optimization
//   9. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 887: Error message without production error code - breaks React bundle size optimization
//   11. Line 887: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 893: Error message without production error code - breaks React bundle size optimization
//   2. Line 893: Error message without production error code - breaks React bundle size optimization
//   3. Line 898: Error message without production error code - breaks React bundle size optimization
//   4. Line 898: Error message without production error code - breaks React bundle size optimization
//   5. Line 904: Error message without production error code - breaks React bundle size optimization
//   6. Line 904: Error message without production error code - breaks React bundle size optimization
//   7. Line 912: Error message without production error code - breaks React bundle size optimization
//   8. Line 912: Error message without production error code - breaks React bundle size optimization
//   9. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 918: Error message without production error code - breaks React bundle size optimization
//   11. Line 918: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 924: Error message without production error code - breaks React bundle size optimization
//   2. Line 924: Error message without production error code - breaks React bundle size optimization
//   3. Line 929: Error message without production error code - breaks React bundle size optimization
//   4. Line 929: Error message without production error code - breaks React bundle size optimization
//   5. Line 935: Error message without production error code - breaks React bundle size optimization
//   6. Line 935: Error message without production error code - breaks React bundle size optimization
//   7. Line 943: Error message without production error code - breaks React bundle size optimization
//   8. Line 943: Error message without production error code - breaks React bundle size optimization
//   9. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 949: Error message without production error code - breaks React bundle size optimization
//   11. Line 949: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (11):
//   1. Line 955: Error message without production error code - breaks React bundle size optimization
//   2. Line 955: Error message without production error code - breaks React bundle size optimization
//   3. Line 960: Error message without production error code - breaks React bundle size optimization
//   4. Line 960: Error message without production error code - breaks React bundle size optimization
//   5. Line 966: Error message without production error code - breaks React bundle size optimization
//   6. Line 966: Error message without production error code - breaks React bundle size optimization
//   7. Line 974: Error message without production error code - breaks React bundle size optimization
//   8. Line 974: Error message without production error code - breaks React bundle size optimization
//   9. Line 977: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 980: Error message without production error code - breaks React bundle size optimization
//   11. Line 980: Error message without production error code - breaks React bundle size optimization
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

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 528: Error message without production error code - breaks React bundle size optimization
//   2. Line 528: Error message without production error code - breaks React bundle size optimization
//   3. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 534: Error message without production error code - breaks React bundle size optimization
//   5. Line 534: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 572: Error message without production error code - breaks React bundle size optimization
//   2. Line 572: Error message without production error code - breaks React bundle size optimization
//   3. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 578: Error message without production error code - breaks React bundle size optimization
//   5. Line 578: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 616: Error message without production error code - breaks React bundle size optimization
//   2. Line 616: Error message without production error code - breaks React bundle size optimization
//   3. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 622: Error message without production error code - breaks React bundle size optimization
//   5. Line 622: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 660: Error message without production error code - breaks React bundle size optimization
//   2. Line 660: Error message without production error code - breaks React bundle size optimization
//   3. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 666: Error message without production error code - breaks React bundle size optimization
//   5. Line 666: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 704: Error message without production error code - breaks React bundle size optimization
//   2. Line 704: Error message without production error code - breaks React bundle size optimization
//   3. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 710: Error message without production error code - breaks React bundle size optimization
//   5. Line 710: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 748: Error message without production error code - breaks React bundle size optimization
//   2. Line 748: Error message without production error code - breaks React bundle size optimization
//   3. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 754: Error message without production error code - breaks React bundle size optimization
//   5. Line 754: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 792: Error message without production error code - breaks React bundle size optimization
//   2. Line 792: Error message without production error code - breaks React bundle size optimization
//   3. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 798: Error message without production error code - breaks React bundle size optimization
//   5. Line 798: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 836: Error message without production error code - breaks React bundle size optimization
//   2. Line 836: Error message without production error code - breaks React bundle size optimization
//   3. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 842: Error message without production error code - breaks React bundle size optimization
//   5. Line 842: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 880: Error message without production error code - breaks React bundle size optimization
//   2. Line 880: Error message without production error code - breaks React bundle size optimization
//   3. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 886: Error message without production error code - breaks React bundle size optimization
//   5. Line 886: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 924: Error message without production error code - breaks React bundle size optimization
//   2. Line 924: Error message without production error code - breaks React bundle size optimization
//   3. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 930: Error message without production error code - breaks React bundle size optimization
//   5. Line 930: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 968: Error message without production error code - breaks React bundle size optimization
//   2. Line 968: Error message without production error code - breaks React bundle size optimization
//   3. Line 971: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 974: Error message without production error code - breaks React bundle size optimization
//   5. Line 974: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1012: Error message without production error code - breaks React bundle size optimization
//   2. Line 1012: Error message without production error code - breaks React bundle size optimization
//   3. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1018: Error message without production error code - breaks React bundle size optimization
//   5. Line 1018: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1056: Error message without production error code - breaks React bundle size optimization
//   2. Line 1056: Error message without production error code - breaks React bundle size optimization
//   3. Line 1059: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1062: Error message without production error code - breaks React bundle size optimization
//   5. Line 1062: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1100: Error message without production error code - breaks React bundle size optimization
//   2. Line 1100: Error message without production error code - breaks React bundle size optimization
//   3. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1106: Error message without production error code - breaks React bundle size optimization
//   5. Line 1106: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1144: Error message without production error code - breaks React bundle size optimization
//   2. Line 1144: Error message without production error code - breaks React bundle size optimization
//   3. Line 1147: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1150: Error message without production error code - breaks React bundle size optimization
//   5. Line 1150: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1188: Error message without production error code - breaks React bundle size optimization
//   2. Line 1188: Error message without production error code - breaks React bundle size optimization
//   3. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1194: Error message without production error code - breaks React bundle size optimization
//   5. Line 1194: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1232: Error message without production error code - breaks React bundle size optimization
//   2. Line 1232: Error message without production error code - breaks React bundle size optimization
//   3. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1238: Error message without production error code - breaks React bundle size optimization
//   5. Line 1238: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1276: Error message without production error code - breaks React bundle size optimization
//   2. Line 1276: Error message without production error code - breaks React bundle size optimization
//   3. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1282: Error message without production error code - breaks React bundle size optimization
//   5. Line 1282: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1320: Error message without production error code - breaks React bundle size optimization
//   2. Line 1320: Error message without production error code - breaks React bundle size optimization
//   3. Line 1323: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1326: Error message without production error code - breaks React bundle size optimization
//   5. Line 1326: Error message without production error code - breaks React bundle size optimization
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
