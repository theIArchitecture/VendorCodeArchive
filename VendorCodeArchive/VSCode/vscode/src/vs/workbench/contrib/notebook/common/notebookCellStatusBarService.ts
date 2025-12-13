/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookCellStatusBarItemList, INotebookCellStatusBarItemProvider } from './notebookCommon.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const INotebookCellStatusBarService = createDecorator<INotebookCellStatusBarService>('notebookCellStatusBarService');

export interface INotebookCellStatusBarService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeProviders: Event<void>;
	readonly onDidChangeItems: Event<void>;

	registerCellStatusBarItemProvider(provider: INotebookCellStatusBarItemProvider): IDisposable;

	getStatusBarItemsForCell(docUri: URI, cellIndex: number, viewType: string, token: CancellationToken): Promise<INotebookCellStatusBarItemList[]>;
}
