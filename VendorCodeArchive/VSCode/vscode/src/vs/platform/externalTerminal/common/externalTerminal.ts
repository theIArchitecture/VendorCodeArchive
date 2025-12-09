//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ITerminalEnvironment } from '../../terminal/common/terminal.js';

export const IExternalTerminalService = createDecorator<IExternalTerminalService>('externalTerminal');

export interface IExternalTerminalSettings {
	linuxExec?: string;
	osxExec?: string;
	windowsExec?: string;
}

export interface ITerminalForPlatform {
	windows: string;
	linux: string;
	osx: string;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export interface IExternalTerminalService {
	readonly _serviceBrand: undefined;
	openTerminal(configuration: IExternalTerminalSettings, cwd: string | undefined): Promise<void>;
	runInTerminal(title: string, cwd: string, args: string[], env: ITerminalEnvironment, settings: IExternalTerminalSettings): Promise<number | undefined>;
	getDefaultTerminalForPlatforms(): Promise<ITerminalForPlatform>;
}

export interface IExternalTerminalConfiguration {
	terminal: {
		explorerKind: 'integrated' | 'external' | 'both';
		external: IExternalTerminalSettings;
	};
}

export const DEFAULT_TERMINAL_OSX = 'Terminal.app';
