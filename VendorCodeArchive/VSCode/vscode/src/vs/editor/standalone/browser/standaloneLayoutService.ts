/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { coalesce } from '../../../base/common/arrays.js';
import { Event } from '../../../base/common/event.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { ILayoutOffsetInfo, ILayoutService } from '../../../platform/layout/browser/layoutService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

class StandaloneLayoutService implements ILayoutService {
	declare readonly _serviceBrand: undefined;

	readonly onDidLayoutMainContainer = Event.None;
	readonly onDidLayoutActiveContainer = Event.None;
	readonly onDidLayoutContainer = Event.None;
	readonly onDidChangeActiveContainer = Event.None;
	readonly onDidAddContainer = Event.None;

	get mainContainer(): HTMLElement {
		return this._codeEditorService.listCodeEditors().at(0)?.getContainerDomNode() ?? mainWindow.document.body;
	}

	get activeContainer(): HTMLElement {
		const activeCodeEditor = this._codeEditorService.getFocusedCodeEditor() ?? this._codeEditorService.getActiveCodeEditor();

		return activeCodeEditor?.getContainerDomNode() ?? this.mainContainer;
	}

	get mainContainerDimension(): dom.IDimension {
		return dom.getClientArea(this.mainContainer);
	}

	get activeContainerDimension() {
		return dom.getClientArea(this.activeContainer);
	}

	readonly mainContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };
	readonly activeContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };

	get containers(): Iterable<HTMLElement> {
		return coalesce(this._codeEditorService.listCodeEditors().map(codeEditor => codeEditor.getContainerDomNode()));
	}

	getContainer() {
		return this.activeContainer;
	}

	whenContainerStylesLoaded() { return undefined; }

	focus(): void {
		this._codeEditorService.getFocusedCodeEditor()?.focus();
	}

	constructor(
		@ICodeEditorService private _codeEditorService: ICodeEditorService
	) { }

}

export class EditorScopedLayoutService extends StandaloneLayoutService {
	override get mainContainer(): HTMLElement {
		return this._container;
	}
	constructor(
		private _container: HTMLElement,
		@ICodeEditorService codeEditorService: ICodeEditorService,
	) {
		super(codeEditorService);
	}
}

registerSingleton(ILayoutService, StandaloneLayoutService, InstantiationType.Delayed);
