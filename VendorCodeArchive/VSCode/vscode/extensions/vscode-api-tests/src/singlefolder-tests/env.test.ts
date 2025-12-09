//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { env, ExtensionKind, extensions, UIKind, Uri } from 'vscode';
import { assertNoRpc } from '../utils';

suite('vscode API - env', () => {

	teardown(assertNoRpc);

	test('env is set', function () {
		assert.strictEqual(typeof env.language, 'string');
		assert.strictEqual(typeof env.appRoot, 'string');
		assert.strictEqual(typeof env.appName, 'string');
		assert.strictEqual(typeof env.machineId, 'string');
		assert.strictEqual(typeof env.sessionId, 'string');
		assert.strictEqual(typeof env.shell, 'string');
	});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 24: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 25: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 26: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 27: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 28: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 29: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	test('env is readonly', function () {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 40: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 41: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 42: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 43: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 44: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 54: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 55: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 68: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 69: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 70: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.throws(() => (env as any).language = '234');
		assert.throws(() => (env as any).appRoot = '234');
		assert.throws(() => (env as any).appName = '234');
		assert.throws(() => (env as any).machineId = '234');
		assert.throws(() => (env as any).sessionId = '234');
		assert.throws(() => (env as any).shell = '234');
	});

	test('env.remoteName', function () {
		const remoteName = env.remoteName;
		const knownWorkspaceExtension = extensions.getExtension('vscode.git');
		const knownUiAndWorkspaceExtension = extensions.getExtension('vscode.media-preview');
		if (typeof remoteName === 'undefined') {
			// not running in remote, so we expect both extensions
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 40: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.ok(knownWorkspaceExtension);
			assert.ok(knownUiAndWorkspaceExtension);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(ExtensionKind.UI, knownUiAndWorkspaceExtension!.extensionKind);
		} else if (typeof remoteName === 'string') {
			// running in remote, so we only expect workspace extensions
			assert.ok(knownWorkspaceExtension);
			if (env.uiKind === UIKind.Desktop) {
				assert.ok(!knownUiAndWorkspaceExtension); // we currently can only access extensions that run on same host
			} else {
				assert.ok(knownUiAndWorkspaceExtension);
			}
			assert.strictEqual(ExtensionKind.Workspace, knownWorkspaceExtension!.extensionKind);
		} else {
			assert.fail();
		}
	});

	test('env.uiKind', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);

		const kind = env.uiKind;
		if (result.scheme === 'http' || result.scheme === 'https') {
			assert.strictEqual(kind, UIKind.Web);
		} else {
			assert.strictEqual(kind, UIKind.Desktop);
		}
	});

	test('env.asExternalUri - with env.uriScheme', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);
		assert.ok(result);

		if (env.uiKind === UIKind.Desktop) {
			assert.strictEqual(uri.scheme, result.scheme);
			assert.strictEqual(uri.authority, result.authority);
			assert.strictEqual(uri.path, result.path);
		} else {
			assert.ok(result.scheme === 'http' || result.scheme === 'https');
		}
	});
});
