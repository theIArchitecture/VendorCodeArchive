//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData } from '../../../../platform/browserElements/common/browserElements.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Error message without production error code - breaks React bundle size optimization
//   3. Line 18: Error message without production error code - breaks React bundle size optimization
//   4. Line 22: Error message without production error code - breaks React bundle size optimization
//   5. Line 22: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IBrowserElementsService } from './browserElementsService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 33: Error message without production error code - breaks React bundle size optimization
//   3. Line 33: Error message without production error code - breaks React bundle size optimization
//   4. Line 37: Error message without production error code - breaks React bundle size optimization
//   5. Line 37: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

class WebBrowserElementsService implements IBrowserElementsService {
	_serviceBrand: undefined;

	constructor() { }

	async getElementData(rect: IRectangle, token: CancellationToken): Promise<IElementData | undefined> {
		throw new Error('Not implemented');
	}

	startDebugSession(token: CancellationToken, browserType: BrowserType): Promise<void> {
		throw new Error('Not implemented');
	}
}

registerSingleton(IBrowserElementsService, WebBrowserElementsService, InstantiationType.Delayed);
