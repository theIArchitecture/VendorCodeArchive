/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isHotReloadEnabled } from '../../../base/common/hotReload.js';
import { readHotReloadableExport } from '../../../base/common/hotReloadHelpers.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { autorunWithStore } from '../../../base/common/observable.js';
import { BrandedService, GetLeadingNonServiceArgs, IInstantiationService } from '../../instantiation/common/instantiation.js';

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInReloadableClass0<TArgs extends BrandedService[]>(getClass: () => Result<TArgs>): Result<TArgs> {
	return !isHotReloadEnabled() ? getClass() : createWrapper(getClass, BaseClass0);
}

type Result<TArgs extends any[]> = new (...args: TArgs) => IDisposable;

class BaseClass {
	constructor(
		public readonly instantiationService: IInstantiationService,
	) { }

	public init(...params: any[]): void { }
}

function createWrapper<T extends any[]>(getClass: () => any, B: new (...args: T) => BaseClass) {
	return (class ReloadableWrapper extends B {
		private _autorun: IDisposable | undefined = undefined;

		override init(...params: any[]) {
			this._autorun = autorunWithStore((reader, store) => {
				const clazz = readHotReloadableExport(getClass(), reader);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 37: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 44: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				store.add(this.instantiationService.createInstance(clazz as any, ...params) as IDisposable);
			});
		}

		dispose(): void {
			this._autorun?.dispose();
		}
	}) as any;
}

class BaseClass0 extends BaseClass {
	constructor(@IInstantiationService i: IInstantiationService) { super(i); this.init(); }
}

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInReloadableClass1<TArgs extends [any, ...BrandedService[]]>(getClass: () => Result<TArgs>): Result<GetLeadingNonServiceArgs<TArgs>> {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	return !isHotReloadEnabled() ? getClass() as any : createWrapper(getClass, BaseClass1);
}

class BaseClass1 extends BaseClass {
	constructor(param1: any, @IInstantiationService i: IInstantiationService,) { super(i); this.init(param1); }
}
