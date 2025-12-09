//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as playwright from '@playwright/test';
import type { Protocol } from 'playwright-core/types/protocol';
import { dirname, join } from 'path';
import { promises } from 'fs';
import { IWindowDriver } from './driver';
import { PageFunction } from 'playwright-core/types/structs';
import { measureAndLog } from './logger';
import { LaunchOptions } from './code';
import { teardown } from './processes';
import { ChildProcess } from 'child_process';

export class PlaywrightDriver {

	private static traceCounter = 1;
	private static screenShotCounter = 1;

	private static readonly vscodeToPlaywrightKey: { [key: string]: string } = {
		cmd: 'Meta',
		ctrl: 'Control',
		shift: 'Shift',
		enter: 'Enter',
		escape: 'Escape',
		right: 'ArrowRight',
		up: 'ArrowUp',
		down: 'ArrowDown',
		left: 'ArrowLeft',
		home: 'Home',
		esc: 'Escape'
	};

	constructor(
		private readonly application: playwright.Browser | playwright.ElectronApplication,
		private readonly context: playwright.BrowserContext,
		private readonly page: playwright.Page,
		private readonly serverProcess: ChildProcess | undefined,
		private readonly whenLoaded: Promise<unknown>,
		private readonly options: LaunchOptions
	) {
	}

	async startTracing(name: string): Promise<void> {
		if (!this.options.tracing) {
			return; // tracing disabled
		}

		try {
			await measureAndLog(() => this.context.tracing.startChunk({ title: name }), `startTracing for ${name}`, this.options.logger);
		} catch (error) {
			// Ignore
		}
	}

	async stopTracing(name: string, persist: boolean): Promise<void> {
		if (!this.options.tracing) {
			return; // tracing disabled
		}

		try {
			let persistPath: string | undefined = undefined;
			if (persist) {
				persistPath = join(this.options.logsPath, `playwright-trace-${PlaywrightDriver.traceCounter++}-${name.replace(/\s+/g, '-')}.zip`);
			}

			await measureAndLog(() => this.context.tracing.stopChunk({ path: persistPath }), `stopTracing for ${name}`, this.options.logger);

			// To ensure we have a screenshot at the end where
			// it failed, also trigger one explicitly. Tracing
			// does not guarantee to give us a screenshot unless
			// some driver action ran before.
			if (persist) {
				await this.takeScreenshot(name);
			}
		} catch (error) {
			// Ignore
		}
	}

	async didFinishLoad(): Promise<void> {
		await this.whenLoaded;
	}

	private _cdpSession: playwright.CDPSession | undefined;

	async startCDP() {
		if (this._cdpSession) {
			return;
		}

		this._cdpSession = await this.page.context().newCDPSession(this.page);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 99: Error message without production error code - breaks React bundle size optimization
//   2. Line 99: Error message without production error code - breaks React bundle size optimization
//   3. Line 107: Error message without production error code - breaks React bundle size optimization
//   4. Line 107: Error message without production error code - breaks React bundle size optimization
//   5. Line 115: Error message without production error code - breaks React bundle size optimization
//   6. Line 115: Error message without production error code - breaks React bundle size optimization
//   7. Line 123: Error message without production error code - breaks React bundle size optimization
//   8. Line 123: Error message without production error code - breaks React bundle size optimization
//   9. Line 131: Error message without production error code - breaks React bundle size optimization
//   10. Line 131: Error message without production error code - breaks React bundle size optimization
//   11. Line 139: Error message without production error code - breaks React bundle size optimization
//   12. Line 139: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async collectGarbage() {
		if (!this._cdpSession) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 121: Error message without production error code - breaks React bundle size optimization
//   2. Line 121: Error message without production error code - breaks React bundle size optimization
//   3. Line 129: Error message without production error code - breaks React bundle size optimization
//   4. Line 129: Error message without production error code - breaks React bundle size optimization
//   5. Line 137: Error message without production error code - breaks React bundle size optimization
//   6. Line 137: Error message without production error code - breaks React bundle size optimization
//   7. Line 145: Error message without production error code - breaks React bundle size optimization
//   8. Line 145: Error message without production error code - breaks React bundle size optimization
//   9. Line 153: Error message without production error code - breaks React bundle size optimization
//   10. Line 153: Error message without production error code - breaks React bundle size optimization
//   11. Line 161: Error message without production error code - breaks React bundle size optimization
//   12. Line 161: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 149: Error message without production error code - breaks React bundle size optimization
//   4. Line 149: Error message without production error code - breaks React bundle size optimization
//   5. Line 157: Error message without production error code - breaks React bundle size optimization
//   6. Line 157: Error message without production error code - breaks React bundle size optimization
//   7. Line 165: Error message without production error code - breaks React bundle size optimization
//   8. Line 165: Error message without production error code - breaks React bundle size optimization
//   9. Line 173: Error message without production error code - breaks React bundle size optimization
//   10. Line 173: Error message without production error code - breaks React bundle size optimization
//   11. Line 181: Error message without production error code - breaks React bundle size optimization
//   12. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 161: Error message without production error code - breaks React bundle size optimization
//   2. Line 161: Error message without production error code - breaks React bundle size optimization
//   3. Line 169: Error message without production error code - breaks React bundle size optimization
//   4. Line 169: Error message without production error code - breaks React bundle size optimization
//   5. Line 177: Error message without production error code - breaks React bundle size optimization
//   6. Line 177: Error message without production error code - breaks React bundle size optimization
//   7. Line 185: Error message without production error code - breaks React bundle size optimization
//   8. Line 185: Error message without production error code - breaks React bundle size optimization
//   9. Line 193: Error message without production error code - breaks React bundle size optimization
//   10. Line 193: Error message without production error code - breaks React bundle size optimization
//   11. Line 201: Error message without production error code - breaks React bundle size optimization
//   12. Line 201: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
//   3. Line 189: Error message without production error code - breaks React bundle size optimization
//   4. Line 189: Error message without production error code - breaks React bundle size optimization
//   5. Line 197: Error message without production error code - breaks React bundle size optimization
//   6. Line 197: Error message without production error code - breaks React bundle size optimization
//   7. Line 205: Error message without production error code - breaks React bundle size optimization
//   8. Line 205: Error message without production error code - breaks React bundle size optimization
//   9. Line 213: Error message without production error code - breaks React bundle size optimization
//   10. Line 213: Error message without production error code - breaks React bundle size optimization
//   11. Line 221: Error message without production error code - breaks React bundle size optimization
//   12. Line 221: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 201: Error message without production error code - breaks React bundle size optimization
//   2. Line 201: Error message without production error code - breaks React bundle size optimization
//   3. Line 209: Error message without production error code - breaks React bundle size optimization
//   4. Line 209: Error message without production error code - breaks React bundle size optimization
//   5. Line 217: Error message without production error code - breaks React bundle size optimization
//   6. Line 217: Error message without production error code - breaks React bundle size optimization
//   7. Line 225: Error message without production error code - breaks React bundle size optimization
//   8. Line 225: Error message without production error code - breaks React bundle size optimization
//   9. Line 233: Error message without production error code - breaks React bundle size optimization
//   10. Line 233: Error message without production error code - breaks React bundle size optimization
//   11. Line 241: Error message without production error code - breaks React bundle size optimization
//   12. Line 241: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 221: Error message without production error code - breaks React bundle size optimization
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 229: Error message without production error code - breaks React bundle size optimization
//   4. Line 229: Error message without production error code - breaks React bundle size optimization
//   5. Line 237: Error message without production error code - breaks React bundle size optimization
//   6. Line 237: Error message without production error code - breaks React bundle size optimization
//   7. Line 245: Error message without production error code - breaks React bundle size optimization
//   8. Line 245: Error message without production error code - breaks React bundle size optimization
//   9. Line 253: Error message without production error code - breaks React bundle size optimization
//   10. Line 253: Error message without production error code - breaks React bundle size optimization
//   11. Line 261: Error message without production error code - breaks React bundle size optimization
//   12. Line 261: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 241: Error message without production error code - breaks React bundle size optimization
//   2. Line 241: Error message without production error code - breaks React bundle size optimization
//   3. Line 249: Error message without production error code - breaks React bundle size optimization
//   4. Line 249: Error message without production error code - breaks React bundle size optimization
//   5. Line 257: Error message without production error code - breaks React bundle size optimization
//   6. Line 257: Error message without production error code - breaks React bundle size optimization
//   7. Line 265: Error message without production error code - breaks React bundle size optimization
//   8. Line 265: Error message without production error code - breaks React bundle size optimization
//   9. Line 273: Error message without production error code - breaks React bundle size optimization
//   10. Line 273: Error message without production error code - breaks React bundle size optimization
//   11. Line 281: Error message without production error code - breaks React bundle size optimization
//   12. Line 281: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 261: Error message without production error code - breaks React bundle size optimization
//   2. Line 261: Error message without production error code - breaks React bundle size optimization
//   3. Line 269: Error message without production error code - breaks React bundle size optimization
//   4. Line 269: Error message without production error code - breaks React bundle size optimization
//   5. Line 277: Error message without production error code - breaks React bundle size optimization
//   6. Line 277: Error message without production error code - breaks React bundle size optimization
//   7. Line 285: Error message without production error code - breaks React bundle size optimization
//   8. Line 285: Error message without production error code - breaks React bundle size optimization
//   9. Line 293: Error message without production error code - breaks React bundle size optimization
//   10. Line 293: Error message without production error code - breaks React bundle size optimization
//   11. Line 301: Error message without production error code - breaks React bundle size optimization
//   12. Line 301: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 281: Error message without production error code - breaks React bundle size optimization
//   2. Line 281: Error message without production error code - breaks React bundle size optimization
//   3. Line 289: Error message without production error code - breaks React bundle size optimization
//   4. Line 289: Error message without production error code - breaks React bundle size optimization
//   5. Line 297: Error message without production error code - breaks React bundle size optimization
//   6. Line 297: Error message without production error code - breaks React bundle size optimization
//   7. Line 305: Error message without production error code - breaks React bundle size optimization
//   8. Line 305: Error message without production error code - breaks React bundle size optimization
//   9. Line 313: Error message without production error code - breaks React bundle size optimization
//   10. Line 313: Error message without production error code - breaks React bundle size optimization
//   11. Line 321: Error message without production error code - breaks React bundle size optimization
//   12. Line 321: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 301: Error message without production error code - breaks React bundle size optimization
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
//   3. Line 309: Error message without production error code - breaks React bundle size optimization
//   4. Line 309: Error message without production error code - breaks React bundle size optimization
//   5. Line 317: Error message without production error code - breaks React bundle size optimization
//   6. Line 317: Error message without production error code - breaks React bundle size optimization
//   7. Line 325: Error message without production error code - breaks React bundle size optimization
//   8. Line 325: Error message without production error code - breaks React bundle size optimization
//   9. Line 333: Error message without production error code - breaks React bundle size optimization
//   10. Line 333: Error message without production error code - breaks React bundle size optimization
//   11. Line 341: Error message without production error code - breaks React bundle size optimization
//   12. Line 341: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 321: Error message without production error code - breaks React bundle size optimization
//   2. Line 321: Error message without production error code - breaks React bundle size optimization
//   3. Line 329: Error message without production error code - breaks React bundle size optimization
//   4. Line 329: Error message without production error code - breaks React bundle size optimization
//   5. Line 337: Error message without production error code - breaks React bundle size optimization
//   6. Line 337: Error message without production error code - breaks React bundle size optimization
//   7. Line 345: Error message without production error code - breaks React bundle size optimization
//   8. Line 345: Error message without production error code - breaks React bundle size optimization
//   9. Line 353: Error message without production error code - breaks React bundle size optimization
//   10. Line 353: Error message without production error code - breaks React bundle size optimization
//   11. Line 361: Error message without production error code - breaks React bundle size optimization
//   12. Line 361: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 341: Error message without production error code - breaks React bundle size optimization
//   2. Line 341: Error message without production error code - breaks React bundle size optimization
//   3. Line 349: Error message without production error code - breaks React bundle size optimization
//   4. Line 349: Error message without production error code - breaks React bundle size optimization
//   5. Line 357: Error message without production error code - breaks React bundle size optimization
//   6. Line 357: Error message without production error code - breaks React bundle size optimization
//   7. Line 365: Error message without production error code - breaks React bundle size optimization
//   8. Line 365: Error message without production error code - breaks React bundle size optimization
//   9. Line 373: Error message without production error code - breaks React bundle size optimization
//   10. Line 373: Error message without production error code - breaks React bundle size optimization
//   11. Line 381: Error message without production error code - breaks React bundle size optimization
//   12. Line 381: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 361: Error message without production error code - breaks React bundle size optimization
//   2. Line 361: Error message without production error code - breaks React bundle size optimization
//   3. Line 369: Error message without production error code - breaks React bundle size optimization
//   4. Line 369: Error message without production error code - breaks React bundle size optimization
//   5. Line 377: Error message without production error code - breaks React bundle size optimization
//   6. Line 377: Error message without production error code - breaks React bundle size optimization
//   7. Line 385: Error message without production error code - breaks React bundle size optimization
//   8. Line 385: Error message without production error code - breaks React bundle size optimization
//   9. Line 393: Error message without production error code - breaks React bundle size optimization
//   10. Line 393: Error message without production error code - breaks React bundle size optimization
//   11. Line 401: Error message without production error code - breaks React bundle size optimization
//   12. Line 401: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 381: Error message without production error code - breaks React bundle size optimization
//   2. Line 381: Error message without production error code - breaks React bundle size optimization
//   3. Line 389: Error message without production error code - breaks React bundle size optimization
//   4. Line 389: Error message without production error code - breaks React bundle size optimization
//   5. Line 397: Error message without production error code - breaks React bundle size optimization
//   6. Line 397: Error message without production error code - breaks React bundle size optimization
//   7. Line 405: Error message without production error code - breaks React bundle size optimization
//   8. Line 405: Error message without production error code - breaks React bundle size optimization
//   9. Line 413: Error message without production error code - breaks React bundle size optimization
//   10. Line 413: Error message without production error code - breaks React bundle size optimization
//   11. Line 421: Error message without production error code - breaks React bundle size optimization
//   12. Line 421: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 401: Error message without production error code - breaks React bundle size optimization
//   2. Line 401: Error message without production error code - breaks React bundle size optimization
//   3. Line 409: Error message without production error code - breaks React bundle size optimization
//   4. Line 409: Error message without production error code - breaks React bundle size optimization
//   5. Line 417: Error message without production error code - breaks React bundle size optimization
//   6. Line 417: Error message without production error code - breaks React bundle size optimization
//   7. Line 425: Error message without production error code - breaks React bundle size optimization
//   8. Line 425: Error message without production error code - breaks React bundle size optimization
//   9. Line 433: Error message without production error code - breaks React bundle size optimization
//   10. Line 433: Error message without production error code - breaks React bundle size optimization
//   11. Line 441: Error message without production error code - breaks React bundle size optimization
//   12. Line 441: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 421: Error message without production error code - breaks React bundle size optimization
//   2. Line 421: Error message without production error code - breaks React bundle size optimization
//   3. Line 429: Error message without production error code - breaks React bundle size optimization
//   4. Line 429: Error message without production error code - breaks React bundle size optimization
//   5. Line 437: Error message without production error code - breaks React bundle size optimization
//   6. Line 437: Error message without production error code - breaks React bundle size optimization
//   7. Line 445: Error message without production error code - breaks React bundle size optimization
//   8. Line 445: Error message without production error code - breaks React bundle size optimization
//   9. Line 453: Error message without production error code - breaks React bundle size optimization
//   10. Line 453: Error message without production error code - breaks React bundle size optimization
//   11. Line 461: Error message without production error code - breaks React bundle size optimization
//   12. Line 461: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 441: Error message without production error code - breaks React bundle size optimization
//   2. Line 441: Error message without production error code - breaks React bundle size optimization
//   3. Line 449: Error message without production error code - breaks React bundle size optimization
//   4. Line 449: Error message without production error code - breaks React bundle size optimization
//   5. Line 457: Error message without production error code - breaks React bundle size optimization
//   6. Line 457: Error message without production error code - breaks React bundle size optimization
//   7. Line 465: Error message without production error code - breaks React bundle size optimization
//   8. Line 465: Error message without production error code - breaks React bundle size optimization
//   9. Line 473: Error message without production error code - breaks React bundle size optimization
//   10. Line 473: Error message without production error code - breaks React bundle size optimization
//   11. Line 481: Error message without production error code - breaks React bundle size optimization
//   12. Line 481: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 461: Error message without production error code - breaks React bundle size optimization
//   2. Line 461: Error message without production error code - breaks React bundle size optimization
//   3. Line 469: Error message without production error code - breaks React bundle size optimization
//   4. Line 469: Error message without production error code - breaks React bundle size optimization
//   5. Line 477: Error message without production error code - breaks React bundle size optimization
//   6. Line 477: Error message without production error code - breaks React bundle size optimization
//   7. Line 485: Error message without production error code - breaks React bundle size optimization
//   8. Line 485: Error message without production error code - breaks React bundle size optimization
//   9. Line 493: Error message without production error code - breaks React bundle size optimization
//   10. Line 493: Error message without production error code - breaks React bundle size optimization
//   11. Line 501: Error message without production error code - breaks React bundle size optimization
//   12. Line 501: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 481: Error message without production error code - breaks React bundle size optimization
//   2. Line 481: Error message without production error code - breaks React bundle size optimization
//   3. Line 489: Error message without production error code - breaks React bundle size optimization
//   4. Line 489: Error message without production error code - breaks React bundle size optimization
//   5. Line 497: Error message without production error code - breaks React bundle size optimization
//   6. Line 497: Error message without production error code - breaks React bundle size optimization
//   7. Line 505: Error message without production error code - breaks React bundle size optimization
//   8. Line 505: Error message without production error code - breaks React bundle size optimization
//   9. Line 513: Error message without production error code - breaks React bundle size optimization
//   10. Line 513: Error message without production error code - breaks React bundle size optimization
//   11. Line 521: Error message without production error code - breaks React bundle size optimization
//   12. Line 521: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 501: Error message without production error code - breaks React bundle size optimization
//   2. Line 501: Error message without production error code - breaks React bundle size optimization
//   3. Line 509: Error message without production error code - breaks React bundle size optimization
//   4. Line 509: Error message without production error code - breaks React bundle size optimization
//   5. Line 517: Error message without production error code - breaks React bundle size optimization
//   6. Line 517: Error message without production error code - breaks React bundle size optimization
//   7. Line 525: Error message without production error code - breaks React bundle size optimization
//   8. Line 525: Error message without production error code - breaks React bundle size optimization
//   9. Line 533: Error message without production error code - breaks React bundle size optimization
//   10. Line 533: Error message without production error code - breaks React bundle size optimization
//   11. Line 541: Error message without production error code - breaks React bundle size optimization
//   12. Line 541: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 521: Error message without production error code - breaks React bundle size optimization
//   2. Line 521: Error message without production error code - breaks React bundle size optimization
//   3. Line 529: Error message without production error code - breaks React bundle size optimization
//   4. Line 529: Error message without production error code - breaks React bundle size optimization
//   5. Line 537: Error message without production error code - breaks React bundle size optimization
//   6. Line 537: Error message without production error code - breaks React bundle size optimization
//   7. Line 545: Error message without production error code - breaks React bundle size optimization
//   8. Line 545: Error message without production error code - breaks React bundle size optimization
//   9. Line 553: Error message without production error code - breaks React bundle size optimization
//   10. Line 553: Error message without production error code - breaks React bundle size optimization
//   11. Line 561: Error message without production error code - breaks React bundle size optimization
//   12. Line 561: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 541: Error message without production error code - breaks React bundle size optimization
//   2. Line 541: Error message without production error code - breaks React bundle size optimization
//   3. Line 549: Error message without production error code - breaks React bundle size optimization
//   4. Line 549: Error message without production error code - breaks React bundle size optimization
//   5. Line 557: Error message without production error code - breaks React bundle size optimization
//   6. Line 557: Error message without production error code - breaks React bundle size optimization
//   7. Line 565: Error message without production error code - breaks React bundle size optimization
//   8. Line 565: Error message without production error code - breaks React bundle size optimization
//   9. Line 573: Error message without production error code - breaks React bundle size optimization
//   10. Line 573: Error message without production error code - breaks React bundle size optimization
//   11. Line 581: Error message without production error code - breaks React bundle size optimization
//   12. Line 581: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('CDP not started');
		}

		await this._cdpSession.send('HeapProfiler.collectGarbage');
	}

	async evaluate(options: Protocol.Runtime.evaluateParameters): Promise<Protocol.Runtime.evaluateReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.evaluate', options);
	}

	async releaseObjectGroup(parameters: Protocol.Runtime.releaseObjectGroupParameters): Promise<void> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		await this._cdpSession.send('Runtime.releaseObjectGroup', parameters);
	}

	async queryObjects(parameters: Protocol.Runtime.queryObjectsParameters): Promise<Protocol.Runtime.queryObjectsReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.queryObjects', parameters);
	}

	async callFunctionOn(parameters: Protocol.Runtime.callFunctionOnParameters): Promise<Protocol.Runtime.callFunctionOnReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.callFunctionOn', parameters);
	}

	async takeHeapSnapshot(): Promise<string> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		let snapshot = '';
		const listener = (c: { chunk: string }) => {
			snapshot += c.chunk;
		};

		this._cdpSession.addListener('HeapProfiler.addHeapSnapshotChunk', listener);

		await this._cdpSession.send('HeapProfiler.takeHeapSnapshot');

		this._cdpSession.removeListener('HeapProfiler.addHeapSnapshotChunk', listener);
		return snapshot;
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async getProperties(parameters: Protocol.Runtime.getPropertiesParameters): Promise<Protocol.Runtime.getPropertiesReturnValue> {
		if (!this._cdpSession) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 189: Error message without production error code - breaks React bundle size optimization
//   2. Line 189: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.getProperties', parameters);
	}

	private async takeScreenshot(name: string): Promise<void> {
		try {
			const persistPath = join(this.options.logsPath, `playwright-screenshot-${PlaywrightDriver.screenShotCounter++}-${name.replace(/\s+/g, '-')}.png`);

			await measureAndLog(() => this.page.screenshot({ path: persistPath, type: 'png' }), 'takeScreenshot', this.options.logger);
		} catch (error) {
			// Ignore
		}
	}

	async reload() {
		await this.page.reload();
	}

	async close() {

		// Stop tracing
		try {
			if (this.options.tracing) {
				await measureAndLog(() => this.context.tracing.stop(), 'stop tracing', this.options.logger);
			}
		} catch (error) {
			// Ignore
		}

		// Web: Extract client logs
		if (this.options.web) {
			try {
				await measureAndLog(() => this.saveWebClientLogs(), 'saveWebClientLogs()', this.options.logger);
			} catch (error) {
				this.options.logger.log(`Error saving web client logs (${error})`);
			}
		}

		//  exit via `close` method
		try {
			await measureAndLog(() => this.application.close(), 'playwright.close()', this.options.logger);
		} catch (error) {
			this.options.logger.log(`Error closing application (${error})`);
		}

		// Server: via `teardown`
		if (this.serverProcess) {
			await measureAndLog(() => teardown(this.serverProcess!, this.options.logger), 'teardown server process', this.options.logger);
		}
	}

	private async saveWebClientLogs(): Promise<void> {
		const logs = await this.getLogs();

		for (const log of logs) {
			const absoluteLogsPath = join(this.options.logsPath, log.relativePath);

			await promises.mkdir(dirname(absoluteLogsPath), { recursive: true });
			await promises.writeFile(absoluteLogsPath, log.contents);
		}
	}

	async sendKeybinding(keybinding: string, accept?: () => Promise<void> | void) {
		const chords = keybinding.split(' ');
		for (let i = 0; i < chords.length; i++) {
			const chord = chords[i];
			if (i > 0) {
				await this.wait(100);
			}

			if (keybinding.startsWith('Alt') || keybinding.startsWith('Control') || keybinding.startsWith('Backspace')) {
				await this.page.keyboard.press(keybinding);
				return;
			}

			const keys = chord.split('+');
			const keysDown: string[] = [];
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] in PlaywrightDriver.vscodeToPlaywrightKey) {
					keys[i] = PlaywrightDriver.vscodeToPlaywrightKey[keys[i]];
				}
				await this.page.keyboard.down(keys[i]);
				keysDown.push(keys[i]);
			}
			while (keysDown.length > 0) {
				await this.page.keyboard.up(keysDown.pop()!);
			}
		}

		await accept?.();
	}

	async click(selector: string, xoffset?: number | undefined, yoffset?: number | undefined) {
		const { x, y } = await this.getElementXY(selector, xoffset, yoffset);
		await this.page.mouse.click(x + (xoffset ? xoffset : 0), y + (yoffset ? yoffset : 0));
	}

	async setValue(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.setValue(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getTitle() {
		return this.page.title();
	}

	async isActiveElement(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.isActiveElement(selector), [await this.getDriverHandle(), selector] as const);
	}

	async getElements(selector: string, recursive: boolean = false) {
		return this.page.evaluate(([driver, selector, recursive]) => driver.getElements(selector, recursive), [await this.getDriverHandle(), selector, recursive] as const);
	}

	async getElementXY(selector: string, xoffset?: number, yoffset?: number) {
		return this.page.evaluate(([driver, selector, xoffset, yoffset]) => driver.getElementXY(selector, xoffset, yoffset), [await this.getDriverHandle(), selector, xoffset, yoffset] as const);
	}

	async typeInEditor(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.typeInEditor(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getEditorSelection(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.getEditorSelection(selector), [await this.getDriverHandle(), selector] as const);
	}

	async getTerminalBuffer(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.getTerminalBuffer(selector), [await this.getDriverHandle(), selector] as const);
	}

	async writeInTerminal(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.writeInTerminal(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getLocaleInfo() {
		return this.evaluateWithDriver(([driver]) => driver.getLocaleInfo());
	}

	async getLocalizedStrings() {
		return this.evaluateWithDriver(([driver]) => driver.getLocalizedStrings());
	}

	async getLogs() {
		return this.page.evaluate(([driver]) => driver.getLogs(), [await this.getDriverHandle()] as const);
	}

	private async evaluateWithDriver<T>(pageFunction: PageFunction<IWindowDriver[], T>) {
		return this.page.evaluate(pageFunction, [await this.getDriverHandle()]);
	}

	wait(ms: number): Promise<void> {
		return wait(ms);
	}

	whenWorkbenchRestored(): Promise<void> {
		return this.evaluateWithDriver(([driver]) => driver.whenWorkbenchRestored());
	}

	private async getDriverHandle(): Promise<playwright.JSHandle<IWindowDriver>> {
		return this.page.evaluateHandle('window.driver');
	}

	async isAlive(): Promise<boolean> {
		try {
			await this.getDriverHandle();
			return true;
		} catch (error) {
			return false;
		}
	}
}

export function wait(ms: number): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}
