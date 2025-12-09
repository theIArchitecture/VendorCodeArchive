//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from './commonFacade/deps.js';
import { IObservableWithChange, IReader } from './base.js';

export interface IChangeTracker<TChangeSummary> {
	createChangeSummary(previousChangeSummary: TChangeSummary | undefined): TChangeSummary;
	handleChange(ctx: IChangeContext, change: TChangeSummary): boolean;
	beforeUpdate?(reader: IReader, change: TChangeSummary): void;
}

export interface IChangeContext {
	readonly changedObservable: IObservableWithChange<any, any>;
	readonly change: unknown;

	/**
	 * Returns if the given observable caused the change.
	 */
	didChange<T, TChange>(observable: IObservableWithChange<T, TChange>): this is { change: TChange };
}

/**
 * Subscribes to and records changes and the last value of the given observables.
 * Don't use the key "changes", as it is reserved for the changes array!
*/
export function recordChanges<TObs extends Record<any, IObservableWithChange<any, any>>>(obs: TObs):
	IChangeTracker<{ [TKey in keyof TObs]: ReturnType<TObs[TKey]['get']> }
		& { changes: readonly ({ [TKey in keyof TObs]: { key: TKey; change: TObs[TKey]['TChange'] } }[keyof TObs])[] }> {
	return {
		createChangeSummary: (_previousChangeSummary) => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 36: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 41: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return {
				changes: [],
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 48: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			} as any;
		},
		handleChange(ctx, changeSummary) {
			for (const key in obs) {
				if (ctx.didChange(obs[key])) {
					(changeSummary.changes as any).push({ key, change: ctx.change });
				}
			}
			return true;
		},
		beforeUpdate(reader, changeSummary) {
			for (const key in obs) {
				if (key === 'changes') {
					throw new BugIndicatingError('property name "changes" is reserved for change tracking');
				}
				changeSummary[key] = obs[key].read(reader);
			}
		}
	};
}

/**
 * Subscribes to and records changes and the last value of the given observables.
 * Don't use the key "changes", as it is reserved for the changes array!
*/
export function recordChangesLazy<TObs extends Record<any, IObservableWithChange<any, any>>>(getObs: () => TObs):
	IChangeTracker<{ [TKey in keyof TObs]: ReturnType<TObs[TKey]['get']> }
		& { changes: readonly ({ [TKey in keyof TObs]: { key: TKey; change: TObs[TKey]['TChange'] } }[keyof TObs])[] }> {
	let obs: TObs | undefined = undefined;
	return {
		createChangeSummary: (_previousChangeSummary) => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 69: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return {
				changes: [],
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			} as any;
		},
		handleChange(ctx, changeSummary) {
			if (!obs) {
				obs = getObs();
			}
			for (const key in obs) {
				if (ctx.didChange(obs[key])) {
					(changeSummary.changes as any).push({ key, change: ctx.change });
				}
			}
			return true;
		},
		beforeUpdate(reader, changeSummary) {
			if (!obs) {
				obs = getObs();
			}
			for (const key in obs) {
				if (key === 'changes') {
					throw new BugIndicatingError('property name "changes" is reserved for change tracking');
				}
				changeSummary[key] = obs[key].read(reader);
			}
		}
	};
}
