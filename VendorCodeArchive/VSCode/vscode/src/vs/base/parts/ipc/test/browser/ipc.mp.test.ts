//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../common/cancellation.js';
import { Event } from '../../../../common/event.js';
import { Client as MessagePortClient } from '../../browser/ipc.mp.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

suite('IPC, MessagePorts', () => {

	test('message passing', async () => {
		const { port1, port2 } = new MessageChannel();

		const client1 = new MessagePortClient(port1, 'client1');
		const client2 = new MessagePortClient(port2, 'client2');

		client1.registerChannel('client1', {
			call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
				switch (command) {
					case 'testMethodClient1': return Promise.resolve('success1');
					default: return Promise.reject(new Error('not implemented'));
				}
			},

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 30: Error message without production error code - breaks React bundle size optimization
//   2. Line 30: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			listen(_: unknown, event: string, arg?: any): Event<any> {
				switch (event) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 42: Error message without production error code - breaks React bundle size optimization
//   2. Line 42: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					default: throw new Error('not implemented');
				}
			}
		});

		client2.registerChannel('client2', {
			call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
				switch (command) {
					case 'testMethodClient2': return Promise.resolve('success2');
					default: return Promise.reject(new Error('not implemented'));
				}
			},

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 45: Error message without production error code - breaks React bundle size optimization
//   2. Line 45: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			listen(_: unknown, event: string, arg?: any): Event<any> {
				switch (event) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 67: Error message without production error code - breaks React bundle size optimization
//   2. Line 67: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					default: throw new Error('not implemented');
				}
			}
		});

		const channelClient1 = client2.getChannel('client1');
		assert.strictEqual(await channelClient1.call('testMethodClient1'), 'success1');

		const channelClient2 = client1.getChannel('client2');
		assert.strictEqual(await channelClient2.call('testMethodClient2'), 'success2');

		client1.dispose();
		client2.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
