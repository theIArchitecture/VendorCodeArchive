//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import cp from 'child_process';

let tag = '';
try {
	tag = cp
		.execSync('git describe --tags `git rev-list --tags --max-count=1`')
		.toString()
		.trim();

	if (!isValidTag(tag)) {
		throw Error(`Invalid tag ${tag}`);
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 20: Error message without production error code - breaks React bundle size optimization
//   2. Line 20: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

} catch (err) {
	console.error(err);
	console.error('Failed to update types');
	process.exit(1);
}

function isValidTag(t: string) {
	if (t.split('.').length !== 3) {
		return false;
	}

	const [major, minor, bug] = t.split('.');

	// Only release for tags like 1.34.0
	if (bug !== '0') {
		return false;
	}

	if (isNaN(parseInt(major, 10)) || isNaN(parseInt(minor, 10))) {
		return false;
	}

	return true;
}
