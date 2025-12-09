//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow } from '../../../../../base/browser/window.js';
import { createDecorator, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookEditor, INotebookEditorCreationOptions } from '../notebookBrowser.js';
import { Event } from '../../../../../base/common/event.js';
import { Dimension } from '../../../../../base/browser/dom.js';
import { NotebookEditorWidget } from '../notebookEditorWidget.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 20: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 20: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { URI } from '../../../../../base/common/uri.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 66: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 66: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 71: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 82: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 88: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 88: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 93: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 99: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 99: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const INotebookEditorService = createDecorator<INotebookEditorService>('INotebookEditorWidgetService');

export interface IBorrowValue<T> {
	readonly value: T | undefined;
}

export interface INotebookEditorService {
	_serviceBrand: undefined;

	retrieveWidget(accessor: ServicesAccessor, groupId: number, input: { resource: URI; typeId: string }, creationOptions?: INotebookEditorCreationOptions, dimension?: Dimension, codeWindow?: CodeWindow): IBorrowValue<INotebookEditor>;

	retrieveExistingWidgetFromURI(resource: URI): IBorrowValue<NotebookEditorWidget> | undefined;
	retrieveAllExistingWidgets(): IBorrowValue<NotebookEditorWidget>[];
	onDidAddNotebookEditor: Event<INotebookEditor>;
	onDidRemoveNotebookEditor: Event<INotebookEditor>;
	addNotebookEditor(editor: INotebookEditor): void;
	removeNotebookEditor(editor: INotebookEditor): void;
	getNotebookEditor(editorId: string): INotebookEditor | undefined;
	listNotebookEditors(): readonly INotebookEditor[];
	updateReplContextKey(uri: string): void;
}
