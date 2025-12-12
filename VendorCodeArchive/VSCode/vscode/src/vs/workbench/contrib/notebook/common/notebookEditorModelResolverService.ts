/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { IResolvedNotebookEditorModel, NotebookEditorModelCreationOptions } from './notebookCommon.js';
import { IReference } from '../../../../base/common/lifecycle.js';
import { Event, IWaitUntil } from '../../../../base/common/event.js';
import { NotebookTextModel } from './model/notebookTextModel.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const INotebookEditorModelResolverService = createDecorator<INotebookEditorModelResolverService>('INotebookModelResolverService');

/**
 * A notebook file can only be opened ONCE per notebook type.
 * This event fires when a file is already open as type A
 * and there is request to open it as type B. Listeners must
 * do cleanup (close editor, release references) or the request fails
 */
export interface INotebookConflictEvent extends IWaitUntil {
	resource: URI;
	viewType: string;
}

export interface IUntitledNotebookResource {
	/**
	 * Depending on the value of `untitledResource` will
	 * resolve a untitled notebook that:
	 * - gets a unique name if `undefined` (e.g. `Untitled-1')
	 * - uses the resource directly if the scheme is `untitled:`
	 * - converts any other resource scheme to `untitled:` and will
	 *   assume an associated file path
	 *
	 * Untitled notebook editors with associated path behave slightly
	 * different from other untitled editors:
	 * - they are dirty right when opening
	 * - they will not ask for a file path when saving but use the associated path
	 */
	untitledResource: URI | undefined;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface INotebookEditorModelResolverService {
	readonly _serviceBrand: undefined;

	readonly onDidSaveNotebook: Event<URI>;
	readonly onDidChangeDirty: Event<IResolvedNotebookEditorModel>;

	readonly onWillFailWithConflict: Event<INotebookConflictEvent>;

	isDirty(resource: URI): boolean;

	createUntitledNotebookTextModel(viewType: string): Promise<NotebookTextModel>;

	resolve(resource: URI, viewType?: string, creationOptions?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
	resolve(resource: IUntitledNotebookResource, viewType: string, creationOtions?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
}
