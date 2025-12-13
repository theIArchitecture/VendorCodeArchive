/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Platform } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const INativeMcpDiscoveryHelperService = createDecorator<INativeMcpDiscoveryHelperService>('INativeMcpDiscoveryHelperService');

export const NativeMcpDiscoveryHelperChannelName = 'NativeMcpDiscoveryHelper';

export interface INativeMcpDiscoveryData {
	// platform and homedir are duplicated by the remote/native environment, but here for convenience
	platform: Platform;
	homedir: URI;
	winAppData?: URI;
	xdgHome?: URI;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface INativeMcpDiscoveryHelperService {
	readonly _serviceBrand: undefined;

	load(): Promise<INativeMcpDiscoveryData>;
}
