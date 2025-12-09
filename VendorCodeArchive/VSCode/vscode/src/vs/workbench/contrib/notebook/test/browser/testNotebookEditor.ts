//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { NotImplementedError } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { LanguageService } from '../../../../../editor/common/services/languageService.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ModelService } from '../../../../../editor/common/services/modelService.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 25: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 25: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 25: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { TestLanguageConfigurationService } from '../../../../../editor/test/common/modes/testLanguageConfigurationService.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 54: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 54: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 54: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 55: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 55: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 55: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 68: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 68: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 68: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 69: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 69: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 69: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 83: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 83: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 83: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 96: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 97: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 97: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 97: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 110: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 110: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 110: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 124: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 124: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 124: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 125: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 125: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 125: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 138: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 138: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 138: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 152: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 152: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 152: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 153: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 153: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 153: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 167: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 167: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 167: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 180: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 180: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 180: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 195: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 195: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 195: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 208: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 208: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 208: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 209: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 209: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 209: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 222: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 222: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 222: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 223: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 223: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 223: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 236: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 236: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 236: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 237: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 237: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 237: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 250: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 250: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 250: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 251: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 251: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 251: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 264: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 264: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 264: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 278: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 278: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 278: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 279: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 279: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 279: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { TestClipboardService } from '../../../../../platform/clipboard/test/common/testClipboardService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { MockKeybindingService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILayoutService } from '../../../../../platform/layout/browser/layoutService.js';
import { IListService, ListService } from '../../../../../platform/list/browser/listService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../../../platform/undoRedo/common/undoRedoService.js';
import { IWorkspaceTrustRequestService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { EditorModel } from '../../../../common/editor/editorModel.js';
import { CellFindMatchWithIndex, CellFocusMode, IActiveNotebookEditorDelegate, IBaseCellEditorOptions, ICellViewModel, INotebookEditorDelegate } from '../../browser/notebookBrowser.js';
import { NotebookCellStateChangedEvent, NotebookLayoutInfo } from '../../browser/notebookViewEvents.js';
import { NotebookCellStatusBarService } from '../../browser/services/notebookCellStatusBarServiceImpl.js';
import { ListViewInfoAccessor, NotebookCellList } from '../../browser/view/notebookCellList.js';
import { BaseCellRenderTemplate } from '../../browser/view/notebookRenderingCommon.js';
import { NotebookEventDispatcher } from '../../browser/viewModel/eventDispatcher.js';
import { CellViewModel, NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { ViewContext } from '../../browser/viewModel/viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { INotebookCellStatusBarService } from '../../common/notebookCellStatusBarService.js';
import { CellKind, CellUri, ICellDto2, INotebookDiffEditorModel, INotebookEditorModel, INotebookFindOptions, IOutputDto, IResolvedNotebookEditorModel, NotebookCellExecutionState, NotebookCellMetadata, SelectionStateType } from '../../common/notebookCommon.js';
import { ICellExecuteUpdate, ICellExecutionComplete, ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookCellExecution, INotebookExecution, INotebookExecutionStateService, INotebookFailStateChangedEvent } from '../../common/notebookExecutionStateService.js';
import { NotebookOptions } from '../../browser/notebookOptions.js';
import { ICellRange } from '../../common/notebookRange.js';
import { TextModelResolverService } from '../../../../services/textmodelResolver/common/textModelResolverService.js';
import { IWorkingCopySaveEvent } from '../../../../services/workingCopy/common/workingCopy.js';
import { TestLayoutService } from '../../../../test/browser/workbenchTestServices.js';
import { TestStorageService, TestTextResourcePropertiesService, TestWorkspaceTrustRequestService } from '../../../../test/common/workbenchTestServices.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { EditorFontLigatures, EditorFontVariations } from '../../../../../editor/common/config/editorOptions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { TestCodeEditorService } from '../../../../../editor/test/browser/editorTestServices.js';
import { INotebookCellOutlineDataSourceFactory, NotebookCellOutlineDataSourceFactory } from '../../browser/viewModel/notebookOutlineDataSourceFactory.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { INotebookOutlineEntryFactory, NotebookOutlineEntryFactory } from '../../browser/viewModel/notebookOutlineEntryFactory.js';
import { IOutlineService } from '../../../../services/outline/browser/outline.js';
import { DefaultEndOfLine } from '../../../../../editor/common/model.js';
import { ITextResourcePropertiesService } from '../../../../../editor/common/services/textResourceConfiguration.js';

export class TestCell extends NotebookCellTextModel {
	constructor(
		public viewType: string,
		handle: number,
		public source: string,
		language: string,
		cellKind: CellKind,
		outputs: IOutputDto[],
		languageService: ILanguageService,
	) {
		super(CellUri.generate(URI.parse('test:///fake/notebook'), handle), handle, source, language, Mimes.text, cellKind, outputs, undefined, undefined, undefined, { transientCellMetadata: {}, transientDocumentMetadata: {}, transientOutputs: false, cellContentMetadata: {} }, languageService, DefaultEndOfLine.LF);
	}
}

export class NotebookEditorTestModel extends EditorModel implements INotebookEditorModel {
	private _dirty = false;

	protected readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	protected readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	readonly onDidChangeOrphaned = Event.None;
	readonly onDidChangeReadonly = Event.None;
	readonly onDidRevertUntitled = Event.None;

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;


	get viewType() {
		return this._notebook.viewType;
	}

	get resource() {
		return this._notebook.uri;
	}

	get notebook(): NotebookTextModel {
		return this._notebook;
	}

	constructor(
		private _notebook: NotebookTextModel
	) {
		super();

		if (_notebook && _notebook.onDidChangeContent) {
			this._register(_notebook.onDidChangeContent(() => {
				this._dirty = true;
				this._onDidChangeDirty.fire();
				this._onDidChangeContent.fire();
			}));
		}
	}

	isReadonly(): boolean {
		return false;
	}

	isOrphaned(): boolean {
		return false;
	}

	hasAssociatedFilePath(): boolean {
		return false;
	}

	isDirty() {
		return this._dirty;
	}

	get hasErrorState() {
		return false;
	}

	isModified(): boolean {
		return this._dirty;
	}

	getNotebook(): NotebookTextModel {
		return this._notebook;
	}

	async load(): Promise<IResolvedNotebookEditorModel> {
		return this;
	}

	async save(): Promise<boolean> {
		if (this._notebook) {
			this._dirty = false;
			this._onDidChangeDirty.fire();
			this._onDidSave.fire({});
			// todo, flush all states
			return true;
		}

		return false;
	}

	saveAs(): Promise<EditorInput | undefined> {
		throw new NotImplementedError();
	}

	revert(): Promise<void> {
		throw new NotImplementedError();
	}
}

export function setupInstantiationService(disposables: Pick<DisposableStore, 'add'>) {
	const instantiationService = disposables.add(new TestInstantiationService());
	const testThemeService = new TestThemeService();
	instantiationService.stub(ILanguageService, disposables.add(new LanguageService()));
	instantiationService.stub(IUndoRedoService, instantiationService.createInstance(UndoRedoService));
	instantiationService.stub(IConfigurationService, new TestConfigurationService());
	instantiationService.stub(IThemeService, testThemeService);
	instantiationService.stub(ILanguageConfigurationService, disposables.add(new TestLanguageConfigurationService()));
	instantiationService.stub(ITextResourcePropertiesService, instantiationService.createInstance(TestTextResourcePropertiesService));
	instantiationService.stub(IModelService, disposables.add(instantiationService.createInstance(ModelService)));
	instantiationService.stub(ITextModelService, <ITextModelService>disposables.add(instantiationService.createInstance(TextModelResolverService)));
	instantiationService.stub(IContextKeyService, disposables.add(instantiationService.createInstance(ContextKeyService)));
	instantiationService.stub(IListService, disposables.add(instantiationService.createInstance(ListService)));
	instantiationService.stub(ILayoutService, new TestLayoutService());
	instantiationService.stub(ILogService, new NullLogService());
	instantiationService.stub(IClipboardService, TestClipboardService);
	instantiationService.stub(IStorageService, disposables.add(new TestStorageService()));
	instantiationService.stub(IWorkspaceTrustRequestService, disposables.add(new TestWorkspaceTrustRequestService(true)));
	instantiationService.stub(INotebookExecutionStateService, new TestNotebookExecutionStateService());
	instantiationService.stub(IKeybindingService, new MockKeybindingService());
	instantiationService.stub(INotebookCellStatusBarService, disposables.add(new NotebookCellStatusBarService()));
	instantiationService.stub(ICodeEditorService, disposables.add(new TestCodeEditorService(testThemeService)));
	instantiationService.stub(IOutlineService, new class extends mock<IOutlineService>() { override registerOutlineCreator() { return { dispose() { } }; } });
	instantiationService.stub(INotebookCellOutlineDataSourceFactory, instantiationService.createInstance(NotebookCellOutlineDataSourceFactory));
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	instantiationService.stub(INotebookOutlineEntryFactory, instantiationService.createInstance(NotebookOutlineEntryFactory));

	instantiationService.stub(ILanguageDetectionService, new class MockLanguageDetectionService implements ILanguageDetectionService {
		_serviceBrand: undefined;
		isEnabledForLanguage(languageId: string): boolean {
			return false;
		}
		async detectLanguage(resource: URI, supportedLangs?: string[] | undefined): Promise<string | undefined> {
			return undefined;
		}
	});

	return instantiationService;
}

function _createTestNotebookEditor(instantiationService: TestInstantiationService, disposables: DisposableStore, cells: MockNotebookCell[]): { editor: IActiveNotebookEditorDelegate; viewModel: NotebookViewModel } {

	const viewType = 'notebook';
	const notebook = disposables.add(instantiationService.createInstance(NotebookTextModel, viewType, URI.parse('test://test'), cells.map((cell): ICellDto2 => {
		return {
			source: cell[0],
			mime: undefined,
			language: cell[1],
			cellKind: cell[2],
			outputs: cell[3] ?? [],
			metadata: cell[4]
		};
	}), {}, { transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false }));

	const model = disposables.add(new NotebookEditorTestModel(notebook));
	const notebookOptions = disposables.add(new NotebookOptions(mainWindow, false, undefined, instantiationService.get(IConfigurationService), instantiationService.get(INotebookExecutionStateService), instantiationService.get(ICodeEditorService)));
	const baseCellEditorOptions = new class extends mock<IBaseCellEditorOptions>() { };
	const viewContext = new ViewContext(notebookOptions, disposables.add(new NotebookEventDispatcher()), () => baseCellEditorOptions);
	const viewModel: NotebookViewModel = disposables.add(instantiationService.createInstance(NotebookViewModel, viewType, model.notebook, viewContext, null, { isReadOnly: false }));

	const cellList = disposables.add(createNotebookCellList(instantiationService, disposables, viewContext));
	cellList.attachViewModel(viewModel);
	const listViewInfoAccessor = disposables.add(new ListViewInfoAccessor(cellList));

	let visibleRanges: ICellRange[] = [{ start: 0, end: 100 }];

	const id = Date.now().toString();
	const notebookEditor: IActiveNotebookEditorDelegate = new class extends mock<IActiveNotebookEditorDelegate>() {
		// eslint-disable-next-line local/code-must-use-super-dispose
		override dispose() {
			viewModel.dispose();
		}
		override notebookOptions = notebookOptions;
		override onDidChangeModel: Event<NotebookTextModel | undefined> = new Emitter<NotebookTextModel | undefined>().event;
		override onDidChangeCellState: Event<NotebookCellStateChangedEvent> = new Emitter<NotebookCellStateChangedEvent>().event;
		override getViewModel(): NotebookViewModel {
			return viewModel;
		}
		override textModel = viewModel.notebookDocument;
		override hasModel(): this is IActiveNotebookEditorDelegate {
			return !!viewModel;
		}
		override getLength() { return viewModel.length; }
		override getFocus() { return viewModel.getFocus(); }
		override getSelections() { return viewModel.getSelections(); }
		override setFocus(focus: ICellRange) {
			viewModel.updateSelectionsState({
				kind: SelectionStateType.Index,
				focus: focus,
				selections: viewModel.getSelections()
			});
		}
		override setSelections(selections: ICellRange[]) {
			viewModel.updateSelectionsState({
				kind: SelectionStateType.Index,
				focus: viewModel.getFocus(),
				selections: selections
			});
		}
		override getViewIndexByModelIndex(index: number) { return listViewInfoAccessor.getViewIndex(viewModel.viewCells[index]); }
		override getCellRangeFromViewRange(startIndex: number, endIndex: number) { return listViewInfoAccessor.getCellRangeFromViewRange(startIndex, endIndex); }
		override revealCellRangeInView() { }
		override setHiddenAreas(_ranges: ICellRange[]): boolean {
			return cellList.setHiddenAreas(_ranges, true);
		}
		override getActiveCell() {
			const elements = cellList.getFocusedElements();

			if (elements && elements.length) {
				return elements[0];
			}

			return undefined;
		}
		override hasOutputTextSelection() {
			return false;
		}
		override changeModelDecorations() { return null; }
		override focusElement() { }
		override setCellEditorSelection() { }
		override async revealRangeInCenterIfOutsideViewportAsync() { }
		override async layoutNotebookCell() { }
		override async createOutput() { }
		override async removeInset() { }
		override async focusNotebookCell(cell: ICellViewModel, focusItem: 'editor' | 'container' | 'output') {
			cell.focusMode = focusItem === 'editor' ? CellFocusMode.Editor
				: focusItem === 'output' ? CellFocusMode.Output
					: CellFocusMode.Container;
		}
		override cellAt(index: number) { return viewModel.cellAt(index)!; }
		override getCellIndex(cell: ICellViewModel) { return viewModel.getCellIndex(cell); }
		override getCellsInRange(range?: ICellRange) { return viewModel.getCellsInRange(range); }
		override getCellByHandle(handle: number) { return viewModel.getCellByHandle(handle); }
		override getNextVisibleCellIndex(index: number) { return viewModel.getNextVisibleCellIndex(index); }
		getControl() { return this; }
		override get onDidChangeSelection() { return viewModel.onDidChangeSelection as Event<any>; }
		override get onDidChangeOptions() { return viewModel.onDidChangeOptions; }
		override get onDidChangeViewCells() { return viewModel.onDidChangeViewCells; }
		override async find(query: string, options: INotebookFindOptions): Promise<CellFindMatchWithIndex[]> {
			const findMatches = viewModel.find(query, options).filter(match => match.length > 0);
			return findMatches;
		}
		override deltaCellDecorations() { return []; }
		override onDidChangeVisibleRanges = Event.None;

		override get visibleRanges() {
			return visibleRanges;
		}

		override set visibleRanges(_ranges: ICellRange[]) {
			visibleRanges = _ranges;
		}

		override getId(): string { return id; }
		override setScrollTop(scrollTop: number): void {
			cellList.scrollTop = scrollTop;
		}
		override get scrollTop(): number {
			return cellList.scrollTop;
		}
		override getLayoutInfo(): NotebookLayoutInfo {
			return {
				width: 0,
				height: 0,
				scrollHeight: cellList.getScrollHeight(),
				fontInfo: new FontInfo({
					pixelRatio: 1,
					fontFamily: 'mockFont',
					fontWeight: 'normal',
					fontSize: 14,
					fontFeatureSettings: EditorFontLigatures.OFF,
					fontVariationSettings: EditorFontVariations.OFF,
					lineHeight: 19,
					letterSpacing: 1.5,
					isMonospace: true,
					typicalHalfwidthCharacterWidth: 10,
					typicalFullwidthCharacterWidth: 20,
					canUseHalfwidthRightwardsArrow: true,
					spaceWidth: 10,
					middotWidth: 10,
					wsmiddotWidth: 10,
					maxDigitWidth: 10,
				}, true),
				stickyHeight: 0,
				listViewOffsetTop: 0,
			};
		}
	};

	return { editor: notebookEditor, viewModel };
}

export function createTestNotebookEditor(instantiationService: TestInstantiationService, disposables: DisposableStore, cells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][]): { editor: INotebookEditorDelegate; viewModel: NotebookViewModel } {
	return _createTestNotebookEditor(instantiationService, disposables, cells);
}

export async function withTestNotebookDiffModel<R = any>(originalCells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][], modifiedCells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][], callback: (diffModel: INotebookDiffEditorModel, disposables: DisposableStore, accessor: TestInstantiationService) => Promise<R> | R): Promise<R> {
	const disposables = new DisposableStore();
	const instantiationService = setupInstantiationService(disposables);
	const originalNotebook = createTestNotebookEditor(instantiationService, disposables, originalCells);
	const modifiedNotebook = createTestNotebookEditor(instantiationService, disposables, modifiedCells);
	const originalResource = new class extends mock<IResolvedNotebookEditorModel>() {
		override get notebook() {
			return originalNotebook.viewModel.notebookDocument;
		}
		override get resource() {
			return originalNotebook.viewModel.notebookDocument.uri;
		}
	};

	const modifiedResource = new class extends mock<IResolvedNotebookEditorModel>() {
		override get notebook() {
			return modifiedNotebook.viewModel.notebookDocument;
		}
		override get resource() {
			return modifiedNotebook.viewModel.notebookDocument.uri;
		}
	};

	const model = new class extends mock<INotebookDiffEditorModel>() {
		override get original() {
			return originalResource;
		}
		override get modified() {
			return modifiedResource;
		}
	};

	const res = await callback(model, disposables, instantiationService);
	if (res instanceof Promise) {
		res.finally(() => {
			originalNotebook.editor.dispose();
			originalNotebook.viewModel.notebookDocument.dispose();
			originalNotebook.viewModel.dispose();
			modifiedNotebook.editor.dispose();
			modifiedNotebook.viewModel.notebookDocument.dispose();
			modifiedNotebook.viewModel.dispose();
			disposables.dispose();
		});
	} else {
		originalNotebook.editor.dispose();
		originalNotebook.viewModel.notebookDocument.dispose();
		originalNotebook.viewModel.dispose();
		modifiedNotebook.editor.dispose();
		modifiedNotebook.viewModel.notebookDocument.dispose();
		modifiedNotebook.viewModel.dispose();
		disposables.dispose();
	}
	return res;
}

interface IActiveTestNotebookEditorDelegate extends IActiveNotebookEditorDelegate {
	visibleRanges: ICellRange[];
}

export type MockNotebookCell = [
	source: string,
	lang: string,
	kind: CellKind,
	output?: IOutputDto[],
	metadata?: NotebookCellMetadata,
];

export type MockDocumentSymbol = {
	name: string;
	range: {};
	kind?: number;
	children?: MockDocumentSymbol[];
};

export async function withTestNotebook<R = any>(cells: MockNotebookCell[], callback: (editor: IActiveTestNotebookEditorDelegate, viewModel: NotebookViewModel, disposables: DisposableStore, accessor: TestInstantiationService) => Promise<R> | R, accessor?: TestInstantiationService): Promise<R> {
	const disposables: DisposableStore = new DisposableStore();
	const instantiationService = accessor ?? setupInstantiationService(disposables);
	const notebookEditor = _createTestNotebookEditor(instantiationService, disposables, cells);

	return runWithFakedTimers({ useFakeTimers: true }, async () => {
		const res = await callback(notebookEditor.editor, notebookEditor.viewModel, disposables, instantiationService);
		if (res instanceof Promise) {
			res.finally(() => {
				notebookEditor.editor.dispose();
				notebookEditor.viewModel.dispose();
				notebookEditor.editor.textModel.dispose();
				disposables.dispose();
			});
		} else {
			notebookEditor.editor.dispose();
			notebookEditor.viewModel.dispose();
			notebookEditor.editor.textModel.dispose();
			disposables.dispose();
		}
		return res;
	});
}

export function createNotebookCellList(instantiationService: TestInstantiationService, disposables: Pick<DisposableStore, 'add'>, viewContext?: ViewContext) {
	const delegate: IListVirtualDelegate<CellViewModel> = {
		getHeight(element: CellViewModel) { return element.getHeight(17); },
		getTemplateId() { return 'template'; }
	};

	const baseCellRenderTemplate = new class extends mock<BaseCellRenderTemplate>() { };
	const renderer: IListRenderer<CellViewModel, BaseCellRenderTemplate> = {
		templateId: 'template',
		renderTemplate() { return baseCellRenderTemplate; },
		renderElement() { },
		disposeTemplate() { }
	};

	const notebookOptions = !!viewContext ? viewContext.notebookOptions
		: disposables.add(new NotebookOptions(mainWindow, false, undefined, instantiationService.get(IConfigurationService), instantiationService.get(INotebookExecutionStateService), instantiationService.get(ICodeEditorService)));
	const cellList: NotebookCellList = disposables.add(instantiationService.createInstance(
		NotebookCellList,
		'NotebookCellList',
		DOM.$('container'),
		notebookOptions,
		delegate,
		[renderer],
		instantiationService.get<IContextKeyService>(IContextKeyService),
		{
			supportDynamicHeights: true,
			multipleSelectionSupport: true,
		}
	));

	return cellList;
}

export function valueBytesFromString(value: string): VSBuffer {
	return VSBuffer.fromString(value);
}

class TestCellExecution implements INotebookCellExecution {
	constructor(
		readonly notebook: URI,
		readonly cellHandle: number,
		private onComplete: () => void,
	) { }

	readonly state: NotebookCellExecutionState = NotebookCellExecutionState.Unconfirmed;

	readonly didPause: boolean = false;
	readonly isPaused: boolean = false;

	confirm(): void {
	}

	update(updates: ICellExecuteUpdate[]): void {
	}

	complete(complete: ICellExecutionComplete): void {
		this.onComplete();
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export class TestNotebookExecutionStateService implements INotebookExecutionStateService {
	_serviceBrand: undefined;

	private _executions = new ResourceMap<INotebookCellExecution>();

	onDidChangeExecution = new Emitter<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>().event;
	onDidChangeLastRunFailState = new Emitter<INotebookFailStateChangedEvent>().event;

	forceCancelNotebookExecutions(notebookUri: URI): void {
	}

	getCellExecutionsForNotebook(notebook: URI): INotebookCellExecution[] {
		return [];
	}

	getCellExecution(cellUri: URI): INotebookCellExecution | undefined {
		return this._executions.get(cellUri);
	}

	createCellExecution(notebook: URI, cellHandle: number): INotebookCellExecution {
		const onComplete = () => this._executions.delete(CellUri.generate(notebook, cellHandle));
		const exe = new TestCellExecution(notebook, cellHandle, onComplete);
		this._executions.set(CellUri.generate(notebook, cellHandle), exe);
		return exe;
	}

	getCellExecutionsByHandleForNotebook(notebook: URI): Map<number, INotebookCellExecution> | undefined {
		return;
	}

	getLastFailedCellForNotebook(notebook: URI): number | undefined {
		return;
	}
	getLastCompletedCellForNotebook(notebook: URI): number | undefined {
		return;
	}
	getExecution(notebook: URI): INotebookExecution | undefined {
		return;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 578: Error message without production error code - breaks React bundle size optimization
//   2. Line 578: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}
	createExecution(notebook: URI): INotebookExecution {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 618: Error message without production error code - breaks React bundle size optimization
//   2. Line 618: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
}
