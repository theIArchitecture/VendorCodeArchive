//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Range } from '../../../../../../../../../editor/common/core/range.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../../../base/test/common/utils.js';
import { SpacingToken, SimpleToken, Space, Tab, VerticalTab } from '../../../../../../common/promptSyntax/codecs/base/simpleCodec/tokens/tokens.js';

suite('SimpleToken', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('SpacingToken', () => {
		test('extends \'SimpleToken\'', () => {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 18: Error message without production error code - breaks React bundle size optimization
//   2. Line 18: Error message without production error code - breaks React bundle size optimization
//   3. Line 21: Error message without production error code - breaks React bundle size optimization
//   4. Line 21: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			class TestClass extends SpacingToken {
				public override get text(): string {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 32: Error message without production error code - breaks React bundle size optimization
//   2. Line 32: Error message without production error code - breaks React bundle size optimization
//   3. Line 35: Error message without production error code - breaks React bundle size optimization
//   4. Line 35: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 44: Error message without production error code - breaks React bundle size optimization
//   2. Line 44: Error message without production error code - breaks React bundle size optimization
//   3. Line 47: Error message without production error code - breaks React bundle size optimization
//   4. Line 47: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 56: Error message without production error code - breaks React bundle size optimization
//   2. Line 56: Error message without production error code - breaks React bundle size optimization
//   3. Line 59: Error message without production error code - breaks React bundle size optimization
//   4. Line 59: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 68: Error message without production error code - breaks React bundle size optimization
//   2. Line 68: Error message without production error code - breaks React bundle size optimization
//   3. Line 71: Error message without production error code - breaks React bundle size optimization
//   4. Line 71: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error('Method not implemented.');
				}
				public override toString(): string {
					throw new Error('Method not implemented.');
				}
			}

			const token = new TestClass(new Range(1, 1, 1, 1));

			assert(
				token instanceof SimpleToken,
				'SpacingToken must extend SimpleToken.',
			);
		});
	});

	suite('Space', () => {
		test('extends \'SpacingToken\'', () => {
			const token = new Space(new Range(1, 1, 1, 2));

			assert(
				token instanceof SimpleToken,
				'Space must extend SpacingToken.',
			);
		});
	});

	suite('Tab', () => {
		test('extends \'SpacingToken\'', () => {
			const token = new Tab(new Range(1, 1, 1, 2));

			assert(
				token instanceof SimpleToken,
				'Tab must extend SpacingToken.',
			);
		});
	});

	suite('VerticalTab', () => {
		test('extends \'SpacingToken\'', () => {
			const token = new VerticalTab(new Range(1, 1, 1, 2));

			assert(
				token instanceof SimpleToken,
				'VerticalTab must extend SpacingToken.',
			);
		});
	});
});
