//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

export interface IMergeRegion {
	name: string;
	header: vscode.Range;
	content: vscode.Range;
	decoratorContent: vscode.Range;
}

export const enum CommitType {
	Current,
	Incoming,
	Both
}

export interface IExtensionConfiguration {
	enableCodeLens: boolean;
	enableDecorations: boolean;
	enableEditorOverview: boolean;
}

export interface IDocumentMergeConflict extends IDocumentMergeConflictDescriptor {
	commitEdit(type: CommitType, editor: vscode.TextEditor, edit?: vscode.TextEditorEdit): Thenable<boolean>;
	applyEdit(type: CommitType, document: vscode.TextDocument, edit: { replace(range: vscode.Range, newText: string): void }): void;
}

export interface IDocumentMergeConflictDescriptor {
	range: vscode.Range;
	current: IMergeRegion;
	incoming: IMergeRegion;
	commonAncestors: IMergeRegion[];
	splitter: vscode.Range;
}

export interface IDocumentMergeConflictTracker {
	getConflicts(document: vscode.TextDocument): PromiseLike<IDocumentMergeConflict[]>;
	isPending(document: vscode.TextDocument): boolean;
	forget(document: vscode.TextDocument): void;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export interface IDocumentMergeConflictTrackerService {
	createTracker(origin: string): IDocumentMergeConflictTracker;
	forget(document: vscode.TextDocument): void;
}
