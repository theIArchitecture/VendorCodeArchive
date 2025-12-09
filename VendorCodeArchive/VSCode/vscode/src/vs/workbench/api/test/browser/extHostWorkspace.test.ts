//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { basename } from '../../../../base/common/path.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { MainThreadWorkspace } from '../../browser/mainThreadWorkspace.js';
import { IMainContext, IWorkspaceData, MainContext, ITextSearchComplete } from '../../common/extHost.protocol.js';
import { RelativePattern } from '../../common/extHostTypes.js';
import { ExtHostWorkspace } from '../../common/extHostWorkspace.js';
import { mock } from '../../../../base/test/common/mock.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { ExtHostRpcService } from '../../common/extHostRpcService.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { IFileQueryBuilderOptions, ITextQueryBuilderOptions } from '../../../services/search/common/queryBuilder.js';
import { IPatternInfo } from '../../../services/search/common/search.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { FileSystemProviderCapabilities } from '../../../../platform/files/common/files.js';
import { nullExtensionDescription as extensionDescriptor } from '../../../services/extensions/common/extensions.js';
import { IURITransformerService } from '../../common/extHostUriTransformerService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExcludeSettingOptions } from '../../../services/search/common/searchExtTypes.js';

function createExtHostWorkspace(mainContext: IMainContext, data: IWorkspaceData, logService: ILogService): ExtHostWorkspace {
	const result = new ExtHostWorkspace(
		new ExtHostRpcService(mainContext),
		new class extends mock<IExtHostInitDataService>() { override workspace = data; },
		new class extends mock<IExtHostFileSystemInfo>() { override getCapabilities() { return isLinux ? FileSystemProviderCapabilities.PathCaseSensitive : undefined; } },
		logService,
		new class extends mock<IURITransformerService>() { }
	);
	result.$initializeWorkspace(data, true);
	return result;
}

suite('ExtHostWorkspace', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertAsRelativePath(workspace: ExtHostWorkspace, input: string, expected: string, includeWorkspace?: boolean) {
		const actual = workspace.getRelativePath(input, includeWorkspace);
		assert.strictEqual(actual, expected);
	}

	test('asRelativePath', () => {

		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/Applications/NewsWoWBot'), 0)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(ws, '/Coding/Applications/NewsWoWBot/bernd/das/brot', 'bernd/das/brot');
		assertAsRelativePath(ws, '/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart',
			'/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart');

		assertAsRelativePath(ws, '', '');
		assertAsRelativePath(ws, '/foo/bar', '/foo/bar');
		assertAsRelativePath(ws, 'in/out', 'in/out');
	});

	test('asRelativePath, same paths, #11402', function () {
		const root = '/home/aeschli/workspaces/samples/docker';
		const input = '/home/aeschli/workspaces/samples/docker';
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(ws, input, input);

		const input2 = '/home/aeschli/workspaces/samples/docker/a.file';
		assertAsRelativePath(ws, input2, 'a.file');
	});

	test('asRelativePath, no workspace', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), null!, new NullLogService());
		assertAsRelativePath(ws, '', '');
		assertAsRelativePath(ws, '/foo/bar', '/foo/bar');
	});

	test('asRelativePath, multiple folders', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());
		assertAsRelativePath(ws, '/Coding/One/file.txt', 'One/file.txt');
		assertAsRelativePath(ws, '/Coding/Two/files/out.txt', 'Two/files/out.txt');
		assertAsRelativePath(ws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
	});

	test('slightly inconsistent behaviour of asRelativePath and getWorkspaceFolder, #31553', function () {
		const mrws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'One/file.txt');
		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'One/file.txt', true);
		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'file.txt', false);
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'Two/files/out.txt');
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'Two/files/out.txt', true);
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'files/out.txt', false);
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', true);
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', false);

		const srws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0)], name: 'Test' }, new NullLogService());
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'file.txt');
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'file.txt', false);
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'One/file.txt', true);
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', true);
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', false);
	});

	test('getPath, legacy', function () {
		let ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), null!, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), undefined!, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.file('Folder'), 0), aWorkspaceFolderData(URI.file('Another/Folder'), 1)] }, new NullLogService());
		assert.strictEqual(ws.getPath()!.replace(/\\/g, '/'), '/Folder');

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.file('/Folder'), 0)] }, new NullLogService());
		assert.strictEqual(ws.getPath()!.replace(/\\/g, '/'), '/Folder');
	});

	test('WorkspaceFolder has name and index', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());

		const [one, two] = ws.getWorkspaceFolders()!;

		assert.strictEqual(one.name, 'One');
		assert.strictEqual(one.index, 0);
		assert.strictEqual(two.name, 'Two');
		assert.strictEqual(two.index, 1);
	});

	test('getContainingWorkspaceFolder', () => {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), {
			id: 'foo',
			name: 'Test',
			folders: [
				aWorkspaceFolderData(URI.file('/Coding/One'), 0),
				aWorkspaceFolderData(URI.file('/Coding/Two'), 1),
				aWorkspaceFolderData(URI.file('/Coding/Two/Nested'), 2)
			]
		}, new NullLogService());

		let folder = ws.getWorkspaceFolder(URI.file('/foo/bar'));
		assert.strictEqual(folder, undefined);

		folder = ws.getWorkspaceFolder(URI.file('/Coding/One/file/path.txt'))!;
		assert.strictEqual(folder.name, 'One');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/file/path.txt'))!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nest'))!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/file'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/f'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested'), true)!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/'), true)!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two'), true)!;
		assert.strictEqual(folder, undefined);

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two'), false)!;
		assert.strictEqual(folder.name, 'Two');
	});

	test('Multiroot change event should have a delta, #29641', function (done) {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		let sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.deepStrictEqual(e.removed, []);
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar2');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar2'), 1)] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.removed.length, 2);
				assert.strictEqual(e.removed[0].uri.toString(), 'foo:bar');
				assert.strictEqual(e.removed[1].uri.toString(), 'foo:bar2');

				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar3');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0)] });
		sub.dispose();
		finish();
	});

	test('Multiroot change keeps existing workspaces live', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }, new NullLogService());

		const firstFolder = ws.getWorkspaceFolders()![0];
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar2'), 0), aWorkspaceFolderData(URI.parse('foo:bar'), 1, 'renamed')] });

		assert.strictEqual(ws.getWorkspaceFolders()![1], firstFolder);
		assert.strictEqual(firstFolder.index, 1);
		assert.strictEqual(firstFolder.name, 'renamed');

		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar2'), 1), aWorkspaceFolderData(URI.parse('foo:bar'), 2)] });
		assert.strictEqual(ws.getWorkspaceFolders()![2], firstFolder);
		assert.strictEqual(firstFolder.index, 2);

		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0)] });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar'), 1)] });

		assert.notStrictEqual(firstFolder, ws.workspace!.folders[0]);
	});

	test('updateWorkspaceFolders - invalid arguments', function () {
		let ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, null!, null!));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 1));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 1, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, -1, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, -1, -1));

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }, new NullLogService());

		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 1, 1));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 1, asUpdateWorkspaceFolderData(URI.parse('foo:bar'))));
	});

	test('updateWorkspaceFolders - valid arguments', function (done) {
		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		const protocol: IMainContext = {
			getProxy: () => { return undefined!; },
			set: () => { return undefined!; },
			dispose: () => { },
			assertRegistered: () => { },
			drain: () => { return undefined!; },
		};

		const ws = createExtHostWorkspace(protocol, { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		//
		// Add one folder
		//
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar'))));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(1, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());

		const firstAddedFolder = ws.getWorkspaceFolders()![0];

		let gotEvent = false;
		let sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar');
				assert.strictEqual(e.added[0], firstAddedFolder); // verify object is still live
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live

		//
		// Add two more folders
		//
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 1, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar1')), asUpdateWorkspaceFolderData(URI.parse('foo:bar2'))));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 477: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 560: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 561: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 584: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 585: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 620: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 645: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(3, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());
		assert.strictEqual(ws.workspace!.folders[2].uri.toString(), URI.parse('foo:bar2').toString());

		const secondAddedFolder = ws.getWorkspaceFolders()![1];
		const thirdAddedFolder = ws.getWorkspaceFolders()![2];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 2);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar1');
				assert.strictEqual(e.added[1].uri.toString(), 'foo:bar2');
				assert.strictEqual(e.added[0], secondAddedFolder);
				assert.strictEqual(e.added[1], thirdAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar1'), 1), aWorkspaceFolderData(URI.parse('foo:bar2'), 2)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![2], thirdAddedFolder); // verify object is still live

		//
		// Remove one folder
		//
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 2, 1));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 516: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 585: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 700: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 725: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 746: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 770: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 840: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.strictEqual(e.removed.length, 1);
				assert.strictEqual(e.removed[0], thirdAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar1'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live

		//
		// Rename folder
		//
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar'), 'renamed 1'), asUpdateWorkspaceFolderData(URI.parse('foo:bar1'), 'renamed 2')));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 645: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 683: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 715: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 716: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 827: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 971: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1003: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1040: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1041: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1075: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1147: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1148: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1149: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1255: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1256: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1257: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());
		assert.strictEqual(ws.workspace!.folders[0].name, 'renamed 1');
		assert.strictEqual(ws.workspace!.folders[1].name, 'renamed 2');
		assert.strictEqual(ws.getWorkspaceFolders()![0].name, 'renamed 1');
		assert.strictEqual(ws.getWorkspaceFolders()![1].name, 'renamed 2');

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.strictEqual(e.removed.length, 0);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0, 'renamed 1'), aWorkspaceFolderData(URI.parse('foo:bar1'), 1, 'renamed 2')] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 560: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 744: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 745: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 805: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 901: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 940: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 941: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 952: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 999: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1000: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1001: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1048: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1049: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1097: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1098: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1099: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1146: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1147: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1148: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1195: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1196: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1197: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1333: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1342: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1343: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1344: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1391: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1392: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1430: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1431: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1440: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1441: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1442: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1480: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1489: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1490: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1491: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1528: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1529: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1538: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1539: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1540: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1577: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1578: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1587: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1588: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1589: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1626: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1627: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1636: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1637: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1638: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(ws.workspace!.folders[0].name, 'renamed 1');
		assert.strictEqual(ws.workspace!.folders[1].name, 'renamed 2');
		assert.strictEqual(ws.getWorkspaceFolders()![0].name, 'renamed 1');
		assert.strictEqual(ws.getWorkspaceFolders()![1].name, 'renamed 2');

		//
		// Add and remove folders
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar3')), asUpdateWorkspaceFolderData(URI.parse('foo:bar4'))));
		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar3').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar4').toString());

		const fourthAddedFolder = ws.getWorkspaceFolders()![0];
		const fifthAddedFolder = ws.getWorkspaceFolders()![1];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 2);
				assert.strictEqual(e.added[0], fourthAddedFolder);
				assert.strictEqual(e.added[1], fifthAddedFolder);
				assert.strictEqual(e.removed.length, 2);
				assert.strictEqual(e.removed[0], firstAddedFolder);
				assert.strictEqual(e.removed[1], secondAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar4'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], fourthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fifthAddedFolder); // verify object is still live

		//
		// Swap folders
		//
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar4')), asUpdateWorkspaceFolderData(URI.parse('foo:bar3'))));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 613: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 672: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 673: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 734: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 912: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1033: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1092: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1212: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1213: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1272: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1273: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1274: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1333: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1334: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1392: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1394: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1452: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1453: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1454: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1514: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1572: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1573: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1632: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1634: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1692: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1693: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1694: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1752: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1754: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1813: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1814: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1872: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1873: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1874: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1932: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1933: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar4').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar3').toString());

		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 0);
				assert.strictEqual(e.removed.length, 0);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar4'), 0), aWorkspaceFolderData(URI.parse('foo:bar3'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live
		assert.strictEqual(fifthAddedFolder.index, 0);
		assert.strictEqual(fourthAddedFolder.index, 1);

		//
		// Add one folder after the other without waiting for confirmation (not supported currently)
		//

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 497: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 2, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar5'))));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 585: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 668: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 742: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 814: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1099: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1101: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1172: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1173: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1315: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1317: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1318: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1389: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1390: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1460: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1461: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1462: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1531: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1532: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1533: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1534: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1603: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1604: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1675: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1676: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1677: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1678: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1748: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1749: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1750: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1820: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1821: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1822: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1894: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1963: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1964: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1965: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2035: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2036: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2037: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2038: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2107: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2108: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2109: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2110: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2179: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2180: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2181: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2251: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2252: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(3, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar4').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar3').toString());
		assert.strictEqual(ws.workspace!.folders[2].uri.toString(), URI.parse('foo:bar5').toString());

		const sixthAddedFolder = ws.getWorkspaceFolders()![2];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0], sixthAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({
			id: 'foo', name: 'Test', folders: [
				aWorkspaceFolderData(URI.parse('foo:bar4'), 0),
				aWorkspaceFolderData(URI.parse('foo:bar3'), 1),
				aWorkspaceFolderData(URI.parse('foo:bar5'), 2)
			]
		}); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();

		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![2], sixthAddedFolder); // verify object is still live

		finish();
	});

	test('Multiroot change event is immutable', function (done) {
		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());
		const sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.throws(() => {
					(<any>e).added = [];
				});
				// assert.throws(() => {
				// 	(<any>e.added)[0] = null;
				// });
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [] });
		sub.dispose();
		finish();
	});

	test('`vscode.workspace.getWorkspaceFolder(file)` don\'t return workspace folder when file open from command line. #36221', function () {
		if (isWindows) {

			const ws = createExtHostWorkspace(new TestRPCProtocol(), {
				id: 'foo', name: 'Test', folders: [
					aWorkspaceFolderData(URI.file('c:/Users/marek/Desktop/vsc_test/'), 0)
				]
			}, new NullLogService());

			assert.ok(ws.getWorkspaceFolder(URI.file('c:/Users/marek/Desktop/vsc_test/a.txt')));
			assert.ok(ws.getWorkspaceFolder(URI.file('C:/Users/marek/Desktop/vsc_test/b.txt')));
		}
	});

	function aWorkspaceFolderData(uri: URI, index: number, name: string = ''): IWorkspaceFolderData {
		return {
			uri,
			index,
			name: name || basename(uri.path)
		};
	}

	function asUpdateWorkspaceFolderData(uri: URI, name?: string): { uri: URI; name?: string } {
		return { uri, name };
	}

	suite('findFiles -', function () {
		test('string include', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'foo');
					assert.strictEqual(_includeFolder, null);
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.maxResults, 10);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles('foo', undefined, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		function testFindFilesInclude(pattern: RelativePattern) {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.deepStrictEqual(_includeFolder ? URI.from(_includeFolder).toJSON() : null, URI.file('/other/folder').toJSON());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles(pattern, undefined, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		}

		test('RelativePattern include (string)', () => {
			return testFindFilesInclude(new RelativePattern('/other/folder', 'glob/**'));
		});

		test('RelativePattern include (URI)', () => {
			return testFindFilesInclude(new RelativePattern(URI.file('/other/folder'), 'glob/**'));
		});

		test('no excludes', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.deepStrictEqual(URI.revive(_includeFolder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, true);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles(new RelativePattern('/other/folder', 'glob/**'), null, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('with cancelled token', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

			const token = CancellationToken.Cancelled;
			return ws.findFiles(new RelativePattern('/other/folder', 'glob/**'), null, 10, new ExtensionIdentifier('test'), token).then(() => {
				assert(!mainThreadCalled, '!mainThreadCalled');
			});
		});

		test('RelativePattern exclude', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // Note that the base portion is ignored, see #52651
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles('', new RelativePattern(root, 'glob/**'), 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});
	});

	suite('findFiles2 -', function () {
		test('string include', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'foo');
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(_includeFolder, null);
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.maxResults, 10);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2(['foo'], { maxResults: 10, useExcludeSettings: ExcludeSettingOptions.FilesExclude }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		function testFindFiles2Include(pattern: RelativePattern[]) {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'glob/**');
					assert.strictEqual(options.includePattern, undefined);
					assert.deepStrictEqual(_includeFolder ? URI.from(_includeFolder).toJSON() : null, URI.file('/other/folder').toJSON());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2(pattern, { maxResults: 10 }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		}

		test('RelativePattern include (string)', () => {
			return testFindFiles2Include([new RelativePattern('/other/folder', 'glob/**')]);
		});

		test('RelativePattern include (URI)', () => {
			return testFindFiles2Include([new RelativePattern(URI.file('/other/folder'), 'glob/**')]);
		});

		test('no excludes', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'glob/**');
					assert.strictEqual(options.includePattern, undefined);
					assert.deepStrictEqual(URI.revive(_includeFolder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([new RelativePattern('/other/folder', 'glob/**')], {}, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('with cancelled token', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

			const token = CancellationToken.Cancelled;
			return ws.findFiles2([new RelativePattern('/other/folder', 'glob/**')], {}, new ExtensionIdentifier('test'), token).then(() => {
				assert(!mainThreadCalled, '!mainThreadCalled');
			});
		});

		test('RelativePattern exclude', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // Note that the base portion is ignored, see #52651
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { exclude: [new RelativePattern(root, 'glob/**')] }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});
		test('useIgnoreFiles', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.disregardIgnoreFiles, false);
					assert.strictEqual(options.disregardGlobalIgnoreFiles, false);
					assert.strictEqual(options.disregardParentIgnoreFiles, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { useIgnoreFiles: { local: true, parent: true, global: true } }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('use symlinks', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.ignoreSymlinks, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { followSymlinks: true }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		// todo: add tests with multiple filePatterns and excludes

	});

	suite('findTextInFiles -', function () {
		test('no include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, {}, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('string include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, '**/files');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { include: '**/files' }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('RelativePattern include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(URI.revive(folder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { include: new RelativePattern('/other/folder', 'glob/**') }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('with cancelled token', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			const token = CancellationToken.Cancelled;
			await ws.findTextInFiles({ pattern: 'foo' }, {}, () => { }, new ExtensionIdentifier('test'), token);
			assert(!mainThreadCalled, '!mainThreadCalled');
		});

		test('RelativePattern exclude', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // exclude folder is ignored...
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { exclude: new RelativePattern('/other/folder', 'glob/**') }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});
	});

	suite('findTextInFiles2 -', function () {
		test('no include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, {}, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('string include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, '**/files');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { include: ['**/files'] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('RelativePattern include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(URI.revive(folder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { include: [new RelativePattern('/other/folder', 'glob/**')] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('with cancelled token', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			const token = CancellationToken.Cancelled;
			await (ws.findTextInFiles2({ pattern: 'foo' }, undefined, new ExtensionIdentifier('test'), token)).complete;
			assert(!mainThreadCalled, '!mainThreadCalled');
		});

		test('RelativePattern exclude', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // exclude folder is ignored...
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { exclude: [new RelativePattern('/other/folder', 'glob/**')] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		// TODO: test multiple includes/excludess
	});
});
