//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservableWithChange, IObserver } from '../../../../base/common/observable.js';

export function onObservableChange<T>(observable: IObservableWithChange<unknown, T>, callback: (value: T) => void): IDisposable {
	const o: IObserver = {
		beginUpdate() { },
		endUpdate() { },
		handlePossibleChange(observable) {
			observable.reportChanges();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		},
		handleChange<T2, TChange>(_observable: IObservableWithChange<T2, TChange>, change: TChange) {
			callback(change as any as T);
		}
	};

	observable.addObserver(o);
	return {
		dispose() {
			observable.removeObserver(o);
		}
	};
}
