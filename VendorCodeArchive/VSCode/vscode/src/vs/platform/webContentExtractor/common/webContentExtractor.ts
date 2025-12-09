//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 37: Error message without production error code - breaks React bundle size optimization
//   9. Line 37: Error message without production error code - breaks React bundle size optimization
//   10. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 44: Error message without production error code - breaks React bundle size optimization
//   12. Line 44: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IWebContentExtractorService = createDecorator<IWebContentExtractorService>('IWebContentExtractorService');
export const ISharedWebContentExtractorService = createDecorator<ISharedWebContentExtractorService>('ISharedWebContentExtractorService');


export interface IWebContentExtractorService {
	_serviceBrand: undefined;
	extract(uri: URI[]): Promise<string[]>;
}

/*
 * A service that extracts image content from a given arbitrary URI. This is done in the shared process to avoid running non trusted application code in the main process.
 */
export interface ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(uri: URI, token: CancellationToken): Promise<VSBuffer | undefined>;
}

/**
 * A service that extracts web content from a given URI.
 * This is a placeholder implementation that does not perform any actual extraction.
 * It's intended to be used on platforms where web content extraction is not supported such as in the browser.
 */
export class NullWebContentExtractorService implements IWebContentExtractorService {
	_serviceBrand: undefined;

	extract(_uri: URI[]): Promise<string[]> {
		throw new Error('Not implemented');
	}
}

export class NullSharedWebContentExtractorService implements ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(_uri: URI, _token: CancellationToken): Promise<VSBuffer | undefined> {
		throw new Error('Not implemented');
	}
}
