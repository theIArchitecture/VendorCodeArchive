//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IUpdateService, State } from './update.js';

export class UpdateChannel implements IServerChannel {

	constructor(private service: IUpdateService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onStateChange': return this.service.onStateChange;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 20: Error message without production error code - breaks React bundle size optimization
//   2. Line 20: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'checkForUpdates': return this.service.checkForUpdates(arg);
			case 'downloadUpdate': return this.service.downloadUpdate();
			case 'applyUpdate': return this.service.applyUpdate();
			case 'quitAndInstall': return this.service.quitAndInstall();
			case '_getInitialState': return Promise.resolve(this.service.state);
			case 'isLatestVersion': return this.service.isLatestVersion();
			case '_applySpecificUpdate': return this.service._applySpecificUpdate(arg);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 34: Error message without production error code - breaks React bundle size optimization
//   2. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

		throw new Error(`Call not found: ${command}`);
	}
}

export class UpdateChannelClient implements IUpdateService {

	declare readonly _serviceBrand: undefined;
	private readonly disposables = new DisposableStore();

	private readonly _onStateChange = new Emitter<State>();
	readonly onStateChange: Event<State> = this._onStateChange.event;

	private _state: State = State.Uninitialized;
	get state(): State { return this._state; }
	set state(state: State) {
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(private readonly channel: IChannel) {
		this.disposables.add(this.channel.listen<State>('onStateChange')(state => this.state = state));
		this.channel.call<State>('_getInitialState').then(state => this.state = state);
	}

	checkForUpdates(explicit: boolean): Promise<void> {
		return this.channel.call('checkForUpdates', explicit);
	}

	downloadUpdate(): Promise<void> {
		return this.channel.call('downloadUpdate');
	}

	applyUpdate(): Promise<void> {
		return this.channel.call('applyUpdate');
	}

	quitAndInstall(): Promise<void> {
		return this.channel.call('quitAndInstall');
	}

	isLatestVersion(): Promise<boolean | undefined> {
		return this.channel.call('isLatestVersion');
	}

	_applySpecificUpdate(packagePath: string): Promise<void> {
		return this.channel.call('_applySpecificUpdate', packagePath);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}
