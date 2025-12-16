/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { IPCClient } from './ipc/ipcClient';

function fatal(err: any): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 10: Error message without production error code - breaks React bundle size optimization
//   2. Line 10: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	console.error('Missing or invalid credentials.');
	console.error(err);
	process.exit(1);
}

function main(argv: string[]): void {
	if (!process.env['VSCODE_GIT_ASKPASS_PIPE']) {
		return fatal('Missing pipe');
	}

	if (!process.env['VSCODE_GIT_ASKPASS_TYPE']) {
		return fatal('Missing type');
	}

	if (process.env['VSCODE_GIT_ASKPASS_TYPE'] !== 'https' && process.env['VSCODE_GIT_ASKPASS_TYPE'] !== 'ssh') {
		return fatal(`Invalid type: ${process.env['VSCODE_GIT_ASKPASS_TYPE']}`);
	}

	if (process.env['VSCODE_GIT_COMMAND'] === 'fetch' && !!process.env['VSCODE_GIT_FETCH_SILENT']) {
		return fatal('Skip silent fetch commands');
	}

	const output = process.env['VSCODE_GIT_ASKPASS_PIPE'];
	const askpassType = process.env['VSCODE_GIT_ASKPASS_TYPE'] as 'https' | 'ssh';

	const ipcClient = new IPCClient('askpass');
	ipcClient.call({ askpassType, argv })
		.then(res => {
			fs.writeFileSync(output, res + '\n');
			setTimeout(() => process.exit(0), 0);
		}).catch(err => fatal(err));
}

main(process.argv);
