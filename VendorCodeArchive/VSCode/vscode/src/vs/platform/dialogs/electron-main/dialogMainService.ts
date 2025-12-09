//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { Queue } from '../../../base/common/async.js';
import { hash } from '../../../base/common/hash.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { normalizeNFC } from '../../../base/common/normalization.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { Promises } from '../../../base/node/pfs.js';
import { localize } from '../../../nls.js';
import { INativeOpenDialogOptions, massageMessageBoxOptions } from '../common/dialogs.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { WORKSPACE_FILTER } from '../../workspace/common/workspace.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 201: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 201: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IDialogMainService = createDecorator<IDialogMainService>('dialogMainService');

export interface IDialogMainService {

	readonly _serviceBrand: undefined;

	pickFileFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickFile(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickWorkspace(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;

	showMessageBox(options: electron.MessageBoxOptions, window?: electron.BrowserWindow): Promise<electron.MessageBoxReturnValue>;
	showSaveDialog(options: electron.SaveDialogOptions, window?: electron.BrowserWindow): Promise<electron.SaveDialogReturnValue>;
	showOpenDialog(options: electron.OpenDialogOptions, window?: electron.BrowserWindow): Promise<electron.OpenDialogReturnValue>;
}

interface IInternalNativeOpenDialogOptions extends INativeOpenDialogOptions {
	readonly pickFolders?: boolean;
	readonly pickFiles?: boolean;

	readonly title: string;
	readonly buttonLabel?: string;
	readonly filters?: electron.FileFilter[];
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export class DialogMainService implements IDialogMainService {

	declare readonly _serviceBrand: undefined;

	private readonly windowFileDialogLocks = new Map<number, Set<number>>();
	private readonly windowDialogQueues = new Map<number, Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>>();
	private readonly noWindowDialogueQueue = new Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IProductService private readonly productService: IProductService
	) {
	}

	pickFileFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		return this.doPick({ ...options, pickFolders: true, pickFiles: true, title: localize('open', "Open") }, window);
	}

	pickFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		return this.doPick({ ...options, pickFolders: true, title: localize('openFolder', "Open Folder") }, window);
	}

	pickFile(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		return this.doPick({ ...options, pickFiles: true, title: localize('openFile', "Open File") }, window);
	}

	pickWorkspace(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		const title = localize('openWorkspaceTitle', "Open Workspace from File");
		const buttonLabel = mnemonicButtonLabel(localize({ key: 'openWorkspace', comment: ['&& denotes a mnemonic'] }, "&&Open")).withMnemonic;
		const filters = WORKSPACE_FILTER;

		return this.doPick({ ...options, pickFiles: true, title, filters, buttonLabel }, window);
	}

	private async doPick(options: IInternalNativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {

		// Ensure dialog options
		const dialogOptions: electron.OpenDialogOptions = {
			title: options.title,
			buttonLabel: options.buttonLabel,
			filters: options.filters,
			defaultPath: options.defaultPath
		};

		// Ensure properties
		if (typeof options.pickFiles === 'boolean' || typeof options.pickFolders === 'boolean') {
			dialogOptions.properties = undefined; // let it override based on the booleans

			if (options.pickFiles && options.pickFolders) {
				dialogOptions.properties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
			}
		}

		if (!dialogOptions.properties) {
			dialogOptions.properties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
		}

		if (isMacintosh) {
			dialogOptions.properties.push('treatPackageAsDirectory'); // always drill into .app files
		}

		// Show Dialog
		const result = await this.showOpenDialog(dialogOptions, (window || electron.BrowserWindow.getFocusedWindow()) ?? undefined);
		if (result && result.filePaths && result.filePaths.length > 0) {
			return result.filePaths;
		}

		return undefined;
	}

	private getWindowDialogQueue<T extends electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>(window?: electron.BrowserWindow): Queue<T> {

		// Queue message box requests per window so that one can show
		// after the other.
		if (window) {
			let windowDialogQueue = this.windowDialogQueues.get(window.id);
			if (!windowDialogQueue) {
				windowDialogQueue = new Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>();
				this.windowDialogQueues.set(window.id, windowDialogQueue);
			}

			return windowDialogQueue as unknown as Queue<T>;
		} else {
			return this.noWindowDialogueQueue as unknown as Queue<T>;
		}
	}

	showMessageBox(rawOptions: electron.MessageBoxOptions, window?: electron.BrowserWindow): Promise<electron.MessageBoxReturnValue> {
		return this.getWindowDialogQueue<electron.MessageBoxReturnValue>(window).queue(async () => {
			const { options, buttonIndeces } = massageMessageBoxOptions(rawOptions, this.productService);

			let result: electron.MessageBoxReturnValue | undefined = undefined;
			if (window) {
				result = await electron.dialog.showMessageBox(window, options);
			} else {
				result = await electron.dialog.showMessageBox(options);
			}

			return {
				response: buttonIndeces[result.response],
				checkboxChecked: result.checkboxChecked
			};
		});
	}

	async showSaveDialog(options: electron.SaveDialogOptions, window?: electron.BrowserWindow): Promise<electron.SaveDialogReturnValue> {

		// Prevent duplicates of the same dialog queueing at the same time
		const fileDialogLock = this.acquireFileDialogLock(options, window);
		if (!fileDialogLock) {
			this.logService.error('[DialogMainService]: file save dialog is already or will be showing for the window with the same configuration');

			return { canceled: true, filePath: '' };
		}

		try {
			return await this.getWindowDialogQueue<electron.SaveDialogReturnValue>(window).queue(async () => {
				let result: electron.SaveDialogReturnValue;
				if (window) {
					result = await electron.dialog.showSaveDialog(window, options);
				} else {
					result = await electron.dialog.showSaveDialog(options);
				}

				result.filePath = this.normalizePath(result.filePath);

				return result;
			});
		} finally {
			dispose(fileDialogLock);
		}
	}

	private normalizePath(path: string): string;
	private normalizePath(path: string | undefined): string | undefined;
	private normalizePath(path: string | undefined): string | undefined {
		if (path && isMacintosh) {
			path = normalizeNFC(path); // macOS only: normalize paths to NFC form
		}

		return path;
	}

	private normalizePaths(paths: string[]): string[] {
		return paths.map(path => this.normalizePath(path));
	}

	async showOpenDialog(options: electron.OpenDialogOptions, window?: electron.BrowserWindow): Promise<electron.OpenDialogReturnValue> {

		// Ensure the path exists (if provided)
		if (options.defaultPath) {
			const pathExists = await Promises.exists(options.defaultPath);
			if (!pathExists) {
				options.defaultPath = undefined;
			}
		}

		// Prevent duplicates of the same dialog queueing at the same time
		const fileDialogLock = this.acquireFileDialogLock(options, window);
		if (!fileDialogLock) {
			this.logService.error('[DialogMainService]: file open dialog is already or will be showing for the window with the same configuration');

			return { canceled: true, filePaths: [] };
		}

		try {
			return await this.getWindowDialogQueue<electron.OpenDialogReturnValue>(window).queue(async () => {
				let result: electron.OpenDialogReturnValue;
				if (window) {
					result = await electron.dialog.showOpenDialog(window, options);
				} else {
					result = await electron.dialog.showOpenDialog(options);
				}

				result.filePaths = this.normalizePaths(result.filePaths);

				return result;
			});
		} finally {
			dispose(fileDialogLock);
		}
	}

	private acquireFileDialogLock(options: electron.SaveDialogOptions | electron.OpenDialogOptions, window?: electron.BrowserWindow): IDisposable | undefined {

		// If no window is provided, allow as many dialogs as
		// needed since we consider them not modal per window
		if (!window) {
			return Disposable.None;
		}

		// If a window is provided, only allow a single dialog
		// at the same time because dialogs are modal and we
		// do not want to open one dialog after the other
		// (https://github.com/microsoft/vscode/issues/114432)
		// we figure this out by `hashing` the configuration
		// options for the dialog to prevent duplicates

		this.logService.trace('[DialogMainService]: request to acquire file dialog lock', options);

		let windowFileDialogLocks = this.windowFileDialogLocks.get(window.id);
		if (!windowFileDialogLocks) {
			windowFileDialogLocks = new Set();
			this.windowFileDialogLocks.set(window.id, windowFileDialogLocks);
		}

		const optionsHash = hash(options);
		if (windowFileDialogLocks.has(optionsHash)) {
			return undefined; // prevent duplicates, return
		}

		this.logService.trace('[DialogMainService]: new file dialog lock created', options);

		windowFileDialogLocks.add(optionsHash);

		return toDisposable(() => {
			this.logService.trace('[DialogMainService]: file dialog lock disposed', options);

			windowFileDialogLocks?.delete(optionsHash);

			// If the window has no more dialog locks, delete it from the set of locks
			if (windowFileDialogLocks?.size === 0) {
				this.windowFileDialogLocks.delete(window.id);
			}
		});
	}
}
