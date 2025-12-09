//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IWorkspace, ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 25: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILabelService = createDecorator<ILabelService>('labelService');

export interface ILabelService {

	readonly _serviceBrand: undefined;

	/**
	 * Gets the human readable label for a uri.
	 * If `relative` is passed returns a label relative to the workspace root that the uri belongs to.
	 * If `noPrefix` is passed does not tildify the label and also does not prepand the root name for relative labels in a multi root scenario.
	 * If `separator` is passed, will use that over the defined path separator of the formatter.
	 * If `appendWorkspaceSuffix` is passed, will append the name of the workspace to the label.
	 */
	getUriLabel(resource: URI, options?: { relative?: boolean; noPrefix?: boolean; separator?: '/' | '\\'; appendWorkspaceSuffix?: boolean }): string;
	getUriBasenameLabel(resource: URI): string;
	getWorkspaceLabel(workspace: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI | IWorkspace), options?: { verbose: Verbosity }): string;
	getHostLabel(scheme: string, authority?: string): string;
	getHostTooltip(scheme: string, authority?: string): string | undefined;
	getSeparator(scheme: string, authority?: string): '/' | '\\';

	registerFormatter(formatter: ResourceLabelFormatter): IDisposable;
	onDidChangeFormatters: Event<IFormatterChangeEvent>;

	/**
	 * Registers a formatter that's cached for the machine beyond the lifecycle
	 * of the current window. Disposing the formatter _will not_ remove it from
	 * the cache.
	 */
	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable;
}

export const enum Verbosity {
	SHORT,
	MEDIUM,
	LONG
}

export interface IFormatterChangeEvent {
	scheme: string;
}

export interface ResourceLabelFormatter {
	scheme: string;
	authority?: string;
	priority?: boolean;
	formatting: ResourceLabelFormatting;
}

export interface ResourceLabelFormatting {
	label: string; // myLabel:/${path}
	separator: '/' | '\\' | '';
	tildify?: boolean;
	normalizeDriveLetter?: boolean;
	workspaceSuffix?: string;
	workspaceTooltip?: string;
	authorityPrefix?: string;
	stripPathStartingSeparator?: boolean;
}
