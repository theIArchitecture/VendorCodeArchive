//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const path = require('path');
const perf = require('@vscode/vscode-perf');

const VSCODE_FOLDER = path.join(__dirname, '..');

async function main() {

	const args = process.argv;
	/** @type {string | undefined} */
	let build = undefined;

	if (args.indexOf('--help') === -1 && args.indexOf('-h') === -1) {
		// get build arg from args
		let buildArgIndex = args.indexOf('--build');
		buildArgIndex = buildArgIndex === -1 ? args.indexOf('-b') : buildArgIndex;
		if (buildArgIndex === -1) {
			let runtimeArgIndex = args.indexOf('--runtime');
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			runtimeArgIndex = runtimeArgIndex === -1 ? args.indexOf('-r') : runtimeArgIndex;
			if (runtimeArgIndex !== -1 && args[runtimeArgIndex + 1] !== 'desktop') {
				console.error('Please provide the --build argument. It is an executable file for desktop or a URL for web');
				process.exit(1);
			}
			build = getLocalCLIPath();
		} else {
			build = args[buildArgIndex + 1];
			if (build !== 'insider' && build !== 'stable' && build !== 'exploration') {
				build = getExePath(args[buildArgIndex + 1]);
			}
			args.splice(buildArgIndex + 1, 1);
		}

		args.push('--folder');
		args.push(VSCODE_FOLDER);
		args.push('--file');
		args.push(path.join(VSCODE_FOLDER, 'package.json'));
	}

	if (build) {
		args.push('--build');
		args.push(build);
	}

	await perf.run();
	process.exit(0);
}

/**
 * @param {string} buildPath
 * @returns {string}
 */
function getExePath(buildPath) {
	buildPath = path.normalize(path.resolve(buildPath));
	if (buildPath === path.normalize(getLocalCLIPath())) {
		return buildPath;
	}
	let relativeExePath;
	switch (process.platform) {
		case 'darwin':
			relativeExePath = path.join('Contents', 'MacOS', 'Electron');
			break;
		case 'linux': {
			const product = require(path.join(buildPath, 'resources', 'app', 'product.json'));
			relativeExePath = product.applicationName;
			break;
		}
		case 'win32': {
			const product = require(path.join(buildPath, 'resources', 'app', 'product.json'));
			relativeExePath = `${product.nameShort}.exe`;
			break;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 79: Error message without production error code - breaks React bundle size optimization
//   2. Line 79: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}
		default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 98: Error message without production error code - breaks React bundle size optimization
//   2. Line 98: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Unsupported platform.');
	}
	return buildPath.endsWith(relativeExePath) ? buildPath : path.join(buildPath, relativeExePath);
}

/**
 * @returns {string}
 */
function getLocalCLIPath() {
	return process.platform === 'win32' ? path.join(VSCODE_FOLDER, 'scripts', 'code.bat') : path.join(VSCODE_FOLDER, 'scripts', 'code.sh');
}

main();
