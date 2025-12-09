//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WindowIdleValue } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { TRUSTED_DOMAINS_STORAGE_KEY, readStaticTrustedDomains } from './trustedDomains.js';
import { isURLDomainTrusted } from '../common/trustedDomains.js';
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

import { Event, Emitter } from '../../../../base/common/event.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 29: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 40: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 51: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 53: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 53: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ITrustedDomainService = createDecorator<ITrustedDomainService>('ITrustedDomainService');

export interface ITrustedDomainService {
	_serviceBrand: undefined;
	onDidChangeTrustedDomains: Event<void>;
	isValid(resource: URI): boolean;
}

export class TrustedDomainService extends Disposable implements ITrustedDomainService {
	_serviceBrand: undefined;

	private _staticTrustedDomainsResult!: WindowIdleValue<string[]>;

	private _onDidChangeTrustedDomains: Emitter<void> = this._register(new Emitter<void>());
	onDidChangeTrustedDomains: Event<void> = this._onDidChangeTrustedDomains.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
	) {
		super();

		const initStaticDomainsResult = () => {
			return new WindowIdleValue(mainWindow, () => {
				const { defaultTrustedDomains, trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
				return [
					...defaultTrustedDomains,
					...trustedDomains
				];
			});
		};
		this._staticTrustedDomainsResult = initStaticDomainsResult();
		this._register(this._storageService.onDidChangeValue(StorageScope.APPLICATION, TRUSTED_DOMAINS_STORAGE_KEY, this._store)(() => {
			this._staticTrustedDomainsResult?.dispose();
			this._staticTrustedDomainsResult = initStaticDomainsResult();
			this._onDidChangeTrustedDomains.fire();
		}));
	}

	isValid(resource: URI): boolean {
		const { defaultTrustedDomains, trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
		const allTrustedDomains = [...defaultTrustedDomains, ...trustedDomains];

		return isURLDomainTrusted(resource, allTrustedDomains);
	}
}
