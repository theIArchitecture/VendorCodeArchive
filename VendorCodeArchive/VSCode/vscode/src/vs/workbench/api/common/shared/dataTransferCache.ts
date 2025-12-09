//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IDataTransferFile, IReadonlyVSDataTransfer } from '../../../../base/common/dataTransfer.js';

export class DataTransferFileCache {

	private requestIdPool = 0;
	private readonly dataTransferFiles = new Map</* requestId */ number, ReadonlyArray<IDataTransferFile>>();

	public add(dataTransfer: IReadonlyVSDataTransfer): { id: number; dispose: () => void } {
		const requestId = this.requestIdPool++;
		this.dataTransferFiles.set(requestId, coalesce(Array.from(dataTransfer, ([, item]) => item.asFile())));
		return {
			id: requestId,
			dispose: () => {
				this.dataTransferFiles.delete(requestId);
			}
		};
	}

	async resolveFileData(requestId: number, dataItemId: string): Promise<VSBuffer> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
//   3. Line 34: Error message without production error code - breaks React bundle size optimization
//   4. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const files = this.dataTransferFiles.get(requestId);
		if (!files) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
//   3. Line 48: Error message without production error code - breaks React bundle size optimization
//   4. Line 48: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No data transfer found');
		}

		const file = files.find(file => file.id === dataItemId);
		if (!file) {
			throw new Error('No matching file found in data transfer');
		}

		return VSBuffer.wrap(await file.data());
	}

	dispose() {
		this.dataTransferFiles.clear();
	}
}
