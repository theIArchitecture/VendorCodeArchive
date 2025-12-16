/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir } from 'os';
import { platform } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { INativeMcpDiscoveryData, INativeMcpDiscoveryHelperService } from '../common/nativeMcpDiscoveryHelper.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class NativeMcpDiscoveryHelperService implements INativeMcpDiscoveryHelperService {
	declare readonly _serviceBrand: undefined;

	constructor() { }

	load(): Promise<INativeMcpDiscoveryData> {
		return Promise.resolve({
			platform,
			homedir: URI.file(homedir()),
			winAppData: this.uriFromEnvVariable('APPDATA'),
			xdgHome: this.uriFromEnvVariable('XDG_CONFIG_HOME'),
		});
	}

	private uriFromEnvVariable(varName: string) {
		const envVar = process.env[varName];
		if (!envVar) {
			return undefined;
		}
		return URI.file(envVar);
	}
}

