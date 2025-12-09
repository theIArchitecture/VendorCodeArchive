//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Event } from '../../../base/common/event.js';
import { localize } from '../../../nls.js';

export interface IRemoteTunnelSession {
	readonly providerId: string;
	readonly sessionId: string;
	readonly accountLabel: string;
	readonly token?: string;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export const IRemoteTunnelService = createDecorator<IRemoteTunnelService>('IRemoteTunnelService');
export interface IRemoteTunnelService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeTunnelStatus: Event<TunnelStatus>;
	getTunnelStatus(): Promise<TunnelStatus>;

	getMode(): Promise<TunnelMode>;
	readonly onDidChangeMode: Event<TunnelMode>;

	readonly onDidTokenFailed: Event<IRemoteTunnelSession | undefined>;
	initialize(mode: TunnelMode): Promise<TunnelStatus>;

	startTunnel(mode: ActiveTunnelMode): Promise<TunnelStatus>;
	stopTunnel(): Promise<void>;
	getTunnelName(): Promise<string | undefined>;

}

export interface ActiveTunnelMode {
	readonly active: true;
	readonly session: IRemoteTunnelSession;
	readonly asService: boolean;
}

export interface InactiveTunnelMode {
	readonly active: false;
}

export const INACTIVE_TUNNEL_MODE: InactiveTunnelMode = { active: false };

/** Saved mode for the tunnel. */
export type TunnelMode = ActiveTunnelMode | InactiveTunnelMode;

export type TunnelStatus = TunnelStates.Connected | TunnelStates.Disconnected | TunnelStates.Connecting | TunnelStates.Uninitialized;

export namespace TunnelStates {
	export interface Uninitialized {
		readonly type: 'uninitialized';
	}
	export interface Connecting {
		readonly type: 'connecting';
		readonly progress?: string;
	}
	export interface Connected {
		readonly type: 'connected';
		readonly info: ConnectionInfo;
		readonly serviceInstallFailed: boolean;
	}
	export interface Disconnected {
		readonly type: 'disconnected';
		readonly onTokenFailed?: IRemoteTunnelSession;
	}
	export const disconnected = (onTokenFailed?: IRemoteTunnelSession): Disconnected => ({ type: 'disconnected', onTokenFailed });
	export const connected = (info: ConnectionInfo, serviceInstallFailed: boolean): Connected => ({ type: 'connected', info, serviceInstallFailed });
	export const connecting = (progress?: string): Connecting => ({ type: 'connecting', progress });
	export const uninitialized: Uninitialized = { type: 'uninitialized' };

}

export interface ConnectionInfo {
	link: string;
	domain: string;
	tunnelName: string;
	isAttached: boolean;
}

export const CONFIGURATION_KEY_PREFIX = 'remote.tunnels.access';
export const CONFIGURATION_KEY_HOST_NAME = CONFIGURATION_KEY_PREFIX + '.hostNameOverride';
export const CONFIGURATION_KEY_PREVENT_SLEEP = CONFIGURATION_KEY_PREFIX + '.preventSleep';

export const LOG_ID = 'remoteTunnelService';
export const LOGGER_NAME = localize('remoteTunnelLog', "Remote Tunnel Service");
