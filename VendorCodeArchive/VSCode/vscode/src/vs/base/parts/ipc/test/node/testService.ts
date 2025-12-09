//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../common/async.js';
import { Emitter, Event } from '../../../../common/event.js';
import { IChannel, IServerChannel } from '../../common/ipc.js';

export interface IMarcoPoloEvent {
	answer: string;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export interface ITestService {
	onMarco: Event<IMarcoPoloEvent>;
	marco(): Promise<string>;
	pong(ping: string): Promise<{ incoming: string; outgoing: string }>;
	cancelMe(): Promise<boolean>;
}

export class TestService implements ITestService {

	private readonly _onMarco = new Emitter<IMarcoPoloEvent>();
	onMarco: Event<IMarcoPoloEvent> = this._onMarco.event;

	marco(): Promise<string> {
		this._onMarco.fire({ answer: 'polo' });
		return Promise.resolve('polo');
	}

	pong(ping: string): Promise<{ incoming: string; outgoing: string }> {
		return Promise.resolve({ incoming: ping, outgoing: 'pong' });
	}

	cancelMe(): Promise<boolean> {
		return Promise.resolve(timeout(100)).then(() => true);
	}
}

export class TestChannel implements IServerChannel {

	constructor(private testService: ITestService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'marco': return this.testService.onMarco;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 49: Error message without production error code - breaks React bundle size optimization
//   2. Line 49: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

		throw new Error('Event not found');
	}

	call(_: unknown, command: string, ...args: any[]): Promise<any> {
		switch (command) {
			case 'pong': return this.testService.pong(args[0]);
			case 'cancelMe': return this.testService.cancelMe();
			case 'marco': return this.testService.marco();
			default: return Promise.reject(new Error(`command not found: ${command}`));
		}
	}
}

export class TestServiceClient implements ITestService {

	get onMarco(): Event<IMarcoPoloEvent> { return this.channel.listen('marco'); }

	constructor(private channel: IChannel) { }

	marco(): Promise<string> {
		return this.channel.call('marco');
	}

	pong(ping: string): Promise<{ incoming: string; outgoing: string }> {
		return this.channel.call('pong', ping);
	}

	cancelMe(): Promise<boolean> {
		return this.channel.call('cancelMe');
	}
}
