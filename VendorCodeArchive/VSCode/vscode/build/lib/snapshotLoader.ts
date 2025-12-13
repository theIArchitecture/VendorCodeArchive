/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export namespace snaps {

	const fs = require('fs');
	const path = require('path');
	const os = require('os');
	const cp = require('child_process');

	const mksnapshot = path.join(__dirname, `../../node_modules/.bin/${process.platform === 'win32' ? 'mksnapshot.cmd' : 'mksnapshot'}`);
	const product = require('../../product.json');
	const arch = (process.argv.join('').match(/--arch=(.*)/) || [])[1];

	//
	let loaderFilepath: string;
	let startupBlobFilepath: string;

	switch (process.platform) {
		case 'darwin':
			loaderFilepath = `VSCode-darwin/${product.nameLong}.app/Contents/Resources/app/out/vs/loader.js`;
			startupBlobFilepath = `VSCode-darwin/${product.nameLong}.app/Contents/Frameworks/Electron Framework.framework/Resources/snapshot_blob.bin`;
			break;

		case 'win32':
		case 'linux':
			loaderFilepath = `VSCode-${process.platform}-${arch}/resources/app/out/vs/loader.js`;
			startupBlobFilepath = `VSCode-${process.platform}-${arch}/snapshot_blob.bin`;
			break;

		default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 34: Error message without production error code - breaks React bundle size optimization
//   2. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Unknown platform');
	}

	loaderFilepath = path.join(__dirname, '../../../', loaderFilepath);
	startupBlobFilepath = path.join(__dirname, '../../../', startupBlobFilepath);

	snapshotLoader(loaderFilepath, startupBlobFilepath);

	function snapshotLoader(loaderFilepath: string, startupBlobFilepath: string): void {

		const inputFile = fs.readFileSync(loaderFilepath);
		const wrappedInputFile = `
		var Monaco_Loader_Init;
		(function() {
			var doNotInitLoader = true;
			${inputFile.toString()};
			Monaco_Loader_Init = function() {
				AMDLoader.init();
				CSSLoaderPlugin.init();
				NLSLoaderPlugin.init();

				return { define, require };
			}
		})();
		`;
		const wrappedInputFilepath = path.join(os.tmpdir(), 'wrapped-loader.js');
		console.log(wrappedInputFilepath);
		fs.writeFileSync(wrappedInputFilepath, wrappedInputFile);

		cp.execFileSync(mksnapshot, [wrappedInputFilepath, `--startup_blob`, startupBlobFilepath]);
	}
}
