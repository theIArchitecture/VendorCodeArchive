/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable } from '../base.js';
import { transaction } from '../transaction.js';
import { Event, IDisposable } from '../commonFacade/deps.js';
import { DebugOwner, DebugNameData } from '../debugName.js';
import { BaseObservable } from './baseObservable.js';
import { DebugLocation } from '../debugLocation.js';

export function observableSignalFromEvent(
	owner: DebugOwner | string,
	event: Event<any>,
	debugLocation = DebugLocation.ofCaller()
): IObservable<void> {
	return new FromEventObservableSignal(typeof owner === 'string' ? owner : new DebugNameData(owner, undefined, undefined), event, debugLocation);
}

class FromEventObservableSignal extends BaseObservable<void> {
	private subscription: IDisposable | undefined;

	public readonly debugName: string;
	constructor(
		debugNameDataOrName: DebugNameData | string,
		private readonly event: Event<any>,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
		this.debugName = typeof debugNameDataOrName === 'string'
			? debugNameDataOrName
			: debugNameDataOrName.getDebugName(this) ?? 'Observable Signal From Event';
	}

	protected override onFirstObserverAdded(): void {
		this.subscription = this.event(this.handleEvent);
	}

	private readonly handleEvent = () => {
		transaction(
			(tx) => {
				for (const o of this._observers) {
					tx.updateObserver(o, this);
					o.handleChange(this, undefined);
				}
			},
			() => this.debugName
		);
	};

	protected override onLastObserverRemoved(): void {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		this.subscription!.dispose();
		this.subscription = undefined;
	}

	public override get(): void {
		// NO OP
	}
}
