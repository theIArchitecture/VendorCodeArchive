//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { BracketsUtils } from '../../../../common/languages/supports/richEditBrackets.js';

suite('richEditBrackets', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function findPrevBracketInRange(reversedBracketRegex: RegExp, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range | null {
		return BracketsUtils.findPrevBracketInRange(reversedBracketRegex, 1, lineText, currentTokenStart, currentTokenEnd);
	}

	function findNextBracketInRange(forwardBracketRegex: RegExp, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range | null {
		return BracketsUtils.findNextBracketInRange(forwardBracketRegex, 1, lineText, currentTokenStart, currentTokenEnd);
	}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 25: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 26: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 31: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 32: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 37: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 38: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 43: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 44: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 55: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 68: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('findPrevBracketInToken one char 1', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{', 0, 1);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 54: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 90: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 92: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken one char 2', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{{', 0, 1);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken one char 3', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{hello world!', 0, 13);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken more chars 1', () => {
		const result = findPrevBracketInRange(/(olleh)/i, 'hello world!', 0, 12);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 6);
	});

	test('findPrevBracketInToken more chars 2', () => {
		const result = findPrevBracketInRange(/(olleh)/i, 'hello world!', 0, 5);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 6);
	});

	test('findPrevBracketInToken more chars 3', () => {
		const result = findPrevBracketInRange(/(olleh)/i, ' hello world!', 0, 6);
		assert.strictEqual(result!.startColumn, 2);
		assert.strictEqual(result!.endColumn, 7);
	});

	test('findNextBracketInToken one char', () => {
		const result = findNextBracketInRange(/(\{)|(\})/i, '{', 0, 1);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findNextBracketInToken more chars', () => {
		const result = findNextBracketInRange(/(world)/i, 'hello world!', 0, 12);
		assert.strictEqual(result!.startColumn, 7);
		assert.strictEqual(result!.endColumn, 12);
	});

	test('findNextBracketInToken with emoty result', () => {
		const result = findNextBracketInRange(/(\{)|(\})/i, '', 0, 0);
		assert.strictEqual(result, null);
	});

	test('issue #3894: [Handlebars] Curly braces edit issues', () => {
		const result = findPrevBracketInRange(/(\-\-!<)|(>\-\-)|(\{\{)|(\}\})/i, '{{asd}}', 0, 2);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 3);
	});

});
