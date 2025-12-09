//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { Client, IChannel, IClientRouter, IConnectionHub, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IOpenURLOptions, IURLHandler } from './url.js';

export class URLHandlerChannel implements IServerChannel {

	constructor(private handler: IURLHandler) { }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 18: Error message without production error code - breaks React bundle size optimization
//   2. Line 18: Error message without production error code - breaks React bundle size optimization
//   3. Line 26: Error message without production error code - breaks React bundle size optimization
//   4. Line 26: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	listen<T>(_: unknown, event: string): Event<T> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 32: Error message without production error code - breaks React bundle size optimization
//   2. Line 32: Error message without production error code - breaks React bundle size optimization
//   3. Line 40: Error message without production error code - breaks React bundle size optimization
//   4. Line 40: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 44: Error message without production error code - breaks React bundle size optimization
//   2. Line 44: Error message without production error code - breaks React bundle size optimization
//   3. Line 52: Error message without production error code - breaks React bundle size optimization
//   4. Line 52: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'handleURL': return this.handler.handleURL(URI.revive(arg[0]), arg[1]);
		}

		throw new Error(`Call not found: ${command}`);
	}
}

export class URLHandlerChannelClient implements IURLHandler {

	constructor(private channel: IChannel) { }

	handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		return this.channel.call('handleURL', [uri.toJSON(), options]);
	}
}

export class URLHandlerRouter implements IClientRouter<string> {

	constructor(
		private next: IClientRouter<string>,
		private readonly logService: ILogService
	) { }

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 48: Error message without production error code - breaks React bundle size optimization
//   2. Line 48: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async routeCall(hub: IConnectionHub<string>, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<Client<string>> {
		if (command !== 'handleURL') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 72: Error message without production error code - breaks React bundle size optimization
//   2. Line 72: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Call not found: ${command}`);
		}

		if (Array.isArray(arg) && arg.length > 0) {
			const uri = URI.revive(arg[0]);

			this.logService.trace('URLHandlerRouter#routeCall() with URI argument', uri.toString(true));

			if (uri.query) {
				const match = /\bwindowId=(\d+)/.exec(uri.query);

				if (match) {
					const windowId = match[1];

					this.logService.trace(`URLHandlerRouter#routeCall(): found windowId query parameter with value "${windowId}"`, uri.toString(true));

					const regex = new RegExp(`window:${windowId}`);
					const connection = hub.connections.find(c => {
						this.logService.trace('URLHandlerRouter#routeCall(): testing connection', c.ctx);

						return regex.test(c.ctx);
					});
					if (connection) {
						this.logService.trace('URLHandlerRouter#routeCall(): found a connection to route', uri.toString(true));

						return connection;
					} else {
						this.logService.trace('URLHandlerRouter#routeCall(): did not find a connection to route', uri.toString(true));
					}
				} else {
					this.logService.trace('URLHandlerRouter#routeCall(): did not find windowId query parameter', uri.toString(true));
				}
			}
		} else {
			this.logService.trace('URLHandlerRouter#routeCall() without URI argument');
		}

		return this.next.routeCall(hub, command, arg, cancellationToken);
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 89: Error message without production error code - breaks React bundle size optimization
//   2. Line 89: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	routeEvent(_: IConnectionHub<string>, event: string): Promise<Client<string>> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 123: Error message without production error code - breaks React bundle size optimization
//   2. Line 123: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Event not found: ${event}`);
	}
}
