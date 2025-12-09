//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { DiffElementCellViewModelBase, getFormattedOutputJSON, OutputComparison, outputEqual, OUTPUT_EDITOR_HEIGHT_MAGIC, PropertyFoldingState, SideBySideDiffElementViewModel, SingleSideDiffElementViewModel, DiffElementPlaceholderViewModel, IDiffElementViewModelBase, NotebookDocumentMetadataViewModel } from './diffElementViewModel.js';
import { CellDiffSideBySideRenderTemplate, CellDiffSingleSideRenderTemplate, DiffSide, DIFF_CELL_MARGIN, INotebookTextDiffEditor, NOTEBOOK_DIFF_CELL_INPUT, NOTEBOOK_DIFF_CELL_PROPERTY, NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED, CellDiffPlaceholderRenderTemplate, IDiffCellMarginOverlay, NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE, NotebookDocumentDiffElementRenderTemplate, NOTEBOOK_DIFF_METADATA } from './notebookDiffEditorBrowser.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { CellEditType, CellUri, NotebookCellMetadata } from '../../common/notebookCommon.js';
import { ToolBar } from '../../../../../base/browser/ui/toolbar/toolbar.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { getFlatActionBarActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { CodiconActionViewItem } from '../view/cellParts/cellActionView.js';
import { collapsedIcon, expandedIcon } from '../notebookIcons.js';
import { OutputContainer } from './diffElementOutputs.js';
import { EditorExtensionsRegistry } from '../../../../../editor/browser/editorExtensions.js';
import { ContextMenuController } from '../../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SuggestController } from '../../../../../editor/contrib/suggest/browser/suggestController.js';
import { MenuPreventer } from '../../../codeEditor/browser/menuPreventer.js';
import { SelectionClipboardContributionID } from '../../../codeEditor/browser/selectionClipboard.js';
import { TabCompletionController } from '../../../snippets/browser/tabCompletion.js';
import { renderIcon, renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { fixedDiffEditorOptions, fixedEditorOptions, getEditorPadding } from './diffCellEditorOptions.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { DiffNestedCellViewModel } from './diffNestedCellViewModel.js';
import { localize } from '../../../../../nls.js';
import { Emitter } from '../../../../../base/common/event.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { getFormattedMetadataJSON } from '../../common/model/notebookCellTextModel.js';
import { IDiffEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { getUnchangedRegionSettings } from './unchangedEditorRegions.js';

export function getOptimizedNestedCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
	return {
		isSimpleWidget: false,
		contributions: EditorExtensionsRegistry.getSomeEditorContributions([
			MenuPreventer.ID,
			SelectionClipboardContributionID,
			ContextMenuController.ID,
			SuggestController.ID,
			SnippetController2.ID,
			TabCompletionController.ID,
		])
	};
}

export class CellDiffPlaceholderElement extends Disposable {
	constructor(
		placeholder: DiffElementPlaceholderViewModel,
		templateData: CellDiffPlaceholderRenderTemplate,
	) {
		super();
		templateData.body.classList.remove('left', 'right', 'full');
		const text = (placeholder.hiddenCells.length === 1) ?
			localize('hiddenCell', '{0} hidden cell', placeholder.hiddenCells.length) :
			localize('hiddenCells', '{0} hidden cells', placeholder.hiddenCells.length);
		templateData.placeholder.innerText = text;

		this._register(DOM.addDisposableListener(templateData.placeholder, 'dblclick', (e: MouseEvent) => {
			if (e.button !== 0) {
				return;
			}
			e.preventDefault();
			placeholder.showHiddenCells();
		}));
		this._register(templateData.marginOverlay.onAction(() => placeholder.showHiddenCells()));
		templateData.marginOverlay.show();
	}
}

class PropertyHeader extends Disposable {
	protected _foldingIndicator!: HTMLElement;
	protected _statusSpan!: HTMLElement;
	protected _description!: HTMLElement;
	protected _toolbar!: WorkbenchToolBar;
	protected _menu!: IMenu;
	protected _propertyExpanded?: IContextKey<boolean>;
	protected _propertyChanged?: IContextKey<boolean>;

	constructor(
		readonly cell: IDiffElementViewModelBase,
		readonly propertyHeaderContainer: HTMLElement,
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly accessor: {
			updateInfoRendering: (renderOutput: boolean) => void;
			checkIfModified: () => false | { reason: string | undefined };
			getFoldingState: () => PropertyFoldingState;
			updateFoldingState: (newState: PropertyFoldingState) => void;
			unChangedLabel: string;
			changedLabel: string;
			prefix: string;
			menuId: MenuId;
		},
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ICommandService private readonly commandService: ICommandService,
		@INotificationService private readonly notificationService: INotificationService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IThemeService private readonly themeService: IThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super();
	}

	buildHeader(): void {
		this._foldingIndicator = DOM.append(this.propertyHeaderContainer, DOM.$('.property-folding-indicator'));
		this._foldingIndicator.classList.add(this.accessor.prefix);
		const metadataStatus = DOM.append(this.propertyHeaderContainer, DOM.$('div.property-status'));
		this._statusSpan = DOM.append(metadataStatus, DOM.$('span'));
		this._description = DOM.append(metadataStatus, DOM.$('span.property-description'));

		const cellToolbarContainer = DOM.append(this.propertyHeaderContainer, DOM.$('div.property-toolbar'));
		this._toolbar = this._register(new WorkbenchToolBar(cellToolbarContainer, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					const item = new CodiconActionViewItem(action, { hoverDelegate: options.hoverDelegate }, this.keybindingService, this.notificationService, this.contextKeyService, this.themeService, this.contextMenuService, this.accessibilityService);
					return item;
				}

				return undefined;
			}
		}, this.menuService, this.contextKeyService, this.contextMenuService, this.keybindingService, this.commandService, this.telemetryService));
		this._toolbar.context = this.cell;

		const scopedContextKeyService = this.contextKeyService.createScoped(cellToolbarContainer);
		this._register(scopedContextKeyService);
		this._propertyChanged = NOTEBOOK_DIFF_CELL_PROPERTY.bindTo(scopedContextKeyService);
		this._propertyExpanded = NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED.bindTo(scopedContextKeyService);

		this._menu = this._register(this.menuService.createMenu(this.accessor.menuId, scopedContextKeyService));
		this._register(this._menu.onDidChange(() => this.updateMenu()));

		this._register(this.notebookEditor.onMouseUp(e => {
			if (!e.event.target || e.target !== this.cell) {
				return;
			}

			const target = e.event.target as HTMLElement;

			if (
				target === this.propertyHeaderContainer ||
				target === this._foldingIndicator || this._foldingIndicator.contains(target) ||
				target === metadataStatus || metadataStatus.contains(target)
			) {
				const oldFoldingState = this.accessor.getFoldingState();
				this.accessor.updateFoldingState(oldFoldingState === PropertyFoldingState.Expanded ? PropertyFoldingState.Collapsed : PropertyFoldingState.Expanded);
				this._updateFoldingIcon();
				this.accessor.updateInfoRendering(this.cell.renderOutput);
			}
		}));

		this.refresh();
		this.accessor.updateInfoRendering(this.cell.renderOutput);
	}
	refresh() {
		this.updateMenu();
		this._updateFoldingIcon();

		const metadataChanged = this.accessor.checkIfModified();
		if (this._propertyChanged) {
			this._propertyChanged.set(!!metadataChanged);
		}
		if (metadataChanged) {
			this._statusSpan.textContent = this.accessor.changedLabel;
			this._statusSpan.style.fontWeight = 'bold';
			if (metadataChanged.reason) {
				this._description.textContent = metadataChanged.reason;
			}
			this.propertyHeaderContainer.classList.add('modified');
		} else {
			this._statusSpan.textContent = this.accessor.unChangedLabel;
			this._statusSpan.style.fontWeight = 'normal';
			this._description.textContent = '';
			this.propertyHeaderContainer.classList.remove('modified');
		}
	}

	private updateMenu() {
		const metadataChanged = this.accessor.checkIfModified();
		if (metadataChanged) {
			const actions = getFlatActionBarActions(this._menu.getActions({ shouldForwardArgs: true }));
			this._toolbar.setActions(actions);
		} else {
			this._toolbar.setActions([]);
		}
	}

	private _updateFoldingIcon() {
		if (this.accessor.getFoldingState() === PropertyFoldingState.Collapsed) {
			DOM.reset(this._foldingIndicator, renderIcon(collapsedIcon));
			this._propertyExpanded?.set(false);
		} else {
			DOM.reset(this._foldingIndicator, renderIcon(expandedIcon));
			this._propertyExpanded?.set(true);
		}

	}
}

interface IDiffElementLayoutState {
	outerWidth?: boolean;
	editorHeight?: boolean;
	metadataEditor?: boolean;
	metadataHeight?: boolean;
	outputTotalHeight?: boolean;
}


export class NotebookDocumentMetadataElement extends Disposable {
	private readonly _editor: DiffEditorWidget;
	private _editorViewStateChanged: boolean;
	private _toolbar!: ToolBar;
	private readonly _cellHeaderContainer: HTMLElement;
	private readonly _editorContainer: HTMLElement;
	private _cellHeader!: PropertyHeader;
	private _diffEditorContainer!: HTMLElement;

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly viewModel: NotebookDocumentMetadataViewModel,
		readonly templateData: NotebookDocumentDiffElementRenderTemplate,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITextResourceConfigurationService private readonly textConfigurationService: ITextResourceConfigurationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._editor = templateData.sourceEditor;
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._editorContainer = this.templateData.editorContainer;
		this._diffEditorContainer = this.templateData.diffEditorContainer;

		this._editorViewStateChanged = false;
		// init
		this._register(viewModel.onDidLayoutChange(e => {
			this.layout(e);
			this.updateBorders();
		}));
		this.buildBody();
		this.updateBorders();
	}

	buildBody(): void {
		const body = this.templateData.body;
		body.classList.remove('full');
		body.classList.add('full');

		this.updateSourceEditor();

		if (this.viewModel instanceof NotebookDocumentMetadataViewModel) {
			this._register(this.viewModel.modifiedMetadata.onDidChange(e => {
				this._cellHeader.refresh();
			}));
		}
	}
	protected layoutNotebookCell() {
		this.notebookEditor.layoutNotebookCell(
			this.viewModel,
			this.viewModel.layoutInfo.totalHeight
		);
	}

	updateBorders() {
		this.templateData.leftBorder.style.height = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
		this.templateData.rightBorder.style.height = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
		this.templateData.bottomBorder.style.top = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
	}
	updateSourceEditor(): void {
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		this._editorContainer.classList.add('diff');

		const updateSourceEditor = () => {
			if (this.viewModel.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.viewModel.editorHeight = 0;
				return;
			}

			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.viewModel.layoutInfo.editorHeight !== 0 ? this.viewModel.layoutInfo.editorHeight : this.viewModel.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			const contentHeight = this._editor.getContentHeight();
			if (contentHeight >= 0) {
				this.viewModel.editorHeight = contentHeight;
			}
			return editorHeight;
		};
		const renderSourceEditor = () => {
			const editorHeight = updateSourceEditor();
			if (!editorHeight) {
				return;
			}

			// If there is only 1 line, then ensure we have the necessary padding to display the button for whitespaces.
			// E.g. assume we have a cell with 1 line and we add some whitespace,
			// Then diff editor displays the button `Show Whitespace Differences`, however with 12 paddings on the top, the
			// button can get cut off.
			const lineCount = this.viewModel.modifiedMetadata.textBuffer.getLineCount();
			const options: IDiffEditorOptions = {
				padding: getEditorPadding(lineCount)
			};
			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				options.hideUnchangedRegions = unchangedRegions.options;
			}
			this._editor.updateOptions(options);
			this._register(unchangedRegions.onDidChangeEnablement(() => {
				options.hideUnchangedRegions = unchangedRegions.options;
				this._editor.updateOptions(options);
			}));
			this._editor.layout({
				width: this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN,
				height: editorHeight
			});
			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.viewModel.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.viewModel.layoutInfo.editorHeight !== e.contentHeight) {
					this.viewModel.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor();
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.viewModel,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => {
					return this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash() ? { reason: undefined } : false;
				},
				getFoldingState: () => this.viewModel.cellFoldingState,
				updateFoldingState: (state) => this.viewModel.cellFoldingState = state,
				unChangedLabel: 'Notebook Metadata',
				changedLabel: 'Notebook Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffDocumentMetadata
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		const scopedContextKeyService = this.contextKeyService.createScoped(this.templateData.inputToolbarContainer);
		this._register(scopedContextKeyService);
		const inputChanged = NOTEBOOK_DIFF_METADATA.bindTo(scopedContextKeyService);
		inputChanged.set(this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash());

		this._toolbar = this.templateData.toolbar;

		this._toolbar.context = this.viewModel;

		const refreshToolbar = () => {
			const hasChanges = this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash();
			inputChanged.set(hasChanges);

			if (hasChanges) {
				const menu = this.menuService.getMenuActions(MenuId.NotebookDiffDocumentMetadata, scopedContextKeyService, { shouldForwardArgs: true });
				const actions = getFlatActionBarActions(menu);
				this._toolbar.setActions(actions);
			} else {
				this._toolbar.setActions([]);
			}
		};

		this._register(this.viewModel.modifiedMetadata.onDidChange(() => {
			refreshToolbar();
		}));
		refreshToolbar();
	}

	private async _initializeSourceDiffEditor() {
		const [originalRef, modifiedRef] = await Promise.all([
			this.textModelService.createModelReference(this.viewModel.originalMetadata.uri),
			this.textModelService.createModelReference(this.viewModel.modifiedMetadata.uri)]);

		if (this._store.isDisposed) {
			originalRef.dispose();
			modifiedRef.dispose();
			return;
		}

		this._register(originalRef);
		this._register(modifiedRef);

		const vm = this._register(this._editor.createViewModel({
			original: originalRef.object.textEditorModel,
			modified: modifiedRef.object.textEditorModel,
		}));

		// Reduces flicker (compute this before setting the model)
		// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
		// & that results in flicker.
		await vm.waitForDiff();
		this._editor.setModel(vm);

		const handleViewStateChange = () => {
			this._editorViewStateChanged = true;
		};

		const handleScrollChange = (e: editorCommon.IScrollEvent) => {
			if (e.scrollTopChanged || e.scrollLeftChanged) {
				this._editorViewStateChanged = true;
			}
		};

		this.updateEditorOptionsForWhitespace();
		this._register(this._editor.getOriginalEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor.getOriginalEditor().onDidScrollChange(handleScrollChange));
		this._register(this._editor.getModifiedEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor.getModifiedEditor().onDidScrollChange(handleScrollChange));

		const editorViewState = this.viewModel.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor.getContentHeight();
		this.viewModel.editorHeight = contentHeight;
	}
	private updateEditorOptionsForWhitespace() {
		const editor = this._editor;
		const uri = editor.getModel()?.modified.uri || editor.getModel()?.original.uri;
		if (!uri) {
			return;
		}
		const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
		editor.updateOptions({ ignoreTrimWhitespace });

		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
				editor.updateOptions({ ignoreTrimWhitespace });
			}
		}));
	}
	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if (state.editorHeight) {
				this._editorContainer.style.height = `${this.viewModel.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this._editor.getViewWidth(),
					height: this.viewModel.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth) {
				this._editorContainer.style.height = `${this.viewModel.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			this.layoutNotebookCell();
		});
	}

	override dispose() {
		this._editor.setModel(null);

		if (this._editorViewStateChanged) {
			this.viewModel.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}


abstract class AbstractElementRenderer extends Disposable {
	protected readonly _metadataLocalDisposable = this._register(new DisposableStore());
	protected readonly _outputLocalDisposable = this._register(new DisposableStore());
	protected _ignoreMetadata: boolean = false;
	protected _ignoreOutputs: boolean = false;
	protected _cellHeaderContainer!: HTMLElement;
	protected _editorContainer!: HTMLElement;
	protected _cellHeader!: PropertyHeader;
	protected _metadataHeaderContainer!: HTMLElement;
	protected _metadataHeader!: PropertyHeader;
	protected _metadataInfoContainer!: HTMLElement;
	protected _metadataEditorContainer?: HTMLElement;
	protected readonly _metadataEditorDisposeStore!: DisposableStore;
	protected _metadataEditor?: CodeEditorWidget | DiffEditorWidget;

	protected _outputHeaderContainer!: HTMLElement;
	protected _outputHeader!: PropertyHeader;
	protected _outputInfoContainer!: HTMLElement;
	protected _outputEditorContainer?: HTMLElement;
	protected _outputViewContainer?: HTMLElement;
	protected _outputLeftContainer?: HTMLElement;
	protected _outputRightContainer?: HTMLElement;
	protected _outputMetadataContainer?: HTMLElement;
	protected _outputEmptyElement?: HTMLElement;
	protected _outputLeftView?: OutputContainer;
	protected _outputRightView?: OutputContainer;
	protected readonly _outputEditorDisposeStore!: DisposableStore;
	protected _outputEditor?: CodeEditorWidget | DiffEditorWidget;
	protected _outputMetadataEditor?: DiffEditorWidget;

	protected _diffEditorContainer!: HTMLElement;
	protected _diagonalFill?: HTMLElement;
	protected _isDisposed: boolean;

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly cell: DiffElementCellViewModelBase,
		readonly templateData: CellDiffSingleSideRenderTemplate | CellDiffSideBySideRenderTemplate,
		readonly style: 'left' | 'right' | 'full',
		protected readonly instantiationService: IInstantiationService,
		protected readonly languageService: ILanguageService,
		protected readonly modelService: IModelService,
		protected readonly textModelService: ITextModelService,
		protected readonly contextMenuService: IContextMenuService,
		protected readonly keybindingService: IKeybindingService,
		protected readonly notificationService: INotificationService,
		protected readonly menuService: IMenuService,
		protected readonly contextKeyService: IContextKeyService,
		protected readonly configurationService: IConfigurationService,
		protected readonly textConfigurationService: ITextResourceConfigurationService
	) {
		super();
		// init
		this._isDisposed = false;
		this._metadataEditorDisposeStore = this._register(new DisposableStore());
		this._outputEditorDisposeStore = this._register(new DisposableStore());
		this._register(cell.onDidLayoutChange(e => {
			this.layout(e);
		}));
		this._register(cell.onDidLayoutChange(e => this.updateBorders()));
		this.init();
		this.buildBody();

		this._register(cell.onDidStateChange(() => {
			this.updateOutputRendering(this.cell.renderOutput);
		}));
	}

	abstract init(): void;
	abstract styleContainer(container: HTMLElement): void;
	abstract _buildOutput(): void;
	abstract _disposeOutput(): void;
	abstract _buildMetadata(): void;
	abstract _disposeMetadata(): void;

	buildBody(): void {
		const body = this.templateData.body;
		this._diffEditorContainer = this.templateData.diffEditorContainer;
		body.classList.remove('left', 'right', 'full');
		switch (this.style) {
			case 'left':
				body.classList.add('left');
				break;
			case 'right':
				body.classList.add('right');
				break;
			default:
				body.classList.add('full');
				break;
		}

		this.styleContainer(this._diffEditorContainer);
		this.updateSourceEditor();
		if (this.cell.modified) {
			this._register(this.cell.modified.textModel.onDidChangeContent(() => this._cellHeader.refresh()));
		}

		this._ignoreMetadata = this.configurationService.getValue('notebook.diff.ignoreMetadata');
		if (this._ignoreMetadata) {
			this._disposeMetadata();
		} else {
			this._buildMetadata();
		}

		this._ignoreOutputs = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs') || !!(this.notebookEditor.textModel?.transientOptions.transientOutputs);
		if (this._ignoreOutputs) {
			this._disposeOutput();
		} else {
			this._buildOutput();
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let metadataLayoutChange = false;
			let outputLayoutChange = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreMetadata');

				if (newValue !== undefined && this._ignoreMetadata !== newValue) {
					this._ignoreMetadata = newValue;

					this._metadataLocalDisposable.clear();
					if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
						this._disposeMetadata();
					} else {
						this.cell.metadataStatusHeight = 25;
						this._buildMetadata();
						this.updateMetadataRendering();
						metadataLayoutChange = true;
					}
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');

				if (newValue !== undefined && this._ignoreOutputs !== (newValue || this.notebookEditor.textModel?.transientOptions.transientOutputs)) {
					this._ignoreOutputs = newValue || !!(this.notebookEditor.textModel?.transientOptions.transientOutputs);

					this._outputLocalDisposable.clear();
					if (this._ignoreOutputs) {
						this._disposeOutput();
						this.cell.layoutChange();
					} else {
						this.cell.outputStatusHeight = 25;
						this._buildOutput();
						outputLayoutChange = true;
					}
				}
			}

			if (metadataLayoutChange || outputLayoutChange) {
				this.layout({ metadataHeight: metadataLayoutChange, outputTotalHeight: outputLayoutChange });
			}
		}));
	}

	updateMetadataRendering() {
		if (this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
			// we should expand the metadata editor
			this._metadataInfoContainer.style.display = 'block';

			if (!this._metadataEditorContainer || !this._metadataEditor) {
				// create editor
				this._metadataEditorContainer = DOM.append(this._metadataInfoContainer, DOM.$('.metadata-editor-container'));
				this._buildMetadataEditor();
			} else {
				this.cell.metadataHeight = this._metadataEditor.getContentHeight();
			}
		} else {
			// we should collapse the metadata editor
			this._metadataInfoContainer.style.display = 'none';
			// this._metadataEditorDisposeStore.clear();
			this.cell.metadataHeight = 0;
		}
	}

	updateOutputRendering(renderRichOutput: boolean) {
		if (this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
			this._outputInfoContainer.style.display = 'block';
			if (renderRichOutput) {
				this._hideOutputsRaw();
				this._buildOutputRendererContainer();
				this._showOutputsRenderer();
				this._showOutputsEmptyView();
			} else {
				this._hideOutputsRenderer();
				this._buildOutputRawContainer();
				this._showOutputsRaw();
			}
		} else {
			this._outputInfoContainer.style.display = 'none';

			this._hideOutputsRaw();
			this._hideOutputsRenderer();
			this._hideOutputsEmptyView();
		}
	}

	private _buildOutputRawContainer() {
		if (!this._outputEditorContainer) {
			this._outputEditorContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-editor-container'));
			this._buildOutputEditor();
		}
	}

	private _showOutputsRaw() {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		if (this._outputEditorContainer) {
			this._outputEditorContainer.style.display = 'block';
			this.cell.rawOutputHeight = this._outputEditor!.getContentHeight();
		}
	}

	private _showOutputsEmptyView() {
		this.cell.layoutChange();
	}

	protected _hideOutputsRaw() {
		if (this._outputEditorContainer) {
			this._outputEditorContainer.style.display = 'none';
			this.cell.rawOutputHeight = 0;
		}
	}

	protected _hideOutputsEmptyView() {
		this.cell.layoutChange();
	}

	abstract _buildOutputRendererContainer(): void;
	abstract _hideOutputsRenderer(): void;
	abstract _showOutputsRenderer(): void;

	private _applySanitizedMetadataChanges(currentMetadata: NotebookCellMetadata, newMetadata: any) {
		const result: { [key: string]: any } = {};
		try {
			const newMetadataObj = JSON.parse(newMetadata);
			const keys = new Set([...Object.keys(newMetadataObj)]);
			for (const key of keys) {
				switch (key as keyof NotebookCellMetadata) {
					case 'inputCollapsed':
					case 'outputCollapsed':
						// boolean
						if (typeof newMetadataObj[key] === 'boolean') {
							result[key] = newMetadataObj[key];
						} else {
							result[key] = currentMetadata[key as keyof NotebookCellMetadata];
						}
						break;

					default:
						result[key] = newMetadataObj[key];
						break;
				}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 757: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 942: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const index = this.notebookEditor.textModel!.cells.indexOf(this.cell.modified!.textModel);

			if (index < 0) {
				return;
			}

			this.notebookEditor.textModel!.applyEdits([
				{ editType: CellEditType.Metadata, index, metadata: result }
			], true, undefined, () => undefined, undefined, true);
		} catch {
		}
	}

	private async _buildMetadataEditor() {
		this._metadataEditorDisposeStore.clear();

		if (this.cell instanceof SideBySideDiffElementViewModel) {
			this._metadataEditor = this.instantiationService.createInstance(DiffEditorWidget, this._metadataEditorContainer!, {
				...fixedDiffEditorOptions,
				overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
				readOnly: false,
				originalEditable: false,
				ignoreTrimWhitespace: false,
				automaticLayout: false,
				dimension: {
					height: this.cell.layoutInfo.metadataHeight,
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), true, true)
				}
			}, {
				originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
				modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
			});

			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				this._metadataEditor.updateOptions({ hideUnchangedRegions: unchangedRegions.options });
			}
			this._metadataEditorDisposeStore.add(unchangedRegions.onDidChangeEnablement(() => {
				if (this._metadataEditor) {
					this._metadataEditor.updateOptions({ hideUnchangedRegions: unchangedRegions.options });
				}
			}));


			this.layout({ metadataHeight: true });
			this._metadataEditorDisposeStore.add(this._metadataEditor);

			this._metadataEditorContainer?.classList.add('diff');

			const [originalMetadataModel, modifiedMetadataModel] = await Promise.all([
				this.textModelService.createModelReference(CellUri.generateCellPropertyUri(this.cell.originalDocument.uri, this.cell.original.handle, Schemas.vscodeNotebookCellMetadata)),
				this.textModelService.createModelReference(CellUri.generateCellPropertyUri(this.cell.modifiedDocument.uri, this.cell.modified.handle, Schemas.vscodeNotebookCellMetadata))
			]);

			if (this._isDisposed) {
				originalMetadataModel.dispose();
				modifiedMetadataModel.dispose();
				return;
			}

			this._metadataEditorDisposeStore.add(originalMetadataModel);
			this._metadataEditorDisposeStore.add(modifiedMetadataModel);
			const vm = this._metadataEditor.createViewModel({
				original: originalMetadataModel.object.textEditorModel,
				modified: modifiedMetadataModel.object.textEditorModel
			});
			this._metadataEditor.setModel(vm);
			// Reduces flicker (compute this before setting the model)
			// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
			// & that results in flicker.
			await vm.waitForDiff();

			if (this._isDisposed) {
				return;
			}

			this.cell.metadataHeight = this._metadataEditor.getContentHeight();

			this._metadataEditorDisposeStore.add(this._metadataEditor.onDidContentSizeChange((e) => {
				if (e.contentHeightChanged && this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
					this.cell.metadataHeight = e.contentHeight;
				}
			}));

			let respondingToContentChange = false;

			this._metadataEditorDisposeStore.add(modifiedMetadataModel.object.textEditorModel.onDidChangeContent(() => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				respondingToContentChange = true;
				const value = modifiedMetadataModel.object.textEditorModel.getValue();
				this._applySanitizedMetadataChanges(this.cell.modified!.metadata, value);
				this._metadataHeader.refresh();
				respondingToContentChange = false;
			}));

			this._metadataEditorDisposeStore.add(this.cell.modified.textModel.onDidChangeMetadata(() => {
				if (respondingToContentChange) {
					return;
				}

				const modifiedMetadataSource = getFormattedMetadataJSON(this.notebookEditor.textModel?.transientOptions.transientCellMetadata, this.cell.modified?.metadata || {}, this.cell.modified?.language, true);
				modifiedMetadataModel.object.textEditorModel.setValue(modifiedMetadataSource);
			}));

			return;
		} else {
			this._metadataEditor = this.instantiationService.createInstance(CodeEditorWidget, this._metadataEditorContainer!, {
				...fixedEditorOptions,
				dimension: {
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
					height: this.cell.layoutInfo.metadataHeight
				},
				overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
				readOnly: false,
				allowVariableLineHeights: false
			}, {});
			this.layout({ metadataHeight: true });
			this._metadataEditorDisposeStore.add(this._metadataEditor);

			const mode = this.languageService.createById('jsonc');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const originalMetadataSource = getFormattedMetadataJSON(this.notebookEditor.textModel?.transientOptions.transientCellMetadata,
				this.cell.type === 'insert'
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 917: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 938: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 941: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 942: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 988: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 991: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 995: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1016: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1020: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1041: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1063: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1069: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1070: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1089: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1092: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1095: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1116: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1117: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1120: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1139: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1163: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1164: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1166: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1167: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1195: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1213: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1216: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1217: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1264: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1269: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1270: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1317: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1341: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1342: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1344: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1345: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1364: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1369: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1370: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					? this.cell.modified!.metadata || {}
					: this.cell.original!.metadata || {}, undefined, true);
			const uri = this.cell.type === 'insert'
				? this.cell.modified!.uri
				: this.cell.original!.uri;
			const handle = this.cell.type === 'insert'
				? this.cell.modified!.handle
				: this.cell.original!.handle;

			const modelUri = CellUri.generateCellPropertyUri(uri, handle, Schemas.vscodeNotebookCellMetadata);
			const metadataModel = this.modelService.createModel(originalMetadataSource, mode, modelUri, false);
			this._metadataEditor.setModel(metadataModel);
			this._metadataEditorDisposeStore.add(metadataModel);

			this.cell.metadataHeight = this._metadataEditor.getContentHeight();

			this._metadataEditorDisposeStore.add(this._metadataEditor.onDidContentSizeChange((e) => {
				if (e.contentHeightChanged && this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
					this.cell.metadataHeight = e.contentHeight;
				}
			}));
		}
	}

	private _buildOutputEditor() {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		this._outputEditorDisposeStore.clear();

		if ((this.cell.type === 'modified' || this.cell.type === 'unchanged') && !this.notebookEditor.textModel!.transientOptions.transientOutputs) {
			const originalOutputsSource = getFormattedOutputJSON(this.cell.original?.outputs || []);
			const modifiedOutputsSource = getFormattedOutputJSON(this.cell.modified?.outputs || []);
			if (originalOutputsSource !== modifiedOutputsSource) {
				const mode = this.languageService.createById('json');
				const originalModel = this.modelService.createModel(originalOutputsSource, mode, undefined, true);
				const modifiedModel = this.modelService.createModel(modifiedOutputsSource, mode, undefined, true);
				this._outputEditorDisposeStore.add(originalModel);
				this._outputEditorDisposeStore.add(modifiedModel);

				const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
				const lineCount = Math.max(originalModel.getLineCount(), modifiedModel.getLineCount());
				this._outputEditor = this.instantiationService.createInstance(DiffEditorWidget, this._outputEditorContainer!, {
					...fixedDiffEditorOptions,
					overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
					readOnly: true,
					ignoreTrimWhitespace: false,
					automaticLayout: false,
					dimension: {
						height: Math.min(OUTPUT_EDITOR_HEIGHT_MAGIC, this.cell.layoutInfo.rawOutputHeight || lineHeight * lineCount),
						width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true)
					},
					accessibilityVerbose: this.configurationService.getValue<boolean>(AccessibilityVerbositySettingId.DiffEditor) ?? false
				}, {
					originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
					modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
				});
				this._outputEditorDisposeStore.add(this._outputEditor);

				this._outputEditorContainer?.classList.add('diff');

				this._outputEditor.setModel({
					original: originalModel,
					modified: modifiedModel
				});
				this._outputEditor.restoreViewState(this.cell.getOutputEditorViewState() as editorCommon.IDiffEditorViewState);

				this.cell.rawOutputHeight = this._outputEditor.getContentHeight();

				this._outputEditorDisposeStore.add(this._outputEditor.onDidContentSizeChange((e) => {
					if (e.contentHeightChanged && this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
						this.cell.rawOutputHeight = e.contentHeight;
					}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				}));

				this._outputEditorDisposeStore.add(this.cell.modified!.textModel.onDidChangeOutputs(() => {
					const modifiedOutputsSource = getFormattedOutputJSON(this.cell.modified?.outputs || []);
					modifiedModel.setValue(modifiedOutputsSource);
					this._outputHeader.refresh();
				}));

				return;
			}
		}

		this._outputEditor = this.instantiationService.createInstance(CodeEditorWidget, this._outputEditorContainer!, {
			...fixedEditorOptions,
			dimension: {
				width: Math.min(OUTPUT_EDITOR_HEIGHT_MAGIC, this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, this.cell.type === 'unchanged' || this.cell.type === 'modified') - 32),
				height: this.cell.layoutInfo.rawOutputHeight
			},
			overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
			allowVariableLineHeights: false
		}, {});
		this._outputEditorDisposeStore.add(this._outputEditor);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const mode = this.languageService.createById('json');
		const originaloutputSource = getFormattedOutputJSON(
			this.notebookEditor.textModel!.transientOptions.transientOutputs
				? []
				: this.cell.type === 'insert'
					? this.cell.modified?.outputs || []
					: this.cell.original?.outputs || []);
		const outputModel = this.modelService.createModel(originaloutputSource, mode, undefined, true);
		this._outputEditorDisposeStore.add(outputModel);
		this._outputEditor.setModel(outputModel);
		this._outputEditor.restoreViewState(this.cell.getOutputEditorViewState());

		this.cell.rawOutputHeight = this._outputEditor.getContentHeight();

		this._outputEditorDisposeStore.add(this._outputEditor.onDidContentSizeChange((e) => {
			if (e.contentHeightChanged && this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
				this.cell.rawOutputHeight = e.contentHeight;
			}
		}));
	}

	protected layoutNotebookCell() {
		this.notebookEditor.layoutNotebookCell(
			this.cell,
			this.cell.layoutInfo.totalHeight
		);
	}

	updateBorders() {
		this.templateData.leftBorder.style.height = `${this.cell.layoutInfo.totalHeight - 32}px`;
		this.templateData.rightBorder.style.height = `${this.cell.layoutInfo.totalHeight - 32}px`;
		this.templateData.bottomBorder.style.top = `${this.cell.layoutInfo.totalHeight - 32}px`;
	}

	override dispose() {
		if (this._outputEditor) {
			this.cell.saveOutputEditorViewState(this._outputEditor.saveViewState());
		}

		if (this._metadataEditor) {
			this.cell.saveMetadataEditorViewState(this._metadataEditor.saveViewState());
		}

		this._metadataEditorDisposeStore.dispose();
		this._outputEditorDisposeStore.dispose();

		this._isDisposed = true;
		super.dispose();
	}

	abstract updateSourceEditor(): void;
	abstract layout(state: IDiffElementLayoutState): void;
}

abstract class SingleSideDiffElement extends AbstractElementRenderer {
	protected _editor!: CodeEditorWidget;
	override readonly cell: SingleSideDiffElementViewModel;
	override readonly templateData: CellDiffSingleSideRenderTemplate;
	abstract get nestedCellViewModel(): DiffNestedCellViewModel;
	abstract get readonly(): boolean;
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		style: 'left' | 'right' | 'full',
		instantiationService: IInstantiationService,
		languageService: ILanguageService,
		modelService: IModelService,
		textModelService: ITextModelService,
		contextMenuService: IContextMenuService,
		keybindingService: IKeybindingService,
		notificationService: INotificationService,
		menuService: IMenuService,
		contextKeyService: IContextKeyService,
		configurationService: IConfigurationService,
		textConfigurationService: ITextResourceConfigurationService
	) {
		super(
			notebookEditor,
			cell,
			templateData,
			style,
			instantiationService,
			languageService,
			modelService,
			textModelService,
			contextMenuService,
			keybindingService,
			notificationService,
			menuService,
			contextKeyService,
			configurationService,
			textConfigurationService
		);
		this.cell = cell;
		this.templateData = templateData;

		this.updateBorders();
	}

	init() {
		this._diagonalFill = this.templateData.diagonalFill;
	}

	override buildBody() {
		const body = this.templateData.body;
		this._diffEditorContainer = this.templateData.diffEditorContainer;
		body.classList.remove('left', 'right', 'full');
		switch (this.style) {
			case 'left':
				body.classList.add('left');
				break;
			case 'right':
				body.classList.add('right');
				break;
			default:
				body.classList.add('full');
				break;
		}

		this.styleContainer(this._diffEditorContainer);
		this.updateSourceEditor();

		if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
			this._disposeMetadata();
		} else {
			this._buildMetadata();
		}

		if (this.configurationService.getValue('notebook.diff.ignoreOutputs') || this.notebookEditor.textModel?.transientOptions.transientOutputs) {
			this._disposeOutput();
		} else {
			this._buildOutput();
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let metadataLayoutChange = false;
			let outputLayoutChange = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				this._metadataLocalDisposable.clear();
				if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
					this._disposeMetadata();
				} else {
					this.cell.metadataStatusHeight = 25;
					this._buildMetadata();
					this.updateMetadataRendering();
					metadataLayoutChange = true;
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				this._outputLocalDisposable.clear();
				if (this.configurationService.getValue('notebook.diff.ignoreOutputs') || this.notebookEditor.textModel?.transientOptions.transientOutputs) {
					this._disposeOutput();
				} else {
					this.cell.outputStatusHeight = 25;
					this._buildOutput();
					outputLayoutChange = true;
				}
			}

			if (metadataLayoutChange || outputLayoutChange) {
				this.layout({ metadataHeight: metadataLayoutChange, outputTotalHeight: outputLayoutChange });
			}
		}));
	}

	override updateSourceEditor(): void {
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		this._editorContainer = this.templateData.editorContainer;
		this._editorContainer.classList.add('diff');

		const renderSourceEditor = () => {
			if (this.cell.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.cell.editorHeight = 0;
				return;
			}
			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.cell.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			if (this._editor) {
				const contentHeight = this._editor.getContentHeight();
				if (contentHeight >= 0) {
					this.cell.editorHeight = contentHeight;
				}
				return;
			}

			this._editor = this.templateData.sourceEditor;
			this._editor.layout(
				{
					width: (this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN) / 2 - 18,
					height: editorHeight
				}
			);
			this._editor.updateOptions({ readOnly: this.readonly });
			this.cell.editorHeight = editorHeight;

			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.cell.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.cell.layoutInfo.editorHeight !== e.contentHeight) {
					this.cell.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor(this.nestedCellViewModel);
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => ({ reason: undefined }),
				getFoldingState: () => this.cell.cellFoldingState,
				updateFoldingState: (state) => this.cell.cellFoldingState = state,
				unChangedLabel: 'Input',
				changedLabel: 'Input',
				prefix: 'input',
				menuId: MenuId.NotebookDiffCellInputTitle
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		this._initializeSourceDiffEditor(this.nestedCellViewModel);
	}
	protected calculateDiagonalFillHeight() {
		return this.cell.layoutInfo.cellStatusHeight + this.cell.layoutInfo.editorHeight + this.cell.layoutInfo.editorMargin + this.cell.layoutInfo.metadataStatusHeight + this.cell.layoutInfo.metadataHeight + this.cell.layoutInfo.outputTotalHeight + this.cell.layoutInfo.outputStatusHeight;
	}

	private async _initializeSourceDiffEditor(modifiedCell: DiffNestedCellViewModel) {
		const modifiedRef = await this.textModelService.createModelReference(modifiedCell.uri);

		if (this._isDisposed) {
			return;
		}

		const modifiedTextModel = modifiedRef.object.textEditorModel;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1212: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1216: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		this._register(modifiedRef);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1329: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1335: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1370: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1373: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1374: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1401: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1405: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1408: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1411: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1412: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1446: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1449: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1450: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1477: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1481: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1484: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1487: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1488: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1515: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1519: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1522: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1525: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1553: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1560: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1563: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1564: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1591: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1595: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1598: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1601: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1602: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1629: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1636: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1639: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1640: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1671: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1674: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1677: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1678: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1705: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1709: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1715: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1716: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1743: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1747: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1750: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1754: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1781: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1785: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1788: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1791: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1823: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1826: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1829: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1830: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1857: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1861: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1864: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1867: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1868: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1895: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1899: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1902: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1905: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1933: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1937: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1940: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1943: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1944: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1971: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1978: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1982: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		this._editor!.setModel(modifiedTextModel);

		const editorViewState = this.cell.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor!.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor!.getContentHeight();
		this.cell.editorHeight = contentHeight;
		const height = `${this.calculateDiagonalFillHeight()}px`;
		if (this._diagonalFill!.style.height !== height) {
			this._diagonalFill!.style.height = height;
		}
	}

	_disposeMetadata() {
		this.cell.metadataStatusHeight = 0;
		this.cell.metadataHeight = 0;
		this.templateData.cellHeaderContainer.style.display = 'none';
		this.templateData.metadataHeaderContainer.style.display = 'none';
		this.templateData.metadataInfoContainer.style.display = 'none';
		this._metadataEditor = undefined;
	}

	_buildMetadata() {
		this._metadataHeaderContainer = this.templateData.metadataHeaderContainer;
		this._metadataInfoContainer = this.templateData.metadataInfoContainer;
		this._metadataHeaderContainer.style.display = 'flex';
		this._metadataInfoContainer.style.display = 'block';
		this._metadataHeaderContainer.innerText = '';
		this._metadataInfoContainer.innerText = '';

		this._metadataHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._metadataHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateMetadataRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkMetadataIfModified();
				},
				getFoldingState: () => {
					return this.cell.metadataFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.metadataFoldingState = state;
				},
				unChangedLabel: 'Metadata',
				changedLabel: 'Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffCellMetadataTitle
			}
		);
		this._metadataLocalDisposable.add(this._metadataHeader);
		this._metadataHeader.buildHeader();
	}

	_buildOutput() {
		this.templateData.outputHeaderContainer.style.display = 'flex';
		this.templateData.outputInfoContainer.style.display = 'block';

		this._outputHeaderContainer = this.templateData.outputHeaderContainer;
		this._outputInfoContainer = this.templateData.outputInfoContainer;

		this._outputHeaderContainer.innerText = '';
		this._outputInfoContainer.innerText = '';

		this._outputHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._outputHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateOutputRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkIfOutputsModified();
				},
				getFoldingState: () => {
					return this.cell.outputFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.outputFoldingState = state;
				},
				unChangedLabel: 'Outputs',
				changedLabel: 'Outputs changed',
				prefix: 'output',
				menuId: MenuId.NotebookDiffCellOutputsTitle
			}
		);
		this._outputLocalDisposable.add(this._outputHeader);
		this._outputHeader.buildHeader();
	}

	_disposeOutput() {
		this._hideOutputsRaw();
		this._hideOutputsRenderer();
		this._hideOutputsEmptyView();

		this.cell.rawOutputHeight = 0;
		this.cell.outputMetadataHeight = 0;
		this.cell.outputStatusHeight = 0;
		this.templateData.outputHeaderContainer.style.display = 'none';
		this.templateData.outputInfoContainer.style.display = 'none';
		this._outputViewContainer = undefined;
	}
}
export class DeletedElement extends SingleSideDiffElement {
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'left', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
	}

	get nestedCellViewModel() {
		return this.cell.original!;
	}
	get readonly() {
		return true;
	}

	styleContainer(container: HTMLElement) {
		container.classList.remove('inserted');
		container.classList.add('removed');
	}

	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if ((state.editorHeight || state.outerWidth) && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				this._metadataEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.metadataHeight
				});
			}

			if (state.outputTotalHeight || state.outerWidth) {
				this._outputEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.outputTotalHeight
				});
			}

			if (this._diagonalFill) {
				this._diagonalFill.style.height = `${this.calculateDiagonalFillHeight()}px`;
			}

			this.layoutNotebookCell();
		});
	}


	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			const span = DOM.append(this._outputEmptyElement, DOM.$('span'));
			span.innerText = 'No outputs to render';

			if (!this.cell.original?.outputs.length) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._outputLeftView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.original!, DiffSide.Original, this._outputViewContainer);
			this._register(this._outputLeftView);
			this._outputLeftView.render();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1409: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1410: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			const removedOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				if (e.cell.uri.toString() === this.cell.original!.uri.toString()) {
					this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original!.id, ['nb-cellDeleted'], []);
					removedOutputRenderListener.dispose();
				}
			});

			this._register(removedOutputRenderListener);
		}

		this._outputViewContainer.style.display = 'block';
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	_decorate() {
		this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original!.id, ['nb-cellDeleted'], []);
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';

			this._outputLeftView?.showOutputs();
			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';

			this._outputLeftView?.hideOutputs();
		}
	}

	override dispose() {
		if (this._editor) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}

export class InsertElement extends SingleSideDiffElement {
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'right', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
	}
	get nestedCellViewModel() {
		return this.cell.modified!;
	}
	get readonly() {
		return false;
	}

	styleContainer(container: HTMLElement): void {
		container.classList.remove('removed');
		container.classList.add('inserted');
	}

	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			this._outputEmptyElement.innerText = 'No outputs to render';

			if (!this.cell.modified?.outputs.length) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._outputRightView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.modified!, DiffSide.Modified, this._outputViewContainer);
			this._register(this._outputRightView);
			this._outputRightView.render();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			const insertOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1603: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1604: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				if (e.cell.uri.toString() === this.cell.modified!.uri.toString()) {
					this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified!.id, ['nb-cellAdded'], []);
					insertOutputRenderListener.dispose();
				}
			});
			this._register(insertOutputRenderListener);
		}

		this._outputViewContainer.style.display = 'block';
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	_decorate() {
		this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified!.id, ['nb-cellAdded'], []);
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';
			this._outputRightView?.showOutputs();
			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';
			this._outputRightView?.hideOutputs();
		}
	}

	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if ((state.editorHeight || state.outerWidth) && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				this._metadataEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
					height: this.cell.layoutInfo.metadataHeight
				});
			}

			if (state.outputTotalHeight || state.outerWidth) {
				this._outputEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.outputTotalHeight
				});
			}

			this.layoutNotebookCell();

			if (this._diagonalFill) {
				this._diagonalFill.style.height = `${this.calculateDiagonalFillHeight()}px`;
			}
		});
	}

	override dispose() {
		if (this._editor) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}

export class ModifiedElement extends AbstractElementRenderer {
	private _editor?: DiffEditorWidget;
	private _editorViewStateChanged: boolean;
	protected _toolbar!: ToolBar;
	protected _menu!: IMenu;

	override readonly cell: SideBySideDiffElementViewModel;
	override readonly templateData: CellDiffSideBySideRenderTemplate;

	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SideBySideDiffElementViewModel,
		templateData: CellDiffSideBySideRenderTemplate,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'full', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
		this.cell = cell;
		this.templateData = templateData;
		this._editorViewStateChanged = false;

		this.updateBorders();
	}

	init() { }
	styleContainer(container: HTMLElement): void {
		container.classList.remove('inserted', 'removed');
	}

	override buildBody(): void {
		super.buildBody();
		if (this.cell.displayIconToHideUnmodifiedCells) {
			this._register(this.templateData.marginOverlay.onAction(() => this.cell.hideUnchangedCells()));
			this.templateData.marginOverlay.show();
		} else {
			this.templateData.marginOverlay.hide();
		}
	}
	_disposeMetadata() {
		this.cell.metadataStatusHeight = 0;
		this.cell.metadataHeight = 0;
		this.templateData.metadataHeaderContainer.style.display = 'none';
		this.templateData.metadataInfoContainer.style.display = 'none';
		this._metadataEditor = undefined;
	}

	_buildMetadata() {
		this._metadataHeaderContainer = this.templateData.metadataHeaderContainer;
		this._metadataInfoContainer = this.templateData.metadataInfoContainer;
		this._metadataHeaderContainer.style.display = 'flex';
		this._metadataInfoContainer.style.display = 'block';

		this._metadataHeaderContainer.innerText = '';
		this._metadataInfoContainer.innerText = '';

		this._metadataHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._metadataHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateMetadataRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkMetadataIfModified();
				},
				getFoldingState: () => {
					return this.cell.metadataFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.metadataFoldingState = state;
				},
				unChangedLabel: 'Metadata',
				changedLabel: 'Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffCellMetadataTitle
			}
		);
		this._metadataLocalDisposable.add(this._metadataHeader);
		this._metadataHeader.buildHeader();
	}

	_disposeOutput() {
		this._hideOutputsRaw();
		this._hideOutputsRenderer();
		this._hideOutputsEmptyView();

		this.cell.rawOutputHeight = 0;
		this.cell.outputMetadataHeight = 0;
		this.cell.outputStatusHeight = 0;
		this.templateData.outputHeaderContainer.style.display = 'none';
		this.templateData.outputInfoContainer.style.display = 'none';
		this._outputViewContainer = undefined;
	}

	_buildOutput() {
		this.templateData.outputHeaderContainer.style.display = 'flex';
		this.templateData.outputInfoContainer.style.display = 'block';

		this._outputHeaderContainer = this.templateData.outputHeaderContainer;
		this._outputInfoContainer = this.templateData.outputInfoContainer;
		this._outputHeaderContainer.innerText = '';
		this._outputInfoContainer.innerText = '';

		if (this.cell.checkIfOutputsModified()) {
			this._outputInfoContainer.classList.add('modified');
		} else {
			this._outputInfoContainer.classList.remove('modified');
		}

		this._outputHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._outputHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateOutputRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkIfOutputsModified();
				},
				getFoldingState: () => {
					return this.cell.outputFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.outputFoldingState = state;
				},
				unChangedLabel: 'Outputs',
				changedLabel: 'Outputs changed',
				prefix: 'output',
				menuId: MenuId.NotebookDiffCellOutputsTitle
			}
		);
		this._outputLocalDisposable.add(this._outputHeader);
		this._outputHeader.buildHeader();
	}

	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			this._outputEmptyElement.innerText = 'No outputs to render';

			if (!this.cell.checkIfOutputsModified() && this.cell.modified.outputs.length === 0) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._register(this.cell.modified.textModel.onDidChangeOutputs(() => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				// currently we only allow outputs change to the modified cell
				if (!this.cell.checkIfOutputsModified() && this.cell.modified.outputs.length === 0) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1857: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1859: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					this._outputEmptyElement!.style.display = 'block';
				} else {
					this._outputEmptyElement!.style.display = 'none';
				}
				this._decorate();
			}));

			this._outputLeftContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-left'));
			this._outputRightContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-right'));
			this._outputMetadataContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-metadata'));

			const outputModified = this.cell.checkIfOutputsModified();
			const outputMetadataChangeOnly = outputModified
				&& outputModified.kind === OutputComparison.Metadata
				&& this.cell.original.outputs.length === 1
				&& this.cell.modified.outputs.length === 1
				&& outputEqual(this.cell.original.outputs[0], this.cell.modified.outputs[0]) === OutputComparison.Metadata;

			if (outputModified && !outputMetadataChangeOnly) {
				const originalOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
					if (e.cell.uri.toString() === this.cell.original.uri.toString() && this.cell.checkIfOutputsModified()) {
						this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, ['nb-cellDeleted'], []);
						originalOutputRenderListener.dispose();
					}
				});

				const modifiedOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
					if (e.cell.uri.toString() === this.cell.modified.uri.toString() && this.cell.checkIfOutputsModified()) {
						this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, ['nb-cellAdded'], []);
						modifiedOutputRenderListener.dispose();
					}
				});

				this._register(originalOutputRenderListener);
				this._register(modifiedOutputRenderListener);
			}

			// We should use the original text model here
			this._outputLeftView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.original, DiffSide.Original, this._outputLeftContainer);
			this._outputLeftView.render();
			this._register(this._outputLeftView);
			this._outputRightView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.modified, DiffSide.Modified, this._outputRightContainer);
			this._outputRightView.render();
			this._register(this._outputRightView);

			if (outputModified && !outputMetadataChangeOnly) {
				this._decorate();
			}

			if (outputMetadataChangeOnly) {

				this._outputMetadataContainer.style.top = `${this.cell.layoutInfo.rawOutputHeight}px`;
				// single output, metadata change, let's render a diff editor for metadata
				this._outputMetadataEditor = this.instantiationService.createInstance(DiffEditorWidget, this._outputMetadataContainer, {
					...fixedDiffEditorOptions,
					overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
					readOnly: true,
					ignoreTrimWhitespace: false,
					automaticLayout: false,
					dimension: {
						height: OUTPUT_EDITOR_HEIGHT_MAGIC,
						width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true)
					}
				}, {
					originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
					modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
				});

				this._register(this._outputMetadataEditor);
				const originalOutputMetadataSource = JSON.stringify(this.cell.original.outputs[0].metadata ?? {}, undefined, '\t');
				const modifiedOutputMetadataSource = JSON.stringify(this.cell.modified.outputs[0].metadata ?? {}, undefined, '\t');

				const mode = this.languageService.createById('json');
				const originalModel = this.modelService.createModel(originalOutputMetadataSource, mode, undefined, true);
				const modifiedModel = this.modelService.createModel(modifiedOutputMetadataSource, mode, undefined, true);

				this._outputMetadataEditor.setModel({
					original: originalModel,
					modified: modifiedModel
				});

				this.cell.outputMetadataHeight = this._outputMetadataEditor.getContentHeight();

				this._register(this._outputMetadataEditor.onDidContentSizeChange((e) => {
					this.cell.outputMetadataHeight = e.contentHeight;
				}));
			}
		}

		this._outputViewContainer.style.display = 'block';
	}

	_decorate() {
		if (this.cell.checkIfOutputsModified()) {
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, ['nb-cellDeleted'], []);
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, ['nb-cellAdded'], []);
		} else {
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, [], ['nb-cellDeleted']);
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, [], ['nb-cellAdded']);
		}
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';

			this._outputLeftView?.showOutputs();
			this._outputRightView?.showOutputs();
			this._outputMetadataEditor?.layout({
				width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
				height: this.cell.layoutInfo.outputMetadataHeight
			});

			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';

			this._outputLeftView?.hideOutputs();
			this._outputRightView?.hideOutputs();
		}
	}

	updateSourceEditor(): void {
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		const modifiedCell = this.cell.modified;
		this._editorContainer = this.templateData.editorContainer;
		this._editorContainer.classList.add('diff');

		const renderSourceEditor = () => {
			if (this.cell.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.cell.editorHeight = 0;
				return;
			}

			const lineCount = modifiedCell.textModel.textBuffer.getLineCount();
			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.cell.layoutInfo.editorHeight !== 0 ? this.cell.layoutInfo.editorHeight : this.cell.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			if (this._editor) {
				const contentHeight = this._editor.getContentHeight();
				if (contentHeight >= 0) {
					this.cell.editorHeight = contentHeight;
				}
				return;
			}

			this._editor = this.templateData.sourceEditor;
			// If there is only 1 line, then ensure we have the necessary padding to display the button for whitespaces.
			// E.g. assume we have a cell with 1 line and we add some whitespace,
			// Then diff editor displays the button `Show Whitespace Differences`, however with 12 paddings on the top, the
			// button can get cut off.
			const options: IDiffEditorOptions = {
				padding: getEditorPadding(lineCount)
			};
			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				options.hideUnchangedRegions = unchangedRegions.options;
			}
			this._editor.updateOptions(options);
			this._register(unchangedRegions.onDidChangeEnablement(() => {
				options.hideUnchangedRegions = unchangedRegions.options;
				this._editor?.updateOptions(options);
			}));
			this._editor.layout({
				width: this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN,
				height: editorHeight
			});
			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.cell.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.cell.layoutInfo.editorHeight !== e.contentHeight) {
					this.cell.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor();
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => {
					return this.cell.modified?.textModel.getTextBufferHash() !== this.cell.original?.textModel.getTextBufferHash() ? { reason: undefined } : false;
				},
				getFoldingState: () => this.cell.cellFoldingState,
				updateFoldingState: (state) => this.cell.cellFoldingState = state,
				unChangedLabel: 'Input',
				changedLabel: 'Input changed',
				prefix: 'input',
				menuId: MenuId.NotebookDiffCellInputTitle
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		const scopedContextKeyService = this.contextKeyService.createScoped(this.templateData.inputToolbarContainer);
		this._register(scopedContextKeyService);
		const inputChanged = NOTEBOOK_DIFF_CELL_INPUT.bindTo(scopedContextKeyService);
		inputChanged.set(this.cell.modified.textModel.getTextBufferHash() !== this.cell.original.textModel.getTextBufferHash());

		const ignoreWhitespace = NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE.bindTo(scopedContextKeyService);
		const ignore = this.textConfigurationService.getValue<boolean>(this.cell.modified.uri, 'diffEditor.ignoreTrimWhitespace');
		ignoreWhitespace.set(ignore);

		this._toolbar = this.templateData.toolbar;

		this._toolbar.context = this.cell;

		const refreshToolbar = () => {
			const ignore = this.textConfigurationService.getValue<boolean>(this.cell.modified.uri, 'diffEditor.ignoreTrimWhitespace');
			ignoreWhitespace.set(ignore);
			const hasChanges = this.cell.modified.textModel.getTextBufferHash() !== this.cell.original.textModel.getTextBufferHash();
			inputChanged.set(hasChanges);

			if (hasChanges) {
				const menu = this.menuService.getMenuActions(MenuId.NotebookDiffCellInputTitle, scopedContextKeyService, { shouldForwardArgs: true });
				const actions = getFlatActionBarActions(menu);
				this._toolbar.setActions(actions);
			} else {
				this._toolbar.setActions([]);
			}
		};

		this._register(this.cell.modified.textModel.onDidChangeContent(() => refreshToolbar()));
		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(this.cell.modified.uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				refreshToolbar();
			}
		}));
		refreshToolbar();
	}

	private async _initializeSourceDiffEditor() {
		const [originalRef, modifiedRef] = await Promise.all([
			this.textModelService.createModelReference(this.cell.original.uri),
			this.textModelService.createModelReference(this.cell.modified.uri)]);
		this._register(originalRef);
		this._register(modifiedRef);

		if (this._isDisposed) {
			originalRef.dispose();
			modifiedRef.dispose();
			return;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1995: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2004: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 2124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const vm = this._register(this._editor!.createViewModel({
			original: originalRef.object.textEditorModel,
			modified: modifiedRef.object.textEditorModel,
		}));

		// Reduces flicker (compute this before setting the model)
		// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
		// & that results in flicker.
		await vm.waitForDiff();
		this._editor!.setModel(vm);

		const handleViewStateChange = () => {
			this._editorViewStateChanged = true;
		};

		const handleScrollChange = (e: editorCommon.IScrollEvent) => {
			if (e.scrollTopChanged || e.scrollLeftChanged) {
				this._editorViewStateChanged = true;
			}
		};
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2017: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2018: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2019: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2020: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2024: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		this.updateEditorOptionsForWhitespace();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2161: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2162: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2163: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2252: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2255: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2259: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2262: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2304: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2305: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2306: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2307: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2311: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2356: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2357: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2358: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2359: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2363: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2408: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2410: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2411: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2415: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2418: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2461: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2462: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2463: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2467: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2470: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2514: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2515: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2519: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2522: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2564: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2565: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2566: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2567: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2571: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2616: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2617: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2618: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2619: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2623: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2626: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2668: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2669: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2670: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2671: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2675: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2678: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2720: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2721: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2722: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2723: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2727: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2730: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2772: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2773: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2774: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2775: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2779: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2782: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2824: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2825: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2826: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2827: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2831: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2834: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2876: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2877: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2878: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2879: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2883: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2886: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2928: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2929: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2930: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2931: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2935: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2938: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2980: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2981: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2982: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2983: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2987: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2990: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 3032: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3033: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3034: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3035: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3039: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 3042: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 3084: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3085: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3086: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3087: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3091: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 3094: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 3136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3138: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3139: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3143: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 3146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		this._register(this._editor!.getOriginalEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor!.getOriginalEditor().onDidScrollChange(handleScrollChange));
		this._register(this._editor!.getModifiedEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor!.getModifiedEditor().onDidScrollChange(handleScrollChange));

		const editorViewState = this.cell.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor!.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor!.getContentHeight();
		this.cell.editorHeight = contentHeight;
	}
	private updateEditorOptionsForWhitespace() {
		const editor = this._editor;
		if (!editor) {
			return;
		}
		const uri = editor.getModel()?.modified.uri || editor.getModel()?.original.uri;
		if (!uri) {
			return;
		}
		const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
		editor.updateOptions({ ignoreTrimWhitespace });

		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
				editor.updateOptions({ ignoreTrimWhitespace });
			}
		}));
	}
	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if (state.editorHeight && this._editor) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this._editor!.getViewWidth(),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				if (this._metadataEditorContainer) {
					this._metadataEditorContainer.style.height = `${this.cell.layoutInfo.metadataHeight}px`;
					this._metadataEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.metadataHeight
					});
				}
			}

			if (state.outputTotalHeight || state.outerWidth) {
				if (this._outputEditorContainer) {
					this._outputEditorContainer.style.height = `${this.cell.layoutInfo.outputTotalHeight}px`;
					this._outputEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.outputTotalHeight
					});
				}

				if (this._outputMetadataContainer) {
					this._outputMetadataContainer.style.height = `${this.cell.layoutInfo.outputMetadataHeight}px`;
					this._outputMetadataContainer.style.top = `${this.cell.layoutInfo.outputTotalHeight - this.cell.layoutInfo.outputMetadataHeight}px`;
					this._outputMetadataEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.outputMetadataHeight
					});
				}
			}

			this.layoutNotebookCell();
		});
	}

	override dispose() {
		// The editor isn't disposed yet, it can be re-used.
		// However the model can be disposed before the editor & that causes issues.
		if (this._editor) {
			this._editor.setModel(null);
		}

		if (this._editor && this._editorViewStateChanged) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}


export class CollapsedCellOverlayWidget extends Disposable implements IDiffCellMarginOverlay {
	private readonly _nodes = DOM.h('div.diff-hidden-cells', [
		DOM.h('div.center@content', { style: { display: 'flex' } }, [
			DOM.$('a', {
				title: localize('showUnchangedCells', 'Show Unchanged Cells'),
				role: 'button',
				onclick: () => { this._action.fire(); }
			},
				...renderLabelWithIcons('$(unfold)'))]
		),
	]);

	private readonly _action = this._register(new Emitter<void>());
	public readonly onAction = this._action.event;
	constructor(
		private readonly container: HTMLElement
	) {
		super();

		this._nodes.root.style.display = 'none';
		container.appendChild(this._nodes.root);
	}

	public show() {
		this._nodes.root.style.display = 'block';
	}

	public hide() {
		this._nodes.root.style.display = 'none';
	}

	public override dispose() {
		this.hide();
		this.container.removeChild(this._nodes.root);
		DOM.reset(this._nodes.root);
		super.dispose();
	}
}

export class UnchangedCellOverlayWidget extends Disposable implements IDiffCellMarginOverlay {
	private readonly _nodes = DOM.h('div.diff-hidden-cells', [
		DOM.h('div.center@content', { style: { display: 'flex' } }, [
			DOM.$('a', {
				title: localize('hideUnchangedCells', 'Hide Unchanged Cells'),
				role: 'button',
				onclick: () => { this._action.fire(); }
			},
				...renderLabelWithIcons('$(fold)')
			),
		]
		),
	]);

	private readonly _action = this._register(new Emitter<void>());
	public readonly onAction = this._action.event;
	constructor(
		private readonly container: HTMLElement
	) {
		super();

		this._nodes.root.style.display = 'none';
		container.appendChild(this._nodes.root);
	}

	public show() {
		this._nodes.root.style.display = 'block';
	}

	public hide() {
		this._nodes.root.style.display = 'none';
	}
	public override dispose() {
		this.hide();
		this.container.removeChild(this._nodes.root);
		DOM.reset(this._nodes.root);
		super.dispose();
	}
}
