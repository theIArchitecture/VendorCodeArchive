/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalLaunchResult, IProcessPropertyMap, IPtyService, ITerminalChildProcess, ITerminalLaunchError, ProcessPropertyType } from '../../../../platform/terminal/common/terminal.js';
import { BasePty } from '../common/basePty.js';

/**
 * Responsible for establishing and maintaining a connection with an existing terminal process
 * created on the local pty host.
 */
export class LocalPty extends BasePty implements ITerminalChildProcess {
	constructor(
		id: number,
		shouldPersist: boolean,
		private readonly _proxy: IPtyService
	) {
		super(id, shouldPersist);
	}

	start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		return this._proxy.start(this.id);
	}

	detach(forcePersist?: boolean): Promise<void> {
		return this._proxy.detachFromProcess(this.id, forcePersist);
	}

	shutdown(immediate: boolean): void {
		this._proxy.shutdown(this.id, immediate);
	}

	async processBinary(data: string): Promise<void> {
		if (this._inReplay) {
			return;
		}
		return this._proxy.processBinary(this.id, data);
	}

	input(data: string): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.input(this.id, data);
	}

	sendSignal(signal: string): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.sendSignal(this.id, signal);
	}

	resize(cols: number, rows: number): void {
		if (this._inReplay || this._lastDimensions.cols === cols && this._lastDimensions.rows === rows) {
			return;
		}
		this._lastDimensions.cols = cols;
		this._lastDimensions.rows = rows;
		this._proxy.resize(this.id, cols, rows);
	}

	async clearBuffer(): Promise<void> {
		this._proxy.clearBuffer?.(this.id);
	}

	freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		if (!this._proxy.freePortKillProcess) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 70: Error message without production error code - breaks React bundle size optimization
//   2. Line 70: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('freePortKillProcess does not exist on the local pty service');
		}
		return this._proxy.freePortKillProcess(port);
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		return this._proxy.refreshProperty(this.id, type);
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._proxy.updateProperty(this.id, type, value);
	}

	acknowledgeDataEvent(charCount: number): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.acknowledgeDataEvent(this.id, charCount);
	}

	setUnicodeVersion(version: '6' | '11'): Promise<void> {
		return this._proxy.setUnicodeVersion(this.id, version);
	}

	handleOrphanQuestion() {
		this._proxy.orphanQuestionReply(this.id);
	}
}
