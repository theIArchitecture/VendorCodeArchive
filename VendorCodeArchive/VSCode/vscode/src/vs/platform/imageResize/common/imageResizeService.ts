//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 8: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IImageResizeService = createDecorator<IImageResizeService>('imageResizeMainService');


export interface IImageResizeService {

	readonly _serviceBrand: undefined;

	/**
	 * Resizes an image to a maximum dimension of 768px while maintaining aspect ratio.
	 */
	resizeImage(data: Uint8Array | string, mimeType?: string): Promise<Uint8Array>;
}
