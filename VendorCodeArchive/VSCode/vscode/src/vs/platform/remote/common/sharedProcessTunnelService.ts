/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IAddress } from './remoteAgentConnection.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ISharedProcessTunnelService = createDecorator<ISharedProcessTunnelService>('sharedProcessTunnelService');

export const ipcSharedProcessTunnelChannelName = 'sharedProcessTunnel';

export interface ISharedProcessTunnel {
	tunnelLocalPort: number | undefined;
	localAddress: string;
}

/**
 * A service that creates tunnels on the shared process
 */
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface ISharedProcessTunnelService {
	readonly _serviceBrand: undefined;

	/**
	 * Create a tunnel.
	 */
	createTunnel(): Promise<{ id: string }>;
	/**
	 * Start a previously created tunnel.
	 * Can only be called once per created tunnel.
	 */
	startTunnel(authority: string, id: string, tunnelRemoteHost: string, tunnelRemotePort: number, tunnelLocalHost: string, tunnelLocalPort: number | undefined, elevateIfNeeded: boolean | undefined): Promise<ISharedProcessTunnel>;
	/**
	 * Set the remote address info for a previously created tunnel.
	 * Should be called as often as the resolver resolves.
	 */
	setAddress(id: string, address: IAddress): Promise<void>;
	/**
	 * Destroy a previously created tunnel.
	 */
	destroyTunnel(id: string): Promise<void>;
}
