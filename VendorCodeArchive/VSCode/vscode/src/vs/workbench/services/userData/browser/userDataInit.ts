//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { mark } from '../../../../base/common/performance.js';

export interface IUserDataInitializer {
	requiresInitialization(): Promise<boolean>;
	whenInitializationFinished(): Promise<void>;
	initializeRequiredResources(): Promise<void>;
	initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void>;
	initializeOtherResources(instantiationService: IInstantiationService): Promise<void>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataInitializationService = createDecorator<IUserDataInitializationService>('IUserDataInitializationService');
export interface IUserDataInitializationService extends IUserDataInitializer {
	_serviceBrand: any;
}

export class UserDataInitializationService implements IUserDataInitializationService {

	_serviceBrand: any;

	constructor(private readonly initializers: IUserDataInitializer[] = []) {
	}

	async whenInitializationFinished(): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.whenInitializationFinished()));
		}
	}

	async requiresInitialization(): Promise<boolean> {
		return (await Promise.all(this.initializers.map(initializer => initializer.requiresInitialization()))).some(result => result);
	}

	async initializeRequiredResources(): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeRequiredResources()));
		}
	}

	async initializeOtherResources(instantiationService: IInstantiationService): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeOtherResources(instantiationService)));
		}
	}

	async initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeInstalledExtensions(instantiationService)));
		}
	}

}

class InitializeOtherResourcesContribution implements IWorkbenchContribution {
	constructor(
		@IUserDataInitializationService userDataInitializeService: IUserDataInitializationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IExtensionService extensionService: IExtensionService
	) {
		extensionService.whenInstalledExtensionsRegistered().then(() => this.initializeOtherResource(userDataInitializeService, instantiationService));
	}

	private async initializeOtherResource(userDataInitializeService: IUserDataInitializationService, instantiationService: IInstantiationService): Promise<void> {
		if (await userDataInitializeService.requiresInitialization()) {
			mark('code/willInitOtherUserData');
			await userDataInitializeService.initializeOtherResources(instantiationService);
			mark('code/didInitOtherUserData');
		}
	}
}

if (isWeb) {
	const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench);
	workbenchRegistry.registerWorkbenchContribution(InitializeOtherResourcesContribution, LifecyclePhase.Restored);
}
