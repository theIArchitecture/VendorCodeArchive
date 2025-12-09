//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IStorage } from '../../../base/parts/storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, LifecycleMainPhase, ShutdownReason } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { AbstractStorageService, isProfileUsingDefaultStorage, IStorageService, StorageScope, StorageTarget } from '../common/storage.js';
import { ApplicationStorageMain, ProfileStorageMain, InMemoryStorageMain, IStorageMain, IStorageMainOptions, WorkspaceStorageMain, IStorageChangeEvent } from './storageMain.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesMainService } from '../../userDataProfile/electron-main/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { Schemas } from '../../../base/common/network.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 25: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

//#region Storage Main Service (intent: make application, profile and workspace storage accessible to windows from main process)

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 71: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 82: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 93: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 126: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 137: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 148: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 159: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 170: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 181: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 192: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 214: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 225: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 236: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 247: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IStorageMainService = createDecorator<IStorageMainService>('storageMainService');

export interface IProfileStorageChangeEvent extends IStorageChangeEvent {
	readonly storage: IStorageMain;
	readonly profile: IUserDataProfile;
}

export interface IStorageMainService {

	readonly _serviceBrand: undefined;

	/**
	 * Provides access to the application storage shared across all
	 * windows and all profiles.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       Rather use `IApplicationStorageMainService` for that purpose.
	 */
	readonly applicationStorage: IStorageMain;

	/**
	 * Emitted whenever data is updated or deleted in profile scoped storage.
	 */
	readonly onDidChangeProfileStorage: Event<IProfileStorageChangeEvent>;

	/**
	 * Provides access to the profile storage shared across all windows
	 * for the provided profile.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       This is currently not supported.
	 */
	profileStorage(profile: IUserDataProfile): IStorageMain;

	/**
	 * Provides access to the workspace storage specific to a single window.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       This is currently not supported.
	 */
	workspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain;

	/**
	 * Checks if the provided path is currently in use for a storage database.
	 *
	 * @param path the path to the storage file or parent folder
	 */
	isUsed(path: string): boolean;
}

export class StorageMainService extends Disposable implements IStorageMainService {

	declare readonly _serviceBrand: undefined;

	private shutdownReason: ShutdownReason | undefined = undefined;

	private readonly _onDidChangeProfileStorage = this._register(new Emitter<IProfileStorageChangeEvent>());
	readonly onDidChangeProfileStorage = this._onDidChangeProfileStorage.event;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IUserDataProfilesMainService private readonly userDataProfilesService: IUserDataProfilesMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this.applicationStorage = this._register(this.createApplicationStorage());

		this.registerListeners();
	}

	protected getStorageOptions(): IStorageMainOptions {
		return {
			useInMemoryStorage: !!this.environmentService.extensionTestsLocationURI // no storage during extension tests!
		};
	}

	private registerListeners(): void {

		// Application Storage: Warmup when any window opens
		(async () => {
			await this.lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen);

			this.applicationStorage.init();
		})();

		this._register(this.lifecycleMainService.onWillLoadWindow(e => {

			// Profile Storage: Warmup when related window with profile loads
			if (e.window.profile) {
				this.profileStorage(e.window.profile).init();
			}

			// Workspace Storage: Warmup when related window with workspace loads
			if (e.workspace) {
				this.workspaceStorage(e.workspace).init();
			}
		}));

		// All Storage: Close when shutting down
		this._register(this.lifecycleMainService.onWillShutdown(e => {
			this.logService.trace('storageMainService#onWillShutdown()');

			// Remember shutdown reason
			this.shutdownReason = e.reason;

			// Application Storage
			e.join('applicationStorage', this.applicationStorage.close());

			// Profile Storage(s)
			for (const [, profileStorage] of this.mapProfileToStorage) {
				e.join('profileStorage', profileStorage.close());
			}

			// Workspace Storage(s)
			for (const [, workspaceStorage] of this.mapWorkspaceToStorage) {
				e.join('workspaceStorage', workspaceStorage.close());
			}
		}));

		// Prepare storage location as needed
		this._register(this.userDataProfilesService.onWillCreateProfile(e => {
			e.join((async () => {
				if (!(await this.fileService.exists(e.profile.globalStorageHome))) {
					await this.fileService.createFolder(e.profile.globalStorageHome);
				}
			})());
		}));

		// Close the storage of the profile that is being removed
		this._register(this.userDataProfilesService.onWillRemoveProfile(e => {
			const storage = this.mapProfileToStorage.get(e.profile.id);
			if (storage) {
				e.join(storage.close());
			}
		}));
	}

	//#region Application Storage

	readonly applicationStorage: IStorageMain;

	private createApplicationStorage(): IStorageMain {
		this.logService.trace(`StorageMainService: creating application storage`);

		const applicationStorage = new ApplicationStorageMain(this.getStorageOptions(), this.userDataProfilesService, this.logService, this.fileService);

		this._register(Event.once(applicationStorage.onDidCloseStorage)(() => {
			this.logService.trace(`StorageMainService: closed application storage`);
		}));

		return applicationStorage;
	}

	//#endregion

	//#region Profile Storage

	private readonly mapProfileToStorage = new Map<string /* profile ID */, IStorageMain>();

	profileStorage(profile: IUserDataProfile): IStorageMain {
		if (isProfileUsingDefaultStorage(profile)) {
			return this.applicationStorage; // for profiles using default storage, use application storage
		}

		let profileStorage = this.mapProfileToStorage.get(profile.id);
		if (!profileStorage) {
			this.logService.trace(`StorageMainService: creating profile storage (${profile.name})`);

			profileStorage = this._register(this.createProfileStorage(profile));
			this.mapProfileToStorage.set(profile.id, profileStorage);

			const listener = this._register(profileStorage.onDidChangeStorage(e => this._onDidChangeProfileStorage.fire({
				...e,
				storage: profileStorage!,
				profile
			})));

			this._register(Event.once(profileStorage.onDidCloseStorage)(() => {
				this.logService.trace(`StorageMainService: closed profile storage (${profile.name})`);

				this.mapProfileToStorage.delete(profile.id);
				listener.dispose();
			}));
		}

		return profileStorage;
	}

	private createProfileStorage(profile: IUserDataProfile): IStorageMain {
		if (this.shutdownReason === ShutdownReason.KILL) {

			// Workaround for native crashes that we see when
			// SQLite DBs are being created even after shutdown
			// https://github.com/microsoft/vscode/issues/143186

			return new InMemoryStorageMain(this.logService, this.fileService);
		}

		return new ProfileStorageMain(profile, this.getStorageOptions(), this.logService, this.fileService);
	}

	//#endregion


	//#region Workspace Storage

	private readonly mapWorkspaceToStorage = new Map<string /* workspace ID */, IStorageMain>();

	workspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain {
		let workspaceStorage = this.mapWorkspaceToStorage.get(workspace.id);
		if (!workspaceStorage) {
			this.logService.trace(`StorageMainService: creating workspace storage (${workspace.id})`);

			workspaceStorage = this._register(this.createWorkspaceStorage(workspace));
			this.mapWorkspaceToStorage.set(workspace.id, workspaceStorage);

			this._register(Event.once(workspaceStorage.onDidCloseStorage)(() => {
				this.logService.trace(`StorageMainService: closed workspace storage (${workspace.id})`);

				this.mapWorkspaceToStorage.delete(workspace.id);
			}));
		}

		return workspaceStorage;
	}

	private createWorkspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain {
		if (this.shutdownReason === ShutdownReason.KILL) {

			// Workaround for native crashes that we see when
			// SQLite DBs are being created even after shutdown
			// https://github.com/microsoft/vscode/issues/143186

			return new InMemoryStorageMain(this.logService, this.fileService);
		}

		return new WorkspaceStorageMain(workspace, this.getStorageOptions(), this.logService, this.environmentService, this.fileService);
	}

	//#endregion

	isUsed(path: string): boolean {
		const pathUri = URI.file(path);

		for (const storage of [this.applicationStorage, ...this.mapProfileToStorage.values(), ...this.mapWorkspaceToStorage.values()]) {
			if (!storage.path) {
				continue;
			}

			if (this.uriIdentityService.extUri.isEqualOrParent(URI.file(storage.path), pathUri)) {
				return true;
			}
		}

		return false;
	}
}

//#endregion


// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

//#region Application Main Storage Service (intent: use application storage from main process)

export const IApplicationStorageMainService = createDecorator<IStorageMainService>('applicationStorageMainService');

/**
 * A specialized `IStorageService` interface that only allows
 * access to the `StorageScope.APPLICATION` scope.
 */
export interface IApplicationStorageMainService extends IStorageService {

	/**
	 * Important: unlike other storage services in the renderer, the
	 * main process does not await the storage to be ready, rather
	 * storage is being initialized while a window opens to reduce
	 * pressure on startup.
	 *
	 * As such, any client wanting to access application storage from the
	 * main process needs to wait for `whenReady`, otherwise there is
	 * a chance that the service operates on an in-memory store that
	 * is not backed by any persistent DB.
	 */
	readonly whenReady: Promise<void>;

	get(key: string, scope: StorageScope.APPLICATION, fallbackValue: string): string;
	get(key: string, scope: StorageScope.APPLICATION, fallbackValue?: string): string | undefined;

	getBoolean(key: string, scope: StorageScope.APPLICATION, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope.APPLICATION, fallbackValue?: boolean): boolean | undefined;

	getNumber(key: string, scope: StorageScope.APPLICATION, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope.APPLICATION, fallbackValue?: number): number | undefined;

	store(key: string, value: string | boolean | number | undefined | null, scope: StorageScope.APPLICATION, target: StorageTarget): void;

	remove(key: string, scope: StorageScope.APPLICATION): void;

	keys(scope: StorageScope.APPLICATION, target: StorageTarget): string[];

	switch(): never;

	isNew(scope: StorageScope.APPLICATION): boolean;
}

export class ApplicationStorageMainService extends AbstractStorageService implements IApplicationStorageMainService {

	declare readonly _serviceBrand: undefined;

	readonly whenReady: Promise<void>;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IStorageMainService private readonly storageMainService: IStorageMainService
	) {
		super();

		this.whenReady = this.storageMainService.applicationStorage.whenInit;
	}

	protected doInitialize(): Promise<void> {

		// application storage is being initialized as part
		// of the first window opening, so we do not trigger
		// it here but can join it
		return this.storageMainService.applicationStorage.whenInit;
	}

	protected getStorage(scope: StorageScope): IStorage | undefined {
		if (scope === StorageScope.APPLICATION) {
			return this.storageMainService.applicationStorage.storage;
		}

		return undefined; // any other scope is unsupported from main process
	}

	protected getLogDetails(scope: StorageScope): string | undefined {
		if (scope === StorageScope.APPLICATION) {
			return this.userDataProfilesService.defaultProfile.globalStorageHome.with({ scheme: Schemas.file }).fsPath;
		}

		return undefined; // any other scope is unsupported from main process
	}

	protected override shouldFlushWhenIdle(): boolean {
		return false; // not needed here, will be triggered from any window that is opened
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 377: Error message without production error code - breaks React bundle size optimization
//   2. Line 377: Error message without production error code - breaks React bundle size optimization
//   3. Line 381: Error message without production error code - breaks React bundle size optimization
//   4. Line 381: Error message without production error code - breaks React bundle size optimization
//   5. Line 385: Error message without production error code - breaks React bundle size optimization
//   6. Line 385: Error message without production error code - breaks React bundle size optimization
//   7. Line 389: Error message without production error code - breaks React bundle size optimization
//   8. Line 389: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	override switch(): never {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 413: Error message without production error code - breaks React bundle size optimization
//   2. Line 413: Error message without production error code - breaks React bundle size optimization
//   3. Line 417: Error message without production error code - breaks React bundle size optimization
//   4. Line 417: Error message without production error code - breaks React bundle size optimization
//   5. Line 421: Error message without production error code - breaks React bundle size optimization
//   6. Line 421: Error message without production error code - breaks React bundle size optimization
//   7. Line 425: Error message without production error code - breaks React bundle size optimization
//   8. Line 425: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 440: Error message without production error code - breaks React bundle size optimization
//   2. Line 440: Error message without production error code - breaks React bundle size optimization
//   3. Line 444: Error message without production error code - breaks React bundle size optimization
//   4. Line 444: Error message without production error code - breaks React bundle size optimization
//   5. Line 448: Error message without production error code - breaks React bundle size optimization
//   6. Line 448: Error message without production error code - breaks React bundle size optimization
//   7. Line 452: Error message without production error code - breaks React bundle size optimization
//   8. Line 452: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 467: Error message without production error code - breaks React bundle size optimization
//   2. Line 467: Error message without production error code - breaks React bundle size optimization
//   3. Line 471: Error message without production error code - breaks React bundle size optimization
//   4. Line 471: Error message without production error code - breaks React bundle size optimization
//   5. Line 475: Error message without production error code - breaks React bundle size optimization
//   6. Line 475: Error message without production error code - breaks React bundle size optimization
//   7. Line 479: Error message without production error code - breaks React bundle size optimization
//   8. Line 479: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 494: Error message without production error code - breaks React bundle size optimization
//   2. Line 494: Error message without production error code - breaks React bundle size optimization
//   3. Line 498: Error message without production error code - breaks React bundle size optimization
//   4. Line 498: Error message without production error code - breaks React bundle size optimization
//   5. Line 502: Error message without production error code - breaks React bundle size optimization
//   6. Line 502: Error message without production error code - breaks React bundle size optimization
//   7. Line 506: Error message without production error code - breaks React bundle size optimization
//   8. Line 506: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 521: Error message without production error code - breaks React bundle size optimization
//   2. Line 521: Error message without production error code - breaks React bundle size optimization
//   3. Line 525: Error message without production error code - breaks React bundle size optimization
//   4. Line 525: Error message without production error code - breaks React bundle size optimization
//   5. Line 529: Error message without production error code - breaks React bundle size optimization
//   6. Line 529: Error message without production error code - breaks React bundle size optimization
//   7. Line 533: Error message without production error code - breaks React bundle size optimization
//   8. Line 533: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 548: Error message without production error code - breaks React bundle size optimization
//   2. Line 548: Error message without production error code - breaks React bundle size optimization
//   3. Line 552: Error message without production error code - breaks React bundle size optimization
//   4. Line 552: Error message without production error code - breaks React bundle size optimization
//   5. Line 556: Error message without production error code - breaks React bundle size optimization
//   6. Line 556: Error message without production error code - breaks React bundle size optimization
//   7. Line 560: Error message without production error code - breaks React bundle size optimization
//   8. Line 560: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 575: Error message without production error code - breaks React bundle size optimization
//   2. Line 575: Error message without production error code - breaks React bundle size optimization
//   3. Line 579: Error message without production error code - breaks React bundle size optimization
//   4. Line 579: Error message without production error code - breaks React bundle size optimization
//   5. Line 583: Error message without production error code - breaks React bundle size optimization
//   6. Line 583: Error message without production error code - breaks React bundle size optimization
//   7. Line 587: Error message without production error code - breaks React bundle size optimization
//   8. Line 587: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 602: Error message without production error code - breaks React bundle size optimization
//   2. Line 602: Error message without production error code - breaks React bundle size optimization
//   3. Line 606: Error message without production error code - breaks React bundle size optimization
//   4. Line 606: Error message without production error code - breaks React bundle size optimization
//   5. Line 610: Error message without production error code - breaks React bundle size optimization
//   6. Line 610: Error message without production error code - breaks React bundle size optimization
//   7. Line 614: Error message without production error code - breaks React bundle size optimization
//   8. Line 614: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 629: Error message without production error code - breaks React bundle size optimization
//   2. Line 629: Error message without production error code - breaks React bundle size optimization
//   3. Line 633: Error message without production error code - breaks React bundle size optimization
//   4. Line 633: Error message without production error code - breaks React bundle size optimization
//   5. Line 637: Error message without production error code - breaks React bundle size optimization
//   6. Line 637: Error message without production error code - breaks React bundle size optimization
//   7. Line 641: Error message without production error code - breaks React bundle size optimization
//   8. Line 641: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 656: Error message without production error code - breaks React bundle size optimization
//   2. Line 656: Error message without production error code - breaks React bundle size optimization
//   3. Line 660: Error message without production error code - breaks React bundle size optimization
//   4. Line 660: Error message without production error code - breaks React bundle size optimization
//   5. Line 664: Error message without production error code - breaks React bundle size optimization
//   6. Line 664: Error message without production error code - breaks React bundle size optimization
//   7. Line 668: Error message without production error code - breaks React bundle size optimization
//   8. Line 668: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 683: Error message without production error code - breaks React bundle size optimization
//   2. Line 683: Error message without production error code - breaks React bundle size optimization
//   3. Line 687: Error message without production error code - breaks React bundle size optimization
//   4. Line 687: Error message without production error code - breaks React bundle size optimization
//   5. Line 691: Error message without production error code - breaks React bundle size optimization
//   6. Line 691: Error message without production error code - breaks React bundle size optimization
//   7. Line 695: Error message without production error code - breaks React bundle size optimization
//   8. Line 695: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 710: Error message without production error code - breaks React bundle size optimization
//   2. Line 710: Error message without production error code - breaks React bundle size optimization
//   3. Line 714: Error message without production error code - breaks React bundle size optimization
//   4. Line 714: Error message without production error code - breaks React bundle size optimization
//   5. Line 718: Error message without production error code - breaks React bundle size optimization
//   6. Line 718: Error message without production error code - breaks React bundle size optimization
//   7. Line 722: Error message without production error code - breaks React bundle size optimization
//   8. Line 722: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 737: Error message without production error code - breaks React bundle size optimization
//   2. Line 737: Error message without production error code - breaks React bundle size optimization
//   3. Line 741: Error message without production error code - breaks React bundle size optimization
//   4. Line 741: Error message without production error code - breaks React bundle size optimization
//   5. Line 745: Error message without production error code - breaks React bundle size optimization
//   6. Line 745: Error message without production error code - breaks React bundle size optimization
//   7. Line 749: Error message without production error code - breaks React bundle size optimization
//   8. Line 749: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 764: Error message without production error code - breaks React bundle size optimization
//   2. Line 764: Error message without production error code - breaks React bundle size optimization
//   3. Line 768: Error message without production error code - breaks React bundle size optimization
//   4. Line 768: Error message without production error code - breaks React bundle size optimization
//   5. Line 772: Error message without production error code - breaks React bundle size optimization
//   6. Line 772: Error message without production error code - breaks React bundle size optimization
//   7. Line 776: Error message without production error code - breaks React bundle size optimization
//   8. Line 776: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 791: Error message without production error code - breaks React bundle size optimization
//   2. Line 791: Error message without production error code - breaks React bundle size optimization
//   3. Line 795: Error message without production error code - breaks React bundle size optimization
//   4. Line 795: Error message without production error code - breaks React bundle size optimization
//   5. Line 799: Error message without production error code - breaks React bundle size optimization
//   6. Line 799: Error message without production error code - breaks React bundle size optimization
//   7. Line 803: Error message without production error code - breaks React bundle size optimization
//   8. Line 803: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 818: Error message without production error code - breaks React bundle size optimization
//   2. Line 818: Error message without production error code - breaks React bundle size optimization
//   3. Line 822: Error message without production error code - breaks React bundle size optimization
//   4. Line 822: Error message without production error code - breaks React bundle size optimization
//   5. Line 826: Error message without production error code - breaks React bundle size optimization
//   6. Line 826: Error message without production error code - breaks React bundle size optimization
//   7. Line 830: Error message without production error code - breaks React bundle size optimization
//   8. Line 830: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 845: Error message without production error code - breaks React bundle size optimization
//   2. Line 845: Error message without production error code - breaks React bundle size optimization
//   3. Line 849: Error message without production error code - breaks React bundle size optimization
//   4. Line 849: Error message without production error code - breaks React bundle size optimization
//   5. Line 853: Error message without production error code - breaks React bundle size optimization
//   6. Line 853: Error message without production error code - breaks React bundle size optimization
//   7. Line 857: Error message without production error code - breaks React bundle size optimization
//   8. Line 857: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 872: Error message without production error code - breaks React bundle size optimization
//   2. Line 872: Error message without production error code - breaks React bundle size optimization
//   3. Line 876: Error message without production error code - breaks React bundle size optimization
//   4. Line 876: Error message without production error code - breaks React bundle size optimization
//   5. Line 880: Error message without production error code - breaks React bundle size optimization
//   6. Line 880: Error message without production error code - breaks React bundle size optimization
//   7. Line 884: Error message without production error code - breaks React bundle size optimization
//   8. Line 884: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 899: Error message without production error code - breaks React bundle size optimization
//   2. Line 899: Error message without production error code - breaks React bundle size optimization
//   3. Line 903: Error message without production error code - breaks React bundle size optimization
//   4. Line 903: Error message without production error code - breaks React bundle size optimization
//   5. Line 907: Error message without production error code - breaks React bundle size optimization
//   6. Line 907: Error message without production error code - breaks React bundle size optimization
//   7. Line 911: Error message without production error code - breaks React bundle size optimization
//   8. Line 911: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 926: Error message without production error code - breaks React bundle size optimization
//   2. Line 926: Error message without production error code - breaks React bundle size optimization
//   3. Line 930: Error message without production error code - breaks React bundle size optimization
//   4. Line 930: Error message without production error code - breaks React bundle size optimization
//   5. Line 934: Error message without production error code - breaks React bundle size optimization
//   6. Line 934: Error message without production error code - breaks React bundle size optimization
//   7. Line 938: Error message without production error code - breaks React bundle size optimization
//   8. Line 938: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Migrating storage is unsupported from main process');
	}

	protected switchToProfile(): never {
		throw new Error('Switching storage profile is unsupported from main process');
	}

	protected switchToWorkspace(): never {
		throw new Error('Switching storage workspace is unsupported from main process');
	}

	hasScope(): never {
		throw new Error('Main process is never profile or workspace scoped');
	}
}
