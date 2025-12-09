//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IDiffResult } from '../../../../../base/common/diff/diff.js';
import { Emitter, type IValueWithChangeEvent } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, dispose } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import type { URI } from '../../../../../base/common/uri.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import type { ContextKeyValue } from '../../../../../platform/contextkey/common/contextkey.js';
import { MultiDiffEditorItem } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { DiffElementCellViewModelBase, DiffElementPlaceholderViewModel, IDiffElementViewModelBase, NotebookDocumentMetadataViewModel, SideBySideDiffElementViewModel, SingleSideDiffElementViewModel } from './diffElementViewModel.js';
import { NotebookDiffEditorEventDispatcher } from './eventDispatcher.js';
import { INotebookDiffViewModel, INotebookDiffViewModelUpdateEvent, NOTEBOOK_DIFF_ITEM_DIFF_STATE, NOTEBOOK_DIFF_ITEM_KIND } from './notebookDiffEditorBrowser.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellUri, INotebookDiffEditorModel } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { INotebookEditorWorkerService } from '../../common/services/notebookWorkerService.js';
import { IDiffEditorHeightCalculatorService } from './editorHeightCalculator.js';
import { raceCancellation } from '../../../../../base/common/async.js';
import { computeDiff } from '../../common/notebookDiff.js';

export class NotebookDiffViewModel extends Disposable implements INotebookDiffViewModel, IValueWithChangeEvent<readonly MultiDiffEditorItem[]> {
	private readonly placeholderAndRelatedCells = new Map<DiffElementPlaceholderViewModel, DiffElementCellViewModelBase[]>();
	private readonly _items: IDiffElementViewModelBase[] = [];
	get items(): readonly IDiffElementViewModelBase[] {
		return this._items;
	}
	private readonly _onDidChangeItems = this._register(new Emitter<INotebookDiffViewModelUpdateEvent>());
	public readonly onDidChangeItems = this._onDidChangeItems.event;
	private readonly disposables = this._register(new DisposableStore());
	private _onDidChange = this._register(new Emitter<void>());
	private diffEditorItems: NotebookMultiDiffEditorItem[] = [];
	public onDidChange = this._onDidChange.event;
	private notebookMetadataViewModel?: NotebookDocumentMetadataViewModel;
	get value(): readonly NotebookMultiDiffEditorItem[] {
		return this.diffEditorItems
			.filter(item => item.type !== 'placeholder')
			.filter(item => {
				if (this._includeUnchanged) {
					return true;
				}
				if (item instanceof NotebookMultiDiffEditorCellItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				if (item instanceof NotebookMultiDiffEditorMetadataItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				if (item instanceof NotebookMultiDiffEditorOutputItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				return true;
			})
			.filter(item => item instanceof NotebookMultiDiffEditorOutputItem ? !this.hideOutput : true)
			.filter(item => item instanceof NotebookMultiDiffEditorMetadataItem ? !this.ignoreMetadata : true);
	}

	private _hasUnchangedCells?: boolean;
	public get hasUnchangedCells() {
		return this._hasUnchangedCells === true;
	}
	private _includeUnchanged?: boolean;
	public get includeUnchanged() {
		return this._includeUnchanged === true;
	}
	public set includeUnchanged(value) {
		this._includeUnchanged = value;
		this._onDidChange.fire();
	}
	private hideOutput?: boolean;
	private ignoreMetadata?: boolean;

	private originalCellViewModels: IDiffElementViewModelBase[] = [];
	constructor(private readonly model: INotebookDiffEditorModel,
		private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		private readonly configurationService: IConfigurationService,
		private readonly eventDispatcher: NotebookDiffEditorEventDispatcher,
		private readonly notebookService: INotebookService,
		private readonly diffEditorHeightCalculator: IDiffEditorHeightCalculatorService,
		private readonly fontInfo?: FontInfo,
		private readonly excludeUnchangedPlaceholder?: boolean,
	) {
		super();
		this.hideOutput = this.model.modified.notebook.transientOptions.transientOutputs || this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');
		this.ignoreMetadata = this.configurationService.getValue('notebook.diff.ignoreMetadata');

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let triggerChange = false;
			let metadataChanged = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreMetadata');

				if (newValue !== undefined && this.ignoreMetadata !== newValue) {
					this.ignoreMetadata = newValue;
					triggerChange = true;
					metadataChanged = true;
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');

				if (newValue !== undefined && this.hideOutput !== (newValue || this.model.modified.notebook.transientOptions.transientOutputs)) {
					this.hideOutput = newValue || !!(this.model.modified.notebook.transientOptions.transientOutputs);
					triggerChange = true;
				}
			}

			if (metadataChanged) {
				this.toggleNotebookMetadata();
			}
			if (triggerChange) {
				this._onDidChange.fire();
			}
		}));
	}
	override dispose() {
		this.clear();
		super.dispose();
	}
	private clear() {
		this.disposables.clear();
		dispose(Array.from(this.placeholderAndRelatedCells.keys()));
		this.placeholderAndRelatedCells.clear();
		dispose(this.originalCellViewModels);
		this.originalCellViewModels = [];
		dispose(this._items);
		this._items.splice(0, this._items.length);
	}

	async computeDiff(token: CancellationToken): Promise<void> {
		const diffResult = await raceCancellation(this.notebookEditorWorkerService.computeDiff(this.model.original.resource, this.model.modified.resource), token);
		if (!diffResult || token.isCancellationRequested) {
			// after await the editor might be disposed.
			return;
		}

		prettyChanges(this.model.original.notebook, this.model.modified.notebook, diffResult.cellsDiff);

		const { cellDiffInfo, firstChangeIndex } = computeDiff(this.model.original.notebook, this.model.modified.notebook, diffResult);
		if (isEqual(cellDiffInfo, this.originalCellViewModels, this.model)) {
			return;
		} else {
			await raceCancellation(this.updateViewModels(cellDiffInfo, diffResult.metadataChanged, firstChangeIndex), token);
			if (token.isCancellationRequested) {
				return;
			}
			this.updateDiffEditorItems();
		}
	}

	private toggleNotebookMetadata() {
		if (!this.notebookMetadataViewModel) {
			return;
		}

		if (this.ignoreMetadata) {
			if (this._items.length && this._items[0] === this.notebookMetadataViewModel) {
				this._items.splice(0, 1);
				this._onDidChangeItems.fire({ start: 0, deleteCount: 1, elements: [] });
			}
		} else {
			if (!this._items.length || this._items[0] !== this.notebookMetadataViewModel) {
				this._items.splice(0, 0, this.notebookMetadataViewModel);
				this._onDidChangeItems.fire({ start: 0, deleteCount: 0, elements: [this.notebookMetadataViewModel] });
			}
		}
	}
	private updateDiffEditorItems() {
		this.diffEditorItems = [];
		const originalSourceUri = this.model.original.resource!;
		const modifiedSourceUri = this.model.modified.resource!;
		this._hasUnchangedCells = false;
		this.items.forEach(item => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			switch (item.type) {
				case 'delete': {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, undefined, item.type, item.type));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, undefined, item.type, item.type));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, undefined, item.type, item.type));
					break;
				}
				case 'insert': {
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(undefined, item.modified!.uri, item.type, item.type));
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(undefined, modifiedMetadata, item.type, item.type));
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(undefined, modifiedOutput, item.type, item.type));
					break;
				}
				case 'modified': {
					const cellType = item.checkIfInputModified() ? item.type : 'unchanged';
					const containerChanged = (item.checkIfInputModified() || item.checkMetadataIfModified() || item.checkIfOutputsModified()) ? item.type : 'unchanged';
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, item.modified!.uri, cellType, containerChanged));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, modifiedMetadata, item.checkMetadataIfModified() ? item.type : 'unchanged', containerChanged));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, modifiedOutput, item.checkIfOutputsModified() ? item.type : 'unchanged', containerChanged));
					break;
				}
				case 'unchanged': {
					this._hasUnchangedCells = true;
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, item.modified!.uri, item.type, item.type));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, modifiedMetadata, item.type, item.type));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, modifiedOutput, item.type, item.type));
					break;
				}
			}
		});

		this._onDidChange.fire();
	}

	private async updateViewModels(cellDiffInfo: CellDiffInfo[], metadataChanged: boolean, firstChangeIndex: number) {
		const cellViewModels = await this.createDiffViewModels(cellDiffInfo, metadataChanged);
		const oldLength = this._items.length;
		this.clear();
		this._items.splice(0, oldLength);

		let placeholder: DiffElementPlaceholderViewModel | undefined = undefined;
		this.originalCellViewModels = cellViewModels;
		cellViewModels.forEach((vm, index) => {
			if (vm.type === 'unchanged' && !this.excludeUnchangedPlaceholder) {
				if (!placeholder) {
					vm.displayIconToHideUnmodifiedCells = true;
					placeholder = new DiffElementPlaceholderViewModel(vm.mainDocumentTextModel, vm.editorEventDispatcher, vm.initData);
					this._items.push(placeholder);
					const placeholderItem = placeholder;

					this.disposables.add(placeholderItem.onUnfoldHiddenCells(() => {
						const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholderItem);
						if (!Array.isArray(hiddenCellViewModels)) {
							return;
						}
						const start = this._items.indexOf(placeholderItem);
						this._items.splice(start, 1, ...hiddenCellViewModels);
						this._onDidChangeItems.fire({ start, deleteCount: 1, elements: hiddenCellViewModels });
					}));
					this.disposables.add(vm.onHideUnchangedCells(() => {
						const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholderItem);
						if (!Array.isArray(hiddenCellViewModels)) {
							return;
						}
						const start = this._items.indexOf(vm);
						this._items.splice(start, hiddenCellViewModels.length, placeholderItem);
						this._onDidChangeItems.fire({ start, deleteCount: hiddenCellViewModels.length, elements: [placeholderItem] });
					}));
				}
				const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholder) || [];
				hiddenCellViewModels.push(vm);
				this.placeholderAndRelatedCells.set(placeholder, hiddenCellViewModels);
				placeholder.hiddenCells.push(vm);
			} else {
				placeholder = undefined;
				this._items.push(vm);
			}
		});

		// Note, ensure all of the height calculations are done before firing the event.
		// This is to ensure that the diff editor is not resized multiple times, thereby avoiding flickering.
		this._onDidChangeItems.fire({ start: 0, deleteCount: oldLength, elements: this._items, firstChangeIndex });
	}
	private async createDiffViewModels(computedCellDiffs: CellDiffInfo[], metadataChanged: boolean) {
		const originalModel = this.model.original.notebook;
		const modifiedModel = this.model.modified.notebook;
		const initData = {
			metadataStatusHeight: this.configurationService.getValue('notebook.diff.ignoreMetadata') ? 0 : 25,
			outputStatusHeight: this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs') || !!(modifiedModel.transientOptions.transientOutputs) ? 0 : 25,
			fontInfo: this.fontInfo
		};

		const viewModels: (SingleSideDiffElementViewModel | SideBySideDiffElementViewModel | NotebookDocumentMetadataViewModel)[] = [];
		this.notebookMetadataViewModel = this._register(new NotebookDocumentMetadataViewModel(this.model.original.notebook, this.model.modified.notebook, metadataChanged ? 'modifiedMetadata' : 'unchangedMetadata', this.eventDispatcher, initData, this.notebookService, this.diffEditorHeightCalculator));
		if (!this.ignoreMetadata) {
			if (metadataChanged) {
				await this.notebookMetadataViewModel.computeHeights();
			}
			viewModels.push(this.notebookMetadataViewModel);
		}
		const cellViewModels = await Promise.all(computedCellDiffs.map(async (diff) => {
			switch (diff.type) {
				case 'delete': {
					return new SingleSideDiffElementViewModel(
						originalModel,
						modifiedModel,
						originalModel.cells[diff.originalCellIndex],
						undefined,
						'delete',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						this.diffEditorHeightCalculator,
						diff.originalCellIndex
					);
				}
				case 'insert': {
					return new SingleSideDiffElementViewModel(
						modifiedModel,
						originalModel,
						undefined,
						modifiedModel.cells[diff.modifiedCellIndex],
						'insert',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						this.diffEditorHeightCalculator,
						diff.modifiedCellIndex
					);
				}
				case 'modified': {
					const viewModel = new SideBySideDiffElementViewModel(
						this.model.modified.notebook,
						this.model.original.notebook,
						originalModel.cells[diff.originalCellIndex],
						modifiedModel.cells[diff.modifiedCellIndex],
						'modified',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						diff.originalCellIndex,
						this.diffEditorHeightCalculator
					);
					// Reduces flicker (compute this before setting the model)
					// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
					// & that results in flicker.
					await viewModel.computeEditorHeights();
					return viewModel;
				}
				case 'unchanged': {
					return new SideBySideDiffElementViewModel(
						this.model.modified.notebook,
						this.model.original.notebook,
						originalModel.cells[diff.originalCellIndex],
						modifiedModel.cells[diff.modifiedCellIndex],
						'unchanged', this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						diff.originalCellIndex,
						this.diffEditorHeightCalculator
					);
				}
			}
		}));

		cellViewModels.forEach(vm => viewModels.push(vm));

		return viewModels;
	}

}


/**
 * making sure that swapping cells are always translated to `insert+delete`.
 */
export function prettyChanges(original: NotebookTextModel, modified: NotebookTextModel, diffResult: IDiffResult) {
	const changes = diffResult.changes;
	for (let i = 0; i < diffResult.changes.length - 1; i++) {
		// then we know there is another change after current one
		const curr = changes[i];
		const next = changes[i + 1];
		const x = curr.originalStart;
		const y = curr.modifiedStart;

		if (
			curr.originalLength === 1
			&& curr.modifiedLength === 0
			&& next.originalStart === x + 2
			&& next.originalLength === 0
			&& next.modifiedStart === y + 1
			&& next.modifiedLength === 1
			&& original.cells[x].getHashValue() === modified.cells[y + 1].getHashValue()
			&& original.cells[x + 1].getHashValue() === modified.cells[y].getHashValue()
		) {
			// this is a swap
			curr.originalStart = x;
			curr.originalLength = 0;
			curr.modifiedStart = y;
			curr.modifiedLength = 1;

			next.originalStart = x + 1;
			next.originalLength = 1;
			next.modifiedStart = y + 2;
			next.modifiedLength = 0;

			i++;
		}
	}
}

export type CellDiffInfo = {
	originalCellIndex: number;
	modifiedCellIndex: number;
	type: 'unchanged' | 'modified';
} |
{
	originalCellIndex: number;
	type: 'delete';
} |
{
	modifiedCellIndex: number;
	type: 'insert';
};

function isEqual(cellDiffInfo: CellDiffInfo[], viewModels: IDiffElementViewModelBase[], model: INotebookDiffEditorModel) {
	if (cellDiffInfo.length !== viewModels.length) {
		return false;
	}
	const originalModel = model.original.notebook;
	const modifiedModel = model.modified.notebook;
	for (let i = 0; i < viewModels.length; i++) {
		const a = cellDiffInfo[i];
		const b = viewModels[i];
		if (a.type !== b.type) {
			return false;
		}
		switch (a.type) {
			case 'delete': {
				if (originalModel.cells[a.originalCellIndex].handle !== b.original?.handle) {
					return false;
				}
				continue;
			}
			case 'insert': {
				if (modifiedModel.cells[a.modifiedCellIndex].handle !== b.modified?.handle) {
					return false;
				}
				continue;
			}
			default: {
				if (originalModel.cells[a.originalCellIndex].handle !== b.original?.handle) {
					return false;
				}
				if (modifiedModel.cells[a.modifiedCellIndex].handle !== b.modified?.handle) {
					return false;
				}
				continue;
			}
		}
	}

	return true;
}
export abstract class NotebookMultiDiffEditorItem extends MultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		goToFileUri: URI | undefined,
		public readonly type: IDiffElementViewModelBase['type'],
		public readonly containerType: IDiffElementViewModelBase['type'],
		public kind: 'Cell' | 'Metadata' | 'Output',
		contextKeys?: Record<string, ContextKeyValue>,
	) {
		super(originalUri, modifiedUri, goToFileUri, undefined, contextKeys);
	}
}

class NotebookMultiDiffEditorCellItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Cell', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Cell',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}

class NotebookMultiDiffEditorMetadataItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Metadata', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Metadata',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}

class NotebookMultiDiffEditorOutputItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Output', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Output',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}
