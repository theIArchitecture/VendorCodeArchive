//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, Disposable } from '../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IAddressProvider } from '../../remote/common/remoteAgentConnection.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { TunnelPrivacy } from '../../remote/common/remoteAuthorityResolver.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 29: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ITunnelService = createDecorator<ITunnelService>('tunnelService');
export const ISharedTunnelsService = createDecorator<ISharedTunnelsService>('sharedTunnelsService');

export interface RemoteTunnel {
	readonly tunnelRemotePort: number;
	readonly tunnelRemoteHost: string;
	readonly tunnelLocalPort?: number;
	readonly localAddress: string;
	readonly privacy: string;
	readonly protocol?: string;
	dispose(silent?: boolean): Promise<void>;
}

export interface TunnelOptions {
	remoteAddress: { port: number; host: string };
	localAddressPort?: number;
	label?: string;
	public?: boolean;
	privacy?: string;
	protocol?: string;
}

export enum TunnelProtocol {
	Http = 'http',
	Https = 'https'
}

export enum TunnelPrivacyId {
	ConstantPrivate = 'constantPrivate', // private, and changing is unsupported
	Private = 'private',
	Public = 'public'
}

export interface TunnelCreationOptions {
	elevationRequired?: boolean;
}

export interface TunnelProviderFeatures {
	elevation: boolean;
	/**
	 * @deprecated
	 */
	public?: boolean;
	privacyOptions: TunnelPrivacy[];
	protocol: boolean;
}

export interface ITunnelProvider {
	forwardPort(tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions): Promise<RemoteTunnel | string | undefined> | undefined;
}

export function isTunnelProvider(addressOrTunnelProvider: IAddressProvider | ITunnelProvider): addressOrTunnelProvider is ITunnelProvider {
	return !!(addressOrTunnelProvider as ITunnelProvider).forwardPort;
}

export enum ProvidedOnAutoForward {
	Notify = 1,
	OpenBrowser = 2,
	OpenPreview = 3,
	Silent = 4,
	Ignore = 5,
	OpenBrowserOnce = 6
}

export interface ProvidedPortAttributes {
	port: number;
	autoForwardAction: ProvidedOnAutoForward;
}

export interface PortAttributesProvider {
	providePortAttributes(ports: number[], pid: number | undefined, commandLine: string | undefined, token: CancellationToken): Promise<ProvidedPortAttributes[]>;
}

export interface ITunnel {
	remoteAddress: { port: number; host: string };

	/**
	 * The complete local address(ex. localhost:1234)
	 */
	localAddress: string;

	/**
	 * @deprecated Use privacy instead
	 */
	public?: boolean;

	privacy?: string;

	protocol?: string;

	/**
	 * Implementers of Tunnel should fire onDidDispose when dispose is called.
	 */
	onDidDispose: Event<void>;

	dispose(): Promise<void> | void;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 121: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 121: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 161: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 161: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 173: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 173: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 191: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 191: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 215: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 215: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 227: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 227: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 239: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 239: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 275: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 275: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 281: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 281: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 335: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 335: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 341: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 341: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 347: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 347: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 353: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 353: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 359: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 359: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 365: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 365: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 389: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 389: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 395: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 395: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 401: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 401: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 407: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 407: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 419: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 419: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 425: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 425: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 431: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 431: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 443: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 443: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 455: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 455: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 461: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 461: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 467: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 467: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface ISharedTunnelsService {
	readonly _serviceBrand: undefined;

	openTunnel(authority: string, addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost: string, localPort?: number, elevateIfNeeded?: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;
}

export interface ITunnelService {
	readonly _serviceBrand: undefined;

	readonly tunnels: Promise<readonly RemoteTunnel[]>;
	readonly canChangePrivacy: boolean;
	readonly privacyOptions: TunnelPrivacy[];
	readonly onTunnelOpened: Event<RemoteTunnel>;
	readonly onTunnelClosed: Event<{ host: string; port: number }>;
	readonly canElevate: boolean;
	readonly canChangeProtocol: boolean;
	readonly hasTunnelProvider: boolean;
	readonly onAddedTunnelProvider: Event<void>;

	canTunnel(uri: URI): boolean;
	openTunnel(addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost?: string, localPort?: number, elevateIfNeeded?: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;
	getExistingTunnel(remoteHost: string, remotePort: number): Promise<RemoteTunnel | string | undefined>;
	setEnvironmentTunnel(remoteHost: string, remotePort: number, localAddress: string, privacy: string, protocol: string): void;
	closeTunnel(remoteHost: string, remotePort: number): Promise<void>;
	setTunnelProvider(provider: ITunnelProvider | undefined): IDisposable;
	setTunnelFeatures(features: TunnelProviderFeatures): void;
	isPortPrivileged(port: number): boolean;
}

export function extractLocalHostUriMetaDataForPortMapping(uri: URI): { address: string; port: number } | undefined {
	if (uri.scheme !== 'http' && uri.scheme !== 'https') {
		return undefined;
	}
	const localhostMatch = /^(localhost|127\.0\.0\.1|0\.0\.0\.0):(\d+)$/.exec(uri.authority);
	if (!localhostMatch) {
		return undefined;
	}
	return {
		address: localhostMatch[1],
		port: +localhostMatch[2],
	};
}

export function extractQueryLocalHostUriMetaDataForPortMapping(uri: URI): { address: string; port: number } | undefined {
	if (uri.scheme !== 'http' && uri.scheme !== 'https' || !uri.query) {
		return undefined;
	}
	const keyvalues = uri.query.split('&');
	for (const keyvalue of keyvalues) {
		const value = keyvalue.split('=')[1];
		if (/^https?:/.exec(value)) {
			const result = extractLocalHostUriMetaDataForPortMapping(URI.parse(value));
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}

export const LOCALHOST_ADDRESSES = ['localhost', '127.0.0.1', '0:0:0:0:0:0:0:1', '::1'];
export function isLocalhost(host: string): boolean {
	return LOCALHOST_ADDRESSES.indexOf(host) >= 0;
}

export const ALL_INTERFACES_ADDRESSES = ['0.0.0.0', '0:0:0:0:0:0:0:0', '::'];
export function isAllInterfaces(host: string): boolean {
	return ALL_INTERFACES_ADDRESSES.indexOf(host) >= 0;
}

export function isPortPrivileged(port: number, host: string, os: OperatingSystem, osRelease: string): boolean {
	if (os === OperatingSystem.Windows) {
		return false;
	}
	if (os === OperatingSystem.Macintosh) {
		if (isAllInterfaces(host)) {
			const osVersion = (/(\d+)\.(\d+)\.(\d+)/g).exec(osRelease);
			if (osVersion?.length === 4) {
				const major = parseInt(osVersion[1]);
				if (major >= 18 /* since macOS Mojave, darwin version 18.0.0 */) {
					return false;
				}
			}
		}
	}
	return port < 1024;
}

export class DisposableTunnel {
	private _onDispose: Emitter<void> = new Emitter();
	onDidDispose: Event<void> = this._onDispose.event;

	constructor(
		public readonly remoteAddress: { port: number; host: string },
		public readonly localAddress: { port: number; host: string } | string,
		private readonly _dispose: () => Promise<void>) { }

	dispose(): Promise<void> {
		this._onDispose.fire();
		return this._dispose();
	}
}

export abstract class AbstractTunnelService extends Disposable implements ITunnelService {
	declare readonly _serviceBrand: undefined;

	private _onTunnelOpened: Emitter<RemoteTunnel> = new Emitter();
	public onTunnelOpened: Event<RemoteTunnel> = this._onTunnelOpened.event;
	private _onTunnelClosed: Emitter<{ host: string; port: number }> = new Emitter();
	public onTunnelClosed: Event<{ host: string; port: number }> = this._onTunnelClosed.event;
	private _onAddedTunnelProvider: Emitter<void> = new Emitter();
	public onAddedTunnelProvider: Event<void> = this._onAddedTunnelProvider.event;
	protected readonly _tunnels = new Map</*host*/ string, Map</* port */ number, { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> }>>();
	protected _tunnelProvider: ITunnelProvider | undefined;
	protected _canElevate: boolean = false;
	private _canChangeProtocol: boolean = true;
	private _privacyOptions: TunnelPrivacy[] = [];
	private _factoryInProgress: Set<number/*port*/> = new Set();

	public constructor(
		@ILogService protected readonly logService: ILogService,
		@IConfigurationService protected readonly configurationService: IConfigurationService
	) { super(); }

	get hasTunnelProvider(): boolean {
		return !!this._tunnelProvider;
	}

	protected get defaultTunnelHost(): string {
		const settingValue = this.configurationService.getValue('remote.localPortHost');
		return (!settingValue || settingValue === 'localhost') ? '127.0.0.1' : '0.0.0.0';
	}

	setTunnelProvider(provider: ITunnelProvider | undefined): IDisposable {
		this._tunnelProvider = provider;
		if (!provider) {
			// clear features
			this._canElevate = false;
			this._privacyOptions = [];
			this._onAddedTunnelProvider.fire();
			return {
				dispose: () => { }
			};
		}

		this._onAddedTunnelProvider.fire();
		return {
			dispose: () => {
				this._tunnelProvider = undefined;
				this._canElevate = false;
				this._privacyOptions = [];
			}
		};
	}

	setTunnelFeatures(features: TunnelProviderFeatures): void {
		this._canElevate = features.elevation;
		this._privacyOptions = features.privacyOptions;
		this._canChangeProtocol = features.protocol;
	}

	public get canChangeProtocol(): boolean {
		return this._canChangeProtocol;
	}

	public get canElevate(): boolean {
		return this._canElevate;
	}

	public get canChangePrivacy() {
		return this._privacyOptions.length > 0;
	}

	public get privacyOptions() {
		return this._privacyOptions;
	}

	public get tunnels(): Promise<readonly RemoteTunnel[]> {
		return this.getTunnels();
	}

	private async getTunnels(): Promise<readonly RemoteTunnel[]> {
		const tunnels: RemoteTunnel[] = [];
		const tunnelArray = Array.from(this._tunnels.values());
		for (const portMap of tunnelArray) {
			const portArray = Array.from(portMap.values());
			for (const x of portArray) {
				const tunnelValue = await x.value;
				if (tunnelValue && (typeof tunnelValue !== 'string')) {
					tunnels.push(tunnelValue);
				}
			}
		}
		return tunnels;
	}

	override async dispose(): Promise<void> {
		super.dispose();
		for (const portMap of this._tunnels.values()) {
			for (const { value } of portMap.values()) {
				await value.then(tunnel => typeof tunnel !== 'string' ? tunnel?.dispose() : undefined);
			}
			portMap.clear();
		}
		this._tunnels.clear();
	}

	setEnvironmentTunnel(remoteHost: string, remotePort: number, localAddress: string, privacy: string, protocol: string): void {
		this.addTunnelToMap(remoteHost, remotePort, Promise.resolve({
			tunnelRemoteHost: remoteHost,
			tunnelRemotePort: remotePort,
			localAddress,
			privacy,
			protocol,
			dispose: () => Promise.resolve()
		}));
	}

	async getExistingTunnel(remoteHost: string, remotePort: number): Promise<RemoteTunnel | string | undefined> {
		if (isAllInterfaces(remoteHost) || isLocalhost(remoteHost)) {
			remoteHost = LOCALHOST_ADDRESSES[0];
		}

		const existing = this.getTunnelFromMap(remoteHost, remotePort);
		if (existing) {
			++existing.refcount;
			return existing.value;
		}
		return undefined;
	}

	openTunnel(addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost?: string, localPort?: number, elevateIfNeeded: boolean = false, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		this.logService.trace(`ForwardedPorts: (TunnelService) openTunnel request for ${remoteHost}:${remotePort} on local port ${localPort}.`);
		const addressOrTunnelProvider = this._tunnelProvider ?? addressProvider;
		if (!addressOrTunnelProvider) {
			return undefined;
		}

		if (!remoteHost) {
			remoteHost = 'localhost';
		}
		if (!localHost) {
			localHost = this.defaultTunnelHost;
		}

		// Prevent tunnel factories from calling openTunnel from within the factory
		if (this._tunnelProvider && this._factoryInProgress.has(remotePort)) {
			this.logService.debug(`ForwardedPorts: (TunnelService) Another call to create a tunnel with the same address has occurred before the last one completed. This call will be ignored.`);
			return;
		}

		const resolvedTunnel = this.retainOrCreateTunnel(addressOrTunnelProvider, remoteHost, remotePort, localHost, localPort, elevateIfNeeded, privacy, protocol);
		if (!resolvedTunnel) {
			this.logService.trace(`ForwardedPorts: (TunnelService) Tunnel was not created.`);
			return resolvedTunnel;
		}

		return resolvedTunnel.then(tunnel => {
			if (!tunnel) {
				this.logService.trace('ForwardedPorts: (TunnelService) New tunnel is undefined.');
				this.removeEmptyOrErrorTunnelFromMap(remoteHost, remotePort);
				return undefined;
			} else if (typeof tunnel === 'string') {
				this.logService.trace('ForwardedPorts: (TunnelService) The tunnel provider returned an error when creating the tunnel.');
				this.removeEmptyOrErrorTunnelFromMap(remoteHost, remotePort);
				return tunnel;
			}
			this.logService.trace('ForwardedPorts: (TunnelService) New tunnel established.');
			const newTunnel = this.makeTunnel(tunnel);
			if (tunnel.tunnelRemoteHost !== remoteHost || tunnel.tunnelRemotePort !== remotePort) {
				this.logService.warn('ForwardedPorts: (TunnelService) Created tunnel does not match requirements of requested tunnel. Host or port mismatch.');
			}
			if (privacy && tunnel.privacy !== privacy) {
				this.logService.warn('ForwardedPorts: (TunnelService) Created tunnel does not match requirements of requested tunnel. Privacy mismatch.');
			}
			this._onTunnelOpened.fire(newTunnel);
			return newTunnel;
		});
	}

	private makeTunnel(tunnel: RemoteTunnel): RemoteTunnel {
		return {
			tunnelRemotePort: tunnel.tunnelRemotePort,
			tunnelRemoteHost: tunnel.tunnelRemoteHost,
			tunnelLocalPort: tunnel.tunnelLocalPort,
			localAddress: tunnel.localAddress,
			privacy: tunnel.privacy,
			protocol: tunnel.protocol,
			dispose: async () => {
				this.logService.trace(`ForwardedPorts: (TunnelService) dispose request for ${tunnel.tunnelRemoteHost}:${tunnel.tunnelRemotePort} `);
				const existingHost = this._tunnels.get(tunnel.tunnelRemoteHost);
				if (existingHost) {
					const existing = existingHost.get(tunnel.tunnelRemotePort);
					if (existing) {
						existing.refcount--;
						await this.tryDisposeTunnel(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort, existing);
					}
				}
			}
		};
	}

	private async tryDisposeTunnel(remoteHost: string, remotePort: number, tunnel: { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> }): Promise<void> {
		if (tunnel.refcount <= 0) {
			this.logService.trace(`ForwardedPorts: (TunnelService) Tunnel is being disposed ${remoteHost}:${remotePort}.`);
			const disposePromise: Promise<void> = tunnel.value.then(async (tunnel) => {
				if (tunnel && (typeof tunnel !== 'string')) {
					await tunnel.dispose(true);
					this._onTunnelClosed.fire({ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort });
				}
			});
			if (this._tunnels.has(remoteHost)) {
				this._tunnels.get(remoteHost)!.delete(remotePort);
			}
			return disposePromise;
		}
	}

	async closeTunnel(remoteHost: string, remotePort: number): Promise<void> {
		this.logService.trace(`ForwardedPorts: (TunnelService) close request for ${remoteHost}:${remotePort} `);
		const portMap = this._tunnels.get(remoteHost);
		if (portMap && portMap.has(remotePort)) {
			const value = portMap.get(remotePort)!;
			value.refcount = 0;
			await this.tryDisposeTunnel(remoteHost, remotePort, value);
		}
	}

	protected addTunnelToMap(remoteHost: string, remotePort: number, tunnel: Promise<RemoteTunnel | string | undefined>) {
		if (!this._tunnels.has(remoteHost)) {
			this._tunnels.set(remoteHost, new Map());
		}
		this._tunnels.get(remoteHost)!.set(remotePort, { refcount: 1, value: tunnel });
	}

	private async removeEmptyOrErrorTunnelFromMap(remoteHost: string, remotePort: number) {
		const hostMap = this._tunnels.get(remoteHost);
		if (hostMap) {
			const tunnel = hostMap.get(remotePort);
			const tunnelResult = tunnel ? await tunnel.value : undefined;
			if (!tunnelResult || (typeof tunnelResult === 'string')) {
				hostMap.delete(remotePort);
			}
			if (hostMap.size === 0) {
				this._tunnels.delete(remoteHost);
			}
		}
	}

	protected getTunnelFromMap(remoteHost: string, remotePort: number): { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> } | undefined {
		const hosts = [remoteHost];
		// Order matters. We want the original host to be first.
		if (isLocalhost(remoteHost)) {
			hosts.push(...LOCALHOST_ADDRESSES);
			// For localhost, we add the all interfaces hosts because if the tunnel is already available at all interfaces,
			// then of course it is available at localhost.
			hosts.push(...ALL_INTERFACES_ADDRESSES);
		} else if (isAllInterfaces(remoteHost)) {
			hosts.push(...ALL_INTERFACES_ADDRESSES);
		}

		const existingPortMaps = hosts.map(host => this._tunnels.get(host));
		for (const map of existingPortMaps) {
			const existingTunnel = map?.get(remotePort);
			if (existingTunnel) {
				return existingTunnel;
			}
		}
		return undefined;
	}

	canTunnel(uri: URI): boolean {
		return !!extractLocalHostUriMetaDataForPortMapping(uri);
	}

	public abstract isPortPrivileged(port: number): boolean;

	protected abstract retainOrCreateTunnel(addressProvider: IAddressProvider | ITunnelProvider, remoteHost: string, remotePort: number, localHost: string, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;

	protected createWithProvider(tunnelProvider: ITunnelProvider, remoteHost: string, remotePort: number, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		this.logService.trace(`ForwardedPorts: (TunnelService) Creating tunnel with provider ${remoteHost}:${remotePort} on local port ${localPort}.`);
		const key = remotePort;
		this._factoryInProgress.add(key);
		const preferredLocalPort = localPort === undefined ? remotePort : localPort;
		const creationInfo = { elevationRequired: elevateIfNeeded ? this.isPortPrivileged(preferredLocalPort) : false };
		const tunnelOptions: TunnelOptions = { remoteAddress: { host: remoteHost, port: remotePort }, localAddressPort: localPort, privacy, public: privacy ? (privacy !== TunnelPrivacyId.Private) : undefined, protocol };
		const tunnel = tunnelProvider.forwardPort(tunnelOptions, creationInfo);
		if (tunnel) {
			this.addTunnelToMap(remoteHost, remotePort, tunnel);
			tunnel.finally(() => {
				this.logService.trace('ForwardedPorts: (TunnelService) Tunnel created by provider.');
				this._factoryInProgress.delete(key);
			});
		} else {
			this._factoryInProgress.delete(key);
		}
		return tunnel;
	}
}
