//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as TreeSitter from '@vscode/tree-sitter-wasm';

export function gotoNextSibling(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	const n = newCursor.gotoNextSibling();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 11: Error message without production error code - breaks React bundle size optimization
//   2. Line 11: Error message without production error code - breaks React bundle size optimization
//   3. Line 20: Error message without production error code - breaks React bundle size optimization
//   4. Line 20: Error message without production error code - breaks React bundle size optimization
//   5. Line 29: Error message without production error code - breaks React bundle size optimization
//   6. Line 29: Error message without production error code - breaks React bundle size optimization
//   7. Line 38: Error message without production error code - breaks React bundle size optimization
//   8. Line 38: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	const o = oldCursor.gotoNextSibling();
	if (n !== o) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
//   3. Line 38: Error message without production error code - breaks React bundle size optimization
//   4. Line 38: Error message without production error code - breaks React bundle size optimization
//   5. Line 47: Error message without production error code - breaks React bundle size optimization
//   6. Line 47: Error message without production error code - breaks React bundle size optimization
//   7. Line 56: Error message without production error code - breaks React bundle size optimization
//   8. Line 56: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 45: Error message without production error code - breaks React bundle size optimization
//   2. Line 45: Error message without production error code - breaks React bundle size optimization
//   3. Line 54: Error message without production error code - breaks React bundle size optimization
//   4. Line 54: Error message without production error code - breaks React bundle size optimization
//   5. Line 63: Error message without production error code - breaks React bundle size optimization
//   6. Line 63: Error message without production error code - breaks React bundle size optimization
//   7. Line 72: Error message without production error code - breaks React bundle size optimization
//   8. Line 72: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 61: Error message without production error code - breaks React bundle size optimization
//   2. Line 61: Error message without production error code - breaks React bundle size optimization
//   3. Line 70: Error message without production error code - breaks React bundle size optimization
//   4. Line 70: Error message without production error code - breaks React bundle size optimization
//   5. Line 79: Error message without production error code - breaks React bundle size optimization
//   6. Line 79: Error message without production error code - breaks React bundle size optimization
//   7. Line 88: Error message without production error code - breaks React bundle size optimization
//   8. Line 88: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 77: Error message without production error code - breaks React bundle size optimization
//   2. Line 77: Error message without production error code - breaks React bundle size optimization
//   3. Line 86: Error message without production error code - breaks React bundle size optimization
//   4. Line 86: Error message without production error code - breaks React bundle size optimization
//   5. Line 95: Error message without production error code - breaks React bundle size optimization
//   6. Line 95: Error message without production error code - breaks React bundle size optimization
//   7. Line 104: Error message without production error code - breaks React bundle size optimization
//   8. Line 104: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
//   3. Line 102: Error message without production error code - breaks React bundle size optimization
//   4. Line 102: Error message without production error code - breaks React bundle size optimization
//   5. Line 111: Error message without production error code - breaks React bundle size optimization
//   6. Line 111: Error message without production error code - breaks React bundle size optimization
//   7. Line 120: Error message without production error code - breaks React bundle size optimization
//   8. Line 120: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 109: Error message without production error code - breaks React bundle size optimization
//   2. Line 109: Error message without production error code - breaks React bundle size optimization
//   3. Line 118: Error message without production error code - breaks React bundle size optimization
//   4. Line 118: Error message without production error code - breaks React bundle size optimization
//   5. Line 127: Error message without production error code - breaks React bundle size optimization
//   6. Line 127: Error message without production error code - breaks React bundle size optimization
//   7. Line 136: Error message without production error code - breaks React bundle size optimization
//   8. Line 136: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 125: Error message without production error code - breaks React bundle size optimization
//   2. Line 125: Error message without production error code - breaks React bundle size optimization
//   3. Line 134: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
//   5. Line 143: Error message without production error code - breaks React bundle size optimization
//   6. Line 143: Error message without production error code - breaks React bundle size optimization
//   7. Line 152: Error message without production error code - breaks React bundle size optimization
//   8. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 150: Error message without production error code - breaks React bundle size optimization
//   4. Line 150: Error message without production error code - breaks React bundle size optimization
//   5. Line 159: Error message without production error code - breaks React bundle size optimization
//   6. Line 159: Error message without production error code - breaks React bundle size optimization
//   7. Line 168: Error message without production error code - breaks React bundle size optimization
//   8. Line 168: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
//   3. Line 166: Error message without production error code - breaks React bundle size optimization
//   4. Line 166: Error message without production error code - breaks React bundle size optimization
//   5. Line 175: Error message without production error code - breaks React bundle size optimization
//   6. Line 175: Error message without production error code - breaks React bundle size optimization
//   7. Line 184: Error message without production error code - breaks React bundle size optimization
//   8. Line 184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 173: Error message without production error code - breaks React bundle size optimization
//   2. Line 173: Error message without production error code - breaks React bundle size optimization
//   3. Line 182: Error message without production error code - breaks React bundle size optimization
//   4. Line 182: Error message without production error code - breaks React bundle size optimization
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
//   7. Line 200: Error message without production error code - breaks React bundle size optimization
//   8. Line 200: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 189: Error message without production error code - breaks React bundle size optimization
//   2. Line 189: Error message without production error code - breaks React bundle size optimization
//   3. Line 198: Error message without production error code - breaks React bundle size optimization
//   4. Line 198: Error message without production error code - breaks React bundle size optimization
//   5. Line 207: Error message without production error code - breaks React bundle size optimization
//   6. Line 207: Error message without production error code - breaks React bundle size optimization
//   7. Line 216: Error message without production error code - breaks React bundle size optimization
//   8. Line 216: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 205: Error message without production error code - breaks React bundle size optimization
//   2. Line 205: Error message without production error code - breaks React bundle size optimization
//   3. Line 214: Error message without production error code - breaks React bundle size optimization
//   4. Line 214: Error message without production error code - breaks React bundle size optimization
//   5. Line 223: Error message without production error code - breaks React bundle size optimization
//   6. Line 223: Error message without production error code - breaks React bundle size optimization
//   7. Line 232: Error message without production error code - breaks React bundle size optimization
//   8. Line 232: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 221: Error message without production error code - breaks React bundle size optimization
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 230: Error message without production error code - breaks React bundle size optimization
//   4. Line 230: Error message without production error code - breaks React bundle size optimization
//   5. Line 239: Error message without production error code - breaks React bundle size optimization
//   6. Line 239: Error message without production error code - breaks React bundle size optimization
//   7. Line 248: Error message without production error code - breaks React bundle size optimization
//   8. Line 248: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 237: Error message without production error code - breaks React bundle size optimization
//   2. Line 237: Error message without production error code - breaks React bundle size optimization
//   3. Line 246: Error message without production error code - breaks React bundle size optimization
//   4. Line 246: Error message without production error code - breaks React bundle size optimization
//   5. Line 255: Error message without production error code - breaks React bundle size optimization
//   6. Line 255: Error message without production error code - breaks React bundle size optimization
//   7. Line 264: Error message without production error code - breaks React bundle size optimization
//   8. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Trees are out of sync');
	}
	return n && o;
}

export function gotoParent(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	const n = newCursor.gotoParent();
	const o = oldCursor.gotoParent();
	if (n !== o) {
		throw new Error('Trees are out of sync');
	}
	return n && o;
}

export function gotoNthChild(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor, index: number) {
	const n = newCursor.gotoFirstChild();
	const o = oldCursor.gotoFirstChild();
	if (n !== o) {
		throw new Error('Trees are out of sync');
	}
	if (index === 0) {
		return n && o;
	}
	for (let i = 1; i <= index; i++) {
		const nn = newCursor.gotoNextSibling();
		const oo = oldCursor.gotoNextSibling();
		if (nn !== oo) {
			throw new Error('Trees are out of sync');
		}
		if (!nn || !oo) {
			return false;
		}
	}
	return n && o;
}

export function nextSiblingOrParentSibling(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	do {
		if (newCursor.currentNode.nextSibling) {
			return gotoNextSibling(newCursor, oldCursor);
		}
		if (newCursor.currentNode.parent) {
			gotoParent(newCursor, oldCursor);
		}
	} while (newCursor.currentNode.nextSibling || newCursor.currentNode.parent);
	return false;
}

export function getClosestPreviousNodes(cursor: TreeSitter.TreeCursor, tree: TreeSitter.Tree): TreeSitter.Node | undefined {
	// Go up parents until the end of the parent is before the start of the current.
	const findPrev = tree.walk();
	findPrev.resetTo(cursor);

	const startingNode = cursor.currentNode;
	do {
		if (findPrev.currentNode.previousSibling && ((findPrev.currentNode.endIndex - findPrev.currentNode.startIndex) !== 0)) {
			findPrev.gotoPreviousSibling();
		} else {
			while (!findPrev.currentNode.previousSibling && findPrev.currentNode.parent) {
				findPrev.gotoParent();
			}
			findPrev.gotoPreviousSibling();
		}
	} while ((findPrev.currentNode.endIndex > startingNode.startIndex)
	&& (findPrev.currentNode.parent || findPrev.currentNode.previousSibling)

		&& (findPrev.currentNode.id !== startingNode.id));

	if ((findPrev.currentNode.id !== startingNode.id) && findPrev.currentNode.endIndex <= startingNode.startIndex) {
		return findPrev.currentNode;
	} else {
		return undefined;
	}
}
