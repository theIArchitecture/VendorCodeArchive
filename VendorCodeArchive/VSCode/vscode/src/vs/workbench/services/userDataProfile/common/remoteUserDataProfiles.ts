//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { DidChangeProfilesEvent, IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUserDataProfileService } from './userDataProfile.js';
import { distinct } from '../../../../base/common/arrays.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { UserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfileIpc.js';
import { ErrorNoTelemetry } from '../../../../base/common/errors.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

const associatedRemoteProfilesKey = 'associatedRemoteProfiles';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 68: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 101: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 112: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 201: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 201: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 222: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 255: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 256: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 256: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 266: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 267: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 267: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IRemoteUserDataProfilesService = createDecorator<IRemoteUserDataProfilesService>('IRemoteUserDataProfilesService');
export interface IRemoteUserDataProfilesService {
	readonly _serviceBrand: undefined;
	getRemoteProfiles(): Promise<readonly IUserDataProfile[]>;
	getRemoteProfile(localProfile: IUserDataProfile): Promise<IUserDataProfile>;
}

class RemoteUserDataProfilesService extends Disposable implements IRemoteUserDataProfilesService {

	readonly _serviceBrand: undefined;

	private readonly initPromise: Promise<void>;

	private remoteUserDataProfilesService: IUserDataProfilesService | undefined;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.initPromise = this.init();
	}

	private async init(): Promise<void> {
		const connection = this.remoteAgentService.getConnection();
		if (!connection) {
			return;
		}

		const environment = await this.remoteAgentService.getEnvironment();
		if (!environment) {
			return;
		}

		this.remoteUserDataProfilesService = new UserDataProfilesService(environment.profiles.all, environment.profiles.home, connection.getChannel('userDataProfiles'));
		this._register(this.userDataProfilesService.onDidChangeProfiles(e => this.onDidChangeLocalProfiles(e)));

		// Associate current local profile with remote profile
		const remoteProfile = await this.getAssociatedRemoteProfile(this.userDataProfileService.currentProfile, this.remoteUserDataProfilesService);
		if (!remoteProfile.isDefault) {
			this.setAssociatedRemoteProfiles([...this.getAssociatedRemoteProfiles(), remoteProfile.id]);
		}

		this.cleanUp();
	}

	private async onDidChangeLocalProfiles(e: DidChangeProfilesEvent): Promise<void> {
		for (const profile of e.removed) {
			const remoteProfile = this.remoteUserDataProfilesService?.profiles.find(p => p.id === profile.id);
			if (remoteProfile) {
				await this.remoteUserDataProfilesService?.removeProfile(remoteProfile);
			}
		}
	}

	async getRemoteProfiles(): Promise<readonly IUserDataProfile[]> {
		await this.initPromise;

		if (!this.remoteUserDataProfilesService) {
			throw new ErrorNoTelemetry('Remote profiles service not available in the current window');
		}

		return this.remoteUserDataProfilesService.profiles;
	}

	async getRemoteProfile(localProfile: IUserDataProfile): Promise<IUserDataProfile> {
		await this.initPromise;

		if (!this.remoteUserDataProfilesService) {
			throw new ErrorNoTelemetry('Remote profiles service not available in the current window');
		}

		return this.getAssociatedRemoteProfile(localProfile, this.remoteUserDataProfilesService);
	}

	private async getAssociatedRemoteProfile(localProfile: IUserDataProfile, remoteUserDataProfilesService: IUserDataProfilesService): Promise<IUserDataProfile> {
		// If the local profile is the default profile, return the remote default profile
		if (localProfile.isDefault) {
			return remoteUserDataProfilesService.defaultProfile;
		}

		let profile = remoteUserDataProfilesService.profiles.find(p => p.id === localProfile.id);
		if (!profile) {
			profile = await remoteUserDataProfilesService.createProfile(localProfile.id, localProfile.name, {
				transient: localProfile.isTransient,
				useDefaultFlags: localProfile.useDefaultFlags,
			});
			this.setAssociatedRemoteProfiles([...this.getAssociatedRemoteProfiles(), this.userDataProfileService.currentProfile.id]);
		}
		return profile;
	}

	private getAssociatedRemoteProfiles(): string[] {
		if (this.environmentService.remoteAuthority) {
			const remotes = this.parseAssociatedRemoteProfiles();
			return remotes[this.environmentService.remoteAuthority] ?? [];
		}
		return [];
	}

	private setAssociatedRemoteProfiles(profiles: string[]): void {
		if (this.environmentService.remoteAuthority) {
			const remotes = this.parseAssociatedRemoteProfiles();
			profiles = distinct(profiles);
			if (profiles.length) {
				remotes[this.environmentService.remoteAuthority] = profiles;
			} else {
				delete remotes[this.environmentService.remoteAuthority];
			}
			if (Object.keys(remotes).length) {
				this.storageService.store(associatedRemoteProfilesKey, JSON.stringify(remotes), StorageScope.APPLICATION, StorageTarget.MACHINE);
			} else {
				this.storageService.remove(associatedRemoteProfilesKey, StorageScope.APPLICATION);
			}
		}
	}

	private parseAssociatedRemoteProfiles(): IStringDictionary<string[]> {
		if (this.environmentService.remoteAuthority) {
			const value = this.storageService.get(associatedRemoteProfilesKey, StorageScope.APPLICATION);
			try {
				return value ? JSON.parse(value) : {};
			} catch (error) {
				this.logService.error(error);
			}
		}
		return {};
	}

	private async cleanUp(): Promise<void> {
		const associatedRemoteProfiles: string[] = [];
		for (const profileId of this.getAssociatedRemoteProfiles()) {
			const remoteProfile = this.remoteUserDataProfilesService?.profiles.find(p => p.id === profileId);
			if (!remoteProfile) {
				continue;
			}
			const localProfile = this.userDataProfilesService.profiles.find(p => p.id === profileId);
			if (localProfile) {
				if (localProfile.name !== remoteProfile.name) {
					await this.remoteUserDataProfilesService?.updateProfile(remoteProfile, { name: localProfile.name });
				}
				associatedRemoteProfiles.push(profileId);
				continue;
			}
			if (remoteProfile) {
				// Cleanup remote profiles those are not available locally
				await this.remoteUserDataProfilesService?.removeProfile(remoteProfile);
			}
		}
		this.setAssociatedRemoteProfiles(associatedRemoteProfiles);
	}

}

registerSingleton(IRemoteUserDataProfilesService, RemoteUserDataProfilesService, InstantiationType.Delayed);
