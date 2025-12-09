//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as http from 'http';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

function sendFile(res: http.ServerResponse, filepath: string) {
	fs.readFile(filepath, (err, body) => {
		if (err) {
			console.error(err);
			res.writeHead(404);
			res.end();
		} else {
			res.writeHead(200, {
				'content-length': body.length,
			});
			res.end(body);
		}
	});
}

interface IOAuthResult {
	code: string;
	state: string;
}

interface ILoopbackServer {
	/**
	 * If undefined, the server is not started yet.
	 */
	port: number | undefined;

	/**
	 * The nonce used
	 */
	nonce: string;

	/**
	 * The state parameter used in the OAuth flow.
	 */
	state: string | undefined;

	/**
	 * Starts the server.
	 * @returns The port to listen on.
	 * @throws If the server fails to start.
	 * @throws If the server is already started.
	 */
	start(): Promise<number>;
	/**
	 * Stops the server.
	 * @throws If the server is not started.
	 * @throws If the server fails to stop.
	 */
	stop(): Promise<void>;
	/**
	 * Returns a promise that resolves to the result of the OAuth flow.
	 */
	waitForOAuthResponse(): Promise<IOAuthResult>;
}

export class LoopbackAuthServer implements ILoopbackServer {
	private readonly _server: http.Server;
	private readonly _resultPromise: Promise<IOAuthResult>;
	private _startingRedirect: URL;

	public nonce = randomBytes(16).toString('base64');
	public port: number | undefined;

	public set state(state: string | undefined) {
		if (state) {
			this._startingRedirect.searchParams.set('state', state);
		} else {
			this._startingRedirect.searchParams.delete('state');
		}
	}
	public get state(): string | undefined {
		return this._startingRedirect.searchParams.get('state') ?? undefined;
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 87: Error message without production error code - breaks React bundle size optimization
//   2. Line 87: Error message without production error code - breaks React bundle size optimization
//   3. Line 90: Error message without production error code - breaks React bundle size optimization
//   4. Line 90: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	constructor(serveRoot: string, startingRedirect: string) {
		if (!serveRoot) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 101: Error message without production error code - breaks React bundle size optimization
//   2. Line 101: Error message without production error code - breaks React bundle size optimization
//   3. Line 104: Error message without production error code - breaks React bundle size optimization
//   4. Line 104: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 113: Error message without production error code - breaks React bundle size optimization
//   2. Line 113: Error message without production error code - breaks React bundle size optimization
//   3. Line 116: Error message without production error code - breaks React bundle size optimization
//   4. Line 116: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 125: Error message without production error code - breaks React bundle size optimization
//   2. Line 125: Error message without production error code - breaks React bundle size optimization
//   3. Line 128: Error message without production error code - breaks React bundle size optimization
//   4. Line 128: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 137: Error message without production error code - breaks React bundle size optimization
//   2. Line 137: Error message without production error code - breaks React bundle size optimization
//   3. Line 140: Error message without production error code - breaks React bundle size optimization
//   4. Line 140: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 149: Error message without production error code - breaks React bundle size optimization
//   2. Line 149: Error message without production error code - breaks React bundle size optimization
//   3. Line 152: Error message without production error code - breaks React bundle size optimization
//   4. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 161: Error message without production error code - breaks React bundle size optimization
//   2. Line 161: Error message without production error code - breaks React bundle size optimization
//   3. Line 164: Error message without production error code - breaks React bundle size optimization
//   4. Line 164: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 173: Error message without production error code - breaks React bundle size optimization
//   2. Line 173: Error message without production error code - breaks React bundle size optimization
//   3. Line 176: Error message without production error code - breaks React bundle size optimization
//   4. Line 176: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 185: Error message without production error code - breaks React bundle size optimization
//   2. Line 185: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 197: Error message without production error code - breaks React bundle size optimization
//   2. Line 197: Error message without production error code - breaks React bundle size optimization
//   3. Line 200: Error message without production error code - breaks React bundle size optimization
//   4. Line 200: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 209: Error message without production error code - breaks React bundle size optimization
//   2. Line 209: Error message without production error code - breaks React bundle size optimization
//   3. Line 212: Error message without production error code - breaks React bundle size optimization
//   4. Line 212: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 221: Error message without production error code - breaks React bundle size optimization
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 224: Error message without production error code - breaks React bundle size optimization
//   4. Line 224: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 233: Error message without production error code - breaks React bundle size optimization
//   2. Line 233: Error message without production error code - breaks React bundle size optimization
//   3. Line 236: Error message without production error code - breaks React bundle size optimization
//   4. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 245: Error message without production error code - breaks React bundle size optimization
//   2. Line 245: Error message without production error code - breaks React bundle size optimization
//   3. Line 248: Error message without production error code - breaks React bundle size optimization
//   4. Line 248: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 257: Error message without production error code - breaks React bundle size optimization
//   2. Line 257: Error message without production error code - breaks React bundle size optimization
//   3. Line 260: Error message without production error code - breaks React bundle size optimization
//   4. Line 260: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 269: Error message without production error code - breaks React bundle size optimization
//   2. Line 269: Error message without production error code - breaks React bundle size optimization
//   3. Line 272: Error message without production error code - breaks React bundle size optimization
//   4. Line 272: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 281: Error message without production error code - breaks React bundle size optimization
//   2. Line 281: Error message without production error code - breaks React bundle size optimization
//   3. Line 284: Error message without production error code - breaks React bundle size optimization
//   4. Line 284: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 293: Error message without production error code - breaks React bundle size optimization
//   2. Line 293: Error message without production error code - breaks React bundle size optimization
//   3. Line 296: Error message without production error code - breaks React bundle size optimization
//   4. Line 296: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 305: Error message without production error code - breaks React bundle size optimization
//   2. Line 305: Error message without production error code - breaks React bundle size optimization
//   3. Line 308: Error message without production error code - breaks React bundle size optimization
//   4. Line 308: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 317: Error message without production error code - breaks React bundle size optimization
//   2. Line 317: Error message without production error code - breaks React bundle size optimization
//   3. Line 320: Error message without production error code - breaks React bundle size optimization
//   4. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 329: Error message without production error code - breaks React bundle size optimization
//   2. Line 329: Error message without production error code - breaks React bundle size optimization
//   3. Line 332: Error message without production error code - breaks React bundle size optimization
//   4. Line 332: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 341: Error message without production error code - breaks React bundle size optimization
//   2. Line 341: Error message without production error code - breaks React bundle size optimization
//   3. Line 344: Error message without production error code - breaks React bundle size optimization
//   4. Line 344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 353: Error message without production error code - breaks React bundle size optimization
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
//   3. Line 356: Error message without production error code - breaks React bundle size optimization
//   4. Line 356: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 365: Error message without production error code - breaks React bundle size optimization
//   2. Line 365: Error message without production error code - breaks React bundle size optimization
//   3. Line 368: Error message without production error code - breaks React bundle size optimization
//   4. Line 368: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 377: Error message without production error code - breaks React bundle size optimization
//   2. Line 377: Error message without production error code - breaks React bundle size optimization
//   3. Line 380: Error message without production error code - breaks React bundle size optimization
//   4. Line 380: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 389: Error message without production error code - breaks React bundle size optimization
//   2. Line 389: Error message without production error code - breaks React bundle size optimization
//   3. Line 392: Error message without production error code - breaks React bundle size optimization
//   4. Line 392: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('serveRoot must be defined');
		}
		if (!startingRedirect) {
			throw new Error('startingRedirect must be defined');
		}
		this._startingRedirect = new URL(startingRedirect);
		let deferred: { resolve: (result: IOAuthResult) => void; reject: (reason: any) => void };
		this._resultPromise = new Promise<IOAuthResult>((resolve, reject) => deferred = { resolve, reject });

		this._server = http.createServer((req, res) => {
			const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
			switch (reqUrl.pathname) {
				case '/signin': {
					const receivedNonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					if (receivedNonce !== this.nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}` });
						res.end();
					}
					res.writeHead(302, { location: this._startingRedirect.toString() });
					res.end();
					break;
				}
				case '/callback': {
					const code = reqUrl.searchParams.get('code') ?? undefined;
					const state = reqUrl.searchParams.get('state') ?? undefined;
					const nonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					const error = reqUrl.searchParams.get('error') ?? undefined;
					if (error) {
						res.writeHead(302, { location: `/?error=${reqUrl.searchParams.get('error_description')}` });
						res.end();
						deferred.reject(new Error(error));
						break;
					}
					if (!code || !state || !nonce) {
						res.writeHead(400);
						res.end();
						break;
					}
					if (this.state !== state) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('State does not match.')}` });
						res.end();
						deferred.reject(new Error('State does not match.'));
						break;
					}
					if (this.nonce !== nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}` });
						res.end();
						deferred.reject(new Error('Nonce does not match.'));
						break;
					}
					deferred.resolve({ code, state });
					res.writeHead(302, { location: '/' });
					res.end();
					break;
				}
				// Serve the static files
				case '/':
					sendFile(res, path.join(serveRoot, 'index.html'));
					break;
				default:
					// substring to get rid of leading '/'
					sendFile(res, path.join(serveRoot, reqUrl.pathname.substring(1)));
					break;
			}
		});
	}

	public start(): Promise<number> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		return new Promise<number>((resolve, reject) => {
			if (this._server.listening) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Server is already started');
			}
			const portTimeout = setTimeout(() => {
				reject(new Error('Timeout waiting for port'));
			}, 5000);
			this._server.on('listening', () => {
				const address = this._server.address();
				if (typeof address === 'string') {
					this.port = parseInt(address);
				} else if (address instanceof Object) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 169: Error message without production error code - breaks React bundle size optimization
//   2. Line 169: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					this.port = address.port;
				} else {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 203: Error message without production error code - breaks React bundle size optimization
//   2. Line 203: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error('Unable to determine port');
				}

				clearTimeout(portTimeout);

				// set state which will be used to redirect back to vscode
				this.state = `http://127.0.0.1:${this.port}/callback?nonce=${encodeURIComponent(this.nonce)}`;

				resolve(this.port);
			});
			this._server.on('error', err => {
				reject(new Error(`Error listening to server: ${err}`));
			});
			this._server.on('close', () => {
				reject(new Error('Closed'));
			});
			this._server.listen(0, '127.0.0.1');
		});
	}

	public stop(): Promise<void> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 192: Error message without production error code - breaks React bundle size optimization
//   2. Line 192: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		return new Promise<void>((resolve, reject) => {
			if (!this._server.listening) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 236: Error message without production error code - breaks React bundle size optimization
//   2. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Server is not started');
			}
			this._server.close((err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public waitForOAuthResponse(): Promise<IOAuthResult> {
		return this._resultPromise;
	}
}
