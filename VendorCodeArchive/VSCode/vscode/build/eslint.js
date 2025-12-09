//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
const es = require('event-stream');
const vfs = require('vinyl-fs');
const { eslintFilter } = require('./filters');

function eslint() {
	const eslint = require('./gulp-eslint');
	return vfs
		.src(eslintFilter, { base: '.', follow: true, allowEmpty: true })
		.pipe(
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 17: Error message without production error code - breaks React bundle size optimization
//   2. Line 17: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			eslint((results) => {
				if (results.warningCount > 0 || results.errorCount > 0) {
					throw new Error('eslint failed with warnings and/or errors');
				}
			})
		).pipe(es.through(function () { /* noop, important for the stream to end */ }));
}

if (require.main === module) {
	eslint().on('error', (err) => {
		console.error();
		console.error(err);
		process.exit(1);
	});
}
