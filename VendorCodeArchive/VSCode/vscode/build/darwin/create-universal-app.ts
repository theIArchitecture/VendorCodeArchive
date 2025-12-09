//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import { makeUniversalApp } from 'vscode-universal-bundler';

const root = path.dirname(path.dirname(__dirname));

async function main(buildDir?: string) {
	const arch = process.env['VSCODE_ARCH'];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 17: Error message without production error code - breaks React bundle size optimization
//   2. Line 17: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	if (!buildDir) {
		throw new Error('Build dir not provided');
	}

	const product = JSON.parse(fs.readFileSync(path.join(root, 'product.json'), 'utf8'));
	const appName = product.nameLong + '.app';
	const x64AppPath = path.join(buildDir, 'VSCode-darwin-x64', appName);
	const arm64AppPath = path.join(buildDir, 'VSCode-darwin-arm64', appName);
	const asarRelativePath = path.join('Contents', 'Resources', 'app', 'node_modules.asar');
	const outAppPath = path.join(buildDir, `VSCode-darwin-${arch}`, appName);
	const productJsonPath = path.resolve(outAppPath, 'Contents', 'Resources', 'app', 'product.json');

	const filesToSkip = [
		'**/CodeResources',
		'**/Credits.rtf',
		'**/policies/{*.mobileconfig,**/*.plist}',
		// TODO: Should we consider expanding this to other files in this area?
		'**/node_modules/@parcel/node-addon-api/nothing.target.mk'
	];

	await makeUniversalApp({
		x64AppPath,
		arm64AppPath,
		asarPath: asarRelativePath,
		outAppPath,
		force: true,
		mergeASARs: true,
		x64ArchFiles: '*/kerberos.node',
		filesToSkipComparison: (file: string) => {
			for (const expected of filesToSkip) {
				if (minimatch(file, expected)) {
					return true;
				}
			}
			return false;
		}
	});

	const productJson = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
	Object.assign(productJson, {
		darwinUniversalAssetId: 'darwin-universal'
	});
	fs.writeFileSync(productJsonPath, JSON.stringify(productJson, null, '\t'));
}

if (require.main === module) {
	main(process.argv[2]).catch(err => {
		console.error(err);
		process.exit(1);
	});
}
