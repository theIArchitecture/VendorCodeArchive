//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IWebviewManagerService = createDecorator<IWebviewManagerService>('webviewManagerService');

export interface WebviewWebContentsId {
	readonly webContentsId: number;
}

export interface WebviewWindowId {
	readonly windowId: number;
}

export interface FindInFrameOptions {
	readonly forward?: boolean;
	readonly findNext?: boolean;
	readonly matchCase?: boolean;
}

export interface FoundInFrameResult {
	readonly requestId: number;
	readonly activeMatchOrdinal: number;
	readonly matches: number;
	readonly selectionArea: any;
	readonly finalUpdate: boolean;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export interface IWebviewManagerService {
	_serviceBrand: unknown;

	onFoundInFrame: Event<FoundInFrameResult>;

	setIgnoreMenuShortcuts(id: WebviewWebContentsId | WebviewWindowId, enabled: boolean): Promise<void>;

	findInFrame(windowId: WebviewWindowId, frameName: string, text: string, options: FindInFrameOptions): Promise<void>;

	stopFindInFrame(windowId: WebviewWindowId, frameName: string, options: { keepSelection?: boolean }): Promise<void>;
}
