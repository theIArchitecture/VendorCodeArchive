//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { isUNC, toSlashes } from '../../../base/common/extpath.js';
import * as json from '../../../base/common/json.js';
import * as jsonEdit from '../../../base/common/jsonEdit.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { normalizeDriveLetter } from '../../../base/common/labels.js';
import { Schemas } from '../../../base/common/network.js';
import { isAbsolute, posix } from '../../../base/common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { IExtUri, isEqualAuthority } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../backup/common/backup.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { getRemoteAuthority } from '../../remote/common/remoteHosts.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 25: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 25: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IBaseWorkspace, IRawFileWorkspaceFolder, IRawUriWorkspaceFolder, IWorkspaceIdentifier, WorkspaceFolder } from '../../workspace/common/workspace.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 71: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 71: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 82: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 82: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 93: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 93: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 126: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 126: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWorkspacesService = createDecorator<IWorkspacesService>('workspacesService');

export interface IWorkspacesService {

	readonly _serviceBrand: undefined;

	// Workspaces Management
	enterWorkspace(workspaceUri: URI): Promise<IEnterWorkspaceResult | undefined>;
	createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier>;
	deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void>;
	getWorkspaceIdentifier(workspaceUri: URI): Promise<IWorkspaceIdentifier>;

	// Workspaces History
	readonly onDidChangeRecentlyOpened: Event<void>;
	addRecentlyOpened(recents: IRecent[]): Promise<void>;
	removeRecentlyOpened(workspaces: URI[]): Promise<void>;
	clearRecentlyOpened(): Promise<void>;
	getRecentlyOpened(): Promise<IRecentlyOpened>;

	// Dirty Workspaces
	getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>>;
}

//#region Workspaces Recently Opened

export interface IRecentlyOpened {
	workspaces: Array<IRecentWorkspace | IRecentFolder>;
	files: IRecentFile[];
}

export type IRecent = IRecentWorkspace | IRecentFolder | IRecentFile;

export interface IRecentWorkspace {
	readonly workspace: IWorkspaceIdentifier;
	label?: string;
	readonly remoteAuthority?: string;
}

export interface IRecentFolder {
	readonly folderUri: URI;
	label?: string;
	readonly remoteAuthority?: string;
}

export interface IRecentFile {
	readonly fileUri: URI;
	label?: string;
	readonly remoteAuthority?: string;
}

export function isRecentWorkspace(curr: IRecent): curr is IRecentWorkspace {
	return curr.hasOwnProperty('workspace');
}

export function isRecentFolder(curr: IRecent): curr is IRecentFolder {
	return curr.hasOwnProperty('folderUri');
}

export function isRecentFile(curr: IRecent): curr is IRecentFile {
	return curr.hasOwnProperty('fileUri');
}

//#endregion

//#region Workspace File Utilities

export function isStoredWorkspaceFolder(obj: unknown): obj is IStoredWorkspaceFolder {
	return isRawFileWorkspaceFolder(obj) || isRawUriWorkspaceFolder(obj);
}

function isRawFileWorkspaceFolder(obj: unknown): obj is IRawFileWorkspaceFolder {
	const candidate = obj as IRawFileWorkspaceFolder | undefined;

	return typeof candidate?.path === 'string' && (!candidate.name || typeof candidate.name === 'string');
}

function isRawUriWorkspaceFolder(obj: unknown): obj is IRawUriWorkspaceFolder {
	const candidate = obj as IRawUriWorkspaceFolder | undefined;

	return typeof candidate?.uri === 'string' && (!candidate.name || typeof candidate.name === 'string');
}

export type IStoredWorkspaceFolder = IRawFileWorkspaceFolder | IRawUriWorkspaceFolder;

export interface IStoredWorkspace extends IBaseWorkspace {
	folders: IStoredWorkspaceFolder[];
}

export interface IWorkspaceFolderCreationData {
	readonly uri: URI;
	readonly name?: string;
}

export interface IUntitledWorkspaceInfo {
	readonly workspace: IWorkspaceIdentifier;
	readonly remoteAuthority?: string;
}

export interface IEnterWorkspaceResult {
	readonly workspace: IWorkspaceIdentifier;
	readonly backupPath?: string;
}

/**
 * Given a folder URI and the workspace config folder, computes the `IStoredWorkspaceFolder`
 * using a relative or absolute path or a uri.
 * Undefined is returned if the `folderURI` and the `targetConfigFolderURI` don't have the
 * same schema or authority.
 *
 * @param folderURI a workspace folder
 * @param forceAbsolute if set, keep the path absolute
 * @param folderName a workspace name
 * @param targetConfigFolderURI the folder where the workspace is living in
 */
export function getStoredWorkspaceFolder(folderURI: URI, forceAbsolute: boolean, folderName: string | undefined, targetConfigFolderURI: URI, extUri: IExtUri): IStoredWorkspaceFolder {

	// Scheme mismatch: use full absolute URI as `uri`
	if (folderURI.scheme !== targetConfigFolderURI.scheme) {
		return { name: folderName, uri: folderURI.toString(true) };
	}

	// Always prefer a relative path if possible unless
	// prevented to make the workspace file shareable
	// with other users
	let folderPath = !forceAbsolute ? extUri.relativePath(targetConfigFolderURI, folderURI) : undefined;
	if (folderPath !== undefined) {
		if (folderPath.length === 0) {
			folderPath = '.';
		} else {
			if (isWindows) {
				folderPath = massagePathForWindows(folderPath);
			}
		}
	}

	// We could not resolve a relative path
	else {

		// Local file: use `fsPath`
		if (folderURI.scheme === Schemas.file) {
			folderPath = folderURI.fsPath;
			if (isWindows) {
				folderPath = massagePathForWindows(folderPath);
			}
		}

		// Different authority: use full absolute URI
		else if (!extUri.isEqualAuthority(folderURI.authority, targetConfigFolderURI.authority)) {
			return { name: folderName, uri: folderURI.toString(true) };
		}

		// Non-local file: use `path` of URI
		else {
			folderPath = folderURI.path;
		}
	}

	return { name: folderName, path: folderPath };
}

function massagePathForWindows(folderPath: string) {

	// Drive letter should be upper case
	folderPath = normalizeDriveLetter(folderPath);

	// Always prefer slash over backslash unless
	// we deal with UNC paths where backslash is
	// mandatory.
	if (!isUNC(folderPath)) {
		folderPath = toSlashes(folderPath);
	}

	return folderPath;
}

export function toWorkspaceFolders(configuredFolders: IStoredWorkspaceFolder[], workspaceConfigFile: URI, extUri: IExtUri): WorkspaceFolder[] {
	const result: WorkspaceFolder[] = [];
	const seen: Set<string> = new Set();

	const relativeTo = extUri.dirname(workspaceConfigFile);
	for (const configuredFolder of configuredFolders) {
		let uri: URI | undefined = undefined;
		if (isRawFileWorkspaceFolder(configuredFolder)) {
			if (configuredFolder.path) {
				uri = extUri.resolvePath(relativeTo, configuredFolder.path);
			}
		} else if (isRawUriWorkspaceFolder(configuredFolder)) {
			try {
				uri = URI.parse(configuredFolder.uri);
				if (uri.path[0] !== posix.sep) {
					uri = uri.with({ path: posix.sep + uri.path }); // this makes sure all workspace folder are absolute
				}
			} catch (e) {
				console.warn(e); // ignore
			}
		}

		if (uri) {

			// remove duplicates
			const comparisonKey = extUri.getComparisonKey(uri);
			if (!seen.has(comparisonKey)) {
				seen.add(comparisonKey);

				const name = configuredFolder.name || extUri.basenameOrAuthority(uri);
				result.push(new WorkspaceFolder({ uri, name, index: result.length }, configuredFolder));
			}
		}
	}

	return result;
}

/**
 * Rewrites the content of a workspace file to be saved at a new location.
 * Throws an exception if file is not a valid workspace file
 */
export function rewriteWorkspaceFileForNewLocation(rawWorkspaceContents: string, configPathURI: URI, isFromUntitledWorkspace: boolean, targetConfigPathURI: URI, extUri: IExtUri) {
	const storedWorkspace = doParseStoredWorkspace(configPathURI, rawWorkspaceContents);

	const sourceConfigFolder = extUri.dirname(configPathURI);
	const targetConfigFolder = extUri.dirname(targetConfigPathURI);

	const rewrittenFolders: IStoredWorkspaceFolder[] = [];

	for (const folder of storedWorkspace.folders) {
		const folderURI = isRawFileWorkspaceFolder(folder) ? extUri.resolvePath(sourceConfigFolder, folder.path) : URI.parse(folder.uri);
		let absolute;
		if (isFromUntitledWorkspace) {
			absolute = false; // if it was an untitled workspace, try to make paths relative
		} else {
			absolute = !isRawFileWorkspaceFolder(folder) || isAbsolute(folder.path); // for existing workspaces, preserve whether a path was absolute or relative
		}
		rewrittenFolders.push(getStoredWorkspaceFolder(folderURI, absolute, folder.name, targetConfigFolder, extUri));
	}

	// Preserve as much of the existing workspace as possible by using jsonEdit
	// and only changing the folders portion.
	const formattingOptions: FormattingOptions = { insertSpaces: false, tabSize: 4, eol: (isLinux || isMacintosh) ? '\n' : '\r\n' };
	const edits = jsonEdit.setProperty(rawWorkspaceContents, ['folders'], rewrittenFolders, formattingOptions);
	let newContent = jsonEdit.applyEdits(rawWorkspaceContents, edits);

	if (isEqualAuthority(storedWorkspace.remoteAuthority, getRemoteAuthority(targetConfigPathURI))) {
		// unsaved remote workspaces have the remoteAuthority set. Remove it when no longer nexessary.
		newContent = jsonEdit.applyEdits(newContent, jsonEdit.removeProperty(newContent, ['remoteAuthority'], formattingOptions));
	}

	return newContent;
}

function doParseStoredWorkspace(path: URI, contents: string): IStoredWorkspace {

	// Parse workspace file
	const storedWorkspace: IStoredWorkspace = json.parse(contents); // use fault tolerant parser

	// Filter out folders which do not have a path or uri set
	if (storedWorkspace && Array.isArray(storedWorkspace.folders)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 282: Error message without production error code - breaks React bundle size optimization
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		storedWorkspace.folders = storedWorkspace.folders.filter(folder => isStoredWorkspaceFolder(folder));
	} else {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 305: Error message without production error code - breaks React bundle size optimization
//   2. Line 305: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`${path} looks like an invalid workspace file.`);
	}

	return storedWorkspace;
}

//#endregion

//#region Workspace Storage

interface ISerializedRecentWorkspace {
	readonly workspace: {
		id: string;
		configPath: string;
	};
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentFolder {
	readonly folderUri: string;
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentFile {
	readonly fileUri: string;
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentlyOpened {
	readonly entries: Array<ISerializedRecentWorkspace | ISerializedRecentFolder | ISerializedRecentFile>; // since 1.55
}

export type RecentlyOpenedStorageData = object;

function isSerializedRecentWorkspace(data: any): data is ISerializedRecentWorkspace {
	return data.workspace && typeof data.workspace === 'object' && typeof data.workspace.id === 'string' && typeof data.workspace.configPath === 'string';
}

function isSerializedRecentFolder(data: any): data is ISerializedRecentFolder {
	return typeof data.folderUri === 'string';
}

function isSerializedRecentFile(data: any): data is ISerializedRecentFile {
	return typeof data.fileUri === 'string';
}

export function restoreRecentlyOpened(data: RecentlyOpenedStorageData | undefined, logService: ILogService): IRecentlyOpened {
	const result: IRecentlyOpened = { workspaces: [], files: [] };
	if (data) {
		const restoreGracefully = function <T>(entries: T[], onEntry: (entry: T, index: number) => void) {
			for (let i = 0; i < entries.length; i++) {
				try {
					onEntry(entries[i], i);
				} catch (e) {
					logService.warn(`Error restoring recent entry ${JSON.stringify(entries[i])}: ${e.toString()}. Skip entry.`);
				}
			}
		};

		const storedRecents = data as ISerializedRecentlyOpened;
		if (Array.isArray(storedRecents.entries)) {
			restoreGracefully(storedRecents.entries, entry => {
				const label = entry.label;
				const remoteAuthority = entry.remoteAuthority;

				if (isSerializedRecentWorkspace(entry)) {
					result.workspaces.push({ label, remoteAuthority, workspace: { id: entry.workspace.id, configPath: URI.parse(entry.workspace.configPath) } });
				} else if (isSerializedRecentFolder(entry)) {
					result.workspaces.push({ label, remoteAuthority, folderUri: URI.parse(entry.folderUri) });
				} else if (isSerializedRecentFile(entry)) {
					result.files.push({ label, remoteAuthority, fileUri: URI.parse(entry.fileUri) });
				}
			});
		}
	}

	return result;
}

export function toStoreData(recents: IRecentlyOpened): RecentlyOpenedStorageData {
	const serialized: ISerializedRecentlyOpened = { entries: [] };

	const storeLabel = (label: string | undefined, uri: URI) => {
		// Only store the label if it is provided
		// and only if it differs from the path
		// This gives us a chance to render the
		// path better, e.g. use `~` for home.
		return label && label !== uri.fsPath && label !== uri.path;
	};

	for (const recent of recents.workspaces) {
		if (isRecentFolder(recent)) {
			serialized.entries.push({
				folderUri: recent.folderUri.toString(),
				label: storeLabel(recent.label, recent.folderUri) ? recent.label : undefined,
				remoteAuthority: recent.remoteAuthority
			});
		} else {
			serialized.entries.push({
				workspace: {
					id: recent.workspace.id,
					configPath: recent.workspace.configPath.toString()
				},
				label: storeLabel(recent.label, recent.workspace.configPath) ? recent.label : undefined,
				remoteAuthority: recent.remoteAuthority
			});
		}
	}

	for (const recent of recents.files) {
		serialized.entries.push({
			fileUri: recent.fileUri.toString(),
			label: storeLabel(recent.label, recent.fileUri) ? recent.label : undefined,
			remoteAuthority: recent.remoteAuthority
		});
	}

	return serialized;
}

//#endregion
