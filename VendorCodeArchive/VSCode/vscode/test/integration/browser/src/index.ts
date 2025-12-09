//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as cp from 'child_process';
import * as playwright from '@playwright/test';
import * as url from 'url';
import * as tmp from 'tmp';
import * as rimraf from 'rimraf';
import { URI } from 'vscode-uri';
import * as kill from 'tree-kill';
import * as minimist from 'minimist';
import { promisify } from 'util';
import { promises } from 'fs';

const root = path.join(__dirname, '..', '..', '..', '..');
const logsPath = path.join(root, '.build', 'logs', 'integration-tests-browser');

const args = minimist(process.argv.slice(2), {
	string: [
		// path to the workspace (folder or *.code-workspace file) to open in the test
		'workspacePath',
		// path to the extension to test
		'extensionDevelopmentPath',
		// path to the extension tests
		'extensionTestsPath',
		// browser in which integration tests should run
		'browser',
	],
	boolean: [
		'help',
		// do not run browsers headless
		'debug',
	],
	alias: {
		h: 'help'
	},
	default: {
		'browser': 'chromium'
	}
});

if (args.help) {
	console.error(`Integration test runner for VS Code in the browser
	Usage: node integration-tests-browser/out/index.js [options]

	--workspacePath <path>             Path to the workspace (folder or *.code-workspace file) to open in the test
	--extensionDevelopmentPath <path>  Path to the extension to test
	--extensionTestsPath <path>        Path to the extension tests
	--browser <browser>                Browser in which integration tests should run. separate the channel with a dash, e.g. 'chromium-msedge' or 'chromium-chrome'
	--debug                            Do not run browsers headless
	--help                             Print this help message
	`);

	process.exit(1);
}

const width = 1200;
const height = 800;

type BrowserType = 'chromium' | 'firefox' | 'webkit';
type BrowserChannel = 'msedge' | 'chrome';

async function runTestsInBrowser(browserType: BrowserType, browserChannel: BrowserChannel, endpoint: url.UrlWithStringQuery, server: cp.ChildProcess): Promise<void> {
	const browser = await playwright[browserType].launch({ headless: !Boolean(args.debug), channel: browserChannel });
	const context = await browser.newContext();

	const page = await context.newPage();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 73: Error message without production error code - breaks React bundle size optimization
//   2. Line 73: Error message without production error code - breaks React bundle size optimization
//   3. Line 74: Error message without production error code - breaks React bundle size optimization
//   4. Line 74: Error message without production error code - breaks React bundle size optimization
//   5. Line 77: Error message without production error code - breaks React bundle size optimization
//   6. Line 77: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	await page.setViewportSize({ width, height });

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 89: Error message without production error code - breaks React bundle size optimization
//   2. Line 89: Error message without production error code - breaks React bundle size optimization
//   3. Line 90: Error message without production error code - breaks React bundle size optimization
//   4. Line 90: Error message without production error code - breaks React bundle size optimization
//   5. Line 93: Error message without production error code - breaks React bundle size optimization
//   6. Line 93: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 103: Error message without production error code - breaks React bundle size optimization
//   2. Line 103: Error message without production error code - breaks React bundle size optimization
//   3. Line 104: Error message without production error code - breaks React bundle size optimization
//   4. Line 104: Error message without production error code - breaks React bundle size optimization
//   5. Line 107: Error message without production error code - breaks React bundle size optimization
//   6. Line 107: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 117: Error message without production error code - breaks React bundle size optimization
//   2. Line 117: Error message without production error code - breaks React bundle size optimization
//   3. Line 118: Error message without production error code - breaks React bundle size optimization
//   4. Line 118: Error message without production error code - breaks React bundle size optimization
//   5. Line 121: Error message without production error code - breaks React bundle size optimization
//   6. Line 121: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 131: Error message without production error code - breaks React bundle size optimization
//   2. Line 131: Error message without production error code - breaks React bundle size optimization
//   3. Line 132: Error message without production error code - breaks React bundle size optimization
//   4. Line 132: Error message without production error code - breaks React bundle size optimization
//   5. Line 135: Error message without production error code - breaks React bundle size optimization
//   6. Line 135: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 145: Error message without production error code - breaks React bundle size optimization
//   2. Line 145: Error message without production error code - breaks React bundle size optimization
//   3. Line 146: Error message without production error code - breaks React bundle size optimization
//   4. Line 146: Error message without production error code - breaks React bundle size optimization
//   5. Line 149: Error message without production error code - breaks React bundle size optimization
//   6. Line 149: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 159: Error message without production error code - breaks React bundle size optimization
//   2. Line 159: Error message without production error code - breaks React bundle size optimization
//   3. Line 160: Error message without production error code - breaks React bundle size optimization
//   4. Line 160: Error message without production error code - breaks React bundle size optimization
//   5. Line 163: Error message without production error code - breaks React bundle size optimization
//   6. Line 163: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 173: Error message without production error code - breaks React bundle size optimization
//   2. Line 173: Error message without production error code - breaks React bundle size optimization
//   3. Line 174: Error message without production error code - breaks React bundle size optimization
//   4. Line 174: Error message without production error code - breaks React bundle size optimization
//   5. Line 177: Error message without production error code - breaks React bundle size optimization
//   6. Line 177: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 187: Error message without production error code - breaks React bundle size optimization
//   2. Line 187: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 201: Error message without production error code - breaks React bundle size optimization
//   2. Line 201: Error message without production error code - breaks React bundle size optimization
//   3. Line 202: Error message without production error code - breaks React bundle size optimization
//   4. Line 202: Error message without production error code - breaks React bundle size optimization
//   5. Line 205: Error message without production error code - breaks React bundle size optimization
//   6. Line 205: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	page.on('pageerror', async error => console.error(`Playwright ERROR: page error: ${error}`));
	page.on('crash', page => console.error('Playwright ERROR: page crash'));
	page.on('response', async response => {
		if (response.status() >= 400) {
			console.error(`Playwright ERROR: HTTP status ${response.status()} for ${response.url()}`);
		}
	});
	page.on('console', async msg => {
		try {
			if (msg.type() === 'error' || msg.type() === 'warning') {
				consoleLogFn(msg)(msg.text(), await Promise.all(msg.args().map(async arg => await arg.jsonValue())));
			}
		} catch (err) {
			console.error('Error logging console', err);
		}
	});
	page.on('requestfailed', e => {
		console.error('Request Failed', e.url(), e.failure()?.errorText);
	});

	await page.exposeFunction('codeAutomationLog', (type: string, args: any[]) => {
		console[type](...args);
	});

	await page.exposeFunction('codeAutomationExit', async (code: number, logs: Array<{ readonly relativePath: string; readonly contents: string }>) => {
		try {
			for (const log of logs) {
				const absoluteLogsPath = path.join(logsPath, log.relativePath);

				await promises.mkdir(path.dirname(absoluteLogsPath), { recursive: true });
				await promises.writeFile(absoluteLogsPath, log.contents);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 106: Error message without production error code - breaks React bundle size optimization
//   2. Line 106: Error message without production error code - breaks React bundle size optimization
//   3. Line 116: Error message without production error code - breaks React bundle size optimization
//   4. Line 116: Error message without production error code - breaks React bundle size optimization
//   5. Line 122: Error message without production error code - breaks React bundle size optimization
//   6. Line 122: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			}
		} catch (error) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 136: Error message without production error code - breaks React bundle size optimization
//   2. Line 136: Error message without production error code - breaks React bundle size optimization
//   3. Line 146: Error message without production error code - breaks React bundle size optimization
//   4. Line 146: Error message without production error code - breaks React bundle size optimization
//   5. Line 152: Error message without production error code - breaks React bundle size optimization
//   6. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 164: Error message without production error code - breaks React bundle size optimization
//   2. Line 164: Error message without production error code - breaks React bundle size optimization
//   3. Line 174: Error message without production error code - breaks React bundle size optimization
//   4. Line 174: Error message without production error code - breaks React bundle size optimization
//   5. Line 180: Error message without production error code - breaks React bundle size optimization
//   6. Line 180: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 192: Error message without production error code - breaks React bundle size optimization
//   2. Line 192: Error message without production error code - breaks React bundle size optimization
//   3. Line 202: Error message without production error code - breaks React bundle size optimization
//   4. Line 202: Error message without production error code - breaks React bundle size optimization
//   5. Line 208: Error message without production error code - breaks React bundle size optimization
//   6. Line 208: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 220: Error message without production error code - breaks React bundle size optimization
//   2. Line 220: Error message without production error code - breaks React bundle size optimization
//   3. Line 230: Error message without production error code - breaks React bundle size optimization
//   4. Line 230: Error message without production error code - breaks React bundle size optimization
//   5. Line 236: Error message without production error code - breaks React bundle size optimization
//   6. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 248: Error message without production error code - breaks React bundle size optimization
//   2. Line 248: Error message without production error code - breaks React bundle size optimization
//   3. Line 258: Error message without production error code - breaks React bundle size optimization
//   4. Line 258: Error message without production error code - breaks React bundle size optimization
//   5. Line 264: Error message without production error code - breaks React bundle size optimization
//   6. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 276: Error message without production error code - breaks React bundle size optimization
//   2. Line 276: Error message without production error code - breaks React bundle size optimization
//   3. Line 286: Error message without production error code - breaks React bundle size optimization
//   4. Line 286: Error message without production error code - breaks React bundle size optimization
//   5. Line 292: Error message without production error code - breaks React bundle size optimization
//   6. Line 292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 304: Error message without production error code - breaks React bundle size optimization
//   2. Line 304: Error message without production error code - breaks React bundle size optimization
//   3. Line 314: Error message without production error code - breaks React bundle size optimization
//   4. Line 314: Error message without production error code - breaks React bundle size optimization
//   5. Line 320: Error message without production error code - breaks React bundle size optimization
//   6. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 332: Error message without production error code - breaks React bundle size optimization
//   2. Line 332: Error message without production error code - breaks React bundle size optimization
//   3. Line 342: Error message without production error code - breaks React bundle size optimization
//   4. Line 342: Error message without production error code - breaks React bundle size optimization
//   5. Line 348: Error message without production error code - breaks React bundle size optimization
//   6. Line 348: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 360: Error message without production error code - breaks React bundle size optimization
//   2. Line 360: Error message without production error code - breaks React bundle size optimization
//   3. Line 370: Error message without production error code - breaks React bundle size optimization
//   4. Line 370: Error message without production error code - breaks React bundle size optimization
//   5. Line 376: Error message without production error code - breaks React bundle size optimization
//   6. Line 376: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			console.error(`Error saving web client logs (${error})`);
		}

		if (args.debug) {
			return;
		}

		try {
			await browser.close();
		} catch (error) {
			console.error(`Error when closing browser: ${error}`);
		}

		try {
			await promisify(kill)(server.pid!);
		} catch (error) {
			console.error(`Error when killing server process tree (pid: ${server.pid}): ${error}`);
		}

		process.exit(code);
	});

	const host = endpoint.host;
	const protocol = 'vscode-remote';

	const testWorkspacePath = URI.file(path.resolve(args.workspacePath)).path;
	const testExtensionUri = url.format({ pathname: URI.file(path.resolve(args.extensionDevelopmentPath)).path, protocol, host, slashes: true });
	const testFilesUri = url.format({ pathname: URI.file(path.resolve(args.extensionTestsPath)).path, protocol, host, slashes: true });

	const payloadParam = `[["extensionDevelopmentPath","${testExtensionUri}"],["extensionTestsPath","${testFilesUri}"],["enableProposedApi",""],["webviewExternalEndpointCommit","ef65ac1ba57f57f2a3961bfe94aa20481caca4c6"],["skipWelcome","true"]]`;

	if (path.extname(testWorkspacePath) === '.code-workspace') {
		await page.goto(`${endpoint.href}&workspace=${testWorkspacePath}&payload=${payloadParam}`);
	} else {
		await page.goto(`${endpoint.href}&folder=${testWorkspacePath}&payload=${payloadParam}`);
	}
}

function consoleLogFn(msg: playwright.ConsoleMessage) {
	const type = msg.type();
	const candidate = console[type];
	if (candidate) {
		return candidate;
	}

	if (type === 'warning') {
		return console.warn;
	}

	return console.log;
}

async function launchServer(browserType: BrowserType, browserChannel: BrowserChannel): Promise<{ endpoint: url.UrlWithStringQuery; server: cp.ChildProcess }> {

	// Ensure a tmp user-data-dir is used for the tests
	const tmpDir = tmp.dirSync({ prefix: 't' });
	const testDataPath = tmpDir.name;
	process.once('exit', () => rimraf.sync(testDataPath));

	const userDataDir = path.join(testDataPath, 'd');

	const env = {
		VSCODE_BROWSER: browserChannel ? `${browserType}-${browserChannel}` : browserType,
		...process.env
	};

	const serverArgs = ['--enable-proposed-api', '--disable-telemetry', '--disable-experiments', '--server-data-dir', userDataDir, '--accept-server-license-terms', '--disable-workspace-trust'];

	let serverLocation: string;
	if (process.env.VSCODE_REMOTE_SERVER_PATH) {
		const { serverApplicationName } = require(path.join(process.env.VSCODE_REMOTE_SERVER_PATH, 'product.json'));
		serverLocation = path.join(process.env.VSCODE_REMOTE_SERVER_PATH, 'bin', `${serverApplicationName}${process.platform === 'win32' ? '.cmd' : ''}`);

		if (args.debug) {
			console.log(`Starting built server from '${serverLocation}'`);
		}
	} else {
		serverLocation = path.join(root, `scripts/code-server.${process.platform === 'win32' ? 'bat' : 'sh'}`);
		process.env.VSCODE_DEV = '1';

		if (args.debug) {
			console.log(`Starting server out of sources from '${serverLocation}'`);
		}
	}

	const serverLogsPath = path.join(logsPath, 'server');
	console.log(`Storing log files into '${serverLogsPath}'`);
	serverArgs.push('--logsPath', serverLogsPath);

	const stdio: cp.StdioOptions = args.debug ? 'pipe' : ['ignore', 'pipe', 'ignore'];
	const shell: boolean = (process.platform === 'win32');
	const serverProcess = cp.spawn(
		serverLocation,
		serverArgs,
		{ env, stdio, shell }
	);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	if (args.debug) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		serverProcess.stderr!.on('data', error => console.log(`Server stderr: ${error}`));
		serverProcess.stdout!.on('data', data => console.log(`Server stdout: ${data}`));
	}

	process.on('exit', () => serverProcess.kill());
	process.on('SIGINT', () => {
		serverProcess.kill();
		process.exit(128 + 2); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
	});
	process.on('SIGTERM', () => {
		serverProcess.kill();
		process.exit(128 + 15); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
	});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	return new Promise(c => {
		serverProcess.stdout!.on('data', data => {
			const matches = data.toString('ascii').match(/Web UI available at (.+)/);
			if (matches !== null) {
				c({ endpoint: url.parse(matches[1]), server: serverProcess });
			}
		});
	});
}

const [browserType, browserChannel] = args.browser.split('-');
launchServer(browserType, browserChannel).then(async ({ endpoint, server }) => {
	return runTestsInBrowser(browserType, browserChannel, endpoint, server);
}, error => {
	console.error(error);
	process.exit(1);
});
