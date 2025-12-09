//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OpenerService } from '../../../browser/services/openerService.js';
import { TestCodeEditorService } from '../editorTestServices.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { NullCommandService } from '../../../../platform/commands/test/common/nullCommandService.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { matchesScheme, matchesSomeScheme } from '../../../../base/common/network.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';

suite('OpenerService', function () {
	const themeService = new TestThemeService();
	const editorService = new TestCodeEditorService(themeService);

	let lastCommand: { id: string; args: any[] } | undefined;

	const commandService = new (class implements ICommandService {
		declare readonly _serviceBrand: undefined;
		onWillExecuteCommand = () => Disposable.None;
		onDidExecuteCommand = () => Disposable.None;
		executeCommand(id: string, ...args: any[]): Promise<any> {
			lastCommand = { id, args };
			return Promise.resolve(undefined);
		}
	})();

	setup(function () {
		lastCommand = undefined;
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('delegate to editorService, scheme:///fff', async function () {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 42: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 64: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const openerService = new OpenerService(editorService, NullCommandService);
		await openerService.open(URI.parse('another:///somepath'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection, undefined);
	});

	test('delegate to editorService, scheme:///fff#L123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('another:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);

		await openerService.open(URI.parse('another:///somepath#L23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to editorService, scheme:///fff#123,123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('file:///somepath#23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to commandsService, command:someid', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));

		assert.strictEqual(lastCommand, undefined);
		await openerService.open(URI.parse('command:' + id));
		assert.strictEqual(lastCommand, undefined);
	});


	test('delegate to commandsService, command:someid, 2', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 120: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		await openerService.open(URI.parse('command:' + id).with({ query: '\"123\"' }), { allowCommands: true });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], '123');

		await openerService.open(URI.parse('command:' + id), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 0);

		await openerService.open(URI.parse('command:' + id).with({ query: '123' }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], 123);

		await openerService.open(URI.parse('command:' + id).with({ query: JSON.stringify([12, true]) }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 2);
		assert.strictEqual(lastCommand!.args[0], 12);
		assert.strictEqual(lastCommand!.args[1], true);
	});

	test('links are protected by validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(false) }));

		const httpResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		const httpsResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		assert.strictEqual(httpResult, false);
		assert.strictEqual(httpsResult, false);
	});

	test('links validated by validators go to openers', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(true) }));

		let openCount = 0;
		store.add(openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		}));

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
	});

	test('links aren\'t manipulated before being passed to validator: PR #118226', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({
			shouldOpen: (resource) => {
				// We don't want it to convert strings into URIs
				assert.strictEqual(resource instanceof URI, false);
				return Promise.resolve(false);
			}
		}));
		await openerService.open('https://wwww.microsoft.com');
		await openerService.open('https://www.microsoft.com??params=CountryCode%3DUSA%26Name%3Dvscode"');
	});

	test('links validated by multiple validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(true);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 2);
	});

	test('links invalidated by first validator do not continue validating', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(false);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 0);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 0);
	});

	test('matchesScheme', function () {
		assert.ok(matchesScheme('https://microsoft.com', 'https'));
		assert.ok(matchesScheme('http://microsoft.com', 'http'));
		assert.ok(matchesScheme('hTTPs://microsoft.com', 'https'));
		assert.ok(matchesScheme('httP://microsoft.com', 'http'));
		assert.ok(matchesScheme(URI.parse('https://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('http://microsoft.com'), 'http'));
		assert.ok(matchesScheme(URI.parse('hTTPs://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('httP://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('https://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('htt://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('z://microsoft.com'), 'http'));
	});

	test('matchesSomeScheme', function () {
		assert.ok(matchesSomeScheme('https://microsoft.com', 'http', 'https'));
		assert.ok(matchesSomeScheme('http://microsoft.com', 'http', 'https'));
		assert.ok(!matchesSomeScheme('x://microsoft.com', 'http', 'https'));
	});

	test('resolveExternalUri', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		try {
			await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
			assert.fail('Should not reach here');
		} catch {
			// OK
		}

		const disposable = openerService.registerExternalUriResolver({
			async resolveExternalUri(uri) {
				return { resolved: uri, dispose() { } };
			}
		});

		const result = await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
		assert.deepStrictEqual(result.resolved.toString(), 'file:///Users/user/folder');
		disposable.dispose();
	});

	test('vscode.open command can\'t open HTTP URL with hash (#) in it [extension development] #140907', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		const actual: string[] = [];

		openerService.setDefaultExternalOpener({
			async openExternal(href) {
				actual.push(href);
				return true;
			}
		});

		const href = 'https://gitlab.com/viktomas/test-project/merge_requests/new?merge_request%5Bsource_branch%5D=test-%23-hash';
		const uri = URI.parse(href);

		assert.ok(await openerService.open(uri));
		assert.ok(await openerService.open(href));

		assert.deepStrictEqual(actual, [
			encodeURI(uri.toString(true)), // BAD, the encoded # (%23) is double encoded to %2523 (% is double encoded)
			href // good
		]);
	});
});
