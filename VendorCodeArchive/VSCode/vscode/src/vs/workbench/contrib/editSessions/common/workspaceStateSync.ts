//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { parse, stringify } from '../../../../base/common/marshalling.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IStorageEntry, IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { AbstractSynchroniser, IAcceptResult, IMergeResult, IResourcePreview, ISyncResourcePreview } from '../../../../platform/userDataSync/common/abstractSynchronizer.js';
import { IRemoteUserData, IResourceRefHandle, IUserDataSyncLocalStoreService, IUserDataSyncConfiguration, IUserDataSyncEnablementService, IUserDataSyncLogService, IUserDataSyncStoreService, IUserDataSynchroniser, IWorkspaceState, SyncResource, IUserDataSyncResourcePreview } from '../../../../platform/userDataSync/common/userDataSync.js';
import { EditSession, IEditSessionsStorageService } from './editSessions.js';
import { IWorkspaceIdentityService } from '../../../services/workspaces/common/workspaceIdentityService.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding



class NullBackupStoreService implements IUserDataSyncLocalStoreService {
	_serviceBrand: undefined;
	async writeResource(): Promise<void> {
		return;
	}
	async getAllResourceRefs(): Promise<IResourceRefHandle[]> {
		return [];
	}
	async resolveResourceContent(): Promise<string | null> {
		return null;
	}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

class NullEnablementService implements IUserDataSyncEnablementService {
	_serviceBrand: any;

	private _onDidChangeEnablement = new Emitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _onDidChangeResourceEnablement = new Emitter<[SyncResource, boolean]>();
	readonly onDidChangeResourceEnablement: Event<[SyncResource, boolean]> = this._onDidChangeResourceEnablement.event;

	isEnabled(): boolean { return true; }
	canToggleEnablement(): boolean { return true; }
	setEnablement(_enabled: boolean): void { }
	isResourceEnabled(_resource: SyncResource): boolean { return true; }
	isResourceEnablementConfigured(_resource: SyncResource): boolean { return false; }
	setResourceEnablement(_resource: SyncResource, _enabled: boolean): void { }
	getResourceSyncStateVersion(_resource: SyncResource): string | undefined { return undefined; }

}

export class WorkspaceStateSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {
	protected override version: number = 1;

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		userDataSyncStoreService: IUserDataSyncStoreService,
		logService: IUserDataSyncLogService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceIdentityService private readonly workspaceIdentityService: IWorkspaceIdentityService,
		@IEditSessionsStorageService private readonly editSessionsStorageService: IEditSessionsStorageService,
	) {
		const userDataSyncLocalStoreService = new NullBackupStoreService();
		const userDataSyncEnablementService = new NullEnablementService();
		super({ syncResource: SyncResource.WorkspaceState, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
	}

	override async sync(): Promise<IUserDataSyncResourcePreview | null> {
		const cancellationTokenSource = new CancellationTokenSource();
		const folders = await this.workspaceIdentityService.getWorkspaceStateFolders(cancellationTokenSource.token);
		if (!folders.length) {
			return null;
		}

		// Ensure we have latest state by sending out onWillSaveState event
		await this.storageService.flush();

		const keys = this.storageService.keys(StorageScope.WORKSPACE, StorageTarget.USER);
		if (!keys.length) {
			return null;
		}

		const contributedData: IStringDictionary<string> = {};
		keys.forEach((key) => {
			const data = this.storageService.get(key, StorageScope.WORKSPACE);
			if (data) {
				contributedData[key] = data;
			}
		});

		const content: IWorkspaceState = { folders, storage: contributedData, version: this.version };
		await this.editSessionsStorageService.write('workspaceState', stringify(content));
		return null;
	}

	override async apply(): Promise<ISyncResourcePreview | null> {
		const payload = this.editSessionsStorageService.lastReadResources.get('editSessions')?.content;
		const workspaceStateId = payload ? (JSON.parse(payload) as EditSession).workspaceStateId : undefined;

		const resource = await this.editSessionsStorageService.read('workspaceState', workspaceStateId);
		if (!resource) {
			return null;
		}

		const remoteWorkspaceState: IWorkspaceState = parse(resource.content);
		if (!remoteWorkspaceState) {
			this.logService.info('Skipping initializing workspace state because remote workspace state does not exist.');
			return null;
		}

		// Evaluate whether storage is applicable for current workspace
		const cancellationTokenSource = new CancellationTokenSource();
		const replaceUris = await this.workspaceIdentityService.matches(remoteWorkspaceState.folders, cancellationTokenSource.token);
		if (!replaceUris) {
			this.logService.info('Skipping initializing workspace state because remote workspace state does not match current workspace.');
			return null;
		}

		const storage: IStringDictionary<any> = {};
		for (const key of Object.keys(remoteWorkspaceState.storage)) {
			storage[key] = remoteWorkspaceState.storage[key];
		}

		if (Object.keys(storage).length) {
			// Initialize storage with remote storage
			const storageEntries: Array<IStorageEntry> = [];
			for (const key of Object.keys(storage)) {
				// Deserialize the stored state
				try {
					const value = parse(storage[key]);
					// Run URI conversion on the stored state
					replaceUris(value);
					storageEntries.push({ key, value, scope: StorageScope.WORKSPACE, target: StorageTarget.USER });
				} catch {
					storageEntries.push({ key, value: storage[key], scope: StorageScope.WORKSPACE, target: StorageTarget.USER });
				}
			}
			this.storageService.storeAll(storageEntries, true);
		}

		this.editSessionsStorageService.delete('workspaceState', resource.ref);
		return null;
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 158: Error message without production error code - breaks React bundle size optimization
//   2. Line 158: Error message without production error code - breaks React bundle size optimization
//   3. Line 164: Error message without production error code - breaks React bundle size optimization
//   4. Line 164: Error message without production error code - breaks React bundle size optimization
//   5. Line 167: Error message without production error code - breaks React bundle size optimization
//   6. Line 167: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	// TODO@joyceerhl implement AbstractSynchronizer in full
	protected override applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, result: [IResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}
	protected override async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, token: CancellationToken): Promise<IResourcePreview[]> {
		return [];
	}
	protected override getMergeResult(resourcePreview: IResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		throw new Error('Method not implemented.');
	}
	protected override getAcceptResult(resourcePreview: IResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {
		throw new Error('Method not implemented.');
	}
	protected override async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		return true;
	}
	override async hasLocalData(): Promise<boolean> {
		return false;
	}
	override async resolveContent(uri: URI): Promise<string | null> {
		return null;
	}
}
