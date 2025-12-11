//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ClassifiedEvent, OmitMetadata, IGDPRProperty, StrictPropertyCheck } from '../../../../../platform/telemetry/common/gdprTypings.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel } from '../../../../../platform/telemetry/common/telemetry.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IDataChannelService } from '../../../../services/dataChannel/common/dataChannel.js';

export class InterceptingTelemetryService implements ITelemetryService {
	_serviceBrand: undefined;

	constructor(
		private readonly _baseService: ITelemetryService,
		private readonly _intercept: (eventName: string, data?: ITelemetryData) => void,
	) { }

	get telemetryLevel(): TelemetryLevel {
		return this._baseService.telemetryLevel;
	}

	get sessionId(): string {
		return this._baseService.sessionId;
	}

	get machineId(): string {
		return this._baseService.machineId;
	}

	get sqmId(): string {
		return this._baseService.sqmId;
	}

	get devDeviceId(): string {
		return this._baseService.devDeviceId;
	}

	get firstSessionDate(): string {
		return this._baseService.firstSessionDate;
	}

	get msftInternal(): boolean | undefined {
		return this._baseService.msftInternal;
	}

	get sendErrorTelemetry(): boolean {
		return this._baseService.sendErrorTelemetry;
	}

	publicLog(eventName: string, data?: ITelemetryData): void {
		this._intercept(eventName, data);
		this._baseService.publicLog(eventName, data);
	}

	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
		this._intercept(eventName, data);
		this._baseService.publicLog2(eventName, data);
	}

	publicLogError(errorEventName: string, data?: ITelemetryData): void {
		this._intercept(errorEventName, data);
		this._baseService.publicLogError(errorEventName, data);
	}

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
		this._intercept(eventName, data);
		this._baseService.publicLogError2(eventName, data);
	}

	setExperimentProperty(name: string, value: string): void {
		this._baseService.setExperimentProperty(name, value);
	}
}

export interface IEditTelemetryData {
	eventName: string;
	data: Record<string, unknown>;
}

export class DataChannelForwardingTelemetryService extends InterceptingTelemetryService {
	constructor(
		@ITelemetryService telemetryService: ITelemetryService,
		@IDataChannelService dataChannelService: IDataChannelService,
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	) {
		super(telemetryService, (eventName, data) => {
			dataChannelService.getDataChannel<IEditTelemetryData>('editTelemetry').sendData({ eventName, data: data as any });
		});
	}
}
