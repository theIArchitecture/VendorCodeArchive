//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { createTerminalLanguageVirtualUri, LspTerminalModelContentProvider } from '../../browser/lspTerminalModelContentProvider.js';
import * as sinon from 'sinon';
import assert from 'assert';
import { URI } from '../../../../../../base/common/uri.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { GeneralShellType } from '../../../../../../platform/terminal/common/terminal.js';
import { ITerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { VSCODE_LSP_TERMINAL_PROMPT_TRACKER } from '../../browser/lspTerminalUtil.js';

suite('LspTerminalModelContentProvider', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let capabilityStore: ITerminalCapabilityStore;
	let textModelService: ITextModelService;
	let modelService: IModelService;
	let mockTextModel: ITextModel;
	let lspTerminalModelContentProvider: LspTerminalModelContentProvider;
	let virtualTerminalDocumentUri: URI;
	let setValueSpy: sinon.SinonStub;
	let getValueSpy: sinon.SinonStub;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		capabilityStore = store.add(new TerminalCapabilityStore());
		virtualTerminalDocumentUri = URI.from({ scheme: 'vscodeTerminal', path: '/terminal1.py' });

		// Create stubs for the mock text model methods
		setValueSpy = sinon.stub();
		getValueSpy = sinon.stub();

		mockTextModel = {
			setValue: setValueSpy,
			getValue: getValueSpy,
			dispose: sinon.stub(),
			isDisposed: sinon.stub().returns(false)
		} as unknown as ITextModel;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		// Create a stub for modelService.getModel
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 76: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		modelService = {} as IModelService;
		modelService.getModel = sinon.stub().callsFake((uri: URI) => {
			return uri.toString() === virtualTerminalDocumentUri.toString() ? mockTextModel : null;
		});

		// Create stub services for instantiation service
		textModelService = {} as ITextModelService;
		textModelService.registerTextModelContentProvider = sinon.stub().returns({ dispose: sinon.stub() });

		const markerService = {} as IMarkerService;
		markerService.installResourceFilter = sinon.stub().returns({ dispose: sinon.stub() });

		const languageService = {} as ILanguageService;

		// Set up the services in the instantiation service
		instantiationService.stub(IModelService, modelService);
		instantiationService.stub(ITextModelService, textModelService);
		instantiationService.stub(IMarkerService, markerService);
		instantiationService.stub(ILanguageService, languageService);

		// Create the provider instance
		lspTerminalModelContentProvider = store.add(instantiationService.createInstance(
			LspTerminalModelContentProvider,
			capabilityStore,
			1,
			virtualTerminalDocumentUri,
			GeneralShellType.Python
		));
	});

	teardown(() => {
		sinon.restore();
		lspTerminalModelContentProvider?.dispose();
	});

	suite('setContent', () => {

		test('should add delimiter when setting content on empty document', () => {
			getValueSpy.returns('');

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			assert.strictEqual(setValueSpy.args[0][0], VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
		});

		test('should update content with delimiter when document already has content', () => {
			const existingContent = 'previous content\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			getValueSpy.returns(existingContent);

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			const expectedContent = 'previous content\n\nprint("hello")\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			assert.strictEqual(setValueSpy.args[0][0], expectedContent);
		});

		test('should sanitize content when delimiter is in the middle of existing content', () => {
			// Simulating a corrupted state where the delimiter is in the middle
			const existingContent = 'previous content\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER + 'some extra text';
			getValueSpy.returns(existingContent);

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			const expectedContent = 'previous content\n\nprint("hello")\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			assert.strictEqual(setValueSpy.args[0][0], expectedContent);
		});

		test('Mac, Linux - createTerminalLanguageVirtualUri should return the correct URI', () => {
			const expectedUri = URI.from({ scheme: Schemas.vscodeTerminal, path: '/terminal1.py' });
			const actualUri = createTerminalLanguageVirtualUri(1, 'py');
			assert.strictEqual(actualUri.toString(), expectedUri.toString());
		});
	});
});
