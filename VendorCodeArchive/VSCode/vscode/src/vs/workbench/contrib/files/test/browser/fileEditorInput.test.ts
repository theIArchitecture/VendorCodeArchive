//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { FileEditorInput } from '../../browser/editors/fileEditorInput.js';
import { workbenchInstantiationService, TestServiceAccessor, getLastResolvedFileStat } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorFactoryRegistry, Verbosity, EditorExtensions, EditorInputCapabilities } from '../../../../common/editor.js';
import { EncodingMode, TextFileOperationError, TextFileOperationResult } from '../../../../services/textfile/common/textfiles.js';
import { FileOperationResult, NotModifiedSinceFileOperationError, TooLargeFileOperationError } from '../../../../../platform/files/common/files.js';
import { TextFileEditorModel } from '../../../../services/textfile/common/textFileEditorModel.js';
import { timeout } from '../../../../../base/common/async.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { IResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { FileEditorInputSerializer } from '../../browser/editors/fileEditorHandler.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TextEditorService } from '../../../../services/textfile/common/textEditorService.js';

suite('Files - FileEditorInput', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	function createFileInput(resource: URI, preferredResource?: URI, preferredLanguageId?: string, preferredName?: string, preferredDescription?: string, preferredContents?: string): FileEditorInput {
		return disposables.add(instantiationService.createInstance(FileEditorInput, resource, preferredResource, preferredName, preferredDescription, undefined, preferredLanguageId, preferredContents));
	}

	class TestTextEditorService extends TextEditorService {
		override createTextEditor(input: IResourceEditorInput) {
			return createFileInput(input.resource);
		}

		override async resolveTextEditor(input: IResourceEditorInput) {
			return createFileInput(input.resource);
		}
	}

	setup(() => {
		instantiationService = workbenchInstantiationService({
			textEditorService: instantiationService => instantiationService.createInstance(TestTextEditorService)
		}, disposables);

		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	teardown(() => {
		disposables.clear();
	});

	test('Basics', async function () {
		let input = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		const otherInput = createFileInput(toResource.call(this, 'foo/bar/otherfile.js'));
		const otherInputSame = createFileInput(toResource.call(this, 'foo/bar/file.js'));

		assert(input.matches(input));
		assert(input.matches(otherInputSame));
		assert(!input.matches(otherInput));
		assert.ok(input.getName());
		assert.ok(input.getDescription());
		assert.ok(input.getTitle(Verbosity.SHORT));

		assert.ok(!input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(!input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(!input.isReadonly());
		assert.ok(!input.hasCapability(EditorInputCapabilities.Singleton));
		assert.ok(!input.hasCapability(EditorInputCapabilities.RequiresTrust));

		const untypedInput = input.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(untypedInput.resource.toString(), input.resource.toString());

		assert.strictEqual('file.js', input.getName());

		assert.strictEqual(toResource.call(this, '/foo/bar/file.js').fsPath, input.resource.fsPath);
		assert(input.resource instanceof URI);

		input = createFileInput(toResource.call(this, '/foo/bar.html'));

		const inputToResolve: FileEditorInput = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		const sameOtherInput: FileEditorInput = createFileInput(toResource.call(this, '/foo/bar/file.js'));

		let resolved = await inputToResolve.resolve();
		assert.ok(inputToResolve.isResolved());

		const resolvedModelA = resolved;
		resolved = await inputToResolve.resolve();
		assert(resolvedModelA === resolved); // OK: Resolved Model cached globally per input

		try {
			DisposableStore.DISABLE_DISPOSED_WARNING = true; // prevent unwanted warning output from occurring

			const otherResolved = await sameOtherInput.resolve();
			assert(otherResolved === resolvedModelA); // OK: Resolved Model cached globally per input
			inputToResolve.dispose();

			resolved = await inputToResolve.resolve();
			assert(resolvedModelA === resolved); // Model is still the same because we had 2 clients
			inputToResolve.dispose();
			sameOtherInput.dispose();
			resolvedModelA.dispose();

			resolved = await inputToResolve.resolve();
			assert(resolvedModelA !== resolved); // Different instance, because input got disposed

			const stat = getLastResolvedFileStat(resolved);
			resolved = await inputToResolve.resolve();
			await timeout(0);
			assert(stat !== getLastResolvedFileStat(resolved)); // Different stat, because resolve always goes to the server for refresh
		} finally {
			DisposableStore.DISABLE_DISPOSED_WARNING = false;
		}
	});

	test('reports as untitled without supported file scheme', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js').with({ scheme: 'someTestingScheme' }));

		assert.ok(input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(!input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(!input.isReadonly());
	});

	test('reports as readonly with readonly file scheme', async function () {
		const inMemoryFilesystemProvider = disposables.add(new InMemoryFileSystemProvider());
		inMemoryFilesystemProvider.setReadOnly(true);

		disposables.add(accessor.fileService.registerProvider('someTestingReadonlyScheme', inMemoryFilesystemProvider));
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js').with({ scheme: 'someTestingReadonlyScheme' }));

		assert.ok(!input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(input.isReadonly());
	});

	test('preferred resource', function () {
		const resource = toResource.call(this, '/foo/bar/updatefile.js');
		const preferredResource = toResource.call(this, '/foo/bar/UPDATEFILE.js');

		const inputWithoutPreferredResource = createFileInput(resource);
		assert.strictEqual(inputWithoutPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithoutPreferredResource.preferredResource.toString(), resource.toString());

		const inputWithPreferredResource = createFileInput(resource, preferredResource);

		assert.strictEqual(inputWithPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), preferredResource.toString());

		let didChangeLabel = false;
		disposables.add(inputWithPreferredResource.onDidChangeLabel(e => {
			didChangeLabel = true;
		}));

		assert.strictEqual(inputWithPreferredResource.getName(), 'UPDATEFILE.js');

		const otherPreferredResource = toResource.call(this, '/FOO/BAR/updateFILE.js');
		inputWithPreferredResource.setPreferredResource(otherPreferredResource);

		assert.strictEqual(inputWithPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), otherPreferredResource.toString());
		assert.strictEqual(inputWithPreferredResource.getName(), 'updateFILE.js');
		assert.strictEqual(didChangeLabel, true);
	});

	test('preferred language', async function () {
		const languageId = 'file-input-test';
		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		const input = createFileInput(toResource.call(this, '/foo/bar/file.js'), undefined, languageId);
		assert.strictEqual(input.getPreferredLanguageId(), languageId);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const model = disposables.add(await input.resolve() as TextFileEditorModel);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 516: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(model.textEditorModel!.getLanguageId(), languageId);

		input.setLanguageId('text');
		assert.strictEqual(input.getPreferredLanguageId(), 'text');
		assert.strictEqual(model.textEditorModel!.getLanguageId(), PLAINTEXT_LANGUAGE_ID);

		const input2 = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		input2.setPreferredLanguageId(languageId);

		const model2 = disposables.add(await input2.resolve() as TextFileEditorModel);
		assert.strictEqual(model2.textEditorModel!.getLanguageId(), languageId);
	});

	test('preferred contents', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js'), undefined, undefined, undefined, undefined, 'My contents');

		const model = disposables.add(await input.resolve() as TextFileEditorModel);
		assert.strictEqual(model.textEditorModel!.getValue(), 'My contents');
		assert.strictEqual(input.isDirty(), true);

		const untypedInput = input.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(untypedInput.contents, 'My contents');

		const untypedInputWithoutContents = input.toUntyped();
		assert.strictEqual(untypedInputWithoutContents.contents, undefined);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		input.setPreferredContents('Other contents');
		await input.resolve();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 601: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 693: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 716: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 726: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(model.textEditorModel!.getValue(), 'Other contents');

		model.textEditorModel?.setValue('Changed contents');
		await input.resolve();
		assert.strictEqual(model.textEditorModel!.getValue(), 'Changed contents'); // preferred contents only used once

		const input2 = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		input2.setPreferredContents('My contents');

		const model2 = await input2.resolve() as TextFileEditorModel;
		assert.strictEqual(model2.textEditorModel!.getValue(), 'My contents');
		assert.strictEqual(input2.isDirty(), true);
	});

	test('matches', function () {
		const input1 = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		const input2 = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		const input3 = createFileInput(toResource.call(this, '/foo/bar/other.js'));
		const input2Upper = createFileInput(toResource.call(this, '/foo/bar/UPDATEFILE.js'));

		assert.strictEqual(input1.matches(input1), true);
		assert.strictEqual(input1.matches(input2), true);
		assert.strictEqual(input1.matches(input3), false);

		assert.strictEqual(input1.matches(input2Upper), false);
	});

	test('getEncoding/setEncoding', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		await input.setEncoding('utf16', EncodingMode.Encode);
		assert.strictEqual(input.getEncoding(), 'utf16');

		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		assert.strictEqual(input.getEncoding(), resolved.getEncoding());
	});

	test('save', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		resolved.textEditorModel!.setValue('changed');
		assert.ok(input.isDirty());
		assert.ok(input.isModified());

		await input.save(0);
		assert.ok(!input.isDirty());
		assert.ok(!input.isModified());
	});

	test('revert', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		resolved.textEditorModel!.setValue('changed');
		assert.ok(input.isDirty());
		assert.ok(input.isModified());

		await input.revert(0);
		assert.ok(!input.isDirty());
		assert.ok(!input.isModified());

		input.dispose();
		assert.ok(input.isDisposed());
	});

	test('resolve handles binary files', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		accessor.textFileService.setReadStreamErrorOnce(new TextFileOperationError('error', TextFileOperationResult.FILE_IS_BINARY));

		const resolved = disposables.add(await input.resolve());
		assert.ok(resolved);
	});

	test('resolve throws for too large files', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let e: Error | undefined = undefined;
		accessor.textFileService.setReadStreamErrorOnce(new TooLargeFileOperationError('error', FileOperationResult.FILE_TOO_LARGE, 1000));
		try {
			await input.resolve();
		} catch (error) {
			e = error;
		}
		assert.ok(e);
	});

	test('attaches to model when created and reports dirty', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let listenerCount = 0;
		disposables.add(input.onDidChangeDirty(() => {
			listenerCount++;
		}));

		// instead of going through file input resolve method
		// we resolve the model directly through the service
		const model = disposables.add(await accessor.textFileService.files.resolve(input.resource));
		model.textEditorModel?.setValue('hello world');

		assert.strictEqual(listenerCount, 1);
		assert.ok(input.isDirty());
	});

	test('force open text/binary', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		input.setForceOpenAsBinary();

		let resolved = disposables.add(await input.resolve());
		assert.ok(resolved instanceof BinaryEditorModel);

		input.setForceOpenAsText();

		resolved = disposables.add(await input.resolve());
		assert.ok(resolved instanceof TextFileEditorModel);
	});

	test('file editor serializer', async function () {
		instantiationService.invokeFunction(accessor => Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).start(accessor));

		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		disposables.add(Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer('workbench.editors.files.fileEditorInput', FileEditorInputSerializer));

		const editorSerializer = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).getEditorSerializer(input.typeId);
		if (!editorSerializer) {
			assert.fail('File Editor Input Serializer missing');
		}

		assert.strictEqual(editorSerializer.canSerialize(input), true);

		const inputSerialized = editorSerializer.serialize(input);
		if (!inputSerialized) {
			assert.fail('Unexpected serialized file input');
		}

		const inputDeserialized = editorSerializer.deserialize(instantiationService, inputSerialized);
		assert.strictEqual(inputDeserialized ? input.matches(inputDeserialized) : false, true);

		const preferredResource = toResource.call(this, '/foo/bar/UPDATEfile.js');
		const inputWithPreferredResource = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'), preferredResource);

		const inputWithPreferredResourceSerialized = editorSerializer.serialize(inputWithPreferredResource);
		if (!inputWithPreferredResourceSerialized) {
			assert.fail('Unexpected serialized file input');
		}

		const inputWithPreferredResourceDeserialized = editorSerializer.deserialize(instantiationService, inputWithPreferredResourceSerialized) as FileEditorInput;
		assert.strictEqual(inputWithPreferredResource.resource.toString(), inputWithPreferredResourceDeserialized.resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), inputWithPreferredResourceDeserialized.preferredResource.toString());
	});

	test('preferred name/description', async function () {

		// Works with custom file input
		const customFileInput = createFileInput(toResource.call(this, '/foo/bar/updatefile.js').with({ scheme: 'test-custom' }), undefined, undefined, 'My Name', 'My Description');

		let didChangeLabelCounter = 0;
		disposables.add(customFileInput.onDidChangeLabel(() => {
			didChangeLabelCounter++;
		}));

		assert.strictEqual(customFileInput.getName(), 'My Name');
		assert.strictEqual(customFileInput.getDescription(), 'My Description');

		customFileInput.setPreferredName('My Name 2');
		customFileInput.setPreferredDescription('My Description 2');

		assert.strictEqual(customFileInput.getName(), 'My Name 2');
		assert.strictEqual(customFileInput.getDescription(), 'My Description 2');

		assert.strictEqual(didChangeLabelCounter, 2);

		customFileInput.dispose();

		// Disallowed with local file input
		const fileInput = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'), undefined, undefined, 'My Name', 'My Description');

		didChangeLabelCounter = 0;
		disposables.add(fileInput.onDidChangeLabel(() => {
			didChangeLabelCounter++;
		}));

		assert.notStrictEqual(fileInput.getName(), 'My Name');
		assert.notStrictEqual(fileInput.getDescription(), 'My Description');

		fileInput.setPreferredName('My Name 2');
		fileInput.setPreferredDescription('My Description 2');

		assert.notStrictEqual(fileInput.getName(), 'My Name 2');
		assert.notStrictEqual(fileInput.getDescription(), 'My Description 2');

		assert.strictEqual(didChangeLabelCounter, 0);
	});

	test('reports readonly changes', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let listenerCount = 0;
		disposables.add(input.onDidChangeCapabilities(() => {
			listenerCount++;
		}));

		const model = disposables.add(await accessor.textFileService.files.resolve(input.resource));

		assert.strictEqual(model.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);

		const stat = await accessor.fileService.resolve(input.resource, { resolveMetadata: true });

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: true });
			await input.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(!!model.isReadonly(), true);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), true);
		assert.strictEqual(!!input.isReadonly(), true);
		assert.strictEqual(listenerCount, 1);

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: false });
			await input.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(model.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);
		assert.strictEqual(listenerCount, 2);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
