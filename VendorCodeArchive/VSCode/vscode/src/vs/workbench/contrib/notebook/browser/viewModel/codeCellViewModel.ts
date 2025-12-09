//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event, PauseableEmitter } from '../../../../../base/common/event.js';
import { dispose } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import * as UUID from '../../../../../base/common/uuid.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { PrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { CellEditState, CellFindMatch, CellLayoutState, CodeCellLayoutChangeEvent, CodeCellLayoutInfo, ICellOutputViewModel, ICellViewModel } from '../notebookBrowser.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { NotebookLayoutInfo } from '../notebookViewEvents.js';
import { CellOutputViewModel } from './cellOutputViewModel.js';
import { ViewContext } from './viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookFindOptions, NotebookCellOutputsSplice } from '../../common/notebookCommon.js';
import { ICellExecutionError, ICellExecutionStateChangedEvent } from '../../common/notebookExecutionStateService.js';
import { INotebookService } from '../../common/notebookService.js';
import { BaseCellViewModel } from './baseCellViewModel.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';

export const outputDisplayLimit = 500;

export class CodeCellViewModel extends BaseCellViewModel implements ICellViewModel {
	readonly cellKind = CellKind.Code;

	protected readonly _onLayoutInfoRead = this._register(new Emitter<void>());
	readonly onLayoutInfoRead = this._onLayoutInfoRead.event;

	protected readonly _onDidStartExecution = this._register(new Emitter<ICellExecutionStateChangedEvent>());
	readonly onDidStartExecution = this._onDidStartExecution.event;
	protected readonly _onDidStopExecution = this._register(new Emitter<ICellExecutionStateChangedEvent>());
	readonly onDidStopExecution = this._onDidStopExecution.event;

	protected readonly _onDidChangeOutputs = this._register(new Emitter<NotebookCellOutputsSplice>());
	readonly onDidChangeOutputs = this._onDidChangeOutputs.event;

	private readonly _onDidRemoveOutputs = this._register(new Emitter<readonly ICellOutputViewModel[]>());
	readonly onDidRemoveOutputs = this._onDidRemoveOutputs.event;

	private _outputCollection: number[] = [];

	private _outputsTop: PrefixSumComputer | null = null;

	protected _pauseableEmitter = this._register(new PauseableEmitter<CodeCellLayoutChangeEvent>());

	readonly onDidChangeLayout = this._pauseableEmitter.event;

	private _editorHeight = 0;
	set editorHeight(height: number) {
		if (this._editorHeight === height) {
			return;
		}

		this._editorHeight = height;
		this.layoutChange({ editorHeight: true }, 'CodeCellViewModel#editorHeight');
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 66: Error message without production error code - breaks React bundle size optimization
//   2. Line 66: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	get editorHeight() {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 78: Error message without production error code - breaks React bundle size optimization
//   2. Line 78: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('editorHeight is write-only');
	}

	private _chatHeight = 0;
	set chatHeight(height: number) {
		if (this._chatHeight === height) {
			return;
		}

		this._chatHeight = height;
		this.layoutChange({ chatHeight: true }, 'CodeCellViewModel#chatHeight');
	}

	get chatHeight() {
		return this._chatHeight;
	}

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
		this._onDidChangeState.fire({ outputIsHoveredChanged: true });
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
		this._onDidChangeState.fire({ outputIsFocusedChanged: true });
	}

	private _focusInputInOutput: boolean = false;
	public get inputInOutputIsFocused(): boolean {
		return this._focusInputInOutput;
	}

	public set inputInOutputIsFocused(v: boolean) {
		this._focusInputInOutput = v;
	}

	private _outputMinHeight: number = 0;

	private get outputMinHeight() {
		return this._outputMinHeight;
	}

	/**
	 * The minimum height of the output region. It's only set to non-zero temporarily when replacing an output with a new one.
	 * It's reset to 0 when the new output is rendered, or in one second.
	 */
	private set outputMinHeight(newMin: number) {
		this._outputMinHeight = newMin;
	}

	private _layoutInfo: CodeCellLayoutInfo;

	get layoutInfo() {
		return this._layoutInfo;
	}

	private _outputViewModels: ICellOutputViewModel[];

	get outputsViewModels() {
		return this._outputViewModels;
	}

	readonly executionErrorDiagnostic = observableValue<ICellExecutionError | undefined>('excecutionError', undefined);

	constructor(
		viewType: string,
		model: NotebookCellTextModel,
		initialNotebookLayoutInfo: NotebookLayoutInfo | null,
		readonly viewContext: ViewContext,
		@IConfigurationService configurationService: IConfigurationService,
		@INotebookService private readonly _notebookService: INotebookService,
		@ITextModelService modelService: ITextModelService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService
	) {
		super(viewType, model, UUID.generateUuid(), viewContext, configurationService, modelService, undoRedoService, codeEditorService, inlineChatSessionService);
		this._outputViewModels = this.model.outputs.map(output => new CellOutputViewModel(this, output, this._notebookService));

		this._register(this.model.onDidChangeOutputs((splice) => {
			const removedOutputs: ICellOutputViewModel[] = [];
			let outputLayoutChange = false;
			for (let i = splice.start; i < splice.start + splice.deleteCount; i++) {
				if (this._outputCollection[i] !== undefined && this._outputCollection[i] !== 0) {
					outputLayoutChange = true;
				}
			}

			this._outputCollection.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(() => 0));
			removedOutputs.push(...this._outputViewModels.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(output => new CellOutputViewModel(this, output, this._notebookService))));

			this._outputsTop = null;
			this._onDidChangeOutputs.fire(splice);
			this._onDidRemoveOutputs.fire(removedOutputs);
			if (outputLayoutChange) {
				this.layoutChange({ outputHeight: true }, 'CodeCellViewModel#model.onDidChangeOutputs');
			}
			if (!this._outputCollection.length) {
				this.executionErrorDiagnostic.set(undefined, undefined);
			}
			dispose(removedOutputs);
		}));

		this._outputCollection = new Array(this.model.outputs.length);

		this._layoutInfo = {
			fontInfo: initialNotebookLayoutInfo?.fontInfo || null,
			editorHeight: 0,
			editorWidth: initialNotebookLayoutInfo
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(initialNotebookLayoutInfo.width)
				: 0,
			chatHeight: 0,
			statusBarHeight: 0,
			commentOffset: 0,
			commentHeight: 0,
			outputContainerOffset: 0,
			outputTotalHeight: 0,
			outputShowMoreContainerHeight: 0,
			outputShowMoreContainerOffset: 0,
			totalHeight: this.computeTotalHeight(17, 0, 0, 0),
			codeIndicatorHeight: 0,
			outputIndicatorHeight: 0,
			bottomToolbarOffset: 0,
			layoutState: CellLayoutState.Uninitialized,
			estimatedHasHorizontalScrolling: false
		};
	}

	updateExecutionState(e: ICellExecutionStateChangedEvent) {
		if (e.changed) {
			this.executionErrorDiagnostic.set(undefined, undefined);
			this._onDidStartExecution.fire(e);
		} else {
			this._onDidStopExecution.fire(e);
		}
	}

	override updateOptions(e: NotebookOptionsChangeEvent) {
		super.updateOptions(e);
		if (e.cellStatusBarVisibility || e.insertToolbarPosition || e.cellToolbarLocation) {
			this.layoutChange({});
		}
	}

	pauseLayout() {
		this._pauseableEmitter.pause();
	}

	resumeLayout() {
		this._pauseableEmitter.resume();
	}

	layoutChange(state: CodeCellLayoutChangeEvent, source?: string) {
		// recompute
		this._ensureOutputsTop();
		const notebookLayoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const bottomToolbarDimensions = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		const outputShowMoreContainerHeight = state.outputShowMoreContainerHeight ? state.outputShowMoreContainerHeight : this._layoutInfo.outputShowMoreContainerHeight;
		const outputTotalHeight = Math.max(this._outputMinHeight, this.isOutputCollapsed ? notebookLayoutConfiguration.collapsedIndicatorHeight : this._outputsTop!.getTotalSum());
		const commentHeight = state.commentHeight ? this._commentHeight : this._layoutInfo.commentHeight;

		const originalLayout = this.layoutInfo;
		if (!this.isInputCollapsed) {
			let newState: CellLayoutState;
			let editorHeight: number;
			let totalHeight: number;
			let hasHorizontalScrolling = false;
			const chatHeight = state.chatHeight ? this._chatHeight : this._layoutInfo.chatHeight;
			if (!state.editorHeight && this._layoutInfo.layoutState === CellLayoutState.FromCache && !state.outputHeight) {
				// No new editorHeight info - keep cached totalHeight and estimate editorHeight
				const estimate = this.estimateEditorHeight(state.font?.lineHeight ?? this._layoutInfo.fontInfo?.lineHeight);
				editorHeight = estimate.editorHeight;
				hasHorizontalScrolling = estimate.hasHorizontalScrolling;
				totalHeight = this._layoutInfo.totalHeight;
				newState = CellLayoutState.FromCache;
			} else if (state.editorHeight || this._layoutInfo.layoutState === CellLayoutState.Measured) {
				// Editor has been measured
				editorHeight = this._editorHeight;
				totalHeight = this.computeTotalHeight(this._editorHeight, outputTotalHeight, outputShowMoreContainerHeight, chatHeight);
				newState = CellLayoutState.Measured;
				hasHorizontalScrolling = this._layoutInfo.estimatedHasHorizontalScrolling;
			} else {
				const estimate = this.estimateEditorHeight(state.font?.lineHeight ?? this._layoutInfo.fontInfo?.lineHeight);
				editorHeight = estimate.editorHeight;
				hasHorizontalScrolling = estimate.hasHorizontalScrolling;
				totalHeight = this.computeTotalHeight(editorHeight, outputTotalHeight, outputShowMoreContainerHeight, chatHeight);
				newState = CellLayoutState.Estimated;
			}

			const statusBarHeight = this.viewContext.notebookOptions.computeEditorStatusbarHeight(this.internalMetadata, this.uri);
			const codeIndicatorHeight = editorHeight + statusBarHeight;
			const outputIndicatorHeight = outputTotalHeight + outputShowMoreContainerHeight;
			const outputContainerOffset = notebookLayoutConfiguration.editorToolbarHeight
				+ notebookLayoutConfiguration.cellTopMargin // CELL_TOP_MARGIN
				+ chatHeight
				+ editorHeight
				+ statusBarHeight;
			const outputShowMoreContainerOffset = totalHeight
				- bottomToolbarDimensions.bottomToolbarGap
				- bottomToolbarDimensions.bottomToolbarHeight / 2
				- outputShowMoreContainerHeight;
			const bottomToolbarOffset = this.viewContext.notebookOptions.computeBottomToolbarOffset(totalHeight, this.viewType);
			const editorWidth = state.outerWidth !== undefined
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(state.outerWidth)
				: this._layoutInfo?.editorWidth;

			this._layoutInfo = {
				fontInfo: state.font ?? this._layoutInfo.fontInfo ?? null,
				chatHeight,
				editorHeight,
				editorWidth,
				statusBarHeight,
				outputContainerOffset,
				outputTotalHeight,
				outputShowMoreContainerHeight,
				outputShowMoreContainerOffset,
				commentOffset: outputContainerOffset + outputTotalHeight,
				commentHeight,
				totalHeight,
				codeIndicatorHeight,
				outputIndicatorHeight,
				bottomToolbarOffset,
				layoutState: newState,
				estimatedHasHorizontalScrolling: hasHorizontalScrolling
			};
		} else {
			const codeIndicatorHeight = notebookLayoutConfiguration.collapsedIndicatorHeight;
			const outputIndicatorHeight = outputTotalHeight + outputShowMoreContainerHeight;
			const chatHeight = state.chatHeight ? this._chatHeight : this._layoutInfo.chatHeight;

			const outputContainerOffset = notebookLayoutConfiguration.cellTopMargin + notebookLayoutConfiguration.collapsedIndicatorHeight;
			const totalHeight =
				notebookLayoutConfiguration.cellTopMargin
				+ notebookLayoutConfiguration.collapsedIndicatorHeight
				+ notebookLayoutConfiguration.cellBottomMargin //CELL_BOTTOM_MARGIN
				+ bottomToolbarDimensions.bottomToolbarGap //BOTTOM_CELL_TOOLBAR_GAP
				+ chatHeight
				+ commentHeight
				+ outputTotalHeight + outputShowMoreContainerHeight;
			const outputShowMoreContainerOffset = totalHeight
				- bottomToolbarDimensions.bottomToolbarGap
				- bottomToolbarDimensions.bottomToolbarHeight / 2
				- outputShowMoreContainerHeight;
			const bottomToolbarOffset = this.viewContext.notebookOptions.computeBottomToolbarOffset(totalHeight, this.viewType);
			const editorWidth = state.outerWidth !== undefined
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(state.outerWidth)
				: this._layoutInfo?.editorWidth;

			this._layoutInfo = {
				fontInfo: state.font ?? this._layoutInfo.fontInfo ?? null,
				editorHeight: this._layoutInfo.editorHeight,
				editorWidth,
				chatHeight: chatHeight,
				statusBarHeight: 0,
				outputContainerOffset,
				outputTotalHeight,
				outputShowMoreContainerHeight,
				outputShowMoreContainerOffset,
				commentOffset: outputContainerOffset + outputTotalHeight,
				commentHeight,
				totalHeight,
				codeIndicatorHeight,
				outputIndicatorHeight,
				bottomToolbarOffset,
				layoutState: this._layoutInfo.layoutState,
				estimatedHasHorizontalScrolling: false
			};
		}

		this._fireOnDidChangeLayout({
			...state,
			totalHeight: this.layoutInfo.totalHeight !== originalLayout.totalHeight,
			source,
		});
	}

	private _fireOnDidChangeLayout(state: CodeCellLayoutChangeEvent) {
		this._pauseableEmitter.fire(state);
	}

	override restoreEditorViewState(editorViewStates: editorCommon.ICodeEditorViewState | null, totalHeight?: number) {
		super.restoreEditorViewState(editorViewStates);
		if (totalHeight !== undefined && this._layoutInfo.layoutState !== CellLayoutState.Measured) {
			this._layoutInfo = {
				...this._layoutInfo,
				totalHeight: totalHeight,
				layoutState: CellLayoutState.FromCache,
			};
		}
	}

	getDynamicHeight() {
		this._onLayoutInfoRead.fire();
		return this._layoutInfo.totalHeight;
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			const estimate = this.estimateEditorHeight(lineHeight);
			return this.computeTotalHeight(estimate.editorHeight, 0, 0, 0);
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	private estimateEditorHeight(lineHeight: number | undefined = 20): { editorHeight: number; hasHorizontalScrolling: boolean } {
		let hasHorizontalScrolling = false;
		const cellEditorOptions = this.viewContext.getBaseCellEditorOptions(this.language);
		if (this.layoutInfo.fontInfo && cellEditorOptions.value.wordWrap === 'off') {
			for (let i = 0; i < this.lineCount; i++) {
				const max = this.textBuffer.getLineLastNonWhitespaceColumn(i + 1);
				const estimatedWidth = max * (this.layoutInfo.fontInfo.typicalHalfwidthCharacterWidth + this.layoutInfo.fontInfo.letterSpacing);
				if (estimatedWidth > this.layoutInfo.editorWidth) {
					hasHorizontalScrolling = true;
					break;
				}
			}
		}

		const verticalScrollbarHeight = hasHorizontalScrolling ? 12 : 0; // take zoom level into account
		const editorPadding = this.viewContext.notebookOptions.computeEditorPadding(this.internalMetadata, this.uri);
		const editorHeight = this.lineCount * lineHeight
			+ editorPadding.top
			+ editorPadding.bottom // EDITOR_BOTTOM_PADDING
			+ verticalScrollbarHeight;
		return {
			editorHeight,
			hasHorizontalScrolling
		};
	}

	private computeTotalHeight(editorHeight: number, outputsTotalHeight: number, outputShowMoreContainerHeight: number, chatHeight: number): number {
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		return layoutConfiguration.editorToolbarHeight
			+ layoutConfiguration.cellTopMargin
			+ chatHeight
			+ editorHeight
			+ this.viewContext.notebookOptions.computeEditorStatusbarHeight(this.internalMetadata, this.uri)
			+ this._commentHeight
			+ outputsTotalHeight
			+ outputShowMoreContainerHeight
			+ bottomToolbarGap
			+ layoutConfiguration.cellBottomMargin;
	}

	protected onDidChangeTextModelContent(): void {
		if (this.getEditState() !== CellEditState.Editing) {
			this.updateEditState(CellEditState.Editing, 'onDidChangeTextModelContent');
			this._onDidChangeState.fire({ contentChanged: true });
		}
	}

	onDeselect() {
		this.updateEditState(CellEditState.Preview, 'onDeselect');
	}

	updateOutputShowMoreContainerHeight(height: number) {
		this.layoutChange({ outputShowMoreContainerHeight: height }, 'CodeCellViewModel#updateOutputShowMoreContainerHeight');
	}

	updateOutputMinHeight(height: number) {
		this.outputMinHeight = height;
	}

	unlockOutputHeight() {
		this.outputMinHeight = 0;
		this.layoutChange({ outputHeight: true });
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 448: Error message without production error code - breaks React bundle size optimization
//   2. Line 448: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	updateOutputHeight(index: number, height: number, source?: string) {
		if (index >= this._outputCollection.length) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 477: Error message without production error code - breaks React bundle size optimization
//   2. Line 477: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Output index out of range!');
		}

		this._ensureOutputsTop();

		try {
			if (index === 0 || height > 0) {
				this._outputViewModels[index].setVisible(true);
			} else if (height === 0) {
				this._outputViewModels[index].setVisible(false);
			}
		} catch (e) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 462: Error message without production error code - breaks React bundle size optimization
//   2. Line 462: Error message without production error code - breaks React bundle size optimization
//   3. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 479: Error message without production error code - breaks React bundle size optimization
//   5. Line 479: Error message without production error code - breaks React bundle size optimization
//   6. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			const errorMessage = `Failed to update output height for cell ${this.handle}, output ${index}. `
				+ `this.outputCollection.length: ${this._outputCollection.length}, this._outputViewModels.length: ${this._outputViewModels.length}`;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 507: Error message without production error code - breaks React bundle size optimization
//   2. Line 507: Error message without production error code - breaks React bundle size optimization
//   3. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 524: Error message without production error code - breaks React bundle size optimization
//   5. Line 524: Error message without production error code - breaks React bundle size optimization
//   6. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 543: Error message without production error code - breaks React bundle size optimization
//   2. Line 543: Error message without production error code - breaks React bundle size optimization
//   3. Line 551: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 560: Error message without production error code - breaks React bundle size optimization
//   5. Line 560: Error message without production error code - breaks React bundle size optimization
//   6. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 580: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 559: Error message without production error code - breaks React bundle size optimization
//   2. Line 559: Error message without production error code - breaks React bundle size optimization
//   3. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 576: Error message without production error code - breaks React bundle size optimization
//   5. Line 576: Error message without production error code - breaks React bundle size optimization
//   6. Line 579: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 575: Error message without production error code - breaks React bundle size optimization
//   2. Line 575: Error message without production error code - breaks React bundle size optimization
//   3. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 592: Error message without production error code - breaks React bundle size optimization
//   5. Line 592: Error message without production error code - breaks React bundle size optimization
//   6. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 591: Error message without production error code - breaks React bundle size optimization
//   2. Line 591: Error message without production error code - breaks React bundle size optimization
//   3. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 608: Error message without production error code - breaks React bundle size optimization
//   5. Line 608: Error message without production error code - breaks React bundle size optimization
//   6. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 607: Error message without production error code - breaks React bundle size optimization
//   2. Line 607: Error message without production error code - breaks React bundle size optimization
//   3. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 624: Error message without production error code - breaks React bundle size optimization
//   5. Line 624: Error message without production error code - breaks React bundle size optimization
//   6. Line 627: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 637: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 623: Error message without production error code - breaks React bundle size optimization
//   2. Line 623: Error message without production error code - breaks React bundle size optimization
//   3. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 640: Error message without production error code - breaks React bundle size optimization
//   5. Line 640: Error message without production error code - breaks React bundle size optimization
//   6. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 653: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 639: Error message without production error code - breaks React bundle size optimization
//   2. Line 639: Error message without production error code - breaks React bundle size optimization
//   3. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 656: Error message without production error code - breaks React bundle size optimization
//   5. Line 656: Error message without production error code - breaks React bundle size optimization
//   6. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 676: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 655: Error message without production error code - breaks React bundle size optimization
//   2. Line 655: Error message without production error code - breaks React bundle size optimization
//   3. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 672: Error message without production error code - breaks React bundle size optimization
//   5. Line 672: Error message without production error code - breaks React bundle size optimization
//   6. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 692: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 671: Error message without production error code - breaks React bundle size optimization
//   2. Line 671: Error message without production error code - breaks React bundle size optimization
//   3. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 688: Error message without production error code - breaks React bundle size optimization
//   5. Line 688: Error message without production error code - breaks React bundle size optimization
//   6. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 687: Error message without production error code - breaks React bundle size optimization
//   2. Line 687: Error message without production error code - breaks React bundle size optimization
//   3. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 704: Error message without production error code - breaks React bundle size optimization
//   5. Line 704: Error message without production error code - breaks React bundle size optimization
//   6. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 703: Error message without production error code - breaks React bundle size optimization
//   2. Line 703: Error message without production error code - breaks React bundle size optimization
//   3. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 720: Error message without production error code - breaks React bundle size optimization
//   5. Line 720: Error message without production error code - breaks React bundle size optimization
//   6. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 719: Error message without production error code - breaks React bundle size optimization
//   2. Line 719: Error message without production error code - breaks React bundle size optimization
//   3. Line 727: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 736: Error message without production error code - breaks React bundle size optimization
//   5. Line 736: Error message without production error code - breaks React bundle size optimization
//   6. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 735: Error message without production error code - breaks React bundle size optimization
//   2. Line 735: Error message without production error code - breaks React bundle size optimization
//   3. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 752: Error message without production error code - breaks React bundle size optimization
//   5. Line 752: Error message without production error code - breaks React bundle size optimization
//   6. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 751: Error message without production error code - breaks React bundle size optimization
//   2. Line 751: Error message without production error code - breaks React bundle size optimization
//   3. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 768: Error message without production error code - breaks React bundle size optimization
//   5. Line 768: Error message without production error code - breaks React bundle size optimization
//   6. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 767: Error message without production error code - breaks React bundle size optimization
//   2. Line 767: Error message without production error code - breaks React bundle size optimization
//   3. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 784: Error message without production error code - breaks React bundle size optimization
//   5. Line 784: Error message without production error code - breaks React bundle size optimization
//   6. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 783: Error message without production error code - breaks React bundle size optimization
//   2. Line 783: Error message without production error code - breaks React bundle size optimization
//   3. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 800: Error message without production error code - breaks React bundle size optimization
//   5. Line 800: Error message without production error code - breaks React bundle size optimization
//   6. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 799: Error message without production error code - breaks React bundle size optimization
//   2. Line 799: Error message without production error code - breaks React bundle size optimization
//   3. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 816: Error message without production error code - breaks React bundle size optimization
//   5. Line 816: Error message without production error code - breaks React bundle size optimization
//   6. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 815: Error message without production error code - breaks React bundle size optimization
//   2. Line 815: Error message without production error code - breaks React bundle size optimization
//   3. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 832: Error message without production error code - breaks React bundle size optimization
//   5. Line 832: Error message without production error code - breaks React bundle size optimization
//   6. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 845: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`${errorMessage}.\n Error: ${e.message}`);
		}

		if (this._outputViewModels[index].visible.get() && height < 28) {
			height = 28;
		}

		this._outputCollection[index] = height;
		if (this._outputsTop!.setValue(index, height)) {
			this.layoutChange({ outputHeight: true }, source);
		}
	}

	getOutputOffsetInContainer(index: number) {
		this._ensureOutputsTop();

		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		return this._outputsTop!.getPrefixSum(index - 1);
	}

	getOutputOffset(index: number): number {
		return this.layoutInfo.outputContainerOffset + this.getOutputOffsetInContainer(index);
	}

	spliceOutputHeights(start: number, deleteCnt: number, heights: number[]) {
		this._ensureOutputsTop();

		this._outputsTop!.removeValues(start, deleteCnt);
		if (heights.length) {
			const values = new Uint32Array(heights.length);
			for (let i = 0; i < heights.length; i++) {
				values[i] = heights[i];
			}

			this._outputsTop!.insertValues(start, values);
		}

		this.layoutChange({ outputHeight: true }, 'CodeCellViewModel#spliceOutputs');
	}

	private _ensureOutputsTop(): void {
		if (!this._outputsTop) {
			const values = new Uint32Array(this._outputCollection.length);
			for (let i = 0; i < this._outputCollection.length; i++) {
				values[i] = this._outputCollection[i];
			}

			this._outputsTop = new PrefixSumComputer(values);
		}
	}

	private readonly _hasFindResult = this._register(new Emitter<boolean>());
	public readonly hasFindResult: Event<boolean> = this._hasFindResult.event;

	startFind(value: string, options: INotebookFindOptions): CellFindMatch | null {
		const matches = super.cellStartFind(value, options);

		if (matches === null) {
			return null;
		}

		return {
			cell: this,
			contentMatches: matches
		};
	}

	override dispose() {
		super.dispose();

		this._outputCollection = [];
		this._outputsTop = null;
		dispose(this._outputViewModels);
	}
}
