//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const path = require('path');
const util = require('../../../build/lib/util');
const playwright = require('@playwright/test');
const yaserver = require('yaserver');
const http = require('http');

const DEBUG_TESTS = false;
const SRC_DIR = path.join(__dirname, '../../../out-monaco-editor-core/esm');
const DST_DIR = path.join(__dirname, './out');
const PORT = 8562;

run();

async function run() {
	await extractSourcesWithoutCSS();
	const server = await startServer();

	const browser = await playwright['chromium'].launch({
		headless: !DEBUG_TESTS,
		devtools: DEBUG_TESTS
		// slowMo: DEBUG_TESTS ? 2000 : 0
	});

	const page = await browser.newPage({
		viewport: {
			width: 800,
			height: 600
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 39: Error message without production error code - breaks React bundle size optimization
//   2. Line 48: Error message without production error code - breaks React bundle size optimization
//   3. Line 52: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	});
	page.on('pageerror', (e) => {
		console.error(`[esm-check] A page error occurred:`);
		console.error(e);
		process.exit(1);
	});

	const URL = `http://127.0.0.1:${PORT}/index.html`;
	console.log(`[esm-check] Navigating to ${URL}`);
	const response = await page.goto(URL);
	if (!response) {
		console.error(`[esm-check] Missing response.`);
		process.exit(1);
	}
	if (response.status() !== 200) {
		console.error(`[esm-check] Response status ${response.status()} is not 200 .`);
		process.exit(1);
	}
	console.log(`[esm-check] All appears good.`);

	await page.close();
	await browser.close();

	server.close();
}

/**
 * @returns {Promise<http.Server>}
 */
async function startServer() {
	const staticServer = await yaserver.createServer({ rootDir: __dirname });
	return new Promise((resolve, reject) => {
		const server = http.createServer((request, response) => {
			return staticServer.handle(request, response);
		});
		server.listen(PORT, '127.0.0.1', () => {
			resolve(server);
		});
	});
}

async function extractSourcesWithoutCSS() {
	await util.rimraf(DST_DIR);

	const files = util.rreddir(SRC_DIR);
	for (const file of files) {
		const srcFilename = path.join(SRC_DIR, file);
		if (!/\.js$/.test(srcFilename)) {
			continue;
		}

		const dstFilename = path.join(DST_DIR, file);

		let contents = fs.readFileSync(srcFilename).toString();
		contents = contents.replace(/import '[^']+\.css';/g, '');

		util.ensureDir(path.dirname(dstFilename));
		fs.writeFileSync(dstFilename, contents);
	}
}
