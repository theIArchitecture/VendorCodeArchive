//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostEmbeddingsShape, IMainContext, MainContext, MainThreadEmbeddingsShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';


export class ExtHostEmbeddings implements ExtHostEmbeddingsShape {

	private readonly _proxy: MainThreadEmbeddingsShape;
	private readonly _provider = new Map<number, { id: string; provider: vscode.EmbeddingsProvider }>();

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _allKnownModels = new Set<string>();
	private _handlePool: number = 0;

	constructor(
		mainContext: IMainContext
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadEmbeddings);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 33: Error message without production error code - breaks React bundle size optimization
//   2. Line 33: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	registerEmbeddingsProvider(_extension: IExtensionDescription, embeddingsModel: string, provider: vscode.EmbeddingsProvider): IDisposable {
		if (this._allKnownModels.has(embeddingsModel)) {
			throw new Error('An embeddings provider for this model is already registered');
		}

		const handle = this._handlePool++;

		this._proxy.$registerEmbeddingProvider(handle, embeddingsModel);
		this._provider.set(handle, { id: embeddingsModel, provider });

		return toDisposable(() => {
			this._allKnownModels.delete(embeddingsModel);
			this._proxy.$unregisterEmbeddingProvider(handle);
			this._provider.delete(handle);
		});
	}

	async computeEmbeddings(embeddingsModel: string, input: string, token?: vscode.CancellationToken): Promise<vscode.Embedding>;
	async computeEmbeddings(embeddingsModel: string, input: string[], token?: vscode.CancellationToken): Promise<vscode.Embedding[]>;
	async computeEmbeddings(embeddingsModel: string, input: string | string[], token?: vscode.CancellationToken): Promise<vscode.Embedding[] | vscode.Embedding> {

		token ??= CancellationToken.None;

		let returnSingle = false;
		if (typeof input === 'string') {
			input = [input];
			returnSingle = true;
		}
		const result = await this._proxy.$computeEmbeddings(embeddingsModel, input, token);
		if (result.length !== input.length) {
			throw new Error();
		}
		if (returnSingle) {
			if (result.length !== 1) {
				throw new Error();
			}
			return result[0];
		}
		return result;

	}

	async $provideEmbeddings(handle: number, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		const data = this._provider.get(handle);
		if (!data) {
			return [];
		}
		const result = await data.provider.provideEmbeddings(input, token);
		if (!result) {
			return [];
		}
		return result;
	}

	get embeddingsModels(): string[] {
		return Array.from(this._allKnownModels);
	}

	$acceptEmbeddingModels(models: string[]): void {
		this._allKnownModels = new Set(models);
		this._onDidChange.fire();
	}
}
