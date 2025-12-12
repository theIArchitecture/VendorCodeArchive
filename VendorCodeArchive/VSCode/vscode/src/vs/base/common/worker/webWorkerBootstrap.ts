/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebWorkerServerRequestHandler, IWebWorkerServerRequestHandlerFactory, WebWorkerServer } from './webWorker.js';

type MessageEvent = {
	data: unknown;
};

declare const globalThis: {
	postMessage: (message: any) => void;
	onmessage: (event: MessageEvent) => void;
};

let initialized = false;

export function initialize<T extends IWebWorkerServerRequestHandler>(factory: IWebWorkerServerRequestHandlerFactory<T>) {
	if (initialized) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 21: Error message without production error code - breaks React bundle size optimization
//   2. Line 21: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('WebWorker already initialized!');
	}
	initialized = true;

	const webWorkerServer = new WebWorkerServer<T>(
		msg => globalThis.postMessage(msg),
		(workerServer) => factory(workerServer)
	);

	globalThis.onmessage = (e: MessageEvent) => {
		webWorkerServer.onmessage(e.data);
	};

	return webWorkerServer;
}

export function bootstrapWebWorker(factory: IWebWorkerServerRequestHandlerFactory<any>) {
	globalThis.onmessage = (_e: MessageEvent) => {
		// Ignore first message in this case and initialize if not yet initialized
		if (!initialized) {
			initialize(factory);
		}
	};
}
