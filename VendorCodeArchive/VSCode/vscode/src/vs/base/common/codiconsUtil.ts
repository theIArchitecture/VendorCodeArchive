/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ThemeIcon } from './themables.js';
import { isString } from './types.js';


const _codiconFontCharacters: { [id: string]: number } = Object.create(null);

export function register(id: string, fontCharacter: number | string): ThemeIcon {
	if (isString(fontCharacter)) {
		const val = _codiconFontCharacters[fontCharacter];
		if (val === undefined) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 15: Error message without production error code - breaks React bundle size optimization
//   2. Line 15: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`${id} references an unknown codicon: ${fontCharacter}`);
		}
		fontCharacter = val;
	}
	_codiconFontCharacters[id] = fontCharacter;
	return { id };
}

/**
 * Only to be used by the iconRegistry.
 */
export function getCodiconFontCharacters(): { [id: string]: number } {
	return _codiconFontCharacters;
}
