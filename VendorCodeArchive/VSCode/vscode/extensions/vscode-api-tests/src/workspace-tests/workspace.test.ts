//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { join } from 'path';
import * as vscode from 'vscode';
import { closeAllEditors, pathEquals } from '../utils';

suite('vscode API - workspace', () => {

	teardown(closeAllEditors);

	test('rootPath', () => {
		assert.ok(pathEquals(vscode.workspace.rootPath!, join(__dirname, '../../testWorkspace')));
	});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 20: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 24: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	test('workspaceFile', () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 32: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 36: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(pathEquals(vscode.workspace.workspaceFile!.fsPath, join(__dirname, '../../testworkspace.code-workspace')));
	});

	test('workspaceFolders', () => {
		assert.strictEqual(vscode.workspace.workspaceFolders!.length, 2);
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![0].uri.fsPath, join(__dirname, '../../testWorkspace')));
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![1].uri.fsPath, join(__dirname, '../../testWorkspace2')));
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![1].name, 'Test Workspace 2'));
	});

	test('getWorkspaceFolder', () => {
		const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(join(__dirname, '../../testWorkspace2/far.js')));
		assert.ok(!!folder);

		if (folder) {
			assert.ok(pathEquals(folder.uri.fsPath, join(__dirname, '../../testWorkspace2')));
		}
	});
});
