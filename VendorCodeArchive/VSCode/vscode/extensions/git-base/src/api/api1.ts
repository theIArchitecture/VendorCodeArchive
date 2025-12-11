//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, commands } from 'vscode';
import { Model } from '../model';
import { getRemoteSourceActions, pickRemoteSource } from '../remoteSource';
import { GitBaseExtensionImpl } from './extension';
import { API, PickRemoteSourceOptions, PickRemoteSourceResult, RemoteSourceAction, RemoteSourceProvider } from './git-base';

export class ApiImpl implements API {

	constructor(private _model: Model) { }
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	pickRemoteSource(options: PickRemoteSourceOptions): Promise<PickRemoteSourceResult | string | undefined> {
		return pickRemoteSource(this._model, options as any);
	}

	getRemoteSourceActions(url: string): Promise<RemoteSourceAction[]> {
		return getRemoteSourceActions(this._model, url);
	}

	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable {
		return this._model.registerRemoteSourceProvider(provider);
	}
}

export function registerAPICommands(extension: GitBaseExtensionImpl): Disposable {
	const disposables: Disposable[] = [];

	disposables.push(commands.registerCommand('git-base.api.getRemoteSources', (opts?: PickRemoteSourceOptions) => {
		if (!extension.model) {
			return;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		}

		return pickRemoteSource(extension.model, opts as any);
	}));

	return Disposable.from(...disposables);
}
