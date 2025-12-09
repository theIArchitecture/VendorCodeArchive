//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IProcessEnvironment, isLinux, OperatingSystem } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ISerializedCommandDetectionCapability, ITerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { ICreateContributedTerminalProfileOptions, IExtensionTerminalProfile, IFixedTerminalDimensions, ITerminalLaunchResult, IProcessDataEvent, IProcessProperty, IProcessPropertyMap, IProcessReadyEvent, IProcessReadyWindowsPty, IShellLaunchConfig, ITerminalBackend, ITerminalContributions, ITerminalEnvironment, ITerminalLaunchError, ITerminalProfile, ITerminalProfileObject, ITerminalTabAction, ProcessPropertyType, TerminalIcon, TerminalLocationString, TitleEventSource } from '../../../../platform/terminal/common/terminal.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { IEnvironmentVariableInfo } from './environmentVariable.js';
import { IExtensionPointDescriptor } from '../../../services/extensions/common/extensionsRegistry.js';
import { defaultTerminalContribCommandsToSkipShell } from '../terminalContribExports.js';

export const TERMINAL_VIEW_ID = 'terminal';

export const TERMINAL_CREATION_COMMANDS = ['workbench.action.terminal.toggleTerminal', 'workbench.action.terminal.new', 'workbench.action.togglePanel', 'workbench.action.terminal.focus'];

export const TERMINAL_CONFIG_SECTION = 'terminal.integrated';

export const DEFAULT_LETTER_SPACING = 0;
export const MINIMUM_LETTER_SPACING = -5;
// HACK: On Linux it's common for fonts to include an underline that is rendered lower than the
// bottom of the cell which causes it to be cut off due to `overflow:hidden` in the DOM renderer.
// See:
// - https://github.com/microsoft/vscode/issues/211933
// - https://github.com/xtermjs/xterm.js/issues/4067
export const DEFAULT_LINE_HEIGHT = isLinux ? 1.1 : 1;

export const MINIMUM_FONT_WEIGHT = 1;
export const MAXIMUM_FONT_WEIGHT = 1000;
export const DEFAULT_FONT_WEIGHT = 'normal';
export const DEFAULT_BOLD_FONT_WEIGHT = 'bold';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const SUGGESTIONS_FONT_WEIGHT = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

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

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 277: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 289: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 289: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 300: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 300: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 321: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 333: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 333: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ITerminalProfileResolverService = createDecorator<ITerminalProfileResolverService>('terminalProfileResolverService');
export interface ITerminalProfileResolverService {
	readonly _serviceBrand: undefined;

	readonly defaultProfileName: string | undefined;

	/**
	 * Resolves the icon of a shell launch config if this will use the default profile
	 */
	resolveIcon(shellLaunchConfig: IShellLaunchConfig, os: OperatingSystem): void;
	resolveShellLaunchConfig(shellLaunchConfig: IShellLaunchConfig, options: IShellLaunchConfigResolveOptions): Promise<void>;
	getDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile>;
	getDefaultShell(options: IShellLaunchConfigResolveOptions): Promise<string>;
	getDefaultShellArgs(options: IShellLaunchConfigResolveOptions): Promise<string | string[]>;
	getDefaultIcon(): TerminalIcon & ThemeIcon;
	getEnvironment(remoteAuthority: string | undefined): Promise<IProcessEnvironment>;
}

/*
 * When there were shell integration args injected
 * and createProcess returns an error, this exit code will be used.
 */
export const ShellIntegrationExitCode = 633;

export interface IRegisterContributedProfileArgs {
	extensionIdentifier: string; id: string; title: string; options: ICreateContributedTerminalProfileOptions;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 73: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 73: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 96: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 118: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 119: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 119: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 140: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 141: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 141: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 184: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 206: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 207: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 207: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 228: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 229: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 229: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 250: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 272: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 294: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 295: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 295: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 339: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 339: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 360: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 361: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 361: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 404: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 426: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 427: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 427: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 448: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 470: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 471: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 471: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 492: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 493: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 493: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 514: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 515: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 515: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 536: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 537: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 537: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 558: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 559: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 559: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 580: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 581: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 581: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 602: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 603: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 603: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 624: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 625: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 625: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 646: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 647: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 647: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 668: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 669: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 669: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ITerminalProfileService = createDecorator<ITerminalProfileService>('terminalProfileService');
export interface ITerminalProfileService {
	readonly _serviceBrand: undefined;
	readonly availableProfiles: ITerminalProfile[];
	readonly contributedProfiles: IExtensionTerminalProfile[];
	readonly profilesReady: Promise<void>;
	getPlatformKey(): Promise<string>;
	refreshAvailableProfiles(): void;
	getDefaultProfileName(): string | undefined;
	getDefaultProfile(os?: OperatingSystem): ITerminalProfile | undefined;
	onDidChangeAvailableProfiles: Event<ITerminalProfile[]>;
	getContributedDefaultProfile(shellLaunchConfig: IShellLaunchConfig): Promise<IExtensionTerminalProfile | undefined>;
	registerContributedProfile(args: IRegisterContributedProfileArgs): Promise<void>;
	getContributedProfileProvider(extensionIdentifier: string, id: string): ITerminalProfileProvider | undefined;
	registerTerminalProfileProvider(extensionIdentifier: string, id: string, profileProvider: ITerminalProfileProvider): IDisposable;
}

export interface ITerminalProfileProvider {
	createContributedTerminalProfile(options: ICreateContributedTerminalProfileOptions): Promise<void>;
}

export interface IShellLaunchConfigResolveOptions {
	remoteAuthority: string | undefined;
	os: OperatingSystem;
	allowAutomationShell?: boolean;
}

export type FontWeight = 'normal' | 'bold' | number;

export interface ITerminalProfiles {
	linux: { [key: string]: ITerminalProfileObject };
	osx: { [key: string]: ITerminalProfileObject };
	windows: { [key: string]: ITerminalProfileObject };
}

export type ConfirmOnKill = 'never' | 'always' | 'editor' | 'panel';
export type ConfirmOnExit = 'never' | 'always' | 'hasChildProcesses';

export interface ICompleteTerminalConfiguration {
	'terminal.integrated.env.windows': ITerminalEnvironment;
	'terminal.integrated.env.osx': ITerminalEnvironment;
	'terminal.integrated.env.linux': ITerminalEnvironment;
	'terminal.integrated.cwd': string;
	'terminal.integrated.detectLocale': 'auto' | 'off' | 'on';
}

export interface ITerminalConfiguration {
	shell: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	automationShell: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	shellArgs: {
		linux: string[];
		osx: string[];
		windows: string[];
	};
	profiles: ITerminalProfiles;
	defaultProfile: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	useWslProfiles: boolean;
	altClickMovesCursor: boolean;
	macOptionIsMeta: boolean;
	macOptionClickForcesSelection: boolean;
	gpuAcceleration: 'auto' | 'on' | 'off';
	rightClickBehavior: 'default' | 'copyPaste' | 'paste' | 'selectWord' | 'nothing';
	middleClickBehavior: 'default' | 'paste';
	cursorBlinking: boolean;
	cursorStyle: 'block' | 'underline' | 'line';
	cursorStyleInactive: 'outline' | 'block' | 'underline' | 'line' | 'none';
	cursorWidth: number;
	drawBoldTextInBrightColors: boolean;
	fastScrollSensitivity: number;
	fontFamily: string;
	fontWeight: FontWeight;
	fontWeightBold: FontWeight;
	minimumContrastRatio: number;
	mouseWheelScrollSensitivity: number;
	tabStopWidth: number;
	sendKeybindingsToShell: boolean;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
	detectLocale: 'auto' | 'off' | 'on';
	scrollback: number;
	commandsToSkipShell: string[];
	allowChords: boolean;
	allowMnemonics: boolean;
	cwd: string;
	confirmOnExit: ConfirmOnExit;
	confirmOnKill: ConfirmOnKill;
	enableBell: boolean;
	env: {
		linux: { [key: string]: string };
		osx: { [key: string]: string };
		windows: { [key: string]: string };
	};
	environmentChangesIndicator: 'off' | 'on' | 'warnonly';
	environmentChangesRelaunch: boolean;
	showExitAlert: boolean;
	splitCwd: 'workspaceRoot' | 'initial' | 'inherited';
	windowsEnableConpty: boolean;
	windowsUseConptyDll?: boolean;
	wordSeparators: string;
	enableFileLinks: 'off' | 'on' | 'notRemote';
	allowedLinkSchemes: string[];
	unicodeVersion: '6' | '11';
	enablePersistentSessions: boolean;
	tabs: {
		enabled: boolean;
		hideCondition: 'never' | 'singleTerminal' | 'singleGroup';
		showActiveTerminal: 'always' | 'singleTerminal' | 'singleTerminalOrNarrow' | 'singleGroup' | 'never';
		location: 'left' | 'right';
		focusMode: 'singleClick' | 'doubleClick';
		title: string;
		description: string;
		separator: string;
	};
	bellDuration: number;
	defaultLocation: TerminalLocationString;
	customGlyphs: boolean;
	persistentSessionReviveProcess: 'onExit' | 'onExitAndWindowClose' | 'never';
	ignoreProcessNames: string[];
	shellIntegration?: {
		enabled: boolean;
		decorationsEnabled: 'both' | 'gutter' | 'overviewRuler' | 'never';
	};
	enableImages: boolean;
	smoothScrolling: boolean;
	ignoreBracketedPasteMode: boolean;
	rescaleOverlappingGlyphs: boolean;
	fontLigatures?: {
		enabled: boolean;
		featureSettings: string;
		fallbackLigatures: string[];
	};
	hideOnLastClosed: boolean;
}

export interface ITerminalFont {
	fontFamily: string;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
	charWidth?: number;
	charHeight?: number;
}

export interface IRemoteTerminalAttachTarget {
	id: number;
	pid: number;
	title: string;
	titleSource: TitleEventSource;
	cwd: string;
	workspaceId: string;
	workspaceName: string;
	isOrphan: boolean;
	icon: URI | { light: URI; dark: URI } | { id: string; color?: { id: string } } | undefined;
	color: string | undefined;
	fixedDimensions: IFixedTerminalDimensions | undefined;
	shellIntegrationNonce: string;
	tabActions?: ITerminalTabAction[];
}

export interface IBeforeProcessDataEvent {
	/**
	 * The data of the event, this can be modified by the event listener to change what gets sent
	 * to the terminal.
	 */
	data: string;
}

export interface IDefaultShellAndArgsRequest {
	useAutomationShell: boolean;
	callback: (shell: string, args: string[] | string | undefined) => void;
}

/** Read-only process information that can apply to detached terminals. */
export interface ITerminalProcessInfo {
	readonly processState: ProcessState;
	readonly ptyProcessReady: Promise<void>;
	readonly shellProcessId: number | undefined;
	readonly remoteAuthority: string | undefined;
	readonly os: OperatingSystem | undefined;
	readonly userHome: string | undefined;
	readonly initialCwd: string;
	readonly environmentVariableInfo: IEnvironmentVariableInfo | undefined;
	readonly persistentProcessId: number | undefined;
	readonly shouldPersist: boolean;
	readonly hasWrittenData: boolean;
	readonly hasChildProcesses: boolean;
	readonly backend: ITerminalBackend | undefined;
	readonly capabilities: ITerminalCapabilityStore;
	readonly shellIntegrationNonce: string;
	readonly extEnvironmentVariableCollection: IMergedEnvironmentVariableCollection | undefined;
}

export const isTerminalProcessManager = (t: ITerminalProcessInfo | ITerminalProcessManager): t is ITerminalProcessManager => typeof (t as ITerminalProcessManager).write === 'function';

export interface ITerminalProcessManager extends IDisposable, ITerminalProcessInfo {
	readonly processTraits: IProcessReadyEvent | undefined;

	readonly onPtyDisconnect: Event<void>;
	readonly onPtyReconnect: Event<void>;

	readonly onProcessReady: Event<IProcessReadyEvent>;
	readonly onBeforeProcessData: Event<IBeforeProcessDataEvent>;
	readonly onProcessData: Event<IProcessDataEvent>;
	readonly onProcessReplayComplete: Event<void>;
	readonly onEnvironmentVariableInfoChanged: Event<IEnvironmentVariableInfo>;
	readonly onDidChangeProperty: Event<IProcessProperty<any>>;
	readonly onProcessExit: Event<number | undefined>;
	readonly onRestoreCommands: Event<ISerializedCommandDetectionCapability>;

	dispose(immediate?: boolean): void;
	detachFromProcess(forcePersist?: boolean): Promise<void>;
	createProcess(shellLaunchConfig: IShellLaunchConfig, cols: number, rows: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;
	relaunch(shellLaunchConfig: IShellLaunchConfig, cols: number, rows: number, reset: boolean): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;
	write(data: string): Promise<void>;
	sendSignal(signal: string): Promise<void>;
	setDimensions(cols: number, rows: number): Promise<void>;
	setDimensions(cols: number, rows: number, sync: false): Promise<void>;
	setDimensions(cols: number, rows: number, sync: true): void;
	clearBuffer(): Promise<void>;
	setUnicodeVersion(version: '6' | '11'): Promise<void>;
	acknowledgeDataEvent(charCount: number): void;
	processBinary(data: string): void;

	refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]>;
	updateProperty<T extends ProcessPropertyType>(property: T, value: IProcessPropertyMap[T]): Promise<void>;
	getBackendOS(): Promise<OperatingSystem>;
	freePortKillProcess(port: string): Promise<void>;
}

export const enum ProcessState {
	// The process has not been initialized yet.
	Uninitialized = 1,
	// The process is currently launching, the process is marked as launching
	// for a short duration after being created and is helpful to indicate
	// whether the process died as a result of bad shell and args.
	Launching = 2,
	// The process is running normally.
	Running = 3,
	// The process was killed during launch, likely as a result of bad shell and
	// args.
	KilledDuringLaunch = 4,
	// The process was killed by the user (the event originated from VS Code).
	KilledByUser = 5,
	// The process was killed by itself, for example the shell crashed or `exit`
	// was run.
	KilledByProcess = 6
}

export interface ITerminalProcessExtHostProxy extends IDisposable {
	readonly instanceId: number;

	emitData(data: string): void;
	emitProcessProperty(property: IProcessProperty<any>): void;
	emitReady(pid: number, cwd: string, windowsPty: IProcessReadyWindowsPty | undefined): void;
	emitExit(exitCode: number | undefined): void;

	onInput: Event<string>;
	onBinary: Event<string>;
	onResize: Event<{ cols: number; rows: number }>;
	onAcknowledgeDataEvent: Event<number>;
	onShutdown: Event<boolean>;
	onRequestInitialCwd: Event<void>;
	onRequestCwd: Event<void>;
}

export interface IStartExtensionTerminalRequest {
	proxy: ITerminalProcessExtHostProxy;
	cols: number;
	rows: number;
	callback: (error: ITerminalLaunchError | undefined) => void;
}

export interface ITerminalStatus {
	/** An internal string ID used to identify the status. */
	id: string;
	/**
	 * The severity of the status, this defines both the color and how likely the status is to be
	 * the "primary status".
	 */
	severity: Severity;
	/**
	 * An icon representing the status, if this is not specified it will not show up on the terminal
	 * tab and will use the generic `info` icon when hovering.
	 */
	icon?: ThemeIcon;
	/**
	 * What to show for this status in the terminal's hover.
	 */
	tooltip?: string | undefined;
	/**
	 * What to show for this status in the terminal's hover when details are toggled.
	 */
	detailedTooltip?: string | undefined;
	/**
	 * Actions to expose on hover.
	 */
	hoverActions?: ITerminalStatusHoverAction[];
}

export interface ITerminalStatusHoverAction {
	label: string;
	commandId: string;
	run: () => void;
}

/**
 * Context for actions taken on terminal instances.
 */
export interface ISerializedTerminalInstanceContext {
	$mid: MarshalledId.TerminalContext;
	instanceId: number;
}

export const QUICK_LAUNCH_PROFILE_CHOICE = 'workbench.action.terminal.profile.choice';

export const enum TerminalCommandId {
	Toggle = 'workbench.action.terminal.toggleTerminal',
	Kill = 'workbench.action.terminal.kill',
	KillViewOrEditor = 'workbench.action.terminal.killViewOrEditor',
	KillEditor = 'workbench.action.terminal.killEditor',
	KillActiveTab = 'workbench.action.terminal.killActiveTab',
	KillAll = 'workbench.action.terminal.killAll',
	QuickKill = 'workbench.action.terminal.quickKill',
	ConfigureTerminalSettings = 'workbench.action.terminal.openSettings',
	ShellIntegrationLearnMore = 'workbench.action.terminal.learnMore',
	CopyLastCommand = 'workbench.action.terminal.copyLastCommand',
	CopyLastCommandOutput = 'workbench.action.terminal.copyLastCommandOutput',
	CopyLastCommandAndLastCommandOutput = 'workbench.action.terminal.copyLastCommandAndLastCommandOutput',
	CopyAndClearSelection = 'workbench.action.terminal.copyAndClearSelection',
	CopySelection = 'workbench.action.terminal.copySelection',
	CopySelectionAsHtml = 'workbench.action.terminal.copySelectionAsHtml',
	SelectAll = 'workbench.action.terminal.selectAll',
	DeleteWordLeft = 'workbench.action.terminal.deleteWordLeft',
	DeleteWordRight = 'workbench.action.terminal.deleteWordRight',
	DeleteToLineStart = 'workbench.action.terminal.deleteToLineStart',
	MoveToLineStart = 'workbench.action.terminal.moveToLineStart',
	MoveToLineEnd = 'workbench.action.terminal.moveToLineEnd',
	New = 'workbench.action.terminal.new',
	NewWithCwd = 'workbench.action.terminal.newWithCwd',
	NewLocal = 'workbench.action.terminal.newLocal',
	NewInActiveWorkspace = 'workbench.action.terminal.newInActiveWorkspace',
	NewWithProfile = 'workbench.action.terminal.newWithProfile',
	Split = 'workbench.action.terminal.split',
	SplitActiveTab = 'workbench.action.terminal.splitActiveTab',
	SplitInActiveWorkspace = 'workbench.action.terminal.splitInActiveWorkspace',
	Unsplit = 'workbench.action.terminal.unsplit',
	JoinActiveTab = 'workbench.action.terminal.joinActiveTab',
	Join = 'workbench.action.terminal.join',
	Relaunch = 'workbench.action.terminal.relaunch',
	FocusPreviousPane = 'workbench.action.terminal.focusPreviousPane',
	CreateTerminalEditor = 'workbench.action.createTerminalEditor',
	CreateTerminalEditorSameGroup = 'workbench.action.createTerminalEditorSameGroup',
	CreateTerminalEditorSide = 'workbench.action.createTerminalEditorSide',
	FocusTabs = 'workbench.action.terminal.focusTabs',
	FocusNextPane = 'workbench.action.terminal.focusNextPane',
	ResizePaneLeft = 'workbench.action.terminal.resizePaneLeft',
	ResizePaneRight = 'workbench.action.terminal.resizePaneRight',
	ResizePaneUp = 'workbench.action.terminal.resizePaneUp',
	SizeToContentWidth = 'workbench.action.terminal.sizeToContentWidth',
	SizeToContentWidthActiveTab = 'workbench.action.terminal.sizeToContentWidthActiveTab',
	ResizePaneDown = 'workbench.action.terminal.resizePaneDown',
	Focus = 'workbench.action.terminal.focus',
	FocusNext = 'workbench.action.terminal.focusNext',
	FocusPrevious = 'workbench.action.terminal.focusPrevious',
	Paste = 'workbench.action.terminal.paste',
	PasteSelection = 'workbench.action.terminal.pasteSelection',
	SelectDefaultProfile = 'workbench.action.terminal.selectDefaultShell',
	RunSelectedText = 'workbench.action.terminal.runSelectedText',
	RunActiveFile = 'workbench.action.terminal.runActiveFile',
	SwitchTerminal = 'workbench.action.terminal.switchTerminal',
	ScrollDownLine = 'workbench.action.terminal.scrollDown',
	ScrollDownPage = 'workbench.action.terminal.scrollDownPage',
	ScrollToBottom = 'workbench.action.terminal.scrollToBottom',
	ScrollUpLine = 'workbench.action.terminal.scrollUp',
	ScrollUpPage = 'workbench.action.terminal.scrollUpPage',
	ScrollToTop = 'workbench.action.terminal.scrollToTop',
	Clear = 'workbench.action.terminal.clear',
	ClearSelection = 'workbench.action.terminal.clearSelection',
	ChangeIcon = 'workbench.action.terminal.changeIcon',
	ChangeIconActiveTab = 'workbench.action.terminal.changeIconActiveTab',
	ChangeColor = 'workbench.action.terminal.changeColor',
	ChangeColorActiveTab = 'workbench.action.terminal.changeColorActiveTab',
	Rename = 'workbench.action.terminal.rename',
	RenameActiveTab = 'workbench.action.terminal.renameActiveTab',
	RenameWithArgs = 'workbench.action.terminal.renameWithArg',
	ScrollToPreviousCommand = 'workbench.action.terminal.scrollToPreviousCommand',
	ScrollToNextCommand = 'workbench.action.terminal.scrollToNextCommand',
	SelectToPreviousCommand = 'workbench.action.terminal.selectToPreviousCommand',
	SelectToNextCommand = 'workbench.action.terminal.selectToNextCommand',
	SelectToPreviousLine = 'workbench.action.terminal.selectToPreviousLine',
	SelectToNextLine = 'workbench.action.terminal.selectToNextLine',
	SendSequence = 'workbench.action.terminal.sendSequence',
	SendSignal = 'workbench.action.terminal.sendSignal',
	AttachToSession = 'workbench.action.terminal.attachToSession',
	DetachSession = 'workbench.action.terminal.detachSession',
	MoveToEditor = 'workbench.action.terminal.moveToEditor',
	MoveToTerminalPanel = 'workbench.action.terminal.moveToTerminalPanel',
	MoveIntoNewWindow = 'workbench.action.terminal.moveIntoNewWindow',
	NewInNewWindow = 'workbench.action.terminal.newInNewWindow',
	SetDimensions = 'workbench.action.terminal.setDimensions',
	FocusHover = 'workbench.action.terminal.focusHover',
	ShowEnvironmentContributions = 'workbench.action.terminal.showEnvironmentContributions',
	StartVoice = 'workbench.action.terminal.startVoice',
	StopVoice = 'workbench.action.terminal.stopVoice',
}

export const DEFAULT_COMMANDS_TO_SKIP_SHELL: string[] = [
	TerminalCommandId.ClearSelection,
	TerminalCommandId.Clear,
	TerminalCommandId.CopyAndClearSelection,
	TerminalCommandId.CopySelection,
	TerminalCommandId.CopySelectionAsHtml,
	TerminalCommandId.CopyLastCommand,
	TerminalCommandId.CopyLastCommandOutput,
	TerminalCommandId.CopyLastCommandAndLastCommandOutput,
	TerminalCommandId.DeleteToLineStart,
	TerminalCommandId.DeleteWordLeft,
	TerminalCommandId.DeleteWordRight,
	TerminalCommandId.FocusNextPane,
	TerminalCommandId.FocusNext,
	TerminalCommandId.FocusPreviousPane,
	TerminalCommandId.FocusPrevious,
	TerminalCommandId.Focus,
	TerminalCommandId.SizeToContentWidth,
	TerminalCommandId.Kill,
	TerminalCommandId.KillEditor,
	TerminalCommandId.MoveToEditor,
	TerminalCommandId.MoveToLineEnd,
	TerminalCommandId.MoveToLineStart,
	TerminalCommandId.MoveToTerminalPanel,
	TerminalCommandId.NewInActiveWorkspace,
	TerminalCommandId.New,
	TerminalCommandId.NewInNewWindow,
	TerminalCommandId.Paste,
	TerminalCommandId.PasteSelection,
	TerminalCommandId.ResizePaneDown,
	TerminalCommandId.ResizePaneLeft,
	TerminalCommandId.ResizePaneRight,
	TerminalCommandId.ResizePaneUp,
	TerminalCommandId.RunActiveFile,
	TerminalCommandId.RunSelectedText,
	TerminalCommandId.ScrollDownLine,
	TerminalCommandId.ScrollDownPage,
	TerminalCommandId.ScrollToBottom,
	TerminalCommandId.ScrollToNextCommand,
	TerminalCommandId.ScrollToPreviousCommand,
	TerminalCommandId.ScrollToTop,
	TerminalCommandId.ScrollUpLine,
	TerminalCommandId.ScrollUpPage,
	TerminalCommandId.SendSequence,
	TerminalCommandId.SelectAll,
	TerminalCommandId.SelectToNextCommand,
	TerminalCommandId.SelectToNextLine,
	TerminalCommandId.SelectToPreviousCommand,
	TerminalCommandId.SelectToPreviousLine,
	TerminalCommandId.SplitInActiveWorkspace,
	TerminalCommandId.Split,
	TerminalCommandId.Toggle,
	TerminalCommandId.FocusHover,
	AccessibilityCommandId.OpenAccessibilityHelp,
	'workbench.action.tasks.rerunForActiveTerminal',
	'editor.action.toggleTabFocusMode',
	'notifications.hideList',
	'notifications.hideToasts',
	'workbench.action.closeQuickOpen',
	'workbench.action.quickOpen',
	'workbench.action.quickOpenPreviousEditor',
	'workbench.action.showCommands',
	'workbench.action.tasks.build',
	'workbench.action.tasks.restartTask',
	'workbench.action.tasks.runTask',
	'workbench.action.tasks.reRunTask',
	'workbench.action.tasks.showLog',
	'workbench.action.tasks.showTasks',
	'workbench.action.tasks.terminate',
	'workbench.action.tasks.test',
	'workbench.action.toggleFullScreen',
	'workbench.action.terminal.focusAtIndex1',
	'workbench.action.terminal.focusAtIndex2',
	'workbench.action.terminal.focusAtIndex3',
	'workbench.action.terminal.focusAtIndex4',
	'workbench.action.terminal.focusAtIndex5',
	'workbench.action.terminal.focusAtIndex6',
	'workbench.action.terminal.focusAtIndex7',
	'workbench.action.terminal.focusAtIndex8',
	'workbench.action.terminal.focusAtIndex9',
	'workbench.action.focusSecondEditorGroup',
	'workbench.action.focusThirdEditorGroup',
	'workbench.action.focusFourthEditorGroup',
	'workbench.action.focusFifthEditorGroup',
	'workbench.action.focusSixthEditorGroup',
	'workbench.action.focusSeventhEditorGroup',
	'workbench.action.focusEighthEditorGroup',
	'workbench.action.focusNextPart',
	'workbench.action.focusPreviousPart',
	'workbench.action.nextPanelView',
	'workbench.action.previousPanelView',
	'workbench.action.nextSideBarView',
	'workbench.action.previousSideBarView',
	'workbench.action.debug.disconnect',
	'workbench.action.debug.start',
	'workbench.action.debug.stop',
	'workbench.action.debug.run',
	'workbench.action.debug.restart',
	'workbench.action.debug.continue',
	'workbench.action.debug.pause',
	'workbench.action.debug.stepInto',
	'workbench.action.debug.stepOut',
	'workbench.action.debug.stepOver',
	'workbench.action.nextEditor',
	'workbench.action.previousEditor',
	'workbench.action.nextEditorInGroup',
	'workbench.action.previousEditorInGroup',
	'workbench.action.openNextRecentlyUsedEditor',
	'workbench.action.openPreviousRecentlyUsedEditor',
	'workbench.action.openNextRecentlyUsedEditorInGroup',
	'workbench.action.openPreviousRecentlyUsedEditorInGroup',
	'workbench.action.quickOpenPreviousRecentlyUsedEditor',
	'workbench.action.quickOpenLeastRecentlyUsedEditor',
	'workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup',
	'workbench.action.quickOpenLeastRecentlyUsedEditorInGroup',
	'workbench.action.focusActiveEditorGroup',
	'workbench.action.focusFirstEditorGroup',
	'workbench.action.focusLastEditorGroup',
	'workbench.action.firstEditorInGroup',
	'workbench.action.lastEditorInGroup',
	'workbench.action.navigateUp',
	'workbench.action.navigateDown',
	'workbench.action.navigateRight',
	'workbench.action.navigateLeft',
	'workbench.action.togglePanel',
	'workbench.action.quickOpenView',
	'workbench.action.toggleMaximizedPanel',
	'notification.acceptPrimaryAction',
	'runCommands',
	'workbench.action.terminal.chat.start',
	'workbench.action.terminal.chat.close',
	'workbench.action.terminal.chat.discard',
	'workbench.action.terminal.chat.makeRequest',
	'workbench.action.terminal.chat.cancel',
	'workbench.action.terminal.chat.feedbackHelpful',
	'workbench.action.terminal.chat.feedbackUnhelpful',
	'workbench.action.terminal.chat.feedbackReportIssue',
	'workbench.action.terminal.chat.runCommand',
	'workbench.action.terminal.chat.insertCommand',
	'workbench.action.terminal.chat.viewInChat',
	...defaultTerminalContribCommandsToSkipShell,
];

export const terminalContributionsDescriptor: IExtensionPointDescriptor<ITerminalContributions> = {
	extensionPoint: 'terminal',
	defaultExtensionKind: ['workspace'],
	activationEventsGenerator: (contribs: ITerminalContributions[], result: { push(item: string): void }) => {
		for (const contrib of contribs) {
			for (const profileContrib of (contrib.profiles ?? [])) {
				result.push(`onTerminalProfile:${profileContrib.id}`);
			}
		}
	},
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.terminal', 'Contributes terminal functionality.'),
		type: 'object',
		properties: {
			profiles: {
				type: 'array',
				description: nls.localize('vscode.extension.contributes.terminal.profiles', "Defines additional terminal profiles that the user can create."),
				items: {
					type: 'object',
					required: ['id', 'title'],
					defaultSnippets: [{
						body: {
							id: '$1',
							title: '$2'
						}
					}],
					properties: {
						id: {
							description: nls.localize('vscode.extension.contributes.terminal.profiles.id', "The ID of the terminal profile provider."),
							type: 'string',
						},
						title: {
							description: nls.localize('vscode.extension.contributes.terminal.profiles.title', "Title for this terminal profile."),
							type: 'string',
						},
						icon: {
							description: nls.localize('vscode.extension.contributes.terminal.types.icon', "A codicon, URI, or light and dark URIs to associate with this terminal type."),
							anyOf: [{
								type: 'string',
							},
							{
								type: 'object',
								properties: {
									light: {
										description: nls.localize('vscode.extension.contributes.terminal.types.icon.light', 'Icon path when a light theme is used'),
										type: 'string'
									},
									dark: {
										description: nls.localize('vscode.extension.contributes.terminal.types.icon.dark', 'Icon path when a dark theme is used'),
										type: 'string'
									}
								}
							}]
						},
					},
				},
			},
		},
	},
};
