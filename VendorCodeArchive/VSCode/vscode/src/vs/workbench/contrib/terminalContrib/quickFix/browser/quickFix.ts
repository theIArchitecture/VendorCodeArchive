//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { IAction } from '../../../../../base/common/actions.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITerminalCommandSelector, ITerminalOutputMatch, ITerminalOutputMatcher } from '../../../../../platform/terminal/common/terminal.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 29: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 29: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 40: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 40: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 51: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 51: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

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

export const ITerminalQuickFixService = createDecorator<ITerminalQuickFixService>('terminalQuickFixService');
export interface ITerminalQuickFixService {
	onDidRegisterProvider: Event<ITerminalQuickFixProviderSelector>;
	onDidRegisterCommandSelector: Event<ITerminalCommandSelector>;
	onDidUnregisterProvider: Event<string>;
	readonly _serviceBrand: undefined;
	readonly extensionQuickFixes: Promise<Array<ITerminalCommandSelector>>;
	providers: Map<string, ITerminalQuickFixProvider>;
	registerQuickFixProvider(id: string, provider: ITerminalQuickFixProvider): IDisposable;
	registerCommandSelector(selector: ITerminalCommandSelector): void;
}

export interface ITerminalQuickFixProviderSelector {
	selector: ITerminalCommandSelector;
	provider: ITerminalQuickFixProvider;
}

export type TerminalQuickFixActionInternal = IAction | ITerminalQuickFixTerminalCommandAction | ITerminalQuickFixOpenerAction;
export type TerminalQuickFixCallback = (matchResult: ITerminalCommandMatchResult) => TerminalQuickFixActionInternal[] | TerminalQuickFixActionInternal | undefined;
export type TerminalQuickFixCallbackExtension = (terminalCommand: ITerminalCommand, lines: string[] | undefined, option: ITerminalQuickFixOptions, token: CancellationToken) => Promise<ITerminalQuickFix[] | ITerminalQuickFix | undefined>;

export interface ITerminalQuickFixProvider {
	/**
	 * Provides terminal quick fixes
	 * @param commandMatchResult The command match result for which to provide quick fixes
	 * @param token A cancellation token indicating the result is no longer needed
	 * @return Terminal quick fix(es) if any
	 */
	provideTerminalQuickFixes(terminalCommand: ITerminalCommand, lines: string[] | undefined, option: ITerminalQuickFixOptions, token: CancellationToken): Promise<ITerminalQuickFix[] | ITerminalQuickFix | undefined>;
}

export enum TerminalQuickFixType {
	TerminalCommand = 0,
	Opener = 1,
	Port = 2,
	VscodeCommand = 3
}

export interface ITerminalQuickFixOptions {
	type: 'internal' | 'resolved' | 'unresolved';
	id: string;
	commandLineMatcher: string | RegExp;
	outputMatcher?: ITerminalOutputMatcher;
	commandExitResult: 'success' | 'error';
	kind?: 'fix' | 'explain';
}

export interface ITerminalQuickFix {
	type: TerminalQuickFixType;
	id: string;
	source: string;
}

export interface ITerminalQuickFixTerminalCommandAction extends ITerminalQuickFix {
	type: TerminalQuickFixType.TerminalCommand;
	terminalCommand: string;
	// TODO: Should this depend on whether alt is held?
	shouldExecute?: boolean;
}
export interface ITerminalQuickFixOpenerAction extends ITerminalQuickFix {
	type: TerminalQuickFixType.Opener;
	uri: URI;
}
export interface ITerminalQuickFixCommandAction extends ITerminalQuickFix {
	title: string;
}

export interface ITerminalCommandMatchResult {
	commandLine: string;
	commandLineMatch: RegExpMatchArray;
	outputMatch?: ITerminalOutputMatch;
}

export interface ITerminalQuickFixInternalOptions extends ITerminalQuickFixOptions {
	type: 'internal';
	getQuickFixes: TerminalQuickFixCallback;
}

export interface ITerminalQuickFixResolvedExtensionOptions extends ITerminalQuickFixOptions {
	type: 'resolved';
	getQuickFixes: TerminalQuickFixCallbackExtension;
}

export interface ITerminalQuickFixUnresolvedExtensionOptions extends ITerminalQuickFixOptions {
	type: 'unresolved';
}
