//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'crypto';
import { listenStream } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { IChecksumService } from '../common/checksumService.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IFileService } from '../../files/common/files.js';

export class ChecksumService implements IChecksumService {

	declare readonly _serviceBrand: undefined;

	constructor(@IFileService private readonly fileService: IFileService) { }

	async checksum(resource: URI): Promise<string> {
		const stream = (await this.fileService.readFileStream(resource)).value;
		return new Promise<string>((resolve, reject) => {
			const hash = createHash('sha256');

			listenStream(stream, {
				onData: data => hash.update(data.buffer),
				onError: error => reject(error),
				onEnd: () => resolve(hash.digest('base64').replace(/=+$/, ''))
			});
		});
	}
}
