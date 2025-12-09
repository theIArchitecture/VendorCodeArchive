//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyIdentifier, IRPCProtocol, Proxied } from '../../services/extensions/common/proxyIdentifier.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 9: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const IExtHostRpcService = createDecorator<IExtHostRpcService>('IExtHostRpcService');

export interface IExtHostRpcService extends IRPCProtocol {
	readonly _serviceBrand: undefined;
}

export class ExtHostRpcService implements IExtHostRpcService {
	readonly _serviceBrand: undefined;

	readonly getProxy: <T>(identifier: ProxyIdentifier<T>) => Proxied<T>;
	readonly set: <T, R extends T> (identifier: ProxyIdentifier<T>, instance: R) => R;
	readonly dispose: () => void;
	readonly assertRegistered: (identifiers: ProxyIdentifier<any>[]) => void;
	readonly drain: () => Promise<void>;

	constructor(rpcProtocol: IRPCProtocol) {
		this.getProxy = rpcProtocol.getProxy.bind(rpcProtocol);
		this.set = rpcProtocol.set.bind(rpcProtocol);
		this.dispose = rpcProtocol.dispose.bind(rpcProtocol);
		this.assertRegistered = rpcProtocol.assertRegistered.bind(rpcProtocol);
		this.drain = rpcProtocol.drain.bind(rpcProtocol);
	}
}
