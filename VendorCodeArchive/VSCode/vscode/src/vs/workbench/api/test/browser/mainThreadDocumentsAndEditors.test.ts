//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadDocumentsAndEditors } from '../../browser/mainThreadDocumentsAndEditors.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { ModelService } from '../../../../editor/common/services/modelService.js';
import { TestCodeEditorService } from '../../../../editor/test/browser/editorTestServices.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IDocumentsAndEditorsDelta } from '../../common/extHost.protocol.js';
import { createTestCodeEditor, ITestCodeEditor } from '../../../../editor/test/browser/testCodeEditor.js';
import { mock } from '../../../../base/test/common/mock.js';
import { TestEditorService, TestEditorGroupsService, TestEnvironmentService, TestPathService } from '../../../test/browser/workbenchTestServices.js';
import { Event } from '../../../../base/common/event.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';
import { UndoRedoService } from '../../../../platform/undoRedo/common/undoRedoService.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { TestNotificationService } from '../../../../platform/notification/test/common/testNotificationService.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 28: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 28: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 28: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { TestTextResourcePropertiesService, TestWorkingCopyFileService } from '../../../test/common/workbenchTestServices.js';
import { UriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentityService.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 52: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 52: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 52: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 63: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 63: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 63: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 74: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 74: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 74: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 85: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 85: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 85: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 118: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 118: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 118: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 129: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 129: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 129: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 140: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 140: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 140: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 151: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 151: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 151: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 162: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 162: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 162: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { TextModel } from '../../../../editor/common/model/textModel.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { LanguageService } from '../../../../editor/common/services/languageService.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { TestLanguageConfigurationService } from '../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IQuickDiffModelService } from '../../../contrib/scm/browser/quickDiffModel.js';
import { ITextEditorDiffInformation } from '../../../../platform/editor/common/editor.js';
import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TestTreeSitterLibraryService } from '../../../../editor/test/common/services/testTreeSitterLibraryService.js';

suite('MainThreadDocumentsAndEditors', () => {

	let disposables: DisposableStore;

	let modelService: ModelService;
	let codeEditorService: TestCodeEditorService;
	let textFileService: ITextFileService;
	const deltas: IDocumentsAndEditorsDelta[] = [];

	function myCreateTestCodeEditor(model: ITextModel | undefined): ITestCodeEditor {
		return createTestCodeEditor(model, {
			hasTextFocus: false,
			serviceCollection: new ServiceCollection(
				[ICodeEditorService, codeEditorService]
			)
		});
	}

	setup(() => {
		disposables = new DisposableStore();

		deltas.length = 0;
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('editor', { 'detectIndentation': false });
		const dialogService = new TestDialogService();
		const notificationService = new TestNotificationService();
		const undoRedoService = new UndoRedoService(dialogService, notificationService);
		const themeService = new TestThemeService();
		const instantiationService = new TestInstantiationService();
		instantiationService.set(ILanguageService, disposables.add(new LanguageService()));
		instantiationService.set(ILanguageConfigurationService, new TestLanguageConfigurationService());
		instantiationService.set(ITreeSitterLibraryService, new TestTreeSitterLibraryService());
		instantiationService.set(IUndoRedoService, undoRedoService);
		modelService = new ModelService(
			configService,
			new TestTextResourcePropertiesService(configService),
			undoRedoService,
			instantiationService
		);
		codeEditorService = new TestCodeEditorService(themeService);
		textFileService = new class extends mock<ITextFileService>() {
			override isDirty() { return false; }
			override files = <any>{
				onDidSave: Event.None,
				onDidRevert: Event.None,
				onDidChangeDirty: Event.None,
				onDidChangeEncoding: Event.None
			};
			override untitled = <any>{
				onDidChangeEncoding: Event.None
			};
			override getEncoding() { return 'utf8'; }
		};
		const workbenchEditorService = disposables.add(new TestEditorService());
		const editorGroupService = new TestEditorGroupsService();

		const fileService = new class extends mock<IFileService>() {
			override onDidRunOperation = Event.None;
			override onDidChangeFileSystemProviderCapabilities = Event.None;
			override onDidChangeFileSystemProviderRegistrations = Event.None;
		};

		new MainThreadDocumentsAndEditors(
			SingleProxyRPCProtocol({
				$acceptDocumentsAndEditorsDelta: (delta: IDocumentsAndEditorsDelta) => { deltas.push(delta); },
				$acceptEditorDiffInformation: (id: string, diffInformation: ITextEditorDiffInformation | undefined) => { }
			}),
			modelService,
			textFileService,
			workbenchEditorService,
			codeEditorService,
			fileService,
			null!,
			editorGroupService,
			new class extends mock<IPaneCompositePartService>() implements IPaneCompositePartService {
				override onDidPaneCompositeOpen = Event.None;
				override onDidPaneCompositeClose = Event.None;
				override getActivePaneComposite() {
					return undefined;
				}
			},
			TestEnvironmentService,
			new TestWorkingCopyFileService(),
			new UriIdentityService(fileService),
			new class extends mock<IClipboardService>() {
				override readText() {
					return Promise.resolve('clipboard_contents');
				}
			},
			new TestPathService(),
			new TestConfigurationService(),
			new class extends mock<IQuickDiffModelService>() {
				override createQuickDiffModelReference() {
					return undefined;
				}
			}
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Model#add', () => {
		deltas.length = 0;

		disposables.add(modelService.createModel('farboo', null));

		assert.strictEqual(deltas.length, 1);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const [delta] = deltas;

		assert.strictEqual(delta.addedDocuments!.length, 1);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);
		assert.strictEqual(delta.newActiveEditor, undefined);
	});

	test('ignore huge model', function () {

		const oldLimit = TextModel._MODEL_SYNC_LIMIT;
		try {
			const largeModelString = 'abc'.repeat(1024);
			TextModel._MODEL_SYNC_LIMIT = largeModelString.length / 2;

			const model = modelService.createModel(largeModelString, null);
			disposables.add(model);
			assert.ok(model.isTooLargeForSyncing());

			assert.strictEqual(deltas.length, 1);
			const [delta] = deltas;
			assert.strictEqual(delta.newActiveEditor, null);
			assert.strictEqual(delta.addedDocuments, undefined);
			assert.strictEqual(delta.removedDocuments, undefined);
			assert.strictEqual(delta.addedEditors, undefined);
			assert.strictEqual(delta.removedEditors, undefined);

		} finally {
			TextModel._MODEL_SYNC_LIMIT = oldLimit;
		}
	});

	test('ignore huge model from editor', function () {

		const oldLimit = TextModel._MODEL_SYNC_LIMIT;
		try {
			const largeModelString = 'abc'.repeat(1024);
			TextModel._MODEL_SYNC_LIMIT = largeModelString.length / 2;

			const model = modelService.createModel(largeModelString, null);
			const editor = myCreateTestCodeEditor(model);

			assert.strictEqual(deltas.length, 1);
			deltas.length = 0;
			assert.strictEqual(deltas.length, 0);
			editor.dispose();
			model.dispose();

		} finally {
			TextModel._MODEL_SYNC_LIMIT = oldLimit;
		}
	});

	test('ignore simple widget model', function () {
		this.timeout(1000 * 60); // increase timeout for this one test

		const model = modelService.createModel('test', null, undefined, true);
		disposables.add(model);
		assert.ok(model.isForSimpleWidget);

		assert.strictEqual(deltas.length, 1);
		const [delta] = deltas;
		assert.strictEqual(delta.newActiveEditor, null);
		assert.strictEqual(delta.addedDocuments, undefined);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);
	});

	test('ignore editor w/o model', () => {
		const editor = myCreateTestCodeEditor(undefined);
		assert.strictEqual(deltas.length, 1);
		const [delta] = deltas;
		assert.strictEqual(delta.newActiveEditor, null);
		assert.strictEqual(delta.addedDocuments, undefined);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);

		editor.dispose();
	});

	test('editor with model', () => {
		deltas.length = 0;

		const model = modelService.createModel('farboo', null);
		const editor = myCreateTestCodeEditor(model);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(deltas.length, 2);
		const [first, second] = deltas;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(first.addedDocuments!.length, 1);
		assert.strictEqual(first.newActiveEditor, undefined);
		assert.strictEqual(first.removedDocuments, undefined);
		assert.strictEqual(first.addedEditors, undefined);
		assert.strictEqual(first.removedEditors, undefined);

		assert.strictEqual(second.addedEditors!.length, 1);
		assert.strictEqual(second.addedDocuments, undefined);
		assert.strictEqual(second.removedDocuments, undefined);
		assert.strictEqual(second.removedEditors, undefined);
		assert.strictEqual(second.newActiveEditor, undefined);

		editor.dispose();
		model.dispose();
	});

	test('editor with dispos-ed/-ing model', () => {
		const model = modelService.createModel('farboo', null);
		const editor = myCreateTestCodeEditor(model);

		// ignore things until now
		deltas.length = 0;

		modelService.destroyModel(model.uri);
		assert.strictEqual(deltas.length, 1);
		const [first] = deltas;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(first.newActiveEditor, undefined);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(first.removedEditors!.length, 1);
		assert.strictEqual(first.removedDocuments!.length, 1);
		assert.strictEqual(first.addedDocuments, undefined);
		assert.strictEqual(first.addedEditors, undefined);

		editor.dispose();
		model.dispose();
	});
});
