//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileStatWithMetadata, IWriteFileOptions } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IElevatedFileService } from '../common/elevatedFileService.js';

export class BrowserElevatedFileService implements IElevatedFileService {

	readonly _serviceBrand: undefined;

	isSupported(resource: URI): boolean {
		// Saving elevated is currently not supported in web for as
		// long as we have no generic support from the file service
		// (https://github.com/microsoft/vscode/issues/48659)
		return false;
	}

	async writeFileElevated(resource: URI, value: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		throw new Error('Unsupported');
	}
}

registerSingleton(IElevatedFileService, BrowserElevatedFileService, InstantiationType.Delayed);
