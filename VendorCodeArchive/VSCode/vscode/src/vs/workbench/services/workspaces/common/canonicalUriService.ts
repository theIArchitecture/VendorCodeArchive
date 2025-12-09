//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ICanonicalUriService, ICanonicalUriProvider } from '../../../../platform/workspace/common/canonicalUri.js';

export class CanonicalUriService implements ICanonicalUriService {
	declare readonly _serviceBrand: undefined;

	private readonly _providers = new Map<string, ICanonicalUriProvider>();

	registerCanonicalUriProvider(provider: ICanonicalUriProvider): IDisposable {
		this._providers.set(provider.scheme, provider);
		return {
			dispose: () => this._providers.delete(provider.scheme)
		};
	}

	async provideCanonicalUri(uri: URI, targetScheme: string, token: CancellationToken): Promise<URI | undefined> {
		const provider = this._providers.get(uri.scheme);
		if (provider) {
			return provider.provideCanonicalUri(uri, targetScheme, token);
		}
		return undefined;
	}
}

registerSingleton(ICanonicalUriService, CanonicalUriService, InstantiationType.Delayed);
