//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableMap, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostContext, ExtHostEmbeddingsShape, MainContext, MainThreadEmbeddingsShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';


interface IEmbeddingsProvider {
	provideEmbeddings(input: string[], token: CancellationToken): Promise<{ values: number[] }[]>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 87: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 109: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 120: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 131: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 153: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 186: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 208: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 219: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 241: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 252: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 276: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 276: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 298: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 298: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

const IEmbeddingsService = createDecorator<IEmbeddingsService>('embeddingsService');

interface IEmbeddingsService {

	_serviceBrand: undefined;

	readonly onDidChange: Event<void>;

	allProviders: Iterable<string>;

	registerProvider(id: string, provider: IEmbeddingsProvider): IDisposable;

	computeEmbeddings(id: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

class EmbeddingsService implements IEmbeddingsService {
	_serviceBrand: undefined;

	private providers: Map<string, IEmbeddingsProvider>;

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor() {
		this.providers = new Map<string, IEmbeddingsProvider>();
	}

	get allProviders(): Iterable<string> {
		return this.providers.keys();
	}

	registerProvider(id: string, provider: IEmbeddingsProvider): IDisposable {
		this.providers.set(id, provider);
		this._onDidChange.fire();
		return {
			dispose: () => {
				this.providers.delete(id);
				this._onDidChange.fire();
			}
		};
	}

	computeEmbeddings(id: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		const provider = this.providers.get(id);
		if (provider) {
			return provider.provideEmbeddings(input, token);
		} else {
			return Promise.reject(new Error(`No embeddings provider registered with id: ${id}`));
		}
	}
}


registerSingleton(IEmbeddingsService, EmbeddingsService, InstantiationType.Delayed);

@extHostNamedCustomer(MainContext.MainThreadEmbeddings)
export class MainThreadEmbeddings implements MainThreadEmbeddingsShape {

	private readonly _store = new DisposableStore();
	private readonly _providers = this._store.add(new DisposableMap<number>);
	private readonly _proxy: ExtHostEmbeddingsShape;

	constructor(
		context: IExtHostContext,
		@IEmbeddingsService private readonly embeddingsService: IEmbeddingsService
	) {
		this._proxy = context.getProxy(ExtHostContext.ExtHostEmbeddings);

		this._store.add(embeddingsService.onDidChange((() => {
			this._proxy.$acceptEmbeddingModels(Array.from(embeddingsService.allProviders));
		})));
	}

	dispose(): void {
		this._store.dispose();
	}

	$registerEmbeddingProvider(handle: number, identifier: string): void {
		const registration = this.embeddingsService.registerProvider(identifier, {
			provideEmbeddings: (input: string[], token: CancellationToken): Promise<{ values: number[] }[]> => {
				return this._proxy.$provideEmbeddings(handle, input, token);
			}
		});
		this._providers.set(handle, registration);
	}

	$unregisterEmbeddingProvider(handle: number): void {
		this._providers.deleteAndDispose(handle);
	}

	$computeEmbeddings(embeddingsModel: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		return this.embeddingsService.computeEmbeddings(embeddingsModel, input, token);
	}
}
