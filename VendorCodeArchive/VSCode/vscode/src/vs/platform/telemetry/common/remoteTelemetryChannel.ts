/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { TelemetryLevel } from './telemetry.js';
import { ITelemetryAppender } from './telemetryUtils.js';
import { IServerTelemetryService } from './serverTelemetryService.js';

export class ServerTelemetryChannel extends Disposable implements IServerChannel {
	constructor(
		private readonly telemetryService: IServerTelemetryService,
		private readonly telemetryAppender: ITelemetryAppender | null
	) {
		super();
	}


	async call(_: any, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'updateTelemetryLevel': {
				const { telemetryLevel } = arg;
				return this.telemetryService.updateInjectedTelemetryLevel(telemetryLevel);
			}

			case 'logTelemetry': {
				const { eventName, data } = arg;
				// Logging is done directly to the appender instead of through the telemetry service
				// as the data sent from the client has already had common properties added to it and
				// has already been sent to the telemetry output channel
				if (this.telemetryAppender) {
					return this.telemetryAppender.log(eventName, data);
				}

				return Promise.resolve();
			}

			case 'flushTelemetry': {
				if (this.telemetryAppender) {
					return this.telemetryAppender.flush();
				}

				return Promise.resolve();
			}

			case 'ping': {
				return;
			}
		}
		// Command we cannot handle so we throw an error
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 54: Error message without production error code - breaks React bundle size optimization
//   2. Line 54: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`IPC Command ${command} not found`);
	}

	listen(_: any, event: string, arg: any): Event<any> {
		throw new Error('Not supported');
	}

	/**
	 * Disposing the channel also disables the telemetryService as there is
	 * no longer a way to control it
	 */
	public override dispose(): void {
		this.telemetryService.updateInjectedTelemetryLevel(TelemetryLevel.NONE);
		super.dispose();
	}
}
