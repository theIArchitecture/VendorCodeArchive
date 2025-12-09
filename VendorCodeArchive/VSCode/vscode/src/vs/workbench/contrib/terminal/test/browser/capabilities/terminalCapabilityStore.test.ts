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
