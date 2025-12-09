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

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 477: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 469: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 477: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 530: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 551: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 569: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 577: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 580: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 584: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 618: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 629: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 630: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 626: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 645: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 648: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 673: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 684: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 699: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 700: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 712: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 714: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 722: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 725: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 726: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 734: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 736: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 774: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 814: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 827: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 840: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 868: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 889: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 890: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (18):
//   1. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 918: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
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
