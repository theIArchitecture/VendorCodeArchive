//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IProductService } from '../../../../../../platform/product/common/productService.js';
import { ITerminalSimpleLink, TerminalBuiltinLinkType } from '../../browser/links.js';
import { TerminalWordLinkDetector } from '../../browser/terminalWordLinkDetector.js';
import { assertLinkHelper } from './linkTestUtils.js';
import { TestProductService } from '../../../../../test/common/workbenchTestServices.js';
import type { Terminal } from '@xterm/xterm';

suite('Workbench - TerminalWordLinkDetector', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let detector: TerminalWordLinkDetector;
	let xterm: Terminal;
	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		configurationService = new TestConfigurationService();
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: '' } });

		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.set(IProductService, TestProductService);

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 }));
		detector = store.add(instantiationService.createInstance(TerminalWordLinkDetector, xterm));
	});

	async function assertLink(
		text: string,
		expected: (Pick<ITerminalSimpleLink, 'text'> & { range: [number, number][] })[]
	) {
		await assertLinkHelper(text, expected, detector, TerminalBuiltinLinkType.Search);
	}

	suite('should link words as defined by wordSeparators', () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		test('" ()[]"', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ()[]' } });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('foo', [{ range: [[1, 1], [3, 1]], text: 'foo' }]);
			await assertLink(' foo ', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('(foo)', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('[foo]', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('{foo}', [{ range: [[1, 1], [5, 1]], text: '{foo}' }]);
		});
		test('" "', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('foo', [{ range: [[1, 1], [3, 1]], text: 'foo' }]);
			await assertLink(' foo ', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('(foo)', [{ range: [[1, 1], [5, 1]], text: '(foo)' }]);
			await assertLink('[foo]', [{ range: [[1, 1], [5, 1]], text: '[foo]' }]);
			await assertLink('{foo}', [{ range: [[1, 1], [5, 1]], text: '{foo}' }]);
		});
		test('" []"', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' []' } });
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('aabbccdd.txt ', [{ range: [[1, 1], [12, 1]], text: 'aabbccdd.txt' }]);
			await assertLink(' aabbccdd.txt ', [{ range: [[2, 1], [13, 1]], text: 'aabbccdd.txt' }]);
			await assertLink(' [aabbccdd.txt] ', [{ range: [[3, 1], [14, 1]], text: 'aabbccdd.txt' }]);
		});
	});

	suite('should ignore powerline symbols', () => {
		for (let i = 0xe0b0; i <= 0xe0bf; i++) {
			test(`\\u${i.toString(16)}`, async () => {
				await assertLink(`${String.fromCharCode(i)}foo${String.fromCharCode(i)}`, [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			});
		}
	});

	// These are failing - the link's start x is 1 px too far to the right bc it starts
	// with a wide character, which the terminalLinkHelper currently doesn't account for
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 94: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test.skip('should support wide characters', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' []' } });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('我是学生.txt ', [{ range: [[1, 1], [12, 1]], text: '我是学生.txt' }]);
		await assertLink(' 我是学生.txt ', [{ range: [[2, 1], [13, 1]], text: '我是学生.txt' }]);
		await assertLink(' [我是学生.txt] ', [{ range: [[3, 1], [14, 1]], text: '我是学生.txt' }]);
	});

	test('should support multiple link results', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('foo bar', [
			{ range: [[1, 1], [3, 1]], text: 'foo' },
			{ range: [[5, 1], [7, 1]], text: 'bar' }
		]);
	});

	test('should remove trailing colon in the link results', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('foo:5:6: bar:0:32:', [
			{ range: [[1, 1], [7, 1]], text: 'foo:5:6' },
			{ range: [[10, 1], [17, 1]], text: 'bar:0:32' }
		]);
	});

	test('should support wrapping', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('fsdjfsdkfjslkdfjskdfjsldkfjsdlkfjslkdjfskldjflskdfjskldjflskdfjsdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd', [
			{ range: [[1, 1], [41, 3]], text: 'fsdjfsdkfjslkdfjskdfjsldkfjsdlkfjslkdjfskldjflskdfjskldjflskdfjsdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd' },
		]);
	});
	test('should support wrapping with multiple links', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('fsdjfsdkfjslkdfjskdfjsldkfj sdlkfjslkdjfskldjflskdfjskldjflskdfj sdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd', [
			{ range: [[1, 1], [27, 1]], text: 'fsdjfsdkfjslkdfjskdfjsldkfj' },
			{ range: [[29, 1], [64, 1]], text: 'sdlkfjslkdjfskldjflskdfjskldjflskdfj' },
			{ range: [[66, 1], [43, 3]], text: 'sdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd' }
		]);
	});
	test('does not return any links for empty text', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('', []);
	});
	test('should support file scheme links', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('file:///C:/users/test/file.txt ', [{ range: [[1, 1], [30, 1]], text: 'file:///C:/users/test/file.txt' }]);
		await assertLink('file:///C:/users/test/file.txt:1:10 ', [{ range: [[1, 1], [35, 1]], text: 'file:///C:/users/test/file.txt:1:10' }]);
	});
});
