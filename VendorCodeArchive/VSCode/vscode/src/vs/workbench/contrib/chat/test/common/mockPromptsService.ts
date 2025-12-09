//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ICustomChatMode, IPromptsService } from '../../common/promptSyntax/service/promptsService.js';

export class MockPromptsService implements IPromptsService {
	_serviceBrand: undefined;

	private readonly _onDidChangeCustomChatModes = new Emitter<void>();
	readonly onDidChangeCustomChatModes = this._onDidChangeCustomChatModes.event;

	private _customModes: ICustomChatMode[] = [];

	setCustomModes(modes: ICustomChatMode[]): void {
		this._customModes = modes;
		this._onDidChangeCustomChatModes.fire();
	}

	async getCustomChatModes(token: CancellationToken): Promise<readonly ICustomChatMode[]> {
		return this._customModes;
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
//   3. Line 30: Error message without production error code - breaks React bundle size optimization
//   4. Line 30: Error message without production error code - breaks React bundle size optimization
//   5. Line 31: Error message without production error code - breaks React bundle size optimization
//   6. Line 31: Error message without production error code - breaks React bundle size optimization
//   7. Line 33: Error message without production error code - breaks React bundle size optimization
//   8. Line 33: Error message without production error code - breaks React bundle size optimization
//   9. Line 34: Error message without production error code - breaks React bundle size optimization
//   10. Line 34: Error message without production error code - breaks React bundle size optimization
//   11. Line 35: Error message without production error code - breaks React bundle size optimization
//   12. Line 35: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	// Stub implementations for required interface methods
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 58: Error message without production error code - breaks React bundle size optimization
//   2. Line 58: Error message without production error code - breaks React bundle size optimization
//   3. Line 59: Error message without production error code - breaks React bundle size optimization
//   4. Line 59: Error message without production error code - breaks React bundle size optimization
//   5. Line 60: Error message without production error code - breaks React bundle size optimization
//   6. Line 60: Error message without production error code - breaks React bundle size optimization
//   7. Line 62: Error message without production error code - breaks React bundle size optimization
//   8. Line 62: Error message without production error code - breaks React bundle size optimization
//   9. Line 63: Error message without production error code - breaks React bundle size optimization
//   10. Line 63: Error message without production error code - breaks React bundle size optimization
//   11. Line 64: Error message without production error code - breaks React bundle size optimization
//   12. Line 64: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 78: Error message without production error code - breaks React bundle size optimization
//   2. Line 78: Error message without production error code - breaks React bundle size optimization
//   3. Line 79: Error message without production error code - breaks React bundle size optimization
//   4. Line 79: Error message without production error code - breaks React bundle size optimization
//   5. Line 80: Error message without production error code - breaks React bundle size optimization
//   6. Line 80: Error message without production error code - breaks React bundle size optimization
//   7. Line 82: Error message without production error code - breaks React bundle size optimization
//   8. Line 82: Error message without production error code - breaks React bundle size optimization
//   9. Line 83: Error message without production error code - breaks React bundle size optimization
//   10. Line 83: Error message without production error code - breaks React bundle size optimization
//   11. Line 84: Error message without production error code - breaks React bundle size optimization
//   12. Line 84: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 98: Error message without production error code - breaks React bundle size optimization
//   2. Line 98: Error message without production error code - breaks React bundle size optimization
//   3. Line 99: Error message without production error code - breaks React bundle size optimization
//   4. Line 99: Error message without production error code - breaks React bundle size optimization
//   5. Line 100: Error message without production error code - breaks React bundle size optimization
//   6. Line 100: Error message without production error code - breaks React bundle size optimization
//   7. Line 102: Error message without production error code - breaks React bundle size optimization
//   8. Line 102: Error message without production error code - breaks React bundle size optimization
//   9. Line 103: Error message without production error code - breaks React bundle size optimization
//   10. Line 103: Error message without production error code - breaks React bundle size optimization
//   11. Line 104: Error message without production error code - breaks React bundle size optimization
//   12. Line 104: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 118: Error message without production error code - breaks React bundle size optimization
//   2. Line 118: Error message without production error code - breaks React bundle size optimization
//   3. Line 119: Error message without production error code - breaks React bundle size optimization
//   4. Line 119: Error message without production error code - breaks React bundle size optimization
//   5. Line 120: Error message without production error code - breaks React bundle size optimization
//   6. Line 120: Error message without production error code - breaks React bundle size optimization
//   7. Line 122: Error message without production error code - breaks React bundle size optimization
//   8. Line 122: Error message without production error code - breaks React bundle size optimization
//   9. Line 123: Error message without production error code - breaks React bundle size optimization
//   10. Line 123: Error message without production error code - breaks React bundle size optimization
//   11. Line 124: Error message without production error code - breaks React bundle size optimization
//   12. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 138: Error message without production error code - breaks React bundle size optimization
//   2. Line 138: Error message without production error code - breaks React bundle size optimization
//   3. Line 139: Error message without production error code - breaks React bundle size optimization
//   4. Line 139: Error message without production error code - breaks React bundle size optimization
//   5. Line 140: Error message without production error code - breaks React bundle size optimization
//   6. Line 140: Error message without production error code - breaks React bundle size optimization
//   7. Line 142: Error message without production error code - breaks React bundle size optimization
//   8. Line 142: Error message without production error code - breaks React bundle size optimization
//   9. Line 143: Error message without production error code - breaks React bundle size optimization
//   10. Line 143: Error message without production error code - breaks React bundle size optimization
//   11. Line 144: Error message without production error code - breaks React bundle size optimization
//   12. Line 144: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 158: Error message without production error code - breaks React bundle size optimization
//   2. Line 158: Error message without production error code - breaks React bundle size optimization
//   3. Line 159: Error message without production error code - breaks React bundle size optimization
//   4. Line 159: Error message without production error code - breaks React bundle size optimization
//   5. Line 160: Error message without production error code - breaks React bundle size optimization
//   6. Line 160: Error message without production error code - breaks React bundle size optimization
//   7. Line 162: Error message without production error code - breaks React bundle size optimization
//   8. Line 162: Error message without production error code - breaks React bundle size optimization
//   9. Line 163: Error message without production error code - breaks React bundle size optimization
//   10. Line 163: Error message without production error code - breaks React bundle size optimization
//   11. Line 164: Error message without production error code - breaks React bundle size optimization
//   12. Line 164: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 178: Error message without production error code - breaks React bundle size optimization
//   2. Line 178: Error message without production error code - breaks React bundle size optimization
//   3. Line 179: Error message without production error code - breaks React bundle size optimization
//   4. Line 179: Error message without production error code - breaks React bundle size optimization
//   5. Line 180: Error message without production error code - breaks React bundle size optimization
//   6. Line 180: Error message without production error code - breaks React bundle size optimization
//   7. Line 182: Error message without production error code - breaks React bundle size optimization
//   8. Line 182: Error message without production error code - breaks React bundle size optimization
//   9. Line 183: Error message without production error code - breaks React bundle size optimization
//   10. Line 183: Error message without production error code - breaks React bundle size optimization
//   11. Line 184: Error message without production error code - breaks React bundle size optimization
//   12. Line 184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 198: Error message without production error code - breaks React bundle size optimization
//   2. Line 198: Error message without production error code - breaks React bundle size optimization
//   3. Line 199: Error message without production error code - breaks React bundle size optimization
//   4. Line 199: Error message without production error code - breaks React bundle size optimization
//   5. Line 200: Error message without production error code - breaks React bundle size optimization
//   6. Line 200: Error message without production error code - breaks React bundle size optimization
//   7. Line 202: Error message without production error code - breaks React bundle size optimization
//   8. Line 202: Error message without production error code - breaks React bundle size optimization
//   9. Line 203: Error message without production error code - breaks React bundle size optimization
//   10. Line 203: Error message without production error code - breaks React bundle size optimization
//   11. Line 204: Error message without production error code - breaks React bundle size optimization
//   12. Line 204: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 218: Error message without production error code - breaks React bundle size optimization
//   2. Line 218: Error message without production error code - breaks React bundle size optimization
//   3. Line 219: Error message without production error code - breaks React bundle size optimization
//   4. Line 219: Error message without production error code - breaks React bundle size optimization
//   5. Line 220: Error message without production error code - breaks React bundle size optimization
//   6. Line 220: Error message without production error code - breaks React bundle size optimization
//   7. Line 222: Error message without production error code - breaks React bundle size optimization
//   8. Line 222: Error message without production error code - breaks React bundle size optimization
//   9. Line 223: Error message without production error code - breaks React bundle size optimization
//   10. Line 223: Error message without production error code - breaks React bundle size optimization
//   11. Line 224: Error message without production error code - breaks React bundle size optimization
//   12. Line 224: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 238: Error message without production error code - breaks React bundle size optimization
//   2. Line 238: Error message without production error code - breaks React bundle size optimization
//   3. Line 239: Error message without production error code - breaks React bundle size optimization
//   4. Line 239: Error message without production error code - breaks React bundle size optimization
//   5. Line 240: Error message without production error code - breaks React bundle size optimization
//   6. Line 240: Error message without production error code - breaks React bundle size optimization
//   7. Line 242: Error message without production error code - breaks React bundle size optimization
//   8. Line 242: Error message without production error code - breaks React bundle size optimization
//   9. Line 243: Error message without production error code - breaks React bundle size optimization
//   10. Line 243: Error message without production error code - breaks React bundle size optimization
//   11. Line 244: Error message without production error code - breaks React bundle size optimization
//   12. Line 244: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 258: Error message without production error code - breaks React bundle size optimization
//   2. Line 258: Error message without production error code - breaks React bundle size optimization
//   3. Line 259: Error message without production error code - breaks React bundle size optimization
//   4. Line 259: Error message without production error code - breaks React bundle size optimization
//   5. Line 260: Error message without production error code - breaks React bundle size optimization
//   6. Line 260: Error message without production error code - breaks React bundle size optimization
//   7. Line 262: Error message without production error code - breaks React bundle size optimization
//   8. Line 262: Error message without production error code - breaks React bundle size optimization
//   9. Line 263: Error message without production error code - breaks React bundle size optimization
//   10. Line 263: Error message without production error code - breaks React bundle size optimization
//   11. Line 264: Error message without production error code - breaks React bundle size optimization
//   12. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 278: Error message without production error code - breaks React bundle size optimization
//   2. Line 278: Error message without production error code - breaks React bundle size optimization
//   3. Line 279: Error message without production error code - breaks React bundle size optimization
//   4. Line 279: Error message without production error code - breaks React bundle size optimization
//   5. Line 280: Error message without production error code - breaks React bundle size optimization
//   6. Line 280: Error message without production error code - breaks React bundle size optimization
//   7. Line 282: Error message without production error code - breaks React bundle size optimization
//   8. Line 282: Error message without production error code - breaks React bundle size optimization
//   9. Line 283: Error message without production error code - breaks React bundle size optimization
//   10. Line 283: Error message without production error code - breaks React bundle size optimization
//   11. Line 284: Error message without production error code - breaks React bundle size optimization
//   12. Line 284: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 298: Error message without production error code - breaks React bundle size optimization
//   2. Line 298: Error message without production error code - breaks React bundle size optimization
//   3. Line 299: Error message without production error code - breaks React bundle size optimization
//   4. Line 299: Error message without production error code - breaks React bundle size optimization
//   5. Line 300: Error message without production error code - breaks React bundle size optimization
//   6. Line 300: Error message without production error code - breaks React bundle size optimization
//   7. Line 302: Error message without production error code - breaks React bundle size optimization
//   8. Line 302: Error message without production error code - breaks React bundle size optimization
//   9. Line 303: Error message without production error code - breaks React bundle size optimization
//   10. Line 303: Error message without production error code - breaks React bundle size optimization
//   11. Line 304: Error message without production error code - breaks React bundle size optimization
//   12. Line 304: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 318: Error message without production error code - breaks React bundle size optimization
//   2. Line 318: Error message without production error code - breaks React bundle size optimization
//   3. Line 319: Error message without production error code - breaks React bundle size optimization
//   4. Line 319: Error message without production error code - breaks React bundle size optimization
//   5. Line 320: Error message without production error code - breaks React bundle size optimization
//   6. Line 320: Error message without production error code - breaks React bundle size optimization
//   7. Line 322: Error message without production error code - breaks React bundle size optimization
//   8. Line 322: Error message without production error code - breaks React bundle size optimization
//   9. Line 323: Error message without production error code - breaks React bundle size optimization
//   10. Line 323: Error message without production error code - breaks React bundle size optimization
//   11. Line 324: Error message without production error code - breaks React bundle size optimization
//   12. Line 324: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 338: Error message without production error code - breaks React bundle size optimization
//   2. Line 338: Error message without production error code - breaks React bundle size optimization
//   3. Line 339: Error message without production error code - breaks React bundle size optimization
//   4. Line 339: Error message without production error code - breaks React bundle size optimization
//   5. Line 340: Error message without production error code - breaks React bundle size optimization
//   6. Line 340: Error message without production error code - breaks React bundle size optimization
//   7. Line 342: Error message without production error code - breaks React bundle size optimization
//   8. Line 342: Error message without production error code - breaks React bundle size optimization
//   9. Line 343: Error message without production error code - breaks React bundle size optimization
//   10. Line 343: Error message without production error code - breaks React bundle size optimization
//   11. Line 344: Error message without production error code - breaks React bundle size optimization
//   12. Line 344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 358: Error message without production error code - breaks React bundle size optimization
//   2. Line 358: Error message without production error code - breaks React bundle size optimization
//   3. Line 359: Error message without production error code - breaks React bundle size optimization
//   4. Line 359: Error message without production error code - breaks React bundle size optimization
//   5. Line 360: Error message without production error code - breaks React bundle size optimization
//   6. Line 360: Error message without production error code - breaks React bundle size optimization
//   7. Line 362: Error message without production error code - breaks React bundle size optimization
//   8. Line 362: Error message without production error code - breaks React bundle size optimization
//   9. Line 363: Error message without production error code - breaks React bundle size optimization
//   10. Line 363: Error message without production error code - breaks React bundle size optimization
//   11. Line 364: Error message without production error code - breaks React bundle size optimization
//   12. Line 364: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 378: Error message without production error code - breaks React bundle size optimization
//   2. Line 378: Error message without production error code - breaks React bundle size optimization
//   3. Line 379: Error message without production error code - breaks React bundle size optimization
//   4. Line 379: Error message without production error code - breaks React bundle size optimization
//   5. Line 380: Error message without production error code - breaks React bundle size optimization
//   6. Line 380: Error message without production error code - breaks React bundle size optimization
//   7. Line 382: Error message without production error code - breaks React bundle size optimization
//   8. Line 382: Error message without production error code - breaks React bundle size optimization
//   9. Line 383: Error message without production error code - breaks React bundle size optimization
//   10. Line 383: Error message without production error code - breaks React bundle size optimization
//   11. Line 384: Error message without production error code - breaks React bundle size optimization
//   12. Line 384: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 398: Error message without production error code - breaks React bundle size optimization
//   2. Line 398: Error message without production error code - breaks React bundle size optimization
//   3. Line 399: Error message without production error code - breaks React bundle size optimization
//   4. Line 399: Error message without production error code - breaks React bundle size optimization
//   5. Line 400: Error message without production error code - breaks React bundle size optimization
//   6. Line 400: Error message without production error code - breaks React bundle size optimization
//   7. Line 402: Error message without production error code - breaks React bundle size optimization
//   8. Line 402: Error message without production error code - breaks React bundle size optimization
//   9. Line 403: Error message without production error code - breaks React bundle size optimization
//   10. Line 403: Error message without production error code - breaks React bundle size optimization
//   11. Line 404: Error message without production error code - breaks React bundle size optimization
//   12. Line 404: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 418: Error message without production error code - breaks React bundle size optimization
//   2. Line 418: Error message without production error code - breaks React bundle size optimization
//   3. Line 419: Error message without production error code - breaks React bundle size optimization
//   4. Line 419: Error message without production error code - breaks React bundle size optimization
//   5. Line 420: Error message without production error code - breaks React bundle size optimization
//   6. Line 420: Error message without production error code - breaks React bundle size optimization
//   7. Line 422: Error message without production error code - breaks React bundle size optimization
//   8. Line 422: Error message without production error code - breaks React bundle size optimization
//   9. Line 423: Error message without production error code - breaks React bundle size optimization
//   10. Line 423: Error message without production error code - breaks React bundle size optimization
//   11. Line 424: Error message without production error code - breaks React bundle size optimization
//   12. Line 424: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 438: Error message without production error code - breaks React bundle size optimization
//   2. Line 438: Error message without production error code - breaks React bundle size optimization
//   3. Line 439: Error message without production error code - breaks React bundle size optimization
//   4. Line 439: Error message without production error code - breaks React bundle size optimization
//   5. Line 440: Error message without production error code - breaks React bundle size optimization
//   6. Line 440: Error message without production error code - breaks React bundle size optimization
//   7. Line 442: Error message without production error code - breaks React bundle size optimization
//   8. Line 442: Error message without production error code - breaks React bundle size optimization
//   9. Line 443: Error message without production error code - breaks React bundle size optimization
//   10. Line 443: Error message without production error code - breaks React bundle size optimization
//   11. Line 444: Error message without production error code - breaks React bundle size optimization
//   12. Line 444: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 458: Error message without production error code - breaks React bundle size optimization
//   2. Line 458: Error message without production error code - breaks React bundle size optimization
//   3. Line 459: Error message without production error code - breaks React bundle size optimization
//   4. Line 459: Error message without production error code - breaks React bundle size optimization
//   5. Line 460: Error message without production error code - breaks React bundle size optimization
//   6. Line 460: Error message without production error code - breaks React bundle size optimization
//   7. Line 462: Error message without production error code - breaks React bundle size optimization
//   8. Line 462: Error message without production error code - breaks React bundle size optimization
//   9. Line 463: Error message without production error code - breaks React bundle size optimization
//   10. Line 463: Error message without production error code - breaks React bundle size optimization
//   11. Line 464: Error message without production error code - breaks React bundle size optimization
//   12. Line 464: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 478: Error message without production error code - breaks React bundle size optimization
//   2. Line 478: Error message without production error code - breaks React bundle size optimization
//   3. Line 479: Error message without production error code - breaks React bundle size optimization
//   4. Line 479: Error message without production error code - breaks React bundle size optimization
//   5. Line 480: Error message without production error code - breaks React bundle size optimization
//   6. Line 480: Error message without production error code - breaks React bundle size optimization
//   7. Line 482: Error message without production error code - breaks React bundle size optimization
//   8. Line 482: Error message without production error code - breaks React bundle size optimization
//   9. Line 483: Error message without production error code - breaks React bundle size optimization
//   10. Line 483: Error message without production error code - breaks React bundle size optimization
//   11. Line 484: Error message without production error code - breaks React bundle size optimization
//   12. Line 484: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 498: Error message without production error code - breaks React bundle size optimization
//   2. Line 498: Error message without production error code - breaks React bundle size optimization
//   3. Line 499: Error message without production error code - breaks React bundle size optimization
//   4. Line 499: Error message without production error code - breaks React bundle size optimization
//   5. Line 500: Error message without production error code - breaks React bundle size optimization
//   6. Line 500: Error message without production error code - breaks React bundle size optimization
//   7. Line 502: Error message without production error code - breaks React bundle size optimization
//   8. Line 502: Error message without production error code - breaks React bundle size optimization
//   9. Line 503: Error message without production error code - breaks React bundle size optimization
//   10. Line 503: Error message without production error code - breaks React bundle size optimization
//   11. Line 504: Error message without production error code - breaks React bundle size optimization
//   12. Line 504: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 518: Error message without production error code - breaks React bundle size optimization
//   2. Line 518: Error message without production error code - breaks React bundle size optimization
//   3. Line 519: Error message without production error code - breaks React bundle size optimization
//   4. Line 519: Error message without production error code - breaks React bundle size optimization
//   5. Line 520: Error message without production error code - breaks React bundle size optimization
//   6. Line 520: Error message without production error code - breaks React bundle size optimization
//   7. Line 522: Error message without production error code - breaks React bundle size optimization
//   8. Line 522: Error message without production error code - breaks React bundle size optimization
//   9. Line 523: Error message without production error code - breaks React bundle size optimization
//   10. Line 523: Error message without production error code - breaks React bundle size optimization
//   11. Line 524: Error message without production error code - breaks React bundle size optimization
//   12. Line 524: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 538: Error message without production error code - breaks React bundle size optimization
//   2. Line 538: Error message without production error code - breaks React bundle size optimization
//   3. Line 539: Error message without production error code - breaks React bundle size optimization
//   4. Line 539: Error message without production error code - breaks React bundle size optimization
//   5. Line 540: Error message without production error code - breaks React bundle size optimization
//   6. Line 540: Error message without production error code - breaks React bundle size optimization
//   7. Line 542: Error message without production error code - breaks React bundle size optimization
//   8. Line 542: Error message without production error code - breaks React bundle size optimization
//   9. Line 543: Error message without production error code - breaks React bundle size optimization
//   10. Line 543: Error message without production error code - breaks React bundle size optimization
//   11. Line 544: Error message without production error code - breaks React bundle size optimization
//   12. Line 544: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 558: Error message without production error code - breaks React bundle size optimization
//   2. Line 558: Error message without production error code - breaks React bundle size optimization
//   3. Line 559: Error message without production error code - breaks React bundle size optimization
//   4. Line 559: Error message without production error code - breaks React bundle size optimization
//   5. Line 560: Error message without production error code - breaks React bundle size optimization
//   6. Line 560: Error message without production error code - breaks React bundle size optimization
//   7. Line 562: Error message without production error code - breaks React bundle size optimization
//   8. Line 562: Error message without production error code - breaks React bundle size optimization
//   9. Line 563: Error message without production error code - breaks React bundle size optimization
//   10. Line 563: Error message without production error code - breaks React bundle size optimization
//   11. Line 564: Error message without production error code - breaks React bundle size optimization
//   12. Line 564: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 578: Error message without production error code - breaks React bundle size optimization
//   2. Line 578: Error message without production error code - breaks React bundle size optimization
//   3. Line 579: Error message without production error code - breaks React bundle size optimization
//   4. Line 579: Error message without production error code - breaks React bundle size optimization
//   5. Line 580: Error message without production error code - breaks React bundle size optimization
//   6. Line 580: Error message without production error code - breaks React bundle size optimization
//   7. Line 582: Error message without production error code - breaks React bundle size optimization
//   8. Line 582: Error message without production error code - breaks React bundle size optimization
//   9. Line 583: Error message without production error code - breaks React bundle size optimization
//   10. Line 583: Error message without production error code - breaks React bundle size optimization
//   11. Line 584: Error message without production error code - breaks React bundle size optimization
//   12. Line 584: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	getSyntaxParserFor(_model: any): any { throw new Error('Not implemented'); }
	listPromptFiles(_type: any): Promise<readonly any[]> { throw new Error('Not implemented'); }
	getSourceFolders(_type: any): readonly any[] { throw new Error('Not implemented'); }
	asPromptSlashCommand(_command: string): any { return undefined; }
	resolvePromptSlashCommand(_data: any, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	findPromptSlashCommands(): Promise<any[]> { throw new Error('Not implemented'); }
	parse(_uri: URI, _type: any, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	getPromptFileType(_resource: URI): any { return undefined; }
	dispose(): void { }
}
