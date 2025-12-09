//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isEqualOrParent, joinPath, relativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceStateFolder } from '../../../../platform/userDataSync/common/userDataSync.js';
import { EditSessionIdentityMatch, IEditSessionIdentityService } from '../../../../platform/workspace/common/editSessions.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 66: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 73: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 85: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 109: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 121: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 126: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 138: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 150: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 151: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 151: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 169: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 174: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 181: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWorkspaceIdentityService = createDecorator<IWorkspaceIdentityService>('IWorkspaceIdentityService');
export interface IWorkspaceIdentityService {
	_serviceBrand: undefined;
	matches(folders: IWorkspaceStateFolder[], cancellationToken: CancellationToken): Promise<((obj: any) => unknown) | false>;
	getWorkspaceStateFolders(cancellationToken: CancellationToken): Promise<IWorkspaceStateFolder[]>;
}

export class WorkspaceIdentityService implements IWorkspaceIdentityService {
	declare _serviceBrand: undefined;

	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IEditSessionIdentityService private readonly editSessionIdentityService: IEditSessionIdentityService
	) { }

	async getWorkspaceStateFolders(cancellationToken: CancellationToken): Promise<IWorkspaceStateFolder[]> {
		const workspaceStateFolders: IWorkspaceStateFolder[] = [];

		for (const workspaceFolder of this.workspaceContextService.getWorkspace().folders) {
			const workspaceFolderIdentity = await this.editSessionIdentityService.getEditSessionIdentifier(workspaceFolder, cancellationToken);
			if (!workspaceFolderIdentity) { continue; }
			workspaceStateFolders.push({ resourceUri: workspaceFolder.uri.toString(), workspaceFolderIdentity });
		}

		return workspaceStateFolders;
	}

	async matches(incomingWorkspaceFolders: IWorkspaceStateFolder[], cancellationToken: CancellationToken): Promise<((value: any) => unknown) | false> {
		const incomingToCurrentWorkspaceFolderUris: { [key: string]: string } = {};

		const incomingIdentitiesToIncomingWorkspaceFolders: { [key: string]: string } = {};
		for (const workspaceFolder of incomingWorkspaceFolders) {
			incomingIdentitiesToIncomingWorkspaceFolders[workspaceFolder.workspaceFolderIdentity] = workspaceFolder.resourceUri;
		}

		// Precompute the identities of the current workspace folders
		const currentWorkspaceFoldersToIdentities = new Map<IWorkspaceFolder, string>();
		for (const workspaceFolder of this.workspaceContextService.getWorkspace().folders) {
			const workspaceFolderIdentity = await this.editSessionIdentityService.getEditSessionIdentifier(workspaceFolder, cancellationToken);
			if (!workspaceFolderIdentity) { continue; }
			currentWorkspaceFoldersToIdentities.set(workspaceFolder, workspaceFolderIdentity);
		}

		// Match the current workspace folders to the incoming workspace folders
		for (const [currentWorkspaceFolder, currentWorkspaceFolderIdentity] of currentWorkspaceFoldersToIdentities.entries()) {

			// Happy case: identities do not need further disambiguation
			const incomingWorkspaceFolder = incomingIdentitiesToIncomingWorkspaceFolders[currentWorkspaceFolderIdentity];
			if (incomingWorkspaceFolder) {
				// There is an incoming workspace folder with the exact same identity as the current workspace folder
				incomingToCurrentWorkspaceFolderUris[incomingWorkspaceFolder] = currentWorkspaceFolder.uri.toString();
				continue;
			}

			// Unhappy case: compare the identity of the current workspace folder to all incoming workspace folder identities
			let hasCompleteMatch = false;
			for (const [incomingIdentity, incomingFolder] of Object.entries(incomingIdentitiesToIncomingWorkspaceFolders)) {
				if (await this.editSessionIdentityService.provideEditSessionIdentityMatch(currentWorkspaceFolder, currentWorkspaceFolderIdentity, incomingIdentity, cancellationToken) === EditSessionIdentityMatch.Complete) {
					incomingToCurrentWorkspaceFolderUris[incomingFolder] = currentWorkspaceFolder.uri.toString();
					hasCompleteMatch = true;
					break;
				}
			}

			if (hasCompleteMatch) {
				continue;
			}

			return false;
		}

		const convertUri = (uriToConvert: URI) => {
			// Figure out which current folder the incoming URI is a child of
			for (const incomingFolderUriKey of Object.keys(incomingToCurrentWorkspaceFolderUris)) {
				const incomingFolderUri = URI.parse(incomingFolderUriKey);
				if (isEqualOrParent(incomingFolderUri, uriToConvert)) {
					const currentWorkspaceFolderUri = incomingToCurrentWorkspaceFolderUris[incomingFolderUriKey];

					// Compute the relative file path section of the uri to convert relative to the folder it came from
					const relativeFilePath = relativePath(incomingFolderUri, uriToConvert);

					// Reparent the relative file path under the current workspace folder it belongs to
					if (relativeFilePath) {
						return joinPath(URI.parse(currentWorkspaceFolderUri), relativeFilePath);
					}
				}
			}

			// No conversion was possible; return the original URI
			return uriToConvert;
		};

		// Recursively look for any URIs in the provided object and
		// replace them with the URIs of the current workspace folders
		const uriReplacer = (obj: any, depth = 0) => {
			if (!obj || depth > 200) {
				return obj;
			}

			if (obj instanceof VSBuffer || obj instanceof Uint8Array) {
				return <any>obj;
			}

			if (URI.isUri(obj)) {
				return convertUri(obj);
			}

			if (Array.isArray(obj)) {
				for (let i = 0; i < obj.length; ++i) {
					obj[i] = uriReplacer(obj[i], depth + 1);
				}
			} else {
				// walk object
				for (const key in obj) {
					if (Object.hasOwnProperty.call(obj, key)) {
						obj[key] = uriReplacer(obj[key], depth + 1);
					}
				}
			}

			return obj;
		};

		return uriReplacer;
	}
}

registerSingleton(IWorkspaceIdentityService, WorkspaceIdentityService, InstantiationType.Delayed);
