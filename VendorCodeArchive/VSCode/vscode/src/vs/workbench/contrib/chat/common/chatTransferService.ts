//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { areWorkspaceFoldersEmpty } from '../../../services/workspaces/common/workspaceUtils.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { URI } from '../../../../base/common/uri.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 51: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IChatTransferService = createDecorator<IChatTransferService>('chatTransferService');
const transferredWorkspacesKey = 'chat.transferedWorkspaces';

export interface IChatTransferService {
	readonly _serviceBrand: undefined;

	checkAndSetTransferredWorkspaceTrust(): Promise<void>;
	addWorkspaceToTransferred(workspace: URI): void;
}

export class ChatTransferService implements IChatTransferService {
	_serviceBrand: undefined;

	constructor(
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IStorageService private readonly storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService
	) { }

	deleteWorkspaceFromTransferredList(workspace: URI): void {
		const transferredWorkspaces = this.storageService.getObject<string[]>(transferredWorkspacesKey, StorageScope.PROFILE, []);
		const updatedWorkspaces = transferredWorkspaces.filter(uri => uri !== workspace.toString());
		this.storageService.store(transferredWorkspacesKey, updatedWorkspaces, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	addWorkspaceToTransferred(workspace: URI): void {
		const transferredWorkspaces = this.storageService.getObject<string[]>(transferredWorkspacesKey, StorageScope.PROFILE, []);
		transferredWorkspaces.push(workspace.toString());
		this.storageService.store(transferredWorkspacesKey, transferredWorkspaces, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	async checkAndSetTransferredWorkspaceTrust(): Promise<void> {
		const workspace = this.workspaceService.getWorkspace();
		const currentWorkspaceUri = workspace.folders[0]?.uri;
		if (!currentWorkspaceUri) {
			return;
		}
		if (this.isChatTransferredWorkspace(currentWorkspaceUri, this.storageService) && await areWorkspaceFoldersEmpty(workspace, this.fileService)) {
			await this.workspaceTrustManagementService.setWorkspaceTrust(true);
			this.deleteWorkspaceFromTransferredList(currentWorkspaceUri);
		}
	}

	isChatTransferredWorkspace(workspace: URI, storageService: IStorageService): boolean {
		if (!workspace) {
			return false;
		}
		const chatWorkspaceTransfer: URI[] = storageService.getObject(transferredWorkspacesKey, StorageScope.PROFILE, []);
		return chatWorkspaceTransfer.some(item => item.toString() === workspace.toString());
	}
}
