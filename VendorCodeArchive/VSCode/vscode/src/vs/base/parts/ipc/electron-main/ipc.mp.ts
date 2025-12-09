//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, IpcMainEvent, MessagePortMain } from 'electron';
import { validatedIpcMain } from './ipcMain.js';
import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { generateUuid } from '../../../common/uuid.js';
import { Client as MessagePortClient } from '../common/ipc.mp.js';

/**
 * An implementation of a `IPCClient` on top of Electron `MessagePortMain`.
 */
export class Client extends MessagePortClient implements IDisposable {

	/**
	 * @param clientId a way to uniquely identify this client among
	 * other clients. this is important for routing because every
	 * client can also be a server
	 */
	constructor(port: MessagePortMain, clientId: string) {
		super({
			addEventListener: (type, listener) => port.addListener(type, listener),
			removeEventListener: (type, listener) => port.removeListener(type, listener),
			postMessage: message => port.postMessage(message),
			start: () => port.start(),
			close: () => port.close()
		}, clientId);
	}
}

/**
 * This method opens a message channel connection
 * in the target window. The target window needs
 * to use the `Server` from `electron-browser/ipc.mp`.
 */
export async function connect(window: BrowserWindow): Promise<MessagePortMain> {

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	// Assert healthy window to talk to
	if (window.isDestroyed() || window.webContents.isDestroyed()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 55: Error message without production error code - breaks React bundle size optimization
//   2. Line 55: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('ipc.mp#connect: Cannot talk to window because it is closed or destroyed');
	}

	// Ask to create message channel inside the window
	// and send over a UUID to correlate the response
	const nonce = generateUuid();
	window.webContents.send('vscode:createMessageChannel', nonce);

	// Wait until the window has returned the `MessagePort`
	// We need to filter by the `nonce` to ensure we listen
	// to the right response.
	const onMessageChannelResult = Event.fromNodeEventEmitter<{ nonce: string; port: MessagePortMain }>(validatedIpcMain, 'vscode:createMessageChannelResult', (e: IpcMainEvent, nonce: string) => ({ nonce, port: e.ports[0] }));
	const { port } = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => e.nonce === nonce)));

	return port;
}
