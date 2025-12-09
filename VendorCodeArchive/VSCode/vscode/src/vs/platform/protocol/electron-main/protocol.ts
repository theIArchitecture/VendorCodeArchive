//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IProtocolMainService = createDecorator<IProtocolMainService>('protocolMainService');

export interface IIPCObjectUrl<T> extends IDisposable {

	/**
	 * A `URI` that a renderer can use to retrieve the
	 * object via `ipcRenderer.invoke(resource.toString())`
	 */
	resource: URI;

	/**
	 * Allows to update the value of the object after it
	 * has been created.
	 *
	 * @param obj the object to make accessible to the
	 * renderer.
	 */
	update(obj: T): void;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface IProtocolMainService {

	readonly _serviceBrand: undefined;

	/**
	 * Allows to make an object accessible to a renderer
	 * via `ipcRenderer.invoke(resource.toString())`.
	 */
	createIPCObjectUrl<T>(): IIPCObjectUrl<T>;

	/**
	 * Adds a path as root to the list of allowed
	 * resources for file access.
	 *
	 * @param root the path to allow for file access
	 */
	addValidFileRoot(root: string): IDisposable;
}
