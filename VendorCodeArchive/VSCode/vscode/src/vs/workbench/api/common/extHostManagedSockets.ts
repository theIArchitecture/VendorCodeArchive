//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostManagedSocketsShape, MainContext, MainThreadManagedSocketsShape } from './extHost.protocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import * as vscode from 'vscode';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { VSBuffer } from '../../../base/common/buffer.js';

export interface IExtHostManagedSockets extends ExtHostManagedSocketsShape {
	setFactory(socketFactoryId: number, makeConnection: () => Thenable<vscode.ManagedMessagePassing>): void;
	readonly _serviceBrand: undefined;
}

export const IExtHostManagedSockets = createDecorator<IExtHostManagedSockets>('IExtHostManagedSockets');

export class ExtHostManagedSockets implements IExtHostManagedSockets {
	declare readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadManagedSocketsShape;
	private _remoteSocketIdCounter = 0;
	private _factory: ManagedSocketFactory | null = null;
	private readonly _managedRemoteSockets: Map<number, ManagedSocket> = new Map();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadManagedSockets);
	}

	setFactory(socketFactoryId: number, makeConnection: () => Thenable<vscode.ManagedMessagePassing>): void {
		// Terminate all previous sockets
		for (const socket of this._managedRemoteSockets.values()) {
			// calling dispose() will lead to it removing itself from the map
			socket.dispose();
		}
		// Unregister previous factory
		if (this._factory) {
			this._proxy.$unregisterSocketFactory(this._factory.socketFactoryId);
		}

		this._factory = new ManagedSocketFactory(socketFactoryId, makeConnection);
		this._proxy.$registerSocketFactory(this._factory.socketFactoryId);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 51: Error message without production error code - breaks React bundle size optimization
//   2. Line 51: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async $openRemoteSocket(socketFactoryId: number): Promise<number> {
		if (!this._factory || this._factory.socketFactoryId !== socketFactoryId) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 63: Error message without production error code - breaks React bundle size optimization
//   2. Line 63: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`No socket factory with id ${socketFactoryId}`);
		}

		const id = (++this._remoteSocketIdCounter);
		const socket = await this._factory.makeConnection();
		const disposable = new DisposableStore();
		this._managedRemoteSockets.set(id, new ManagedSocket(id, socket, disposable));

		disposable.add(toDisposable(() => this._managedRemoteSockets.delete(id)));
		disposable.add(socket.onDidEnd(() => {
			this._proxy.$onDidManagedSocketEnd(id);
			disposable.dispose();
		}));
		disposable.add(socket.onDidClose(e => {
			this._proxy.$onDidManagedSocketClose(id, e?.stack ?? e?.message);
			disposable.dispose();
		}));
		disposable.add(socket.onDidReceiveMessage(e => this._proxy.$onDidManagedSocketHaveData(id, VSBuffer.wrap(e))));

		return id;
	}

	$remoteSocketWrite(socketId: number, buffer: VSBuffer): void {
		this._managedRemoteSockets.get(socketId)?.actual.send(buffer.buffer);
	}

	$remoteSocketEnd(socketId: number): void {
		const socket = this._managedRemoteSockets.get(socketId);
		if (socket) {
			socket.actual.end();
			socket.dispose();
		}
	}

	async $remoteSocketDrain(socketId: number): Promise<void> {
		await this._managedRemoteSockets.get(socketId)?.actual.drain?.();
	}
}

class ManagedSocketFactory {
	constructor(
		public readonly socketFactoryId: number,
		public readonly makeConnection: () => Thenable<vscode.ManagedMessagePassing>,
	) { }
}

class ManagedSocket extends Disposable {
	constructor(
		public readonly socketId: number,
		public readonly actual: vscode.ManagedMessagePassing,
		disposer: DisposableStore,
	) {
		super();
		this._register(disposer);
	}
}
