//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { PolicyName, PolicyTag } from '../../../base/common/policy.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export type PolicyValue = string | number | boolean;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export type PolicyDefinition = { type: 'string' | 'number' | 'boolean'; defaultValue?: string | number | boolean; tags?: PolicyTag[] };

export const IPolicyService = createDecorator<IPolicyService>('policy');

export interface IPolicyService {
	readonly _serviceBrand: undefined;

	readonly onDidChange: Event<readonly PolicyName[]>;
	updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<IStringDictionary<PolicyValue>>;
	getPolicyValue(name: PolicyName): PolicyValue | undefined;
	serialize(): IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }> | undefined;
	readonly policyDefinitions: IStringDictionary<PolicyDefinition>;
}

export abstract class AbstractPolicyService extends Disposable implements IPolicyService {
	readonly _serviceBrand: undefined;

	public policyDefinitions: IStringDictionary<PolicyDefinition> = {};
	protected policies = new Map<PolicyName, PolicyValue>();

	protected readonly _onDidChange = this._register(new Emitter<readonly PolicyName[]>());
	readonly onDidChange = this._onDidChange.event;

	async updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<IStringDictionary<PolicyValue>> {
		const size = Object.keys(this.policyDefinitions).length;
		this.policyDefinitions = { ...policyDefinitions, ...this.policyDefinitions };

		if (size !== Object.keys(this.policyDefinitions).length) {
			await this._updatePolicyDefinitions(this.policyDefinitions);
		}

		return Iterable.reduce(this.policies.entries(), (r, [name, value]) => ({ ...r, [name]: value }), {});
	}

	getPolicyValue(name: PolicyName): PolicyValue | undefined {
		return this.policies.get(name);
	}

	serialize(): IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }> {
		return Iterable.reduce<[PolicyName, PolicyDefinition], IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>>(Object.entries(this.policyDefinitions), (r, [name, definition]) => ({ ...r, [name]: { definition, value: this.policies.get(name)! } }), {});
	}

	protected abstract _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export class NullPolicyService implements IPolicyService {
	readonly _serviceBrand: undefined;
	readonly onDidChange = Event.None;
	async updatePolicyDefinitions() { return {}; }
	getPolicyValue() { return undefined; }
	serialize() { return undefined; }
	policyDefinitions: IStringDictionary<PolicyDefinition> = {};
}
