//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IPosition } from '../../../../common/core/position.js';
import { ITextModel } from '../../../../common/model.js';
import { CompletionItem } from '../../browser/suggest.js';
import { LRUMemory, Memory, NoMemory, PrefixMemory } from '../../browser/suggestMemory.js';
import { createSuggestItem } from './completionModel.test.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

suite('SuggestMemories', function () {

	let pos: IPosition;
	let buffer: ITextModel;
	let items: CompletionItem[];

	setup(function () {
		pos = { lineNumber: 1, column: 1 };
		buffer = createTextModel('This is some text.\nthis.\nfoo: ,');
		items = [
			createSuggestItem('foo', 0),
			createSuggestItem('bar', 0)
		];
	});

	teardown(() => {
		buffer.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('AbstractMemory, select', function () {

		const mem = new class extends Memory {
			constructor() {
				super('first');
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
//   3. Line 45: Error message without production error code - breaks React bundle size optimization
//   4. Line 45: Error message without production error code - breaks React bundle size optimization
//   5. Line 48: Error message without production error code - breaks React bundle size optimization
//   6. Line 48: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			}
			memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
//   3. Line 61: Error message without production error code - breaks React bundle size optimization
//   4. Line 61: Error message without production error code - breaks React bundle size optimization
//   5. Line 64: Error message without production error code - breaks React bundle size optimization
//   6. Line 64: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 73: Error message without production error code - breaks React bundle size optimization
//   2. Line 73: Error message without production error code - breaks React bundle size optimization
//   3. Line 75: Error message without production error code - breaks React bundle size optimization
//   4. Line 75: Error message without production error code - breaks React bundle size optimization
//   5. Line 78: Error message without production error code - breaks React bundle size optimization
//   6. Line 78: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 87: Error message without production error code - breaks React bundle size optimization
//   2. Line 87: Error message without production error code - breaks React bundle size optimization
//   3. Line 89: Error message without production error code - breaks React bundle size optimization
//   4. Line 89: Error message without production error code - breaks React bundle size optimization
//   5. Line 92: Error message without production error code - breaks React bundle size optimization
//   6. Line 92: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 101: Error message without production error code - breaks React bundle size optimization
//   2. Line 101: Error message without production error code - breaks React bundle size optimization
//   3. Line 103: Error message without production error code - breaks React bundle size optimization
//   4. Line 103: Error message without production error code - breaks React bundle size optimization
//   5. Line 106: Error message without production error code - breaks React bundle size optimization
//   6. Line 106: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 115: Error message without production error code - breaks React bundle size optimization
//   2. Line 115: Error message without production error code - breaks React bundle size optimization
//   3. Line 117: Error message without production error code - breaks React bundle size optimization
//   4. Line 117: Error message without production error code - breaks React bundle size optimization
//   5. Line 120: Error message without production error code - breaks React bundle size optimization
//   6. Line 120: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 129: Error message without production error code - breaks React bundle size optimization
//   2. Line 129: Error message without production error code - breaks React bundle size optimization
//   3. Line 131: Error message without production error code - breaks React bundle size optimization
//   4. Line 131: Error message without production error code - breaks React bundle size optimization
//   5. Line 134: Error message without production error code - breaks React bundle size optimization
//   6. Line 134: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 143: Error message without production error code - breaks React bundle size optimization
//   2. Line 143: Error message without production error code - breaks React bundle size optimization
//   3. Line 145: Error message without production error code - breaks React bundle size optimization
//   4. Line 145: Error message without production error code - breaks React bundle size optimization
//   5. Line 148: Error message without production error code - breaks React bundle size optimization
//   6. Line 148: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
//   3. Line 159: Error message without production error code - breaks React bundle size optimization
//   4. Line 159: Error message without production error code - breaks React bundle size optimization
//   5. Line 162: Error message without production error code - breaks React bundle size optimization
//   6. Line 162: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 171: Error message without production error code - breaks React bundle size optimization
//   2. Line 171: Error message without production error code - breaks React bundle size optimization
//   3. Line 173: Error message without production error code - breaks React bundle size optimization
//   4. Line 173: Error message without production error code - breaks React bundle size optimization
//   5. Line 176: Error message without production error code - breaks React bundle size optimization
//   6. Line 176: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 185: Error message without production error code - breaks React bundle size optimization
//   2. Line 185: Error message without production error code - breaks React bundle size optimization
//   3. Line 187: Error message without production error code - breaks React bundle size optimization
//   4. Line 187: Error message without production error code - breaks React bundle size optimization
//   5. Line 190: Error message without production error code - breaks React bundle size optimization
//   6. Line 190: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 199: Error message without production error code - breaks React bundle size optimization
//   2. Line 199: Error message without production error code - breaks React bundle size optimization
//   3. Line 201: Error message without production error code - breaks React bundle size optimization
//   4. Line 201: Error message without production error code - breaks React bundle size optimization
//   5. Line 204: Error message without production error code - breaks React bundle size optimization
//   6. Line 204: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 213: Error message without production error code - breaks React bundle size optimization
//   2. Line 213: Error message without production error code - breaks React bundle size optimization
//   3. Line 215: Error message without production error code - breaks React bundle size optimization
//   4. Line 215: Error message without production error code - breaks React bundle size optimization
//   5. Line 218: Error message without production error code - breaks React bundle size optimization
//   6. Line 218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
//   3. Line 229: Error message without production error code - breaks React bundle size optimization
//   4. Line 229: Error message without production error code - breaks React bundle size optimization
//   5. Line 232: Error message without production error code - breaks React bundle size optimization
//   6. Line 232: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 241: Error message without production error code - breaks React bundle size optimization
//   2. Line 241: Error message without production error code - breaks React bundle size optimization
//   3. Line 243: Error message without production error code - breaks React bundle size optimization
//   4. Line 243: Error message without production error code - breaks React bundle size optimization
//   5. Line 246: Error message without production error code - breaks React bundle size optimization
//   6. Line 246: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 255: Error message without production error code - breaks React bundle size optimization
//   2. Line 255: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Error message without production error code - breaks React bundle size optimization
//   4. Line 257: Error message without production error code - breaks React bundle size optimization
//   5. Line 260: Error message without production error code - breaks React bundle size optimization
//   6. Line 260: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 269: Error message without production error code - breaks React bundle size optimization
//   2. Line 269: Error message without production error code - breaks React bundle size optimization
//   3. Line 271: Error message without production error code - breaks React bundle size optimization
//   4. Line 271: Error message without production error code - breaks React bundle size optimization
//   5. Line 274: Error message without production error code - breaks React bundle size optimization
//   6. Line 274: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 283: Error message without production error code - breaks React bundle size optimization
//   2. Line 283: Error message without production error code - breaks React bundle size optimization
//   3. Line 285: Error message without production error code - breaks React bundle size optimization
//   4. Line 285: Error message without production error code - breaks React bundle size optimization
//   5. Line 288: Error message without production error code - breaks React bundle size optimization
//   6. Line 288: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 297: Error message without production error code - breaks React bundle size optimization
//   2. Line 297: Error message without production error code - breaks React bundle size optimization
//   3. Line 299: Error message without production error code - breaks React bundle size optimization
//   4. Line 299: Error message without production error code - breaks React bundle size optimization
//   5. Line 302: Error message without production error code - breaks React bundle size optimization
//   6. Line 302: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 311: Error message without production error code - breaks React bundle size optimization
//   2. Line 311: Error message without production error code - breaks React bundle size optimization
//   3. Line 313: Error message without production error code - breaks React bundle size optimization
//   4. Line 313: Error message without production error code - breaks React bundle size optimization
//   5. Line 316: Error message without production error code - breaks React bundle size optimization
//   6. Line 316: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 325: Error message without production error code - breaks React bundle size optimization
//   2. Line 325: Error message without production error code - breaks React bundle size optimization
//   3. Line 327: Error message without production error code - breaks React bundle size optimization
//   4. Line 327: Error message without production error code - breaks React bundle size optimization
//   5. Line 330: Error message without production error code - breaks React bundle size optimization
//   6. Line 330: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 339: Error message without production error code - breaks React bundle size optimization
//   2. Line 339: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
//   4. Line 341: Error message without production error code - breaks React bundle size optimization
//   5. Line 344: Error message without production error code - breaks React bundle size optimization
//   6. Line 344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 353: Error message without production error code - breaks React bundle size optimization
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
//   3. Line 355: Error message without production error code - breaks React bundle size optimization
//   4. Line 355: Error message without production error code - breaks React bundle size optimization
//   5. Line 358: Error message without production error code - breaks React bundle size optimization
//   6. Line 358: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 367: Error message without production error code - breaks React bundle size optimization
//   2. Line 367: Error message without production error code - breaks React bundle size optimization
//   3. Line 369: Error message without production error code - breaks React bundle size optimization
//   4. Line 369: Error message without production error code - breaks React bundle size optimization
//   5. Line 372: Error message without production error code - breaks React bundle size optimization
//   6. Line 372: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 381: Error message without production error code - breaks React bundle size optimization
//   2. Line 381: Error message without production error code - breaks React bundle size optimization
//   3. Line 383: Error message without production error code - breaks React bundle size optimization
//   4. Line 383: Error message without production error code - breaks React bundle size optimization
//   5. Line 386: Error message without production error code - breaks React bundle size optimization
//   6. Line 386: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 395: Error message without production error code - breaks React bundle size optimization
//   2. Line 395: Error message without production error code - breaks React bundle size optimization
//   3. Line 397: Error message without production error code - breaks React bundle size optimization
//   4. Line 397: Error message without production error code - breaks React bundle size optimization
//   5. Line 400: Error message without production error code - breaks React bundle size optimization
//   6. Line 400: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 409: Error message without production error code - breaks React bundle size optimization
//   2. Line 409: Error message without production error code - breaks React bundle size optimization
//   3. Line 411: Error message without production error code - breaks React bundle size optimization
//   4. Line 411: Error message without production error code - breaks React bundle size optimization
//   5. Line 414: Error message without production error code - breaks React bundle size optimization
//   6. Line 414: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 423: Error message without production error code - breaks React bundle size optimization
//   2. Line 423: Error message without production error code - breaks React bundle size optimization
//   3. Line 425: Error message without production error code - breaks React bundle size optimization
//   4. Line 425: Error message without production error code - breaks React bundle size optimization
//   5. Line 428: Error message without production error code - breaks React bundle size optimization
//   6. Line 428: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 437: Error message without production error code - breaks React bundle size optimization
//   2. Line 437: Error message without production error code - breaks React bundle size optimization
//   3. Line 439: Error message without production error code - breaks React bundle size optimization
//   4. Line 439: Error message without production error code - breaks React bundle size optimization
//   5. Line 442: Error message without production error code - breaks React bundle size optimization
//   6. Line 442: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 451: Error message without production error code - breaks React bundle size optimization
//   2. Line 451: Error message without production error code - breaks React bundle size optimization
//   3. Line 453: Error message without production error code - breaks React bundle size optimization
//   4. Line 453: Error message without production error code - breaks React bundle size optimization
//   5. Line 456: Error message without production error code - breaks React bundle size optimization
//   6. Line 456: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 465: Error message without production error code - breaks React bundle size optimization
//   2. Line 465: Error message without production error code - breaks React bundle size optimization
//   3. Line 467: Error message without production error code - breaks React bundle size optimization
//   4. Line 467: Error message without production error code - breaks React bundle size optimization
//   5. Line 470: Error message without production error code - breaks React bundle size optimization
//   6. Line 470: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Method not implemented.');
			} toJSON(): object {
				throw new Error('Method not implemented.');
			}
			fromJSON(data: object): void {
				throw new Error('Method not implemented.');
			}
		};

		const item1 = createSuggestItem('fazz', 0);
		const item2 = createSuggestItem('bazz', 0);
		const item3 = createSuggestItem('bazz', 0);
		const item4 = createSuggestItem('bazz', 0);
		item1.completion.preselect = false;
		item2.completion.preselect = true;
		item3.completion.preselect = true;

		assert.strictEqual(mem.select(buffer, pos, [item1, item2, item3, item4]), 1);
	});

	test('[No|Prefix|LRU]Memory honor selection boost', function () {
		const item1 = createSuggestItem('fazz', 0);
		const item2 = createSuggestItem('bazz', 0);
		const item3 = createSuggestItem('bazz', 0);
		const item4 = createSuggestItem('bazz', 0);
		item1.completion.preselect = false;
		item2.completion.preselect = true;
		item3.completion.preselect = true;
		const items = [item1, item2, item3, item4];


		assert.strictEqual(new NoMemory().select(buffer, pos, items), 1);
		assert.strictEqual(new LRUMemory().select(buffer, pos, items), 1);
		assert.strictEqual(new PrefixMemory().select(buffer, pos, items), 1);
	});

	test('NoMemory', () => {

		const mem = new NoMemory();

		assert.strictEqual(mem.select(buffer, pos, items), 0);
		assert.strictEqual(mem.select(buffer, pos, []), 0);

		mem.memorize(buffer, pos, items[0]);
		mem.memorize(buffer, pos, null!);
	});

	test('LRUMemory', () => {

		pos = { lineNumber: 2, column: 6 };

		const mem = new LRUMemory();
		mem.memorize(buffer, pos, items[1]);

		assert.strictEqual(mem.select(buffer, pos, items), 1);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 3 }, items), 0);

		mem.memorize(buffer, pos, items[0]);
		assert.strictEqual(mem.select(buffer, pos, items), 0);

		assert.strictEqual(mem.select(buffer, pos, [
			createSuggestItem('new', 0),
			createSuggestItem('bar', 0)
		]), 1);

		assert.strictEqual(mem.select(buffer, pos, [
			createSuggestItem('new1', 0),
			createSuggestItem('new2', 0)
		]), 0);
	});

	test('`"editor.suggestSelection": "recentlyUsed"` should be a little more sticky #78571', function () {

		const item1 = createSuggestItem('gamma', 0);
		const item2 = createSuggestItem('game', 0);
		items = [item1, item2];

		const mem = new LRUMemory();
		buffer.setValue('    foo.');
		mem.memorize(buffer, { lineNumber: 1, column: 1 }, item2);

		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 2 }, items), 0); // leading whitespace -> ignore recent items

		mem.memorize(buffer, { lineNumber: 1, column: 9 }, item2);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 9 }, items), 1); // foo.

		buffer.setValue('    foo.g');
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 10 }, items), 1); // foo.g, 'gamma' and 'game' have the same score

		item1.score = [10, 0, 0];
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 10 }, items), 0); // foo.g, 'gamma' has higher score

	});

	test('intellisense is not showing top options first #43429', function () {
		// ensure we don't memorize for whitespace prefixes

		pos = { lineNumber: 2, column: 6 };
		const mem = new LRUMemory();

		mem.memorize(buffer, pos, items[1]);
		assert.strictEqual(mem.select(buffer, pos, items), 1);

		assert.strictEqual(mem.select(buffer, { lineNumber: 3, column: 5 }, items), 0); // foo: |,
		assert.strictEqual(mem.select(buffer, { lineNumber: 3, column: 6 }, items), 1); // foo: ,|
	});

	test('PrefixMemory', () => {

		const mem = new PrefixMemory();
		buffer.setValue('constructor');
		const item0 = createSuggestItem('console', 0);
		const item1 = createSuggestItem('const', 0);
		const item2 = createSuggestItem('constructor', 0);
		const item3 = createSuggestItem('constant', 0);
		const items = [item0, item1, item2, item3];

		mem.memorize(buffer, { lineNumber: 1, column: 2 }, item1); // c -> const
		mem.memorize(buffer, { lineNumber: 1, column: 3 }, item0); // co -> console
		mem.memorize(buffer, { lineNumber: 1, column: 4 }, item2); // con -> constructor

		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 1 }, items), 0);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 2 }, items), 1);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 3 }, items), 0);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 4 }, items), 2);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 7 }, items), 2); // find substr
	});

});
