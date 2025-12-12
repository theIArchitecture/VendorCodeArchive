/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHotReloadEnabled, registerHotReloadHandler } from './hotReload.js';
import { constObservable, IObservable, IReader, ISettableObservable, observableSignalFromEvent, observableValue } from './observable.js';

export function readHotReloadableExport<T>(value: T, reader: IReader | undefined): T {
	observeHotReloadableExports([value], reader);
	return value;
}

export function observeHotReloadableExports(values: any[], reader: IReader | undefined): void {
	if (isHotReloadEnabled()) {
		const o = observableSignalFromEvent(
			'reload',
			event => registerHotReloadHandler(({ oldExports }) => {
				if (![...Object.values(oldExports)].some(v => values.includes(v))) {
					return undefined;
				}
				return (_newExports) => {
					event(undefined);
					return true;
				};
			})
		);
		o.read(reader);
	}
}

const classes = new Map<string, ISettableObservable<unknown>>();

export function createHotClass<T>(clazz: T): IObservable<T> {
	if (!isHotReloadEnabled()) {
		return constObservable(clazz);
	}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 39: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 47: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const id = (clazz as any).name;

	let existing = classes.get(id);
	if (!existing) {
		existing = observableValue(id, clazz);
		classes.set(id, existing);
	} else {
		setTimeout(() => {
			existing!.set(clazz, undefined);
		}, 0);
	}
	return existing as IObservable<T>;
}
