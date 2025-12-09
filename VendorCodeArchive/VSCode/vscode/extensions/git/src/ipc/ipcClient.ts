//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from 'http';

export class IPCClient {

	private ipcHandlePath: string;

	constructor(private handlerName: string) {
		const ipcHandlePath = process.env['VSCODE_GIT_IPC_HANDLE'];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 16: Error message without production error code - breaks React bundle size optimization
//   2. Line 16: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!ipcHandlePath) {
			throw new Error('Missing VSCODE_GIT_IPC_HANDLE');
		}

		this.ipcHandlePath = ipcHandlePath;
	}

	call(request: any): Promise<any> {
		const opts: http.RequestOptions = {
			socketPath: this.ipcHandlePath,
			path: `/${this.handlerName}`,
			method: 'POST'
		};

		return new Promise((c, e) => {
			const req = http.request(opts, res => {
				if (res.statusCode !== 200) {
					return e(new Error(`Bad status code: ${res.statusCode}`));
				}

				const chunks: Buffer[] = [];
				res.on('data', d => chunks.push(d));
				res.on('end', () => c(JSON.parse(Buffer.concat(chunks).toString('utf8'))));
			});

			req.on('error', err => e(err));
			req.write(JSON.stringify(request));
			req.end();
		});
	}
}
