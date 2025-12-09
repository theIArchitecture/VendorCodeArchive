//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { NativeParsedArgs } from './argv.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator, refineServiceDecorator } from '../../instantiation/common/instantiation.js';

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');
export const INativeEnvironmentService = refineServiceDecorator<IEnvironmentService, INativeEnvironmentService>(IEnvironmentService);

export interface IDebugParams {
	port: number | null;
	break: boolean;
}

export interface IExtensionHostDebugParams extends IDebugParams {
	debugId?: string;
	env?: Record<string, string>;
}

/**
 * Type of extension.
 *
 * **NOTE**: This is defined in `platform/environment` because it can appear as a CLI argument.
 */
export type ExtensionKind = 'ui' | 'workspace' | 'web';

/**
 * A basic environment service that can be used in various processes,
 * such as main, renderer and shared process. Use subclasses of this
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

 * service for specific environment.
 */
export interface IEnvironmentService {

	readonly _serviceBrand: undefined;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// --- user roaming data
	stateResource: URI;
	userRoamingDataHome: URI;
	keyboardLayoutResource: URI;
	argvResource: URI;

	// --- data paths
	untitledWorkspacesHome: URI;
	workspaceStorageHome: URI;
	localHistoryHome: URI;
	cacheHome: URI;

	// --- settings sync
	userDataSyncHome: URI;
	sync: 'on' | 'off' | undefined;

	// --- continue edit session
	continueOn?: string;
	editSessionId?: string;

	// --- extension development
	debugExtensionHost: IExtensionHostDebugParams;
	isExtensionDevelopment: boolean;
	disableExtensions: boolean | string[];
	enableExtensions?: readonly string[];
	extensionDevelopmentLocationURI?: URI[];
	extensionDevelopmentKind?: ExtensionKind[];
	extensionTestsLocationURI?: URI;

	// --- logging
	logsHome: URI;
	logLevel?: string;
	extensionLogLevel?: [string, string][];
	verbose: boolean;
	isBuilt: boolean;

	// --- telemetry/exp
	disableTelemetry: boolean;
	disableExperiments: boolean;
	serviceMachineIdResource: URI;

	// --- Policy
	policyFile?: URI;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

/**
 * A subclass of the `IEnvironmentService` to be used only in native
 * environments (Windows, Linux, macOS) but not e.g. web.
 */
export interface INativeEnvironmentService extends IEnvironmentService {

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// --- CLI Arguments
	args: NativeParsedArgs;

	// --- data paths
	/**
	 * Root path of the JavaScript sources.
	 *
	 * Note: This is NOT the installation root
	 * directory itself but contained in it at
	 * a level that is platform dependent.
	 */
	appRoot: string;
	userHome: URI;
	appSettingsHome: URI;
	tmpDir: URI;
	userDataPath: string;

	// --- extensions
	extensionsPath: string;
	extensionsDownloadLocation: URI;
	builtinExtensionsPath: string;

	// --- use in-memory Secret Storage
	useInMemorySecretStorage?: boolean;

	crossOriginIsolated?: boolean;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}
