//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { joinLines } from './util';

const testFileA = workspaceFile('a.md');

const debug = false;

function debugLog(...args: any[]) {
	if (debug) {
		console.log(...args);
	}
}

function workspaceFile(...segments: string[]) {
	return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, ...segments);
}

async function getLinksForFile(file: vscode.Uri): Promise<vscode.DocumentLink[]> {
	debugLog('getting links', file.toString(), Date.now());
	const r = (await vscode.commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', file, /*linkResolveCount*/ 100))!;
	debugLog('got links', file.toString(), Date.now());
	return r;
}

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('Markdown Document links', () => {

	setup(async () => {
		// the tests make the assumption that link providers are already registered
		await vscode.extensions.getExtension('vscode.markdown-language-features')!.activate();
	});

	teardown(async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Should navigate to markdown file', async () => {
		await withFileContents(testFileA, '[b](b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file with leading ./', async () => {
		await withFileContents(testFileA, '[b](./b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file with leading /', async () => {
		await withFileContents(testFileA, '[b](./b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file without file extension', async () => {
		await withFileContents(testFileA, '[b](b)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file in directory', async () => {
		await withFileContents(testFileA, '[b](sub/c)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
	});

	test('Should navigate to fragment by title in file', async () => {
		await withFileContents(testFileA, '[b](sub/c#second)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});

	test('Should navigate to fragment by line', async () => {
		await withFileContents(testFileA, '[b](sub/c#L2)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});

	test('Should navigate to line number within non-md file', async () => {
		await withFileContents(testFileA, '[b](sub/foo.txt#L3)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'foo.txt'));
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
	});

	test('Should navigate to fragment within current file', async () => {
		await withFileContents(testFileA, joinLines(
			'[](a#header)',
			'[](#header)',
			'# Header'));

		const links = await getLinksForFile(testFileA);
		{
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			await executeLink(links[0]);
			assertActiveDocumentUri(workspaceFile('a.md'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
		}
		{
			await executeLink(links[1]);
			assertActiveDocumentUri(workspaceFile('a.md'));
			assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
		}
	});

	test.skip('Should navigate to fragment within current untitled file', async () => { // TODO: skip for now for ls migration
		const testFile = workspaceFile('x.md').with({ scheme: 'untitled' });
		await withFileContents(testFile, joinLines(
			'[](#second)',
			'# Second'));

		const [link] = await getLinksForFile(testFile);
		await executeLink(link);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assertActiveDocumentUri(testFile);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});
});


function assertActiveDocumentUri(expectedUri: vscode.Uri) {
	assert.strictEqual(
		vscode.window.activeTextEditor!.document.uri.fsPath,
		expectedUri.fsPath
	);
}

async function withFileContents(file: vscode.Uri, contents: string): Promise<void> {
	debugLog('openTextDocument', file.toString(), Date.now());
	const document = await vscode.workspace.openTextDocument(file);
	debugLog('showTextDocument', file.toString(), Date.now());
	const editor = await vscode.window.showTextDocument(document);
	debugLog('editTextDocument', file.toString(), Date.now());
	await editor.edit(edit => {
		edit.replace(new vscode.Range(0, 0, 1000, 0), contents);
	});
	debugLog('opened done', vscode.window.activeTextEditor?.document.toString(), Date.now());
}

async function executeLink(link: vscode.DocumentLink) {
	debugLog('executingLink', link.target?.toString(), Date.now());

	await vscode.commands.executeCommand('vscode.open', link.target!);
	debugLog('executedLink', vscode.window.activeTextEditor?.document.toString(), Date.now());
}
