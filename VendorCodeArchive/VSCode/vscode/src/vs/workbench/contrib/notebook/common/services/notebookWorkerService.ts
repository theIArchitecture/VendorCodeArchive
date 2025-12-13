/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookDiffResult } from '../notebookCommon.js';

export const ID_NOTEBOOK_EDITOR_WORKER_SERVICE = 'notebookEditorWorkerService';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const INotebookEditorWorkerService = createDecorator<INotebookEditorWorkerService>(ID_NOTEBOOK_EDITOR_WORKER_SERVICE);

export interface INotebookEditorWorkerService {
	readonly _serviceBrand: undefined;

	canComputeDiff(original: URI, modified: URI): boolean;
	computeDiff(original: URI, modified: URI): Promise<INotebookDiffResult>;
	canPromptRecommendation(model: URI): Promise<boolean>;
}
