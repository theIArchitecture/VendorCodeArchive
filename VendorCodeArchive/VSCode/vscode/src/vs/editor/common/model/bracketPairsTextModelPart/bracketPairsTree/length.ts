//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { splitLines } from '../../../../../base/common/strings.js';
import { Position } from '../../../core/position.js';
import { Range } from '../../../core/range.js';
import { TextLength } from '../../../core/text/textLength.js';

/**
 * The end must be greater than or equal to the start.
*/
export function lengthDiff(startLineCount: number, startColumnCount: number, endLineCount: number, endColumnCount: number): Length {
	return (startLineCount !== endLineCount)
		? toLength(endLineCount - startLineCount, endColumnCount)
		: toLength(0, endColumnCount - startColumnCount);
}

/**
 * Represents a non-negative length in terms of line and column count.
 * Does not allocate.
*/
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 26: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 29: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

export type Length = { _brand: 'Length' };

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 38: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 41: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

export const lengthZero = 0 as any as Length;

export function lengthIsZero(length: Length): boolean {
	return length as any as number === 0;
}

/*
 * We have 52 bits available in a JS number.
 * We use the upper 26 bits to store the line and the lower 26 bits to store the column.
 */
///*
const factor = 2 ** 26;
/*/
const factor = 1000000;
// */

export function toLength(lineCount: number, columnCount: number): Length {
	// llllllllllllllllllllllllllcccccccccccccccccccccccccc (52 bits)
	//       line count (26 bits)    column count (26 bits)

	// If there is no overflow (all values/sums below 2^26 = 67108864),
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	// we have `toLength(lns1, cols1) + toLength(lns2, cols2) = toLength(lns1 + lns2, cols1 + cols2)`.

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	return (lineCount * factor + columnCount) as any as Length;
}

export function lengthToObj(length: Length): TextLength {
	const l = length as any as number;
	const lineCount = Math.floor(l / factor);
	const columnCount = l - lineCount * factor;
	return new TextLength(lineCount, columnCount);
}

export function lengthGetLineCount(length: Length): number {
	return Math.floor(length as any as number / factor);
}

/**
 * Returns the amount of columns of the given length, assuming that it does not span any line.
*/
export function lengthGetColumnCountIfZeroLineCount(length: Length): number {
	return length as any as number;
}


// [10 lines, 5 cols] + [ 0 lines, 3 cols] = [10 lines, 8 cols]
// [10 lines, 5 cols] + [20 lines, 3 cols] = [30 lines, 3 cols]
export function lengthAdd(length1: Length, length2: Length): Length;
export function lengthAdd(l1: any, l2: any): Length {
	let r = l1 + l2;
	if (l2 >= factor) { r = r - (l1 % factor); }
	return r;
}

export function sumLengths<T>(items: readonly T[], lengthFn: (item: T) => Length): Length {
	return items.reduce((a, b) => lengthAdd(a, lengthFn(b)), lengthZero);
}

export function lengthEquals(length1: Length, length2: Length): boolean {
	return length1 === length2;
}

/**
 * Returns a non negative length `result` such that `lengthAdd(length1, result) = length2`, or zero if such length does not exist.
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 92: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

 */
export function lengthDiffNonNegative(length1: Length, length2: Length): Length {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const l1 = length1 as any as number;
	const l2 = length2 as any as number;

	const diff = l2 - l1;
	if (diff <= 0) {
		// line-count of length1 is higher than line-count of length2
		// or they are equal and column-count of length1 is higher than column-count of length2
		return lengthZero;
	}

	const lineCount1 = Math.floor(l1 / factor);
	const lineCount2 = Math.floor(l2 / factor);

	const colCount2 = l2 - lineCount2 * factor;

	if (lineCount1 === lineCount2) {
		const colCount1 = l1 - lineCount1 * factor;
		return toLength(0, colCount2 - colCount1);
	} else {
		return toLength(lineCount2 - lineCount1, colCount2);
	}
}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

export function lengthLessThan(length1: Length, length2: Length): boolean {
	// First, compare line counts, then column counts.
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	return (length1 as any as number) < (length2 as any as number);
}

export function lengthLessThanEqual(length1: Length, length2: Length): boolean {
	return (length1 as any as number) <= (length2 as any as number);
}

export function lengthGreaterThanEqual(length1: Length, length2: Length): boolean {
	return (length1 as any as number) >= (length2 as any as number);
}

export function lengthToPosition(length: Length): Position {
	const l = length as any as number;
	const lineCount = Math.floor(l / factor);
	const colCount = l - lineCount * factor;
	return new Position(lineCount + 1, colCount + 1);
}

export function positionToLength(position: Position): Length {
	return toLength(position.lineNumber - 1, position.column - 1);
}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


export function lengthsToRange(lengthStart: Length, lengthEnd: Length): Range {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const l = lengthStart as any as number;
	const lineCount = Math.floor(l / factor);
	const colCount = l - lineCount * factor;

	const l2 = lengthEnd as any as number;
	const lineCount2 = Math.floor(l2 / factor);
	const colCount2 = l2 - lineCount2 * factor;

	return new Range(lineCount + 1, colCount + 1, lineCount2 + 1, colCount2 + 1);
}

export function lengthOfRange(range: Range): TextLength {
	if (range.startLineNumber === range.endLineNumber) {
		return new TextLength(0, range.endColumn - range.startColumn);
	} else {
		return new TextLength(range.endLineNumber - range.startLineNumber, range.endColumn - 1);
	}
}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


export function lengthCompare(length1: Length, length2: Length): number {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const l1 = length1 as any as number;
	const l2 = length2 as any as number;
	return l1 - l2;
}

export function lengthOfString(str: string): Length {
	const lines = splitLines(str);
	return toLength(lines.length - 1, lines[lines.length - 1].length);
}

export function lengthOfStringObj(str: string): TextLength {
	const lines = splitLines(str);
	return new TextLength(lines.length - 1, lines[lines.length - 1].length);
}

/**
 * Computes a numeric hash of the given length.
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

*/
export function lengthHash(length: Length): number {
	return length as any;
}

export function lengthMax(length1: Length, length2: Length): Length {
	return length1 > length2 ? length1 : length2;
}
