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

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
//   3. Line 158: Error message without production error code - breaks React bundle size optimization
//   4. Line 158: Error message without production error code - breaks React bundle size optimization
//   5. Line 159: Error message without production error code - breaks React bundle size optimization
//   6. Line 159: Error message without production error code - breaks React bundle size optimization
//   7. Line 160: Error message without production error code - breaks React bundle size optimization
//   8. Line 160: Error message without production error code - breaks React bundle size optimization
//   9. Line 161: Error message without production error code - breaks React bundle size optimization
//   10. Line 161: Error message without production error code - breaks React bundle size optimization
//   11. Line 162: Error message without production error code - breaks React bundle size optimization
//   12. Line 162: Error message without production error code - breaks React bundle size optimization
//   13. Line 163: Error message without production error code - breaks React bundle size optimization
//   14. Line 163: Error message without production error code - breaks React bundle size optimization
//   15. Line 164: Error message without production error code - breaks React bundle size optimization
//   16. Line 164: Error message without production error code - breaks React bundle size optimization
//   17. Line 165: Error message without production error code - breaks React bundle size optimization
//   18. Line 165: Error message without production error code - breaks React bundle size optimization
//   19. Line 166: Error message without production error code - breaks React bundle size optimization
//   20. Line 166: Error message without production error code - breaks React bundle size optimization
//   21. Line 167: Error message without production error code - breaks React bundle size optimization
//   22. Line 167: Error message without production error code - breaks React bundle size optimization
//   23. Line 168: Error message without production error code - breaks React bundle size optimization
//   24. Line 168: Error message without production error code - breaks React bundle size optimization
//   25. Line 169: Error message without production error code - breaks React bundle size optimization
//   26. Line 169: Error message without production error code - breaks React bundle size optimization
//   27. Line 170: Error message without production error code - breaks React bundle size optimization
//   28. Line 170: Error message without production error code - breaks React bundle size optimization
//   29. Line 171: Error message without production error code - breaks React bundle size optimization
//   30. Line 171: Error message without production error code - breaks React bundle size optimization
//   31. Line 172: Error message without production error code - breaks React bundle size optimization
//   32. Line 172: Error message without production error code - breaks React bundle size optimization
//   33. Line 173: Error message without production error code - breaks React bundle size optimization
//   34. Line 173: Error message without production error code - breaks React bundle size optimization
//   35. Line 174: Error message without production error code - breaks React bundle size optimization
//   36. Line 174: Error message without production error code - breaks React bundle size optimization
//   37. Line 175: Error message without production error code - breaks React bundle size optimization
//   38. Line 175: Error message without production error code - breaks React bundle size optimization
//   39. Line 176: Error message without production error code - breaks React bundle size optimization
//   40. Line 176: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 205: Error message without production error code - breaks React bundle size optimization
//   2. Line 205: Error message without production error code - breaks React bundle size optimization
//   3. Line 206: Error message without production error code - breaks React bundle size optimization
//   4. Line 206: Error message without production error code - breaks React bundle size optimization
//   5. Line 207: Error message without production error code - breaks React bundle size optimization
//   6. Line 207: Error message without production error code - breaks React bundle size optimization
//   7. Line 208: Error message without production error code - breaks React bundle size optimization
//   8. Line 208: Error message without production error code - breaks React bundle size optimization
//   9. Line 209: Error message without production error code - breaks React bundle size optimization
//   10. Line 209: Error message without production error code - breaks React bundle size optimization
//   11. Line 210: Error message without production error code - breaks React bundle size optimization
//   12. Line 210: Error message without production error code - breaks React bundle size optimization
//   13. Line 211: Error message without production error code - breaks React bundle size optimization
//   14. Line 211: Error message without production error code - breaks React bundle size optimization
//   15. Line 212: Error message without production error code - breaks React bundle size optimization
//   16. Line 212: Error message without production error code - breaks React bundle size optimization
//   17. Line 213: Error message without production error code - breaks React bundle size optimization
//   18. Line 213: Error message without production error code - breaks React bundle size optimization
//   19. Line 214: Error message without production error code - breaks React bundle size optimization
//   20. Line 214: Error message without production error code - breaks React bundle size optimization
//   21. Line 215: Error message without production error code - breaks React bundle size optimization
//   22. Line 215: Error message without production error code - breaks React bundle size optimization
//   23. Line 216: Error message without production error code - breaks React bundle size optimization
//   24. Line 216: Error message without production error code - breaks React bundle size optimization
//   25. Line 217: Error message without production error code - breaks React bundle size optimization
//   26. Line 217: Error message without production error code - breaks React bundle size optimization
//   27. Line 218: Error message without production error code - breaks React bundle size optimization
//   28. Line 218: Error message without production error code - breaks React bundle size optimization
//   29. Line 219: Error message without production error code - breaks React bundle size optimization
//   30. Line 219: Error message without production error code - breaks React bundle size optimization
//   31. Line 220: Error message without production error code - breaks React bundle size optimization
//   32. Line 220: Error message without production error code - breaks React bundle size optimization
//   33. Line 221: Error message without production error code - breaks React bundle size optimization
//   34. Line 221: Error message without production error code - breaks React bundle size optimization
//   35. Line 222: Error message without production error code - breaks React bundle size optimization
//   36. Line 222: Error message without production error code - breaks React bundle size optimization
//   37. Line 223: Error message without production error code - breaks React bundle size optimization
//   38. Line 223: Error message without production error code - breaks React bundle size optimization
//   39. Line 224: Error message without production error code - breaks React bundle size optimization
//   40. Line 224: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 253: Error message without production error code - breaks React bundle size optimization
//   2. Line 253: Error message without production error code - breaks React bundle size optimization
//   3. Line 254: Error message without production error code - breaks React bundle size optimization
//   4. Line 254: Error message without production error code - breaks React bundle size optimization
//   5. Line 255: Error message without production error code - breaks React bundle size optimization
//   6. Line 255: Error message without production error code - breaks React bundle size optimization
//   7. Line 256: Error message without production error code - breaks React bundle size optimization
//   8. Line 256: Error message without production error code - breaks React bundle size optimization
//   9. Line 257: Error message without production error code - breaks React bundle size optimization
//   10. Line 257: Error message without production error code - breaks React bundle size optimization
//   11. Line 258: Error message without production error code - breaks React bundle size optimization
//   12. Line 258: Error message without production error code - breaks React bundle size optimization
//   13. Line 259: Error message without production error code - breaks React bundle size optimization
//   14. Line 259: Error message without production error code - breaks React bundle size optimization
//   15. Line 260: Error message without production error code - breaks React bundle size optimization
//   16. Line 260: Error message without production error code - breaks React bundle size optimization
//   17. Line 261: Error message without production error code - breaks React bundle size optimization
//   18. Line 261: Error message without production error code - breaks React bundle size optimization
//   19. Line 262: Error message without production error code - breaks React bundle size optimization
//   20. Line 262: Error message without production error code - breaks React bundle size optimization
//   21. Line 263: Error message without production error code - breaks React bundle size optimization
//   22. Line 263: Error message without production error code - breaks React bundle size optimization
//   23. Line 264: Error message without production error code - breaks React bundle size optimization
//   24. Line 264: Error message without production error code - breaks React bundle size optimization
//   25. Line 265: Error message without production error code - breaks React bundle size optimization
//   26. Line 265: Error message without production error code - breaks React bundle size optimization
//   27. Line 266: Error message without production error code - breaks React bundle size optimization
//   28. Line 266: Error message without production error code - breaks React bundle size optimization
//   29. Line 267: Error message without production error code - breaks React bundle size optimization
//   30. Line 267: Error message without production error code - breaks React bundle size optimization
//   31. Line 268: Error message without production error code - breaks React bundle size optimization
//   32. Line 268: Error message without production error code - breaks React bundle size optimization
//   33. Line 269: Error message without production error code - breaks React bundle size optimization
//   34. Line 269: Error message without production error code - breaks React bundle size optimization
//   35. Line 270: Error message without production error code - breaks React bundle size optimization
//   36. Line 270: Error message without production error code - breaks React bundle size optimization
//   37. Line 271: Error message without production error code - breaks React bundle size optimization
//   38. Line 271: Error message without production error code - breaks React bundle size optimization
//   39. Line 272: Error message without production error code - breaks React bundle size optimization
//   40. Line 272: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 301: Error message without production error code - breaks React bundle size optimization
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
//   3. Line 302: Error message without production error code - breaks React bundle size optimization
//   4. Line 302: Error message without production error code - breaks React bundle size optimization
//   5. Line 303: Error message without production error code - breaks React bundle size optimization
//   6. Line 303: Error message without production error code - breaks React bundle size optimization
//   7. Line 304: Error message without production error code - breaks React bundle size optimization
//   8. Line 304: Error message without production error code - breaks React bundle size optimization
//   9. Line 305: Error message without production error code - breaks React bundle size optimization
//   10. Line 305: Error message without production error code - breaks React bundle size optimization
//   11. Line 306: Error message without production error code - breaks React bundle size optimization
//   12. Line 306: Error message without production error code - breaks React bundle size optimization
//   13. Line 307: Error message without production error code - breaks React bundle size optimization
//   14. Line 307: Error message without production error code - breaks React bundle size optimization
//   15. Line 308: Error message without production error code - breaks React bundle size optimization
//   16. Line 308: Error message without production error code - breaks React bundle size optimization
//   17. Line 309: Error message without production error code - breaks React bundle size optimization
//   18. Line 309: Error message without production error code - breaks React bundle size optimization
//   19. Line 310: Error message without production error code - breaks React bundle size optimization
//   20. Line 310: Error message without production error code - breaks React bundle size optimization
//   21. Line 311: Error message without production error code - breaks React bundle size optimization
//   22. Line 311: Error message without production error code - breaks React bundle size optimization
//   23. Line 312: Error message without production error code - breaks React bundle size optimization
//   24. Line 312: Error message without production error code - breaks React bundle size optimization
//   25. Line 313: Error message without production error code - breaks React bundle size optimization
//   26. Line 313: Error message without production error code - breaks React bundle size optimization
//   27. Line 314: Error message without production error code - breaks React bundle size optimization
//   28. Line 314: Error message without production error code - breaks React bundle size optimization
//   29. Line 315: Error message without production error code - breaks React bundle size optimization
//   30. Line 315: Error message without production error code - breaks React bundle size optimization
//   31. Line 316: Error message without production error code - breaks React bundle size optimization
//   32. Line 316: Error message without production error code - breaks React bundle size optimization
//   33. Line 317: Error message without production error code - breaks React bundle size optimization
//   34. Line 317: Error message without production error code - breaks React bundle size optimization
//   35. Line 318: Error message without production error code - breaks React bundle size optimization
//   36. Line 318: Error message without production error code - breaks React bundle size optimization
//   37. Line 319: Error message without production error code - breaks React bundle size optimization
//   38. Line 319: Error message without production error code - breaks React bundle size optimization
//   39. Line 320: Error message without production error code - breaks React bundle size optimization
//   40. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 349: Error message without production error code - breaks React bundle size optimization
//   2. Line 349: Error message without production error code - breaks React bundle size optimization
//   3. Line 350: Error message without production error code - breaks React bundle size optimization
//   4. Line 350: Error message without production error code - breaks React bundle size optimization
//   5. Line 351: Error message without production error code - breaks React bundle size optimization
//   6. Line 351: Error message without production error code - breaks React bundle size optimization
//   7. Line 352: Error message without production error code - breaks React bundle size optimization
//   8. Line 352: Error message without production error code - breaks React bundle size optimization
//   9. Line 353: Error message without production error code - breaks React bundle size optimization
//   10. Line 353: Error message without production error code - breaks React bundle size optimization
//   11. Line 354: Error message without production error code - breaks React bundle size optimization
//   12. Line 354: Error message without production error code - breaks React bundle size optimization
//   13. Line 355: Error message without production error code - breaks React bundle size optimization
//   14. Line 355: Error message without production error code - breaks React bundle size optimization
//   15. Line 356: Error message without production error code - breaks React bundle size optimization
//   16. Line 356: Error message without production error code - breaks React bundle size optimization
//   17. Line 357: Error message without production error code - breaks React bundle size optimization
//   18. Line 357: Error message without production error code - breaks React bundle size optimization
//   19. Line 358: Error message without production error code - breaks React bundle size optimization
//   20. Line 358: Error message without production error code - breaks React bundle size optimization
//   21. Line 359: Error message without production error code - breaks React bundle size optimization
//   22. Line 359: Error message without production error code - breaks React bundle size optimization
//   23. Line 360: Error message without production error code - breaks React bundle size optimization
//   24. Line 360: Error message without production error code - breaks React bundle size optimization
//   25. Line 361: Error message without production error code - breaks React bundle size optimization
//   26. Line 361: Error message without production error code - breaks React bundle size optimization
//   27. Line 362: Error message without production error code - breaks React bundle size optimization
//   28. Line 362: Error message without production error code - breaks React bundle size optimization
//   29. Line 363: Error message without production error code - breaks React bundle size optimization
//   30. Line 363: Error message without production error code - breaks React bundle size optimization
//   31. Line 364: Error message without production error code - breaks React bundle size optimization
//   32. Line 364: Error message without production error code - breaks React bundle size optimization
//   33. Line 365: Error message without production error code - breaks React bundle size optimization
//   34. Line 365: Error message without production error code - breaks React bundle size optimization
//   35. Line 366: Error message without production error code - breaks React bundle size optimization
//   36. Line 366: Error message without production error code - breaks React bundle size optimization
//   37. Line 367: Error message without production error code - breaks React bundle size optimization
//   38. Line 367: Error message without production error code - breaks React bundle size optimization
//   39. Line 368: Error message without production error code - breaks React bundle size optimization
//   40. Line 368: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 397: Error message without production error code - breaks React bundle size optimization
//   2. Line 397: Error message without production error code - breaks React bundle size optimization
//   3. Line 398: Error message without production error code - breaks React bundle size optimization
//   4. Line 398: Error message without production error code - breaks React bundle size optimization
//   5. Line 399: Error message without production error code - breaks React bundle size optimization
//   6. Line 399: Error message without production error code - breaks React bundle size optimization
//   7. Line 400: Error message without production error code - breaks React bundle size optimization
//   8. Line 400: Error message without production error code - breaks React bundle size optimization
//   9. Line 401: Error message without production error code - breaks React bundle size optimization
//   10. Line 401: Error message without production error code - breaks React bundle size optimization
//   11. Line 402: Error message without production error code - breaks React bundle size optimization
//   12. Line 402: Error message without production error code - breaks React bundle size optimization
//   13. Line 403: Error message without production error code - breaks React bundle size optimization
//   14. Line 403: Error message without production error code - breaks React bundle size optimization
//   15. Line 404: Error message without production error code - breaks React bundle size optimization
//   16. Line 404: Error message without production error code - breaks React bundle size optimization
//   17. Line 405: Error message without production error code - breaks React bundle size optimization
//   18. Line 405: Error message without production error code - breaks React bundle size optimization
//   19. Line 406: Error message without production error code - breaks React bundle size optimization
//   20. Line 406: Error message without production error code - breaks React bundle size optimization
//   21. Line 407: Error message without production error code - breaks React bundle size optimization
//   22. Line 407: Error message without production error code - breaks React bundle size optimization
//   23. Line 408: Error message without production error code - breaks React bundle size optimization
//   24. Line 408: Error message without production error code - breaks React bundle size optimization
//   25. Line 409: Error message without production error code - breaks React bundle size optimization
//   26. Line 409: Error message without production error code - breaks React bundle size optimization
//   27. Line 410: Error message without production error code - breaks React bundle size optimization
//   28. Line 410: Error message without production error code - breaks React bundle size optimization
//   29. Line 411: Error message without production error code - breaks React bundle size optimization
//   30. Line 411: Error message without production error code - breaks React bundle size optimization
//   31. Line 412: Error message without production error code - breaks React bundle size optimization
//   32. Line 412: Error message without production error code - breaks React bundle size optimization
//   33. Line 413: Error message without production error code - breaks React bundle size optimization
//   34. Line 413: Error message without production error code - breaks React bundle size optimization
//   35. Line 414: Error message without production error code - breaks React bundle size optimization
//   36. Line 414: Error message without production error code - breaks React bundle size optimization
//   37. Line 415: Error message without production error code - breaks React bundle size optimization
//   38. Line 415: Error message without production error code - breaks React bundle size optimization
//   39. Line 416: Error message without production error code - breaks React bundle size optimization
//   40. Line 416: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 445: Error message without production error code - breaks React bundle size optimization
//   2. Line 445: Error message without production error code - breaks React bundle size optimization
//   3. Line 446: Error message without production error code - breaks React bundle size optimization
//   4. Line 446: Error message without production error code - breaks React bundle size optimization
//   5. Line 447: Error message without production error code - breaks React bundle size optimization
//   6. Line 447: Error message without production error code - breaks React bundle size optimization
//   7. Line 448: Error message without production error code - breaks React bundle size optimization
//   8. Line 448: Error message without production error code - breaks React bundle size optimization
//   9. Line 449: Error message without production error code - breaks React bundle size optimization
//   10. Line 449: Error message without production error code - breaks React bundle size optimization
//   11. Line 450: Error message without production error code - breaks React bundle size optimization
//   12. Line 450: Error message without production error code - breaks React bundle size optimization
//   13. Line 451: Error message without production error code - breaks React bundle size optimization
//   14. Line 451: Error message without production error code - breaks React bundle size optimization
//   15. Line 452: Error message without production error code - breaks React bundle size optimization
//   16. Line 452: Error message without production error code - breaks React bundle size optimization
//   17. Line 453: Error message without production error code - breaks React bundle size optimization
//   18. Line 453: Error message without production error code - breaks React bundle size optimization
//   19. Line 454: Error message without production error code - breaks React bundle size optimization
//   20. Line 454: Error message without production error code - breaks React bundle size optimization
//   21. Line 455: Error message without production error code - breaks React bundle size optimization
//   22. Line 455: Error message without production error code - breaks React bundle size optimization
//   23. Line 456: Error message without production error code - breaks React bundle size optimization
//   24. Line 456: Error message without production error code - breaks React bundle size optimization
//   25. Line 457: Error message without production error code - breaks React bundle size optimization
//   26. Line 457: Error message without production error code - breaks React bundle size optimization
//   27. Line 458: Error message without production error code - breaks React bundle size optimization
//   28. Line 458: Error message without production error code - breaks React bundle size optimization
//   29. Line 459: Error message without production error code - breaks React bundle size optimization
//   30. Line 459: Error message without production error code - breaks React bundle size optimization
//   31. Line 460: Error message without production error code - breaks React bundle size optimization
//   32. Line 460: Error message without production error code - breaks React bundle size optimization
//   33. Line 461: Error message without production error code - breaks React bundle size optimization
//   34. Line 461: Error message without production error code - breaks React bundle size optimization
//   35. Line 462: Error message without production error code - breaks React bundle size optimization
//   36. Line 462: Error message without production error code - breaks React bundle size optimization
//   37. Line 463: Error message without production error code - breaks React bundle size optimization
//   38. Line 463: Error message without production error code - breaks React bundle size optimization
//   39. Line 464: Error message without production error code - breaks React bundle size optimization
//   40. Line 464: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 493: Error message without production error code - breaks React bundle size optimization
//   2. Line 493: Error message without production error code - breaks React bundle size optimization
//   3. Line 494: Error message without production error code - breaks React bundle size optimization
//   4. Line 494: Error message without production error code - breaks React bundle size optimization
//   5. Line 495: Error message without production error code - breaks React bundle size optimization
//   6. Line 495: Error message without production error code - breaks React bundle size optimization
//   7. Line 496: Error message without production error code - breaks React bundle size optimization
//   8. Line 496: Error message without production error code - breaks React bundle size optimization
//   9. Line 497: Error message without production error code - breaks React bundle size optimization
//   10. Line 497: Error message without production error code - breaks React bundle size optimization
//   11. Line 498: Error message without production error code - breaks React bundle size optimization
//   12. Line 498: Error message without production error code - breaks React bundle size optimization
//   13. Line 499: Error message without production error code - breaks React bundle size optimization
//   14. Line 499: Error message without production error code - breaks React bundle size optimization
//   15. Line 500: Error message without production error code - breaks React bundle size optimization
//   16. Line 500: Error message without production error code - breaks React bundle size optimization
//   17. Line 501: Error message without production error code - breaks React bundle size optimization
//   18. Line 501: Error message without production error code - breaks React bundle size optimization
//   19. Line 502: Error message without production error code - breaks React bundle size optimization
//   20. Line 502: Error message without production error code - breaks React bundle size optimization
//   21. Line 503: Error message without production error code - breaks React bundle size optimization
//   22. Line 503: Error message without production error code - breaks React bundle size optimization
//   23. Line 504: Error message without production error code - breaks React bundle size optimization
//   24. Line 504: Error message without production error code - breaks React bundle size optimization
//   25. Line 505: Error message without production error code - breaks React bundle size optimization
//   26. Line 505: Error message without production error code - breaks React bundle size optimization
//   27. Line 506: Error message without production error code - breaks React bundle size optimization
//   28. Line 506: Error message without production error code - breaks React bundle size optimization
//   29. Line 507: Error message without production error code - breaks React bundle size optimization
//   30. Line 507: Error message without production error code - breaks React bundle size optimization
//   31. Line 508: Error message without production error code - breaks React bundle size optimization
//   32. Line 508: Error message without production error code - breaks React bundle size optimization
//   33. Line 509: Error message without production error code - breaks React bundle size optimization
//   34. Line 509: Error message without production error code - breaks React bundle size optimization
//   35. Line 510: Error message without production error code - breaks React bundle size optimization
//   36. Line 510: Error message without production error code - breaks React bundle size optimization
//   37. Line 511: Error message without production error code - breaks React bundle size optimization
//   38. Line 511: Error message without production error code - breaks React bundle size optimization
//   39. Line 512: Error message without production error code - breaks React bundle size optimization
//   40. Line 512: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 541: Error message without production error code - breaks React bundle size optimization
//   2. Line 541: Error message without production error code - breaks React bundle size optimization
//   3. Line 542: Error message without production error code - breaks React bundle size optimization
//   4. Line 542: Error message without production error code - breaks React bundle size optimization
//   5. Line 543: Error message without production error code - breaks React bundle size optimization
//   6. Line 543: Error message without production error code - breaks React bundle size optimization
//   7. Line 544: Error message without production error code - breaks React bundle size optimization
//   8. Line 544: Error message without production error code - breaks React bundle size optimization
//   9. Line 545: Error message without production error code - breaks React bundle size optimization
//   10. Line 545: Error message without production error code - breaks React bundle size optimization
//   11. Line 546: Error message without production error code - breaks React bundle size optimization
//   12. Line 546: Error message without production error code - breaks React bundle size optimization
//   13. Line 547: Error message without production error code - breaks React bundle size optimization
//   14. Line 547: Error message without production error code - breaks React bundle size optimization
//   15. Line 548: Error message without production error code - breaks React bundle size optimization
//   16. Line 548: Error message without production error code - breaks React bundle size optimization
//   17. Line 549: Error message without production error code - breaks React bundle size optimization
//   18. Line 549: Error message without production error code - breaks React bundle size optimization
//   19. Line 550: Error message without production error code - breaks React bundle size optimization
//   20. Line 550: Error message without production error code - breaks React bundle size optimization
//   21. Line 551: Error message without production error code - breaks React bundle size optimization
//   22. Line 551: Error message without production error code - breaks React bundle size optimization
//   23. Line 552: Error message without production error code - breaks React bundle size optimization
//   24. Line 552: Error message without production error code - breaks React bundle size optimization
//   25. Line 553: Error message without production error code - breaks React bundle size optimization
//   26. Line 553: Error message without production error code - breaks React bundle size optimization
//   27. Line 554: Error message without production error code - breaks React bundle size optimization
//   28. Line 554: Error message without production error code - breaks React bundle size optimization
//   29. Line 555: Error message without production error code - breaks React bundle size optimization
//   30. Line 555: Error message without production error code - breaks React bundle size optimization
//   31. Line 556: Error message without production error code - breaks React bundle size optimization
//   32. Line 556: Error message without production error code - breaks React bundle size optimization
//   33. Line 557: Error message without production error code - breaks React bundle size optimization
//   34. Line 557: Error message without production error code - breaks React bundle size optimization
//   35. Line 558: Error message without production error code - breaks React bundle size optimization
//   36. Line 558: Error message without production error code - breaks React bundle size optimization
//   37. Line 559: Error message without production error code - breaks React bundle size optimization
//   38. Line 559: Error message without production error code - breaks React bundle size optimization
//   39. Line 560: Error message without production error code - breaks React bundle size optimization
//   40. Line 560: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 589: Error message without production error code - breaks React bundle size optimization
//   2. Line 589: Error message without production error code - breaks React bundle size optimization
//   3. Line 590: Error message without production error code - breaks React bundle size optimization
//   4. Line 590: Error message without production error code - breaks React bundle size optimization
//   5. Line 591: Error message without production error code - breaks React bundle size optimization
//   6. Line 591: Error message without production error code - breaks React bundle size optimization
//   7. Line 592: Error message without production error code - breaks React bundle size optimization
//   8. Line 592: Error message without production error code - breaks React bundle size optimization
//   9. Line 593: Error message without production error code - breaks React bundle size optimization
//   10. Line 593: Error message without production error code - breaks React bundle size optimization
//   11. Line 594: Error message without production error code - breaks React bundle size optimization
//   12. Line 594: Error message without production error code - breaks React bundle size optimization
//   13. Line 595: Error message without production error code - breaks React bundle size optimization
//   14. Line 595: Error message without production error code - breaks React bundle size optimization
//   15. Line 596: Error message without production error code - breaks React bundle size optimization
//   16. Line 596: Error message without production error code - breaks React bundle size optimization
//   17. Line 597: Error message without production error code - breaks React bundle size optimization
//   18. Line 597: Error message without production error code - breaks React bundle size optimization
//   19. Line 598: Error message without production error code - breaks React bundle size optimization
//   20. Line 598: Error message without production error code - breaks React bundle size optimization
//   21. Line 599: Error message without production error code - breaks React bundle size optimization
//   22. Line 599: Error message without production error code - breaks React bundle size optimization
//   23. Line 600: Error message without production error code - breaks React bundle size optimization
//   24. Line 600: Error message without production error code - breaks React bundle size optimization
//   25. Line 601: Error message without production error code - breaks React bundle size optimization
//   26. Line 601: Error message without production error code - breaks React bundle size optimization
//   27. Line 602: Error message without production error code - breaks React bundle size optimization
//   28. Line 602: Error message without production error code - breaks React bundle size optimization
//   29. Line 603: Error message without production error code - breaks React bundle size optimization
//   30. Line 603: Error message without production error code - breaks React bundle size optimization
//   31. Line 604: Error message without production error code - breaks React bundle size optimization
//   32. Line 604: Error message without production error code - breaks React bundle size optimization
//   33. Line 605: Error message without production error code - breaks React bundle size optimization
//   34. Line 605: Error message without production error code - breaks React bundle size optimization
//   35. Line 606: Error message without production error code - breaks React bundle size optimization
//   36. Line 606: Error message without production error code - breaks React bundle size optimization
//   37. Line 607: Error message without production error code - breaks React bundle size optimization
//   38. Line 607: Error message without production error code - breaks React bundle size optimization
//   39. Line 608: Error message without production error code - breaks React bundle size optimization
//   40. Line 608: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 637: Error message without production error code - breaks React bundle size optimization
//   2. Line 637: Error message without production error code - breaks React bundle size optimization
//   3. Line 638: Error message without production error code - breaks React bundle size optimization
//   4. Line 638: Error message without production error code - breaks React bundle size optimization
//   5. Line 639: Error message without production error code - breaks React bundle size optimization
//   6. Line 639: Error message without production error code - breaks React bundle size optimization
//   7. Line 640: Error message without production error code - breaks React bundle size optimization
//   8. Line 640: Error message without production error code - breaks React bundle size optimization
//   9. Line 641: Error message without production error code - breaks React bundle size optimization
//   10. Line 641: Error message without production error code - breaks React bundle size optimization
//   11. Line 642: Error message without production error code - breaks React bundle size optimization
//   12. Line 642: Error message without production error code - breaks React bundle size optimization
//   13. Line 643: Error message without production error code - breaks React bundle size optimization
//   14. Line 643: Error message without production error code - breaks React bundle size optimization
//   15. Line 644: Error message without production error code - breaks React bundle size optimization
//   16. Line 644: Error message without production error code - breaks React bundle size optimization
//   17. Line 645: Error message without production error code - breaks React bundle size optimization
//   18. Line 645: Error message without production error code - breaks React bundle size optimization
//   19. Line 646: Error message without production error code - breaks React bundle size optimization
//   20. Line 646: Error message without production error code - breaks React bundle size optimization
//   21. Line 647: Error message without production error code - breaks React bundle size optimization
//   22. Line 647: Error message without production error code - breaks React bundle size optimization
//   23. Line 648: Error message without production error code - breaks React bundle size optimization
//   24. Line 648: Error message without production error code - breaks React bundle size optimization
//   25. Line 649: Error message without production error code - breaks React bundle size optimization
//   26. Line 649: Error message without production error code - breaks React bundle size optimization
//   27. Line 650: Error message without production error code - breaks React bundle size optimization
//   28. Line 650: Error message without production error code - breaks React bundle size optimization
//   29. Line 651: Error message without production error code - breaks React bundle size optimization
//   30. Line 651: Error message without production error code - breaks React bundle size optimization
//   31. Line 652: Error message without production error code - breaks React bundle size optimization
//   32. Line 652: Error message without production error code - breaks React bundle size optimization
//   33. Line 653: Error message without production error code - breaks React bundle size optimization
//   34. Line 653: Error message without production error code - breaks React bundle size optimization
//   35. Line 654: Error message without production error code - breaks React bundle size optimization
//   36. Line 654: Error message without production error code - breaks React bundle size optimization
//   37. Line 655: Error message without production error code - breaks React bundle size optimization
//   38. Line 655: Error message without production error code - breaks React bundle size optimization
//   39. Line 656: Error message without production error code - breaks React bundle size optimization
//   40. Line 656: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 685: Error message without production error code - breaks React bundle size optimization
//   2. Line 685: Error message without production error code - breaks React bundle size optimization
//   3. Line 686: Error message without production error code - breaks React bundle size optimization
//   4. Line 686: Error message without production error code - breaks React bundle size optimization
//   5. Line 687: Error message without production error code - breaks React bundle size optimization
//   6. Line 687: Error message without production error code - breaks React bundle size optimization
//   7. Line 688: Error message without production error code - breaks React bundle size optimization
//   8. Line 688: Error message without production error code - breaks React bundle size optimization
//   9. Line 689: Error message without production error code - breaks React bundle size optimization
//   10. Line 689: Error message without production error code - breaks React bundle size optimization
//   11. Line 690: Error message without production error code - breaks React bundle size optimization
//   12. Line 690: Error message without production error code - breaks React bundle size optimization
//   13. Line 691: Error message without production error code - breaks React bundle size optimization
//   14. Line 691: Error message without production error code - breaks React bundle size optimization
//   15. Line 692: Error message without production error code - breaks React bundle size optimization
//   16. Line 692: Error message without production error code - breaks React bundle size optimization
//   17. Line 693: Error message without production error code - breaks React bundle size optimization
//   18. Line 693: Error message without production error code - breaks React bundle size optimization
//   19. Line 694: Error message without production error code - breaks React bundle size optimization
//   20. Line 694: Error message without production error code - breaks React bundle size optimization
//   21. Line 695: Error message without production error code - breaks React bundle size optimization
//   22. Line 695: Error message without production error code - breaks React bundle size optimization
//   23. Line 696: Error message without production error code - breaks React bundle size optimization
//   24. Line 696: Error message without production error code - breaks React bundle size optimization
//   25. Line 697: Error message without production error code - breaks React bundle size optimization
//   26. Line 697: Error message without production error code - breaks React bundle size optimization
//   27. Line 698: Error message without production error code - breaks React bundle size optimization
//   28. Line 698: Error message without production error code - breaks React bundle size optimization
//   29. Line 699: Error message without production error code - breaks React bundle size optimization
//   30. Line 699: Error message without production error code - breaks React bundle size optimization
//   31. Line 700: Error message without production error code - breaks React bundle size optimization
//   32. Line 700: Error message without production error code - breaks React bundle size optimization
//   33. Line 701: Error message without production error code - breaks React bundle size optimization
//   34. Line 701: Error message without production error code - breaks React bundle size optimization
//   35. Line 702: Error message without production error code - breaks React bundle size optimization
//   36. Line 702: Error message without production error code - breaks React bundle size optimization
//   37. Line 703: Error message without production error code - breaks React bundle size optimization
//   38. Line 703: Error message without production error code - breaks React bundle size optimization
//   39. Line 704: Error message without production error code - breaks React bundle size optimization
//   40. Line 704: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 733: Error message without production error code - breaks React bundle size optimization
//   2. Line 733: Error message without production error code - breaks React bundle size optimization
//   3. Line 734: Error message without production error code - breaks React bundle size optimization
//   4. Line 734: Error message without production error code - breaks React bundle size optimization
//   5. Line 735: Error message without production error code - breaks React bundle size optimization
//   6. Line 735: Error message without production error code - breaks React bundle size optimization
//   7. Line 736: Error message without production error code - breaks React bundle size optimization
//   8. Line 736: Error message without production error code - breaks React bundle size optimization
//   9. Line 737: Error message without production error code - breaks React bundle size optimization
//   10. Line 737: Error message without production error code - breaks React bundle size optimization
//   11. Line 738: Error message without production error code - breaks React bundle size optimization
//   12. Line 738: Error message without production error code - breaks React bundle size optimization
//   13. Line 739: Error message without production error code - breaks React bundle size optimization
//   14. Line 739: Error message without production error code - breaks React bundle size optimization
//   15. Line 740: Error message without production error code - breaks React bundle size optimization
//   16. Line 740: Error message without production error code - breaks React bundle size optimization
//   17. Line 741: Error message without production error code - breaks React bundle size optimization
//   18. Line 741: Error message without production error code - breaks React bundle size optimization
//   19. Line 742: Error message without production error code - breaks React bundle size optimization
//   20. Line 742: Error message without production error code - breaks React bundle size optimization
//   21. Line 743: Error message without production error code - breaks React bundle size optimization
//   22. Line 743: Error message without production error code - breaks React bundle size optimization
//   23. Line 744: Error message without production error code - breaks React bundle size optimization
//   24. Line 744: Error message without production error code - breaks React bundle size optimization
//   25. Line 745: Error message without production error code - breaks React bundle size optimization
//   26. Line 745: Error message without production error code - breaks React bundle size optimization
//   27. Line 746: Error message without production error code - breaks React bundle size optimization
//   28. Line 746: Error message without production error code - breaks React bundle size optimization
//   29. Line 747: Error message without production error code - breaks React bundle size optimization
//   30. Line 747: Error message without production error code - breaks React bundle size optimization
//   31. Line 748: Error message without production error code - breaks React bundle size optimization
//   32. Line 748: Error message without production error code - breaks React bundle size optimization
//   33. Line 749: Error message without production error code - breaks React bundle size optimization
//   34. Line 749: Error message without production error code - breaks React bundle size optimization
//   35. Line 750: Error message without production error code - breaks React bundle size optimization
//   36. Line 750: Error message without production error code - breaks React bundle size optimization
//   37. Line 751: Error message without production error code - breaks React bundle size optimization
//   38. Line 751: Error message without production error code - breaks React bundle size optimization
//   39. Line 752: Error message without production error code - breaks React bundle size optimization
//   40. Line 752: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 781: Error message without production error code - breaks React bundle size optimization
//   2. Line 781: Error message without production error code - breaks React bundle size optimization
//   3. Line 782: Error message without production error code - breaks React bundle size optimization
//   4. Line 782: Error message without production error code - breaks React bundle size optimization
//   5. Line 783: Error message without production error code - breaks React bundle size optimization
//   6. Line 783: Error message without production error code - breaks React bundle size optimization
//   7. Line 784: Error message without production error code - breaks React bundle size optimization
//   8. Line 784: Error message without production error code - breaks React bundle size optimization
//   9. Line 785: Error message without production error code - breaks React bundle size optimization
//   10. Line 785: Error message without production error code - breaks React bundle size optimization
//   11. Line 786: Error message without production error code - breaks React bundle size optimization
//   12. Line 786: Error message without production error code - breaks React bundle size optimization
//   13. Line 787: Error message without production error code - breaks React bundle size optimization
//   14. Line 787: Error message without production error code - breaks React bundle size optimization
//   15. Line 788: Error message without production error code - breaks React bundle size optimization
//   16. Line 788: Error message without production error code - breaks React bundle size optimization
//   17. Line 789: Error message without production error code - breaks React bundle size optimization
//   18. Line 789: Error message without production error code - breaks React bundle size optimization
//   19. Line 790: Error message without production error code - breaks React bundle size optimization
//   20. Line 790: Error message without production error code - breaks React bundle size optimization
//   21. Line 791: Error message without production error code - breaks React bundle size optimization
//   22. Line 791: Error message without production error code - breaks React bundle size optimization
//   23. Line 792: Error message without production error code - breaks React bundle size optimization
//   24. Line 792: Error message without production error code - breaks React bundle size optimization
//   25. Line 793: Error message without production error code - breaks React bundle size optimization
//   26. Line 793: Error message without production error code - breaks React bundle size optimization
//   27. Line 794: Error message without production error code - breaks React bundle size optimization
//   28. Line 794: Error message without production error code - breaks React bundle size optimization
//   29. Line 795: Error message without production error code - breaks React bundle size optimization
//   30. Line 795: Error message without production error code - breaks React bundle size optimization
//   31. Line 796: Error message without production error code - breaks React bundle size optimization
//   32. Line 796: Error message without production error code - breaks React bundle size optimization
//   33. Line 797: Error message without production error code - breaks React bundle size optimization
//   34. Line 797: Error message without production error code - breaks React bundle size optimization
//   35. Line 798: Error message without production error code - breaks React bundle size optimization
//   36. Line 798: Error message without production error code - breaks React bundle size optimization
//   37. Line 799: Error message without production error code - breaks React bundle size optimization
//   38. Line 799: Error message without production error code - breaks React bundle size optimization
//   39. Line 800: Error message without production error code - breaks React bundle size optimization
//   40. Line 800: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (40):
//   1. Line 829: Error message without production error code - breaks React bundle size optimization
//   2. Line 829: Error message without production error code - breaks React bundle size optimization
//   3. Line 830: Error message without production error code - breaks React bundle size optimization
//   4. Line 830: Error message without production error code - breaks React bundle size optimization
//   5. Line 831: Error message without production error code - breaks React bundle size optimization
//   6. Line 831: Error message without production error code - breaks React bundle size optimization
//   7. Line 832: Error message without production error code - breaks React bundle size optimization
//   8. Line 832: Error message without production error code - breaks React bundle size optimization
//   9. Line 833: Error message without production error code - breaks React bundle size optimization
//   10. Line 833: Error message without production error code - breaks React bundle size optimization
//   11. Line 834: Error message without production error code - breaks React bundle size optimization
//   12. Line 834: Error message without production error code - breaks React bundle size optimization
//   13. Line 835: Error message without production error code - breaks React bundle size optimization
//   14. Line 835: Error message without production error code - breaks React bundle size optimization
//   15. Line 836: Error message without production error code - breaks React bundle size optimization
//   16. Line 836: Error message without production error code - breaks React bundle size optimization
//   17. Line 837: Error message without production error code - breaks React bundle size optimization
//   18. Line 837: Error message without production error code - breaks React bundle size optimization
//   19. Line 838: Error message without production error code - breaks React bundle size optimization
//   20. Line 838: Error message without production error code - breaks React bundle size optimization
//   21. Line 839: Error message without production error code - breaks React bundle size optimization
//   22. Line 839: Error message without production error code - breaks React bundle size optimization
//   23. Line 840: Error message without production error code - breaks React bundle size optimization
//   24. Line 840: Error message without production error code - breaks React bundle size optimization
//   25. Line 841: Error message without production error code - breaks React bundle size optimization
//   26. Line 841: Error message without production error code - breaks React bundle size optimization
//   27. Line 842: Error message without production error code - breaks React bundle size optimization
//   28. Line 842: Error message without production error code - breaks React bundle size optimization
//   29. Line 843: Error message without production error code - breaks React bundle size optimization
//   30. Line 843: Error message without production error code - breaks React bundle size optimization
//   31. Line 844: Error message without production error code - breaks React bundle size optimization
//   32. Line 844: Error message without production error code - breaks React bundle size optimization
//   33. Line 845: Error message without production error code - breaks React bundle size optimization
//   34. Line 845: Error message without production error code - breaks React bundle size optimization
//   35. Line 846: Error message without production error code - breaks React bundle size optimization
//   36. Line 846: Error message without production error code - breaks React bundle size optimization
//   37. Line 847: Error message without production error code - breaks React bundle size optimization
//   38. Line 847: Error message without production error code - breaks React bundle size optimization
//   39. Line 848: Error message without production error code - breaks React bundle size optimization
//   40. Line 848: Error message without production error code - breaks React bundle size optimization
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
