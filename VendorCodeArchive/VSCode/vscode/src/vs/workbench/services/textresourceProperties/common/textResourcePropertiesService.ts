/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { Schemas } from '../../../../base/common/network.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class TextResourcePropertiesService implements ITextResourcePropertiesService {

	declare readonly _serviceBrand: undefined;

	private remoteEnvironment: IRemoteAgentEnvironment | null = null;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IStorageService private readonly storageService: IStorageService
	) {
		remoteAgentService.getEnvironment().then(remoteEnv => this.remoteEnvironment = remoteEnv);
	}

	getEOL(resource?: URI, language?: string): string {
		const eol = this.configurationService.getValue('files.eol', { overrideIdentifier: language, resource });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		const os = this.getOS(resource);
		return os === OperatingSystem.Linux || os === OperatingSystem.Macintosh ? '\n' : '\r\n';
	}

	private getOS(resource?: URI): OperatingSystem {
		let os = OS;

		const remoteAuthority = this.environmentService.remoteAuthority;
		if (remoteAuthority) {
			if (resource && resource.scheme !== Schemas.file) {
				const osCacheKey = `resource.authority.os.${remoteAuthority}`;
				os = this.remoteEnvironment ? this.remoteEnvironment.os : /* Get it from cache */ this.storageService.getNumber(osCacheKey, StorageScope.WORKSPACE, OS);
				this.storageService.store(osCacheKey, os, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		}

		return os;
	}
}

registerSingleton(ITextResourcePropertiesService, TextResourcePropertiesService, InstantiationType.Delayed);
