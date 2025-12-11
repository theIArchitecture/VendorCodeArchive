//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { PolicyName } from '../../../base/common/policy.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { AbstractPolicyService, IPolicyService, PolicyDefinition, PolicyValue } from './policy.js';


export class PolicyChannel implements IServerChannel {

	private readonly disposables = new DisposableStore();

	constructor(private service: IPolicyService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onDidChange': return Event.map(
				this.service.onDidChange,
				names => names.reduce<object>((r, name) => ({ ...r, [name]: this.service.getPolicyValue(name) ?? null }), {}),
				this.disposables
			);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
//   3. Line 37: Error message without production error code - breaks React bundle size optimization
//   4. Line 37: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'updatePolicyDefinitions': return this.service.updatePolicyDefinitions(arg as IStringDictionary<PolicyDefinition>);
		}

		throw new Error(`Call not found: ${command}`);
	}

	dispose() {
		this.disposables.dispose();
	}
}

export class PolicyChannelClient extends AbstractPolicyService implements IPolicyService {

	constructor(policiesData: IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>, private readonly channel: IChannel) {
		super();
		for (const name in policiesData) {
			const { definition, value } = policiesData[name];
			this.policyDefinitions[name] = definition;
			if (value !== undefined) {
				this.policies.set(name, value);
			}
		}
		this.channel.listen<object>('onDidChange')(policies => {
			for (const name in policies) {
				const value = policies[name as keyof typeof policies];

				if (value === null) {
					this.policies.delete(name);
				} else {
					this.policies.set(name, value);
				}
			}

			this._onDidChange.fire(Object.keys(policies));
		});
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		const result = await this.channel.call<{ [name: PolicyName]: PolicyValue }>('updatePolicyDefinitions', policyDefinitions);
		for (const name in result) {
			this.policies.set(name, result[name]);
		}
	}
}
