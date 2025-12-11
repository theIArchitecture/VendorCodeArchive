//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData, INativeBrowserElementsService } from '../../../../platform/browserElements/common/browserElements.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { IBrowserElementsService } from '../browser/browserElementsService.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { NativeBrowserElementsService } from '../../../../platform/browserElements/common/nativeBrowserElementsService.js';

class WorkbenchNativeBrowserElementsService extends NativeBrowserElementsService {

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		super(environmentService.window.id, mainProcessService);
	}
}

let cancelSelectionIdPool = 0;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

let cancelAndDetachIdPool = 0;

class WorkbenchBrowserElementsService implements IBrowserElementsService {
	_serviceBrand: undefined;

	constructor(
		@INativeBrowserElementsService private readonly simpleBrowser: INativeBrowserElementsService
	) { }

	async startDebugSession(token: CancellationToken, browserType: BrowserType): Promise<void> {
		const cancelAndDetachId = cancelAndDetachIdPool++;
		const onCancelChannel = `vscode:cancelCurrentSession${cancelAndDetachId}`;

		const disposable = token.onCancellationRequested(() => {
			ipcRenderer.send(onCancelChannel, cancelAndDetachId);
			disposable.dispose();
		});
		try {
			await this.simpleBrowser.startDebugSession(token, browserType, cancelAndDetachId);
		} catch (error) {
			disposable.dispose();
			throw new Error('No debug session target found', error);
		}
	}

	async getElementData(rect: IRectangle, token: CancellationToken, browserType: BrowserType | undefined): Promise<IElementData | undefined> {
		if (!browserType) {
			return undefined;
		}
		const cancelSelectionId = cancelSelectionIdPool++;
		const onCancelChannel = `vscode:cancelElementSelection${cancelSelectionId}`;
		const disposable = token.onCancellationRequested(() => {
			ipcRenderer.send(onCancelChannel, cancelSelectionId);
		});
		try {
			const elementData = await this.simpleBrowser.getElementData(rect, token, browserType, cancelSelectionId);
			return elementData;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 66: Error message without production error code - breaks React bundle size optimization
//   2. Line 66: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		} catch (error) {
			disposable.dispose();
			throw new Error(`Native Host: Error getting element data: ${error}`);
		} finally {
			disposable.dispose();
		}
	}
}

registerSingleton(IBrowserElementsService, WorkbenchBrowserElementsService, InstantiationType.Delayed);
registerSingleton(INativeBrowserElementsService, WorkbenchNativeBrowserElementsService, InstantiationType.Delayed);
