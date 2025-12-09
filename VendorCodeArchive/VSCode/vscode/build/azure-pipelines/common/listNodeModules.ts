//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 10: Error message without production error code - breaks React bundle size optimization
//   2. Line 10: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


if (process.argv.length !== 3) {
	console.error('Usage: node listNodeModules.js OUTPUT_FILE');
	process.exit(-1);
}

const ROOT = path.join(__dirname, '../../../');

function findNodeModulesFiles(location: string, inNodeModules: boolean, result: string[]) {
	const entries = fs.readdirSync(path.join(ROOT, location));
	for (const entry of entries) {
		const entryPath = `${location}/${entry}`;

		if (/(^\/out)|(^\/src$)|(^\/.git$)|(^\/.build$)/.test(entryPath)) {
			continue;
		}

		let stat: fs.Stats;
		try {
			stat = fs.statSync(path.join(ROOT, entryPath));
		} catch (err) {
			continue;
		}

		if (stat.isDirectory()) {
			findNodeModulesFiles(entryPath, inNodeModules || (entry === 'node_modules'), result);
		} else {
			if (inNodeModules) {
				result.push(entryPath.substr(1));
			}
		}
	}
}

const result: string[] = [];
findNodeModulesFiles('', false, result);
fs.writeFileSync(process.argv[2], result.join('\n') + '\n');
