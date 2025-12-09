//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IRectangle } from '../../window/common/window.js';

export const INativeBrowserElementsService = createDecorator<INativeBrowserElementsService>('nativeBrowserElementsService');

export interface IElementData {
	readonly outerHTML: string;
	readonly computedStyle: string;
	readonly bounds: IRectangle;
}

export enum BrowserType {
	SimpleBrowser = 'simpleBrowser',
	LiveServer = 'liveServer',
}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 24: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 24: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding



export interface INativeBrowserElementsService {

	readonly _serviceBrand: undefined;

	// Properties
	readonly windowId: number;

	getElementData(rect: IRectangle, token: CancellationToken, browserType: BrowserType, cancellationId?: number): Promise<IElementData | undefined>;

	startDebugSession(token: CancellationToken, browserType: BrowserType, cancelAndDetachId?: number): Promise<void>;
}
