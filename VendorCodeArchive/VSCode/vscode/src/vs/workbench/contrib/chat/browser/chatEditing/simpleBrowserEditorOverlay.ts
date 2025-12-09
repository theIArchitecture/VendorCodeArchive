//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../media/simpleBrowserOverlay.css';
import { combinedDisposable, DisposableMap, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, derivedOpts, observableFromEvent, observableSignalFromEvent } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { localize } from '../../../../../nls.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { EditorGroupView } from '../../../../browser/parts/editor/editorGroupView.js';
import { Event } from '../../../../../base/common/event.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { isEqual, joinPath } from '../../../../../base/common/resources.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IChatWidgetService, showChatView } from '../chat.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { Button, ButtonWithDropdown } from '../../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { addDisposableListener } from '../../../../../base/browser/dom.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { cleanupOldImages, createFileForMedia } from '../imageUtils.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IChatRequestVariableEntry } from '../../common/chatVariableEntries.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IBrowserElementsService } from '../../../../services/browserElements/browser/browserElementsService.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IAction, toAction } from '../../../../../base/common/actions.js';
import { BrowserType } from '../../../../../platform/browserElements/common/browserElements.js';

class SimpleBrowserOverlayWidget {

	private readonly _domNode: HTMLElement;

	private readonly imagesFolder: URI;

	private readonly _showStore = new DisposableStore();

	private _timeout: Timeout | undefined = undefined;

	private _activeBrowserType: BrowserType | undefined = undefined;

	constructor(
		private readonly _editor: IEditorGroup,
		private readonly _container: HTMLElement,
		@IHostService private readonly _hostService: IHostService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IViewsService private readonly _viewService: IViewsService,
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IPreferencesService private readonly _preferencesService: IPreferencesService,
		@IBrowserElementsService private readonly _browserElementsService: IBrowserElementsService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		this._showStore.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('chat.sendElementsToChat.enabled')) {
				if (this.configurationService.getValue('chat.sendElementsToChat.enabled')) {
					this.showElement(this._domNode);
				} else {
					this.hideElement(this._domNode);
				}
			}
		}));

		this.imagesFolder = joinPath(this.environmentService.workspaceStorageHome, 'vscode-chat-images');
		cleanupOldImages(this.fileService, this.logService, this.imagesFolder);

		this._domNode = document.createElement('div');
		this._domNode.className = 'element-selection-message';

		const message = document.createElement('span');
		const startSelectionMessage = localize('elementSelectionMessage', 'Add element to chat');
		message.textContent = startSelectionMessage;
		this._domNode.appendChild(message);

		let cts: CancellationTokenSource;
		const actions: IAction[] = [];
		actions.push(
			toAction({
				id: 'singleSelection',
				label: localize('selectElementDropdown', 'Select an Element'),
				enabled: true,
				run: async () => { await startElementSelection(); }
			}),
			toAction({
				id: 'continuousSelection',
				label: localize('continuousSelectionDropdown', 'Continuous Selection'),
				enabled: true,
				run: async () => {
					this._editor.focus();
					cts = new CancellationTokenSource();
					// start selection
					message.textContent = localize('elementSelectionInProgress', 'Selecting element...');
					this.hideElement(startButton.element);
					this.showElement(cancelButton.element);
					cancelButton.label = localize('finishSelectionLabel', 'Done');
					while (!cts.token.isCancellationRequested) {
						try {
							await this.addElementToChat(cts);
						} catch (err) {
							this.logService.error('Failed to select this element.', err);
							cts.cancel();
							break;
						}
					}

					// stop selection
					message.textContent = localize('elementSelectionComplete', 'Element added to chat');
					finishedSelecting();
				}
			}));

		const startButton = this._showStore.add(new ButtonWithDropdown(this._domNode, {
			actions: actions,
			addPrimaryActionToDropdown: false,
			contextMenuProvider: this.contextMenuService,
			supportShortLabel: true,
			title: localize('selectAnElement', 'Click to select an element.'),
			supportIcons: true,
			...defaultButtonStyles
		}));

		startButton.primaryButton.label = localize('startSelection', 'Start');
		startButton.element.classList.add('element-selection-start');

		const cancelButton = this._showStore.add(new Button(this._domNode, { ...defaultButtonStyles, supportIcons: true, title: localize('cancelSelection', 'Click to cancel selection.') }));
		cancelButton.element.className = 'element-selection-cancel hidden';
		const cancelButtonLabel = localize('cancelSelectionLabel', 'Cancel');
		cancelButton.label = cancelButtonLabel;

		const configure = this._showStore.add(new Button(this._domNode, { supportIcons: true, title: localize('chat.configureElements', "Configure Attachments Sent") }));
		configure.icon = Codicon.gear;

		const collapseOverlay = this._showStore.add(new Button(this._domNode, { supportIcons: true, title: localize('chat.hideOverlay', "Collapse Overlay") }));
		collapseOverlay.icon = Codicon.chevronRight;

		const nextSelection = this._showStore.add(new Button(this._domNode, { supportIcons: true, title: localize('chat.nextSelection', "Select Again") }));
		nextSelection.icon = Codicon.close;
		nextSelection.element.classList.add('hidden');

		// shown if the overlay is collapsed
		const expandOverlay = this._showStore.add(new Button(this._domNode, { supportIcons: true, title: localize('chat.expandOverlay', "Expand Overlay") }));
		expandOverlay.icon = Codicon.layout;
		const expandContainer = document.createElement('div');
		expandContainer.className = 'element-expand-container hidden';
		expandContainer.appendChild(expandOverlay.element);
		this._container.appendChild(expandContainer);

		const resetButtons = () => {
			this.hideElement(nextSelection.element);
			this.showElement(startButton.element);
			this.showElement(collapseOverlay.element);
		};

		const finishedSelecting = () => {
			// stop selection
			this.hideElement(cancelButton.element);
			cancelButton.label = cancelButtonLabel;
			this.hideElement(collapseOverlay.element);
			this.showElement(nextSelection.element);

			// wait 3 seconds before showing the start button again unless cancelled out.
			this._timeout = setTimeout(() => {
				message.textContent = startSelectionMessage;
				resetButtons();
			}, 3000);
		};

		const startElementSelection = async () => {
			cts = new CancellationTokenSource();
			this._editor.focus();

			// start selection
			message.textContent = localize('elementSelectionInProgress', 'Selecting element...');
			this.hideElement(startButton.element);
			this.showElement(cancelButton.element);
			await this.addElementToChat(cts);

			// stop selection
			message.textContent = localize('elementSelectionComplete', 'Element added to chat');
			finishedSelecting();
		};

		this._showStore.add(addDisposableListener(startButton.primaryButton.element, 'click', async () => {
			await startElementSelection();
		}));

		this._showStore.add(addDisposableListener(cancelButton.element, 'click', () => {
			cts.cancel();
			message.textContent = localize('elementCancelMessage', 'Selection canceled');
			finishedSelecting();
		}));

		this._showStore.add(addDisposableListener(collapseOverlay.element, 'click', () => {
			this.hideElement(this._domNode);
			this.showElement(expandContainer);
		}));

		this._showStore.add(addDisposableListener(expandOverlay.element, 'click', () => {
			this.showElement(this._domNode);
			this.hideElement(expandContainer);
		}));

		this._showStore.add(addDisposableListener(nextSelection.element, 'click', () => {
			clearTimeout(this._timeout);
			message.textContent = startSelectionMessage;
			resetButtons();
		}));

		this._showStore.add(addDisposableListener(configure.element, 'click', () => {
			this._preferencesService.openSettings({ jsonEditor: false, query: '@id:chat.sendElementsToChat.enabled,chat.sendElementsToChat.attachCSS,chat.sendElementsToChat.attachImages' });
		}));
	}

	setActiveBrowserType(type: BrowserType | undefined) {
		this._activeBrowserType = type;
	}

	hideElement(element: HTMLElement) {
		if (element.classList.contains('hidden')) {
			return;
		}
		element.classList.add('hidden');
	}

	showElement(element: HTMLElement) {
		if (!element.classList.contains('hidden')) {
			return;
		}
		element.classList.remove('hidden');
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 251: Error message without production error code - breaks React bundle size optimization
//   3. Line 251: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	async addElementToChat(cts: CancellationTokenSource) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 264: Error message without production error code - breaks React bundle size optimization
//   3. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 275: Error message without production error code - breaks React bundle size optimization
//   3. Line 275: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 286: Error message without production error code - breaks React bundle size optimization
//   3. Line 286: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 297: Error message without production error code - breaks React bundle size optimization
//   3. Line 297: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 308: Error message without production error code - breaks React bundle size optimization
//   3. Line 308: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 319: Error message without production error code - breaks React bundle size optimization
//   3. Line 319: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Error message without production error code - breaks React bundle size optimization
//   3. Line 330: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 341: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Error message without production error code - breaks React bundle size optimization
//   3. Line 352: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 363: Error message without production error code - breaks React bundle size optimization
//   3. Line 363: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 374: Error message without production error code - breaks React bundle size optimization
//   3. Line 374: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 385: Error message without production error code - breaks React bundle size optimization
//   3. Line 385: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 396: Error message without production error code - breaks React bundle size optimization
//   3. Line 396: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 407: Error message without production error code - breaks React bundle size optimization
//   3. Line 407: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Error message without production error code - breaks React bundle size optimization
//   3. Line 418: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Error message without production error code - breaks React bundle size optimization
//   3. Line 429: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 440: Error message without production error code - breaks React bundle size optimization
//   3. Line 440: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 451: Error message without production error code - breaks React bundle size optimization
//   3. Line 451: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 462: Error message without production error code - breaks React bundle size optimization
//   3. Line 462: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 473: Error message without production error code - breaks React bundle size optimization
//   3. Line 473: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 484: Error message without production error code - breaks React bundle size optimization
//   3. Line 484: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 495: Error message without production error code - breaks React bundle size optimization
//   3. Line 495: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 506: Error message without production error code - breaks React bundle size optimization
//   3. Line 506: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 517: Error message without production error code - breaks React bundle size optimization
//   3. Line 517: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 528: Error message without production error code - breaks React bundle size optimization
//   3. Line 528: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 539: Error message without production error code - breaks React bundle size optimization
//   3. Line 539: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const editorContainer = this._container.querySelector('.editor-container') as HTMLDivElement;
		const editorContainerPosition = editorContainer ? editorContainer.getBoundingClientRect() : this._container.getBoundingClientRect();

		const elementData = await this._browserElementsService.getElementData(editorContainerPosition, cts.token, this._activeBrowserType);
		if (!elementData) {
			throw new Error('Element data not found');
		}
		const bounds = elementData.bounds;
		const toAttach: IChatRequestVariableEntry[] = [];

		const widget = await showChatView(this._viewService) ?? this._chatWidgetService.lastFocusedWidget;
		let value = 'Attached HTML and CSS Context\n\n' + elementData.outerHTML;
		if (this.configurationService.getValue('chat.sendElementsToChat.attachCSS')) {
			value += '\n\n' + elementData.computedStyle;
		}
		toAttach.push({
			id: 'element-' + Date.now(),
			name: this.getDisplayNameFromOuterHTML(elementData.outerHTML),
			fullName: this.getDisplayNameFromOuterHTML(elementData.outerHTML),
			value: value,
			kind: 'element',
			icon: ThemeIcon.fromId(Codicon.layout.id),
		});

		if (this.configurationService.getValue('chat.sendElementsToChat.attachImages')) {
			// remove container so we don't block anything on screenshot
			this._domNode.style.display = 'none';

			// Wait 1 extra frame to make sure overlay is gone
			await new Promise(resolve => setTimeout(resolve, 100));

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 279: Error message without production error code - breaks React bundle size optimization
//   2. Line 279: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			const screenshot = await this._hostService.getScreenshot(bounds);
			if (!screenshot) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 302: Error message without production error code - breaks React bundle size optimization
//   2. Line 302: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Screenshot failed');
			}
			const fileReference = await createFileForMedia(this.fileService, this.imagesFolder, screenshot.buffer, 'image/png');
			toAttach.push({
				id: 'element-screenshot-' + Date.now(),
				name: 'Element Screenshot',
				fullName: 'Element Screenshot',
				kind: 'image',
				value: screenshot.buffer,
				references: fileReference ? [{ reference: fileReference, kind: 'reference' }] : [],
			});

			this._domNode.style.display = '';
		}

		widget?.attachmentModel?.addContext(...toAttach);
	}


	getDisplayNameFromOuterHTML(outerHTML: string): string {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 301: Error message without production error code - breaks React bundle size optimization
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const firstElementMatch = outerHTML.match(/^<(\w+)([^>]*?)>/);
		if (!firstElementMatch) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 334: Error message without production error code - breaks React bundle size optimization
//   2. Line 334: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No outer element found');
		}

		const tagName = firstElementMatch[1];
		const idMatch = firstElementMatch[2].match(/\s+id\s*=\s*["']([^"']+)["']/i);
		const id = idMatch ? `#${idMatch[1]}` : '';
		const classMatch = firstElementMatch[2].match(/\s+class\s*=\s*["']([^"']+)["']/i);
		const className = classMatch ? `.${classMatch[1].replace(/\s+/g, '.')}` : '';
		return `${tagName}${id}${className}`;
	}

	dispose() {
		this._showStore.dispose();
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}
}

class SimpleBrowserOverlayController {

	private readonly _store = new DisposableStore();

	private readonly _domNode = document.createElement('div');

	constructor(
		container: HTMLElement,
		group: IEditorGroup,
		@IInstantiationService instaService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IBrowserElementsService private readonly _browserElementsService: IBrowserElementsService,
	) {

		if (!this.configurationService.getValue('chat.sendElementsToChat.enabled')) {
			return;
		}

		this._domNode.classList.add('chat-simple-browser-overlay');
		this._domNode.style.position = 'absolute';
		this._domNode.style.bottom = `5px`;
		this._domNode.style.right = `5px`;
		this._domNode.style.zIndex = `100`;

		const widget = instaService.createInstance(SimpleBrowserOverlayWidget, group, container);
		this._domNode.appendChild(widget.getDomNode());
		this._store.add(toDisposable(() => this._domNode.remove()));
		this._store.add(widget);

		const connectingWebviewElement = document.createElement('div');
		connectingWebviewElement.className = 'connecting-webview-element';


		const getActiveBrowserType = () => {
			const editor = group.activeEditorPane;
			const isSimpleBrowser = editor?.input.editorId === 'mainThreadWebview-simpleBrowser.view';
			const isLiveServer = editor?.input.editorId === 'mainThreadWebview-browserPreview';
			return isSimpleBrowser ? BrowserType.SimpleBrowser : isLiveServer ? BrowserType.LiveServer : undefined;
		};

		let cts = new CancellationTokenSource();
		const show = async () => {
			// Show the connecting indicator while establishing the session
			connectingWebviewElement.textContent = localize('connectingWebviewElement', 'Connecting to webview...');
			if (!container.contains(connectingWebviewElement)) {
				container.appendChild(connectingWebviewElement);
			}

			cts = new CancellationTokenSource();
			const activeBrowserType = getActiveBrowserType();
			if (activeBrowserType) {
				try {
					await this._browserElementsService.startDebugSession(cts.token, activeBrowserType);
				} catch (error) {
					connectingWebviewElement.textContent = localize('reopenErrorWebviewElement', 'Please reopen the preview.');
					return;
				}
			}

			if (!container.contains(this._domNode)) {
				container.appendChild(this._domNode);
			}
			connectingWebviewElement.remove();
		};

		const hide = () => {
			if (container.contains(this._domNode)) {
				cts.cancel();
				this._domNode.remove();
			}
			connectingWebviewElement.remove();
		};

		const activeEditorSignal = observableSignalFromEvent(this, Event.any(group.onDidActiveEditorChange, group.onDidModelChange));

		const activeUriObs = derivedOpts({ equalsFn: isEqual }, r => {

			activeEditorSignal.read(r); // signal

			const editor = group.activeEditorPane;

			const activeBrowser = getActiveBrowserType();
			widget.setActiveBrowserType(activeBrowser);

			if (activeBrowser) {
				const uri = EditorResourceAccessor.getOriginalUri(editor?.input, { supportSideBySide: SideBySideEditor.PRIMARY });
				return uri;
			}
			return undefined;
		});

		this._store.add(autorun(r => {

			const data = activeUriObs.read(r);

			if (!data) {
				hide();
				return;
			}

			show();
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}

export class SimpleBrowserOverlay implements IWorkbenchContribution {

	static readonly ID = 'chat.simpleBrowser.overlay';

	private readonly _store = new DisposableStore();

	constructor(
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const editorGroups = observableFromEvent(
			this,
			Event.any(editorGroupsService.onDidAddGroup, editorGroupsService.onDidRemoveGroup),
			() => editorGroupsService.groups
		);

		const overlayWidgets = new DisposableMap<IEditorGroup>();

		this._store.add(autorun(r => {

			const toDelete = new Set(overlayWidgets.keys());
			const groups = editorGroups.read(r);


			for (const group of groups) {

				if (!(group instanceof EditorGroupView)) {
					// TODO@jrieken better with https://github.com/microsoft/vscode/tree/ben/layout-group-container
					continue;
				}

				toDelete.delete(group); // we keep the widget for this group!

				if (!overlayWidgets.has(group)) {

					const scopedInstaService = instantiationService.createChild(
						new ServiceCollection([IContextKeyService, group.scopedContextKeyService])
					);

					const container = group.element;


					const ctrl = scopedInstaService.createInstance(SimpleBrowserOverlayController, container, group);
					overlayWidgets.set(group, combinedDisposable(ctrl, scopedInstaService));
				}
			}

			for (const group of toDelete) {
				overlayWidgets.deleteAndDispose(group);
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}
