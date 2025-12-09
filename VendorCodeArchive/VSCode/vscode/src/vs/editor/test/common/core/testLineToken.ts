//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { ColorId, TokenMetadata, ITokenPresentation, StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { ILanguageIdCodec } from '../../../common/languages.js';

/**
 * A token on a line.
 */
export class TestLineToken {

	/**
	 * last char index of this token (not inclusive).
	 */
	public readonly endIndex: number;
	private readonly _metadata: number;

	constructor(endIndex: number, metadata: number) {
		this.endIndex = endIndex;
		this._metadata = metadata;
	}

	public getStandardTokenType(): StandardTokenType {
		return TokenMetadata.getTokenType(this._metadata);
	}

	public getForeground(): ColorId {
		return TokenMetadata.getForeground(this._metadata);
	}

	public getType(): string {
		return TokenMetadata.getClassNameFromMetadata(this._metadata);
	}

	public getInlineStyle(colorMap: string[]): string {
		return TokenMetadata.getInlineStyleFromMetadata(this._metadata, colorMap);
	}

	public getPresentation(): ITokenPresentation {
		return TokenMetadata.getPresentationFromMetadata(this._metadata);
	}

	private static _equals(a: TestLineToken, b: TestLineToken): boolean {
		return (
			a.endIndex === b.endIndex
			&& a._metadata === b._metadata
		);
	}

	public static equalsArr(a: TestLineToken[], b: TestLineToken[]): boolean {
		const aLen = a.length;
		const bLen = b.length;
		if (aLen !== bLen) {
			return false;
		}
		for (let i = 0; i < aLen; i++) {
			if (!this._equals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}
}

export class TestLineTokens implements IViewLineTokens {

	private readonly _actual: TestLineToken[];

	constructor(actual: TestLineToken[]) {
		this._actual = actual;
	}

	public equals(other: IViewLineTokens): boolean {
		if (other instanceof TestLineTokens) {
			return TestLineToken.equalsArr(this._actual, other._actual);
		}
		return false;
	}

	public getCount(): number {
		return this._actual.length;
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		return this._actual[tokenIndex].getStandardTokenType();
	}

	public getForeground(tokenIndex: number): ColorId {
		return this._actual[tokenIndex].getForeground();
	}

	public getEndOffset(tokenIndex: number): number {
		return this._actual[tokenIndex].endIndex;
	}

	public getClassName(tokenIndex: number): string {
		return this._actual[tokenIndex].getType();
	}

	public getInlineStyle(tokenIndex: number, colorMap: string[]): string {
		return this._actual[tokenIndex].getInlineStyle(colorMap);
	}

	public getPresentation(tokenIndex: number): ITokenPresentation {
		return this._actual[tokenIndex].getPresentation();
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 112: Error message without production error code - breaks React bundle size optimization
//   2. Line 112: Error message without production error code - breaks React bundle size optimization
//   3. Line 116: Error message without production error code - breaks React bundle size optimization
//   4. Line 116: Error message without production error code - breaks React bundle size optimization
//   5. Line 120: Error message without production error code - breaks React bundle size optimization
//   6. Line 120: Error message without production error code - breaks React bundle size optimization
//   7. Line 124: Error message without production error code - breaks React bundle size optimization
//   8. Line 124: Error message without production error code - breaks React bundle size optimization
//   9. Line 128: Error message without production error code - breaks React bundle size optimization
//   10. Line 128: Error message without production error code - breaks React bundle size optimization
//   11. Line 132: Error message without production error code - breaks React bundle size optimization
//   12. Line 132: Error message without production error code - breaks React bundle size optimization
//   13. Line 136: Error message without production error code - breaks React bundle size optimization
//   14. Line 136: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	public findTokenIndexAtOffset(offset: number): number {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 136: Error message without production error code - breaks React bundle size optimization
//   2. Line 136: Error message without production error code - breaks React bundle size optimization
//   3. Line 140: Error message without production error code - breaks React bundle size optimization
//   4. Line 140: Error message without production error code - breaks React bundle size optimization
//   5. Line 144: Error message without production error code - breaks React bundle size optimization
//   6. Line 144: Error message without production error code - breaks React bundle size optimization
//   7. Line 148: Error message without production error code - breaks React bundle size optimization
//   8. Line 148: Error message without production error code - breaks React bundle size optimization
//   9. Line 152: Error message without production error code - breaks React bundle size optimization
//   10. Line 152: Error message without production error code - breaks React bundle size optimization
//   11. Line 156: Error message without production error code - breaks React bundle size optimization
//   12. Line 156: Error message without production error code - breaks React bundle size optimization
//   13. Line 160: Error message without production error code - breaks React bundle size optimization
//   14. Line 160: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 158: Error message without production error code - breaks React bundle size optimization
//   2. Line 158: Error message without production error code - breaks React bundle size optimization
//   3. Line 162: Error message without production error code - breaks React bundle size optimization
//   4. Line 162: Error message without production error code - breaks React bundle size optimization
//   5. Line 166: Error message without production error code - breaks React bundle size optimization
//   6. Line 166: Error message without production error code - breaks React bundle size optimization
//   7. Line 170: Error message without production error code - breaks React bundle size optimization
//   8. Line 170: Error message without production error code - breaks React bundle size optimization
//   9. Line 174: Error message without production error code - breaks React bundle size optimization
//   10. Line 174: Error message without production error code - breaks React bundle size optimization
//   11. Line 178: Error message without production error code - breaks React bundle size optimization
//   12. Line 178: Error message without production error code - breaks React bundle size optimization
//   13. Line 182: Error message without production error code - breaks React bundle size optimization
//   14. Line 182: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 180: Error message without production error code - breaks React bundle size optimization
//   2. Line 180: Error message without production error code - breaks React bundle size optimization
//   3. Line 184: Error message without production error code - breaks React bundle size optimization
//   4. Line 184: Error message without production error code - breaks React bundle size optimization
//   5. Line 188: Error message without production error code - breaks React bundle size optimization
//   6. Line 188: Error message without production error code - breaks React bundle size optimization
//   7. Line 192: Error message without production error code - breaks React bundle size optimization
//   8. Line 192: Error message without production error code - breaks React bundle size optimization
//   9. Line 196: Error message without production error code - breaks React bundle size optimization
//   10. Line 196: Error message without production error code - breaks React bundle size optimization
//   11. Line 200: Error message without production error code - breaks React bundle size optimization
//   12. Line 200: Error message without production error code - breaks React bundle size optimization
//   13. Line 204: Error message without production error code - breaks React bundle size optimization
//   14. Line 204: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 202: Error message without production error code - breaks React bundle size optimization
//   2. Line 202: Error message without production error code - breaks React bundle size optimization
//   3. Line 206: Error message without production error code - breaks React bundle size optimization
//   4. Line 206: Error message without production error code - breaks React bundle size optimization
//   5. Line 210: Error message without production error code - breaks React bundle size optimization
//   6. Line 210: Error message without production error code - breaks React bundle size optimization
//   7. Line 214: Error message without production error code - breaks React bundle size optimization
//   8. Line 214: Error message without production error code - breaks React bundle size optimization
//   9. Line 218: Error message without production error code - breaks React bundle size optimization
//   10. Line 218: Error message without production error code - breaks React bundle size optimization
//   11. Line 222: Error message without production error code - breaks React bundle size optimization
//   12. Line 222: Error message without production error code - breaks React bundle size optimization
//   13. Line 226: Error message without production error code - breaks React bundle size optimization
//   14. Line 226: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 224: Error message without production error code - breaks React bundle size optimization
//   2. Line 224: Error message without production error code - breaks React bundle size optimization
//   3. Line 228: Error message without production error code - breaks React bundle size optimization
//   4. Line 228: Error message without production error code - breaks React bundle size optimization
//   5. Line 232: Error message without production error code - breaks React bundle size optimization
//   6. Line 232: Error message without production error code - breaks React bundle size optimization
//   7. Line 236: Error message without production error code - breaks React bundle size optimization
//   8. Line 236: Error message without production error code - breaks React bundle size optimization
//   9. Line 240: Error message without production error code - breaks React bundle size optimization
//   10. Line 240: Error message without production error code - breaks React bundle size optimization
//   11. Line 244: Error message without production error code - breaks React bundle size optimization
//   12. Line 244: Error message without production error code - breaks React bundle size optimization
//   13. Line 248: Error message without production error code - breaks React bundle size optimization
//   14. Line 248: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 246: Error message without production error code - breaks React bundle size optimization
//   2. Line 246: Error message without production error code - breaks React bundle size optimization
//   3. Line 250: Error message without production error code - breaks React bundle size optimization
//   4. Line 250: Error message without production error code - breaks React bundle size optimization
//   5. Line 254: Error message without production error code - breaks React bundle size optimization
//   6. Line 254: Error message without production error code - breaks React bundle size optimization
//   7. Line 258: Error message without production error code - breaks React bundle size optimization
//   8. Line 258: Error message without production error code - breaks React bundle size optimization
//   9. Line 262: Error message without production error code - breaks React bundle size optimization
//   10. Line 262: Error message without production error code - breaks React bundle size optimization
//   11. Line 266: Error message without production error code - breaks React bundle size optimization
//   12. Line 266: Error message without production error code - breaks React bundle size optimization
//   13. Line 270: Error message without production error code - breaks React bundle size optimization
//   14. Line 270: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Not implemented');
	}

	public getLineContent(): string {
		throw new Error('Not implemented');
	}

	public getMetadata(tokenIndex: number): number {
		throw new Error('Method not implemented.');
	}

	public getLanguageId(tokenIndex: number): string {
		throw new Error('Method not implemented.');
	}

	public getTokenText(tokenIndex: number): string {
		throw new Error('Method not implemented.');
	}

	public forEach(callback: (tokenIndex: number) => void): void {
		throw new Error('Not implemented');
	}

	public get languageIdCodec(): ILanguageIdCodec {
		throw new Error('Not implemented');
	}
}

export class TestLineTokenFactory {

	public static inflateArr(tokens: Uint32Array): TestLineToken[] {
		const tokensCount = (tokens.length >>> 1);

		const result: TestLineToken[] = new Array<TestLineToken>(tokensCount);
		for (let i = 0; i < tokensCount; i++) {
			const endOffset = tokens[i << 1];
			const metadata = tokens[(i << 1) + 1];

			result[i] = new TestLineToken(endOffset, metadata);
		}

		return result;
	}

}
