//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore, TerminalCapabilityStoreMultiplexer } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';

suite('TerminalCapabilityStore', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let capabilityStore: TerminalCapabilityStore;
	let addEvents: TerminalCapability[];
	let removeEvents: TerminalCapability[];

	setup(() => {
		capabilityStore = store.add(new TerminalCapabilityStore());
		store.add(capabilityStore.onDidAddCapabilityType(e => addEvents.push(e)));
		store.add(capabilityStore.onDidRemoveCapabilityType(e => removeEvents.push(e)));
		addEvents = [];
		removeEvents = [];
	});

	teardown(() => capabilityStore.dispose());

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 31: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 36: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 43: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('should fire events when capabilities are added', () => {
		assertEvents(addEvents, []);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 46: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 64: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 90: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		capabilityStore.add(TerminalCapability.CwdDetection, {} as any);
		assertEvents(addEvents, [TerminalCapability.CwdDetection]);
	});
	test('should fire events when capabilities are removed', async () => {
		assertEvents(removeEvents, []);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as any);
		assertEvents(removeEvents, []);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		assertEvents(removeEvents, [TerminalCapability.CwdDetection]);
	});
	test('has should return whether a capability is present', () => {
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), false);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as any);
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), true);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), false);
	});
	test('items should reflect current state', () => {
		deepStrictEqual(Array.from(capabilityStore.items), []);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as any);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.CwdDetection]);
		capabilityStore.add(TerminalCapability.NaiveCwdDetection, {} as any);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.CwdDetection, TerminalCapability.NaiveCwdDetection]);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.NaiveCwdDetection]);
	});
});

suite('TerminalCapabilityStoreMultiplexer', () => {
	let store: DisposableStore;
	let multiplexer: TerminalCapabilityStoreMultiplexer;
	let store1: TerminalCapabilityStore;
	let store2: TerminalCapabilityStore;
	let addEvents: TerminalCapability[];
	let removeEvents: TerminalCapability[];

	setup(() => {
		store = new DisposableStore();
		multiplexer = store.add(new TerminalCapabilityStoreMultiplexer());
		multiplexer.onDidAddCapabilityType(e => addEvents.push(e));
		multiplexer.onDidRemoveCapabilityType(e => removeEvents.push(e));
		store1 = store.add(new TerminalCapabilityStore());
		store2 = store.add(new TerminalCapabilityStore());
		addEvents = [];
		removeEvents = [];
	});

	teardown(() => store.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	test('should fire events when capabilities are enabled', async () => {
		assertEvents(addEvents, []);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		multiplexer.add(store1);
		multiplexer.add(store2);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 469: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 585: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 584: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 645: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 648: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 648: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 676: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 687: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 687: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 698: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 727: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 780: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 770: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 779: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 780: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 924: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 977: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 986: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 988: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 997: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 997: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1020: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1018: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1020: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1037: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1048: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1059: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		store1.add(TerminalCapability.CwdDetection, {} as any);
		assertEvents(addEvents, [TerminalCapability.CwdDetection]);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as any);
		assertEvents(addEvents, [TerminalCapability.NaiveCwdDetection]);
	});
	test('should fire events when capabilities are disabled', async () => {
		assertEvents(removeEvents, []);
		multiplexer.add(store1);
		multiplexer.add(store2);
		store1.add(TerminalCapability.CwdDetection, {} as any);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as any);
		assertEvents(removeEvents, []);
		store1.remove(TerminalCapability.CwdDetection);
		assertEvents(removeEvents, [TerminalCapability.CwdDetection]);
		store2.remove(TerminalCapability.NaiveCwdDetection);
		assertEvents(removeEvents, [TerminalCapability.NaiveCwdDetection]);
	});
	test('should fire events when stores are added', async () => {
		assertEvents(addEvents, []);
		store1.add(TerminalCapability.CwdDetection, {} as any);
		assertEvents(addEvents, []);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as any);
		multiplexer.add(store1);
		multiplexer.add(store2);
		assertEvents(addEvents, [TerminalCapability.CwdDetection, TerminalCapability.NaiveCwdDetection]);
	});
	test('items should return items from all stores', () => {
		deepStrictEqual(Array.from(multiplexer.items).sort(), [].sort());
		multiplexer.add(store1);
		multiplexer.add(store2);
		store1.add(TerminalCapability.CwdDetection, {} as any);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection].sort());
		store1.add(TerminalCapability.CommandDetection, {} as any);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as any);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection, TerminalCapability.CommandDetection, TerminalCapability.NaiveCwdDetection].sort());
		store2.remove(TerminalCapability.NaiveCwdDetection);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection, TerminalCapability.CommandDetection].sort());
	});
	test('has should return whether a capability is present', () => {
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), false);
		multiplexer.add(store1);
		store1.add(TerminalCapability.CwdDetection, {} as any);
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), true);
		store1.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), false);
	});
});

function assertEvents(actual: TerminalCapability[], expected: TerminalCapability[]) {
	deepStrictEqual(actual, expected);
	actual.length = 0;
}
