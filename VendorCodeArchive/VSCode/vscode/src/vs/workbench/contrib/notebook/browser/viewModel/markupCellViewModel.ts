//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import * as UUID from '../../../../../base/common/uuid.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { CellEditState, CellFindMatch, CellFoldingState, CellLayoutContext, CellLayoutState, EditorFoldingStateDelegate, ICellOutputViewModel, ICellViewModel, MarkupCellLayoutChangeEvent, MarkupCellLayoutInfo } from '../notebookBrowser.js';
import { BaseCellViewModel } from './baseCellViewModel.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookFindOptions } from '../../common/notebookCommon.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ViewContext } from './viewContext.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { NotebookCellStateChangedEvent, NotebookLayoutInfo } from '../notebookViewEvents.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';

export class MarkupCellViewModel extends BaseCellViewModel implements ICellViewModel {

	readonly cellKind = CellKind.Markup;

	private _layoutInfo: MarkupCellLayoutInfo;

	private _renderedHtml?: string;

	public get renderedHtml(): string | undefined { return this._renderedHtml; }
	public set renderedHtml(value: string | undefined) {
		if (this._renderedHtml !== value) {
			this._renderedHtml = value;
			this._onDidChangeState.fire({ contentChanged: true });
		}
	}

	get layoutInfo() {
		return this._layoutInfo;
	}

	private _previewHeight = 0;

	set renderedMarkdownHeight(newHeight: number) {
		this._previewHeight = newHeight;
		this._updateTotalHeight(this._computeTotalHeight());
	}

	private _chatHeight = 0;

	set chatHeight(newHeight: number) {
		this._chatHeight = newHeight;
		this._updateTotalHeight(this._computeTotalHeight());
	}

	get chatHeight() {
		return this._chatHeight;
	}

	private _editorHeight = 0;
	private _statusBarHeight = 0;
	set editorHeight(newHeight: number) {
		this._editorHeight = newHeight;
		this._statusBarHeight = this.viewContext.notebookOptions.computeStatusBarHeight();
		this._updateTotalHeight(this._computeTotalHeight());
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 69: Error message without production error code - breaks React bundle size optimization
//   2. Line 69: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	get editorHeight() {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 81: Error message without production error code - breaks React bundle size optimization
//   2. Line 81: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('MarkdownCellViewModel.editorHeight is write only');
	}

	protected readonly _onDidChangeLayout = this._register(new Emitter<MarkupCellLayoutChangeEvent>());
	readonly onDidChangeLayout = this._onDidChangeLayout.event;

	get foldingState() {
		return this.foldingDelegate.getFoldingState(this.foldingDelegate.getCellIndex(this));
	}

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
	}

	public get inputInOutputIsFocused(): boolean {
		return false;
	}

	public set inputInOutputIsFocused(_: boolean) {
		//
	}

	private _hoveringCell = false;
	public get cellIsHovered(): boolean {
		return this._hoveringCell;
	}

	public set cellIsHovered(v: boolean) {
		this._hoveringCell = v;
		this._onDidChangeState.fire({ cellIsHoveredChanged: true });
	}

	constructor(
		viewType: string,
		model: NotebookCellTextModel,
		initialNotebookLayoutInfo: NotebookLayoutInfo | null,
		readonly foldingDelegate: EditorFoldingStateDelegate,
		readonly viewContext: ViewContext,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextModelService textModelService: ITextModelService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService
	) {
		super(viewType, model, UUID.generateUuid(), viewContext, configurationService, textModelService, undoRedoService, codeEditorService, inlineChatSessionService);

		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);

		this._layoutInfo = {
			chatHeight: 0,
			editorHeight: 0,
			previewHeight: 0,
			fontInfo: initialNotebookLayoutInfo?.fontInfo || null,
			editorWidth: initialNotebookLayoutInfo?.width
				? this.viewContext.notebookOptions.computeMarkdownCellEditorWidth(initialNotebookLayoutInfo.width)
				: 0,
			commentOffset: 0,
			commentHeight: 0,
			bottomToolbarOffset: bottomToolbarGap,
			totalHeight: 100,
			layoutState: CellLayoutState.Uninitialized,
			foldHintHeight: 0,
			statusBarHeight: 0
		};

		this._register(this.onDidChangeState(e => {
			this.viewContext.eventDispatcher.emit([new NotebookCellStateChangedEvent(e, this.model)]);

			if (e.foldingStateChanged) {
				this._updateTotalHeight(this._computeTotalHeight(), CellLayoutContext.Fold);
			}
		}));
	}

	private _computeTotalHeight(): number {
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		const foldHintHeight = this._computeFoldHintHeight();

		if (this.getEditState() === CellEditState.Editing) {
			return this._editorHeight
				+ layoutConfiguration.markdownCellTopMargin
				+ layoutConfiguration.markdownCellBottomMargin
				+ bottomToolbarGap
				+ this._statusBarHeight
				+ this._commentHeight;
		} else {
			// @rebornix
			// On file open, the previewHeight + bottomToolbarGap for a cell out of viewport can be 0
			// When it's 0, the list view will never try to render it anymore even if we scroll the cell into view.
			// Thus we make sure it's greater than 0
			return Math.max(1, this._previewHeight + bottomToolbarGap + foldHintHeight + this._commentHeight);
		}
	}

	private _computeFoldHintHeight(): number {
		return (this.getEditState() === CellEditState.Editing || this.foldingState !== CellFoldingState.Collapsed) ?
			0 : this.viewContext.notebookOptions.getLayoutConfiguration().markdownFoldHintHeight;
	}

	override updateOptions(e: NotebookOptionsChangeEvent) {
		super.updateOptions(e);
		if (e.cellStatusBarVisibility || e.insertToolbarPosition || e.cellToolbarLocation) {
			this._updateTotalHeight(this._computeTotalHeight());
		}
	}

	/**
	 * we put outputs stuff here to make compiler happy
	 */
	outputsViewModels: ICellOutputViewModel[] = [];
	getOutputOffset(index: number): number {
		// throw new Error('Method not implemented.');
		return -1;
	}
	updateOutputHeight(index: number, height: number): void {
		// throw new Error('Method not implemented.');
	}

	triggerFoldingStateChange() {
		this._onDidChangeState.fire({ foldingStateChanged: true });
	}

	private _updateTotalHeight(newHeight: number, context?: CellLayoutContext) {
		if (newHeight !== this.layoutInfo.totalHeight) {
			this.layoutChange({ totalHeight: newHeight, context });
		}
	}

	layoutChange(state: MarkupCellLayoutChangeEvent) {
		let totalHeight: number;
		let foldHintHeight: number;
		if (!this.isInputCollapsed) {
			totalHeight = state.totalHeight === undefined ?
				(this._layoutInfo.layoutState ===
					CellLayoutState.Uninitialized ?
					100 :
					this._layoutInfo.totalHeight) :
				state.totalHeight;
			// recompute
			foldHintHeight = this._computeFoldHintHeight();
		} else {
			totalHeight =
				this.viewContext.notebookOptions
					.computeCollapsedMarkdownCellHeight(this.viewType);
			state.totalHeight = totalHeight;

			foldHintHeight = 0;
		}
		let commentOffset: number;
		if (this.getEditState() === CellEditState.Editing) {
			const notebookLayoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
			commentOffset = notebookLayoutConfiguration.editorToolbarHeight
				+ notebookLayoutConfiguration.cellTopMargin // CELL_TOP_MARGIN
				+ this._chatHeight
				+ this._editorHeight
				+ this._statusBarHeight;
		} else {
			commentOffset = this._previewHeight;
		}

		this._layoutInfo = {
			fontInfo: state.font || this._layoutInfo.fontInfo,
			editorWidth: state.outerWidth !== undefined ?
				this.viewContext.notebookOptions
					.computeMarkdownCellEditorWidth(state.outerWidth) :
				this._layoutInfo.editorWidth,
			chatHeight: this._chatHeight,
			editorHeight: this._editorHeight,
			statusBarHeight: this._statusBarHeight,
			previewHeight: this._previewHeight,
			bottomToolbarOffset: this.viewContext.notebookOptions
				.computeBottomToolbarOffset(
					totalHeight, this.viewType),
			totalHeight,
			layoutState: CellLayoutState.Measured,
			foldHintHeight,
			commentOffset,
			commentHeight: state.commentHeight ?
				this._commentHeight :
				this._layoutInfo.commentHeight,
		};

		this._onDidChangeLayout.fire(state);
	}

	override restoreEditorViewState(editorViewStates: editorCommon.ICodeEditorViewState | null, totalHeight?: number) {
		super.restoreEditorViewState(editorViewStates);
		// we might already warmup the viewport so the cell has a total height computed
		if (totalHeight !== undefined && this.layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			this._layoutInfo = {
				...this.layoutInfo,
				totalHeight: totalHeight,
				chatHeight: this._chatHeight,
				editorHeight: this._editorHeight,
				statusBarHeight: this._statusBarHeight,
				layoutState: CellLayoutState.FromCache,
			};
			this.layoutChange({});
		}
	}

	getDynamicHeight() {
		return null;
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			return 100;
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	protected onDidChangeTextModelContent(): void {
		this._onDidChangeState.fire({ contentChanged: true });
	}

	onDeselect() {
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

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	override dispose() {
		super.dispose();
		(this.foldingDelegate as any) = null;
	}
}
