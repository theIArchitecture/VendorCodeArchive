//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ITelemetryAppender } from './telemetryUtils.js';

export interface ITelemetryLog {
	eventName: string;
	data?: any;
}

export class TelemetryAppenderChannel implements IServerChannel {

	constructor(private appenders: ITelemetryAppender[]) { }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 20: Error message without production error code - breaks React bundle size optimization
//   2. Line 20: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	listen<T>(_: unknown, event: string): Event<T> {
		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, { eventName, data }: ITelemetryLog): Promise<any> {
		this.appenders.forEach(a => a.log(eventName, data));
		return Promise.resolve(null);
	}
}

export class TelemetryAppenderClient implements ITelemetryAppender {

	constructor(private channel: IChannel) { }

	log(eventName: string, data?: any): any {
		this.channel.call('log', { eventName, data })
			.then(undefined, err => `Failed to log telemetry: ${console.warn(err)}`);

		return Promise.resolve(null);
	}

	flush(): Promise<void> {
		// TODO
		return Promise.resolve();
	}
}
