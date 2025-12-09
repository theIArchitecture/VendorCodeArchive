//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { join } from '../../../../base/common/path.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI, UriDto } from '../../../../base/common/uri.js';
import { ICommandAction } from '../../../action/common/action.js';
import { NativeParsedArgs } from '../../../environment/common/argv.js';
import { INativeWindowConfiguration } from '../../../window/common/window.js';
import { ICodeWindow, ILoadEvent, IWindowState } from '../../../window/electron-main/window.js';
import { findWindowOnFile } from '../../electron-main/windowsFinder.js';
import { toWorkspaceFolders } from '../../../workspaces/common/workspaces.js';
import { IWorkspaceIdentifier } from '../../../workspace/common/workspace.js';
import { FileAccess } from '../../../../base/common/network.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { FocusMode } from '../../../native/common/native.js';

suite('WindowsFinder', () => {

	const fixturesFolder = FileAccess.asFileUri('vs/platform/windows/test/electron-main/fixtures').fsPath;

	const testWorkspace: IWorkspaceIdentifier = {
		id: Date.now().toString(),
		configPath: URI.file(join(fixturesFolder, 'workspaces.json'))
	};

	const testWorkspaceFolders = toWorkspaceFolders([{ path: join(fixturesFolder, 'vscode_workspace_1_folder') }, { path: join(fixturesFolder, 'vscode_workspace_2_folder') }], testWorkspace.configPath, extUriBiasedIgnorePathCase);
	const localWorkspaceResolver = async (workspace: any) => { return workspace === testWorkspace ? { id: testWorkspace.id, configPath: workspace.configPath, folders: testWorkspaceFolders } : undefined; };

	function createTestCodeWindow(options: { lastFocusTime: number; openedFolderUri?: URI; openedWorkspace?: IWorkspaceIdentifier }): ICodeWindow {
		return new class implements ICodeWindow {
			onWillLoad: Event<ILoadEvent> = Event.None;
			onDidMaximize = Event.None;
			onDidUnmaximize = Event.None;
			onDidTriggerSystemContextMenu: Event<{ x: number; y: number }> = Event.None;
			onDidSignalReady: Event<void> = Event.None;
			onDidClose: Event<void> = Event.None;
			onDidDestroy: Event<void> = Event.None;
			onDidEnterFullScreen: Event<void> = Event.None;
			onDidLeaveFullScreen: Event<void> = Event.None;
			whenClosedOrLoaded: Promise<void> = Promise.resolve();
			id: number = -1;
			win: Electron.BrowserWindow = null!;
			config: INativeWindowConfiguration | undefined;
			openedWorkspace = options.openedFolderUri ? { id: '', uri: options.openedFolderUri } : options.openedWorkspace;
			backupPath?: string | undefined;
			remoteAuthority?: string | undefined;
			isExtensionDevelopmentHost = false;
			isExtensionTestHost = false;
			lastFocusTime = options.lastFocusTime;
			isFullScreen = false;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
//   3. Line 60: Error message without production error code - breaks React bundle size optimization
//   4. Line 60: Error message without production error code - breaks React bundle size optimization
//   5. Line 61: Error message without production error code - breaks React bundle size optimization
//   6. Line 61: Error message without production error code - breaks React bundle size optimization
//   7. Line 62: Error message without production error code - breaks React bundle size optimization
//   8. Line 62: Error message without production error code - breaks React bundle size optimization
//   9. Line 63: Error message without production error code - breaks React bundle size optimization
//   10. Line 63: Error message without production error code - breaks React bundle size optimization
//   11. Line 64: Error message without production error code - breaks React bundle size optimization
//   12. Line 64: Error message without production error code - breaks React bundle size optimization
//   13. Line 65: Error message without production error code - breaks React bundle size optimization
//   14. Line 65: Error message without production error code - breaks React bundle size optimization
//   15. Line 66: Error message without production error code - breaks React bundle size optimization
//   16. Line 66: Error message without production error code - breaks React bundle size optimization
//   17. Line 67: Error message without production error code - breaks React bundle size optimization
//   18. Line 67: Error message without production error code - breaks React bundle size optimization
//   19. Line 68: Error message without production error code - breaks React bundle size optimization
//   20. Line 68: Error message without production error code - breaks React bundle size optimization
//   21. Line 69: Error message without production error code - breaks React bundle size optimization
//   22. Line 69: Error message without production error code - breaks React bundle size optimization
//   23. Line 70: Error message without production error code - breaks React bundle size optimization
//   24. Line 70: Error message without production error code - breaks React bundle size optimization
//   25. Line 71: Error message without production error code - breaks React bundle size optimization
//   26. Line 71: Error message without production error code - breaks React bundle size optimization
//   27. Line 72: Error message without production error code - breaks React bundle size optimization
//   28. Line 72: Error message without production error code - breaks React bundle size optimization
//   29. Line 73: Error message without production error code - breaks React bundle size optimization
//   30. Line 73: Error message without production error code - breaks React bundle size optimization
//   31. Line 74: Error message without production error code - breaks React bundle size optimization
//   32. Line 74: Error message without production error code - breaks React bundle size optimization
//   33. Line 75: Error message without production error code - breaks React bundle size optimization
//   34. Line 75: Error message without production error code - breaks React bundle size optimization
//   35. Line 76: Error message without production error code - breaks React bundle size optimization
//   36. Line 76: Error message without production error code - breaks React bundle size optimization
//   37. Line 77: Error message without production error code - breaks React bundle size optimization
//   38. Line 77: Error message without production error code - breaks React bundle size optimization
//   39. Line 78: Error message without production error code - breaks React bundle size optimization
//   40. Line 78: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			isReady = true;

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 109: Error message without production error code - breaks React bundle size optimization
//   2. Line 109: Error message without production error code - breaks React bundle size optimization
//   3. Line 110: Error message without production error code - breaks React bundle size optimization
//   4. Line 110: Error message without production error code - breaks React bundle size optimization
//   5. Line 111: Error message without production error code - breaks React bundle size optimization
//   6. Line 111: Error message without production error code - breaks React bundle size optimization
//   7. Line 112: Error message without production error code - breaks React bundle size optimization
//   8. Line 112: Error message without production error code - breaks React bundle size optimization
//   9. Line 113: Error message without production error code - breaks React bundle size optimization
//   10. Line 113: Error message without production error code - breaks React bundle size optimization
//   11. Line 114: Error message without production error code - breaks React bundle size optimization
//   12. Line 114: Error message without production error code - breaks React bundle size optimization
//   13. Line 115: Error message without production error code - breaks React bundle size optimization
//   14. Line 115: Error message without production error code - breaks React bundle size optimization
//   15. Line 116: Error message without production error code - breaks React bundle size optimization
//   16. Line 116: Error message without production error code - breaks React bundle size optimization
//   17. Line 117: Error message without production error code - breaks React bundle size optimization
//   18. Line 117: Error message without production error code - breaks React bundle size optimization
//   19. Line 118: Error message without production error code - breaks React bundle size optimization
//   20. Line 118: Error message without production error code - breaks React bundle size optimization
//   21. Line 119: Error message without production error code - breaks React bundle size optimization
//   22. Line 119: Error message without production error code - breaks React bundle size optimization
//   23. Line 120: Error message without production error code - breaks React bundle size optimization
//   24. Line 120: Error message without production error code - breaks React bundle size optimization
//   25. Line 121: Error message without production error code - breaks React bundle size optimization
//   26. Line 121: Error message without production error code - breaks React bundle size optimization
//   27. Line 122: Error message without production error code - breaks React bundle size optimization
//   28. Line 122: Error message without production error code - breaks React bundle size optimization
//   29. Line 123: Error message without production error code - breaks React bundle size optimization
//   30. Line 123: Error message without production error code - breaks React bundle size optimization
//   31. Line 124: Error message without production error code - breaks React bundle size optimization
//   32. Line 124: Error message without production error code - breaks React bundle size optimization
//   33. Line 125: Error message without production error code - breaks React bundle size optimization
//   34. Line 125: Error message without production error code - breaks React bundle size optimization
//   35. Line 126: Error message without production error code - breaks React bundle size optimization
//   36. Line 126: Error message without production error code - breaks React bundle size optimization
//   37. Line 127: Error message without production error code - breaks React bundle size optimization
//   38. Line 127: Error message without production error code - breaks React bundle size optimization
//   39. Line 128: Error message without production error code - breaks React bundle size optimization
//   40. Line 128: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			ready(): Promise<ICodeWindow> { throw new Error('Method not implemented.'); }
			setReady(): void { throw new Error('Method not implemented.'); }
			addTabbedWindow(window: ICodeWindow): void { throw new Error('Method not implemented.'); }
			load(config: INativeWindowConfiguration, options: { isReload?: boolean }): void { throw new Error('Method not implemented.'); }
			reload(cli?: NativeParsedArgs): void { throw new Error('Method not implemented.'); }
			focus(options?: { mode: FocusMode }): void { throw new Error('Method not implemented.'); }
			close(): void { throw new Error('Method not implemented.'); }
			getBounds(): Electron.Rectangle { throw new Error('Method not implemented.'); }
			send(channel: string, ...args: any[]): void { throw new Error('Method not implemented.'); }
			sendWhenReady(channel: string, token: CancellationToken, ...args: any[]): void { throw new Error('Method not implemented.'); }
			toggleFullScreen(): void { throw new Error('Method not implemented.'); }
			setRepresentedFilename(name: string): void { throw new Error('Method not implemented.'); }
			getRepresentedFilename(): string | undefined { throw new Error('Method not implemented.'); }
			setDocumentEdited(edited: boolean): void { throw new Error('Method not implemented.'); }
			isDocumentEdited(): boolean { throw new Error('Method not implemented.'); }
			updateTouchBar(items: UriDto<ICommandAction>[][]): void { throw new Error('Method not implemented.'); }
			serializeWindowState(): IWindowState { throw new Error('Method not implemented'); }
			updateWindowControls(options: { height?: number | undefined; backgroundColor?: string | undefined; foregroundColor?: string | undefined }): void { throw new Error('Method not implemented.'); }
			notifyZoomLevel(level: number): void { throw new Error('Method not implemented.'); }
			matches(webContents: any): boolean { throw new Error('Method not implemented.'); }
			dispose(): void { }
		};
	}

	const vscodeFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'vscode_folder')) });
	const lastActiveWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 3, openedFolderUri: undefined });
	const noVscodeFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 2, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder')) });
	const windows: ICodeWindow[] = [
		vscodeFolderWindow,
		lastActiveWindow,
		noVscodeFolderWindow,
	];

	test('New window without folder when no windows exist', async () => {
		assert.strictEqual(await findWindowOnFile([], URI.file('nonexisting'), localWorkspaceResolver), undefined);
		assert.strictEqual(await findWindowOnFile([], URI.file(join(fixturesFolder, 'no_vscode_folder', 'file.txt')), localWorkspaceResolver), undefined);
	});

	test('Existing window with folder', async () => {
		assert.strictEqual(await findWindowOnFile(windows, URI.file(join(fixturesFolder, 'no_vscode_folder', 'file.txt')), localWorkspaceResolver), noVscodeFolderWindow);

		assert.strictEqual(await findWindowOnFile(windows, URI.file(join(fixturesFolder, 'vscode_folder', 'file.txt')), localWorkspaceResolver), vscodeFolderWindow);

		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'vscode_folder', 'nested_folder')) });
		assert.strictEqual(await findWindowOnFile([window], URI.file(join(fixturesFolder, 'vscode_folder', 'nested_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), window);
	});

	test('More specific existing window wins', async () => {
		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 2, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder')) });
		const nestedFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder', 'nested_folder')) });
		assert.strictEqual(await findWindowOnFile([window, nestedFolderWindow], URI.file(join(fixturesFolder, 'no_vscode_folder', 'nested_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), nestedFolderWindow);
	});

	test('Workspace folder wins', async () => {
		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedWorkspace: testWorkspace });
		assert.strictEqual(await findWindowOnFile([window], URI.file(join(fixturesFolder, 'vscode_workspace_2_folder', 'nested_vscode_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), window);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
