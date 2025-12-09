//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { constObservable, IObservable } from '../../../../../base/common/observable.js';
import { IProgressStep } from '../../../../../platform/progress/common/progress.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { CountTokensCallback, ILanguageModelToolsService, IToolData, IToolImpl, IToolInvocation, IToolResult, ToolSet } from '../../common/languageModelToolsService.js';

export class MockLanguageModelToolsService implements ILanguageModelToolsService {
	_serviceBrand: undefined;

	constructor() { }

	cancelToolCallsForRequest(requestId: string): void {
	}

	onDidChangeTools: Event<void> = Event.None;

	flushToolChanges(): void {

	}

	registerToolData(toolData: IToolData): IDisposable {
		return Disposable.None;
	}

	resetToolAutoConfirmation(): void {

	}

	setToolAutoConfirmation(toolId: string, scope: 'workspace' | 'profile', autoConfirm?: boolean): void {

	}

	registerToolImplementation(name: string, tool: IToolImpl): IDisposable {
		return Disposable.None;
	}

	getTools(): Iterable<Readonly<IToolData>> {
		return [];
	}

	getTool(id: string): IToolData | undefined {
		return undefined;
	}

	getToolByName(name: string, includeDisabled?: boolean): IToolData | undefined {
		return undefined;
	}

	acceptProgress(sessionId: string | undefined, callId: string, progress: IProgressStep): void {

	}

	async invokeTool(dto: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult> {
		return {
			content: [{ kind: 'text', value: 'result' }]
		};
	}

	toolSets: IObservable<readonly ToolSet[]> = constObservable([]);

	getToolSetByName(name: string): ToolSet | undefined {
		return undefined;
	}

	getToolSet(id: string): ToolSet | undefined {
		return undefined;
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 76: Error message without production error code - breaks React bundle size optimization
//   2. Line 76: Error message without production error code - breaks React bundle size optimization
//   3. Line 80: Error message without production error code - breaks React bundle size optimization
//   4. Line 80: Error message without production error code - breaks React bundle size optimization
//   5. Line 84: Error message without production error code - breaks React bundle size optimization
//   6. Line 84: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	createToolSet(): ToolSet & IDisposable {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 99: Error message without production error code - breaks React bundle size optimization
//   2. Line 99: Error message without production error code - breaks React bundle size optimization
//   3. Line 103: Error message without production error code - breaks React bundle size optimization
//   4. Line 103: Error message without production error code - breaks React bundle size optimization
//   5. Line 107: Error message without production error code - breaks React bundle size optimization
//   6. Line 107: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 113: Error message without production error code - breaks React bundle size optimization
//   2. Line 113: Error message without production error code - breaks React bundle size optimization
//   3. Line 117: Error message without production error code - breaks React bundle size optimization
//   4. Line 117: Error message without production error code - breaks React bundle size optimization
//   5. Line 121: Error message without production error code - breaks React bundle size optimization
//   6. Line 121: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 127: Error message without production error code - breaks React bundle size optimization
//   2. Line 127: Error message without production error code - breaks React bundle size optimization
//   3. Line 131: Error message without production error code - breaks React bundle size optimization
//   4. Line 131: Error message without production error code - breaks React bundle size optimization
//   5. Line 135: Error message without production error code - breaks React bundle size optimization
//   6. Line 135: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 145: Error message without production error code - breaks React bundle size optimization
//   4. Line 145: Error message without production error code - breaks React bundle size optimization
//   5. Line 149: Error message without production error code - breaks React bundle size optimization
//   6. Line 149: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 155: Error message without production error code - breaks React bundle size optimization
//   2. Line 155: Error message without production error code - breaks React bundle size optimization
//   3. Line 159: Error message without production error code - breaks React bundle size optimization
//   4. Line 159: Error message without production error code - breaks React bundle size optimization
//   5. Line 163: Error message without production error code - breaks React bundle size optimization
//   6. Line 163: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 169: Error message without production error code - breaks React bundle size optimization
//   2. Line 169: Error message without production error code - breaks React bundle size optimization
//   3. Line 173: Error message without production error code - breaks React bundle size optimization
//   4. Line 173: Error message without production error code - breaks React bundle size optimization
//   5. Line 177: Error message without production error code - breaks React bundle size optimization
//   6. Line 177: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 183: Error message without production error code - breaks React bundle size optimization
//   2. Line 183: Error message without production error code - breaks React bundle size optimization
//   3. Line 187: Error message without production error code - breaks React bundle size optimization
//   4. Line 187: Error message without production error code - breaks React bundle size optimization
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 197: Error message without production error code - breaks React bundle size optimization
//   2. Line 197: Error message without production error code - breaks React bundle size optimization
//   3. Line 201: Error message without production error code - breaks React bundle size optimization
//   4. Line 201: Error message without production error code - breaks React bundle size optimization
//   5. Line 205: Error message without production error code - breaks React bundle size optimization
//   6. Line 205: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 211: Error message without production error code - breaks React bundle size optimization
//   2. Line 211: Error message without production error code - breaks React bundle size optimization
//   3. Line 215: Error message without production error code - breaks React bundle size optimization
//   4. Line 215: Error message without production error code - breaks React bundle size optimization
//   5. Line 219: Error message without production error code - breaks React bundle size optimization
//   6. Line 219: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 225: Error message without production error code - breaks React bundle size optimization
//   2. Line 225: Error message without production error code - breaks React bundle size optimization
//   3. Line 229: Error message without production error code - breaks React bundle size optimization
//   4. Line 229: Error message without production error code - breaks React bundle size optimization
//   5. Line 233: Error message without production error code - breaks React bundle size optimization
//   6. Line 233: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 239: Error message without production error code - breaks React bundle size optimization
//   2. Line 239: Error message without production error code - breaks React bundle size optimization
//   3. Line 243: Error message without production error code - breaks React bundle size optimization
//   4. Line 243: Error message without production error code - breaks React bundle size optimization
//   5. Line 247: Error message without production error code - breaks React bundle size optimization
//   6. Line 247: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 253: Error message without production error code - breaks React bundle size optimization
//   2. Line 253: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Error message without production error code - breaks React bundle size optimization
//   4. Line 257: Error message without production error code - breaks React bundle size optimization
//   5. Line 261: Error message without production error code - breaks React bundle size optimization
//   6. Line 261: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 267: Error message without production error code - breaks React bundle size optimization
//   2. Line 267: Error message without production error code - breaks React bundle size optimization
//   3. Line 271: Error message without production error code - breaks React bundle size optimization
//   4. Line 271: Error message without production error code - breaks React bundle size optimization
//   5. Line 275: Error message without production error code - breaks React bundle size optimization
//   6. Line 275: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 281: Error message without production error code - breaks React bundle size optimization
//   2. Line 281: Error message without production error code - breaks React bundle size optimization
//   3. Line 285: Error message without production error code - breaks React bundle size optimization
//   4. Line 285: Error message without production error code - breaks React bundle size optimization
//   5. Line 289: Error message without production error code - breaks React bundle size optimization
//   6. Line 289: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 295: Error message without production error code - breaks React bundle size optimization
//   2. Line 295: Error message without production error code - breaks React bundle size optimization
//   3. Line 299: Error message without production error code - breaks React bundle size optimization
//   4. Line 299: Error message without production error code - breaks React bundle size optimization
//   5. Line 303: Error message without production error code - breaks React bundle size optimization
//   6. Line 303: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 309: Error message without production error code - breaks React bundle size optimization
//   2. Line 309: Error message without production error code - breaks React bundle size optimization
//   3. Line 313: Error message without production error code - breaks React bundle size optimization
//   4. Line 313: Error message without production error code - breaks React bundle size optimization
//   5. Line 317: Error message without production error code - breaks React bundle size optimization
//   6. Line 317: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 323: Error message without production error code - breaks React bundle size optimization
//   2. Line 323: Error message without production error code - breaks React bundle size optimization
//   3. Line 327: Error message without production error code - breaks React bundle size optimization
//   4. Line 327: Error message without production error code - breaks React bundle size optimization
//   5. Line 331: Error message without production error code - breaks React bundle size optimization
//   6. Line 331: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 337: Error message without production error code - breaks React bundle size optimization
//   2. Line 337: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
//   4. Line 341: Error message without production error code - breaks React bundle size optimization
//   5. Line 345: Error message without production error code - breaks React bundle size optimization
//   6. Line 345: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 351: Error message without production error code - breaks React bundle size optimization
//   2. Line 351: Error message without production error code - breaks React bundle size optimization
//   3. Line 355: Error message without production error code - breaks React bundle size optimization
//   4. Line 355: Error message without production error code - breaks React bundle size optimization
//   5. Line 359: Error message without production error code - breaks React bundle size optimization
//   6. Line 359: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 365: Error message without production error code - breaks React bundle size optimization
//   2. Line 365: Error message without production error code - breaks React bundle size optimization
//   3. Line 369: Error message without production error code - breaks React bundle size optimization
//   4. Line 369: Error message without production error code - breaks React bundle size optimization
//   5. Line 373: Error message without production error code - breaks React bundle size optimization
//   6. Line 373: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 379: Error message without production error code - breaks React bundle size optimization
//   2. Line 379: Error message without production error code - breaks React bundle size optimization
//   3. Line 383: Error message without production error code - breaks React bundle size optimization
//   4. Line 383: Error message without production error code - breaks React bundle size optimization
//   5. Line 387: Error message without production error code - breaks React bundle size optimization
//   6. Line 387: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 393: Error message without production error code - breaks React bundle size optimization
//   2. Line 393: Error message without production error code - breaks React bundle size optimization
//   3. Line 397: Error message without production error code - breaks React bundle size optimization
//   4. Line 397: Error message without production error code - breaks React bundle size optimization
//   5. Line 401: Error message without production error code - breaks React bundle size optimization
//   6. Line 401: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}

	toToolEnablementMap(toolOrToolSetNames: Set<string>): Record<string, boolean> {
		throw new Error('Method not implemented.');
	}

	toToolAndToolSetEnablementMap(toolOrToolSetNames: readonly string[] | undefined): Map<ToolSet | IToolData, boolean> {
		throw new Error('Method not implemented.');
	}
}
