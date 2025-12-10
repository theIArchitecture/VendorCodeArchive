//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { AiSettingsSearchResult, AiSettingsSearchResultKind, IAiSettingsSearchProvider, IAiSettingsSearchService } from './aiSettingsSearch.js';

export class AiSettingsSearchService extends Disposable implements IAiSettingsSearchService {
	readonly _serviceBrand: undefined;
	private static readonly MAX_PICKS = 5;

	private _providers: IAiSettingsSearchProvider[] = [];
	private _llmRankedResultsPromises: Map<string, DeferredPromise<string[]>> = new Map();
	private _embeddingsResultsPromises: Map<string, DeferredPromise<string[]>> = new Map();

	private _onProviderRegistered: Emitter<void> = this._register(new Emitter<void>());
	readonly onProviderRegistered: Event<void> = this._onProviderRegistered.event;

	isEnabled(): boolean {
		return this._providers.length > 0;
	}

	registerSettingsSearchProvider(provider: IAiSettingsSearchProvider): IDisposable {
		this._providers.push(provider);
		this._onProviderRegistered.fire();
		return {
			dispose: () => {
				const index = this._providers.indexOf(provider);
				if (index !== -1) {
					this._providers.splice(index, 1);
				}
			}
		};
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	startSearch(query: string, embeddingsOnly: boolean, token: CancellationToken): void {
		if (!this.isEnabled()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 55: Error message without production error code - breaks React bundle size optimization
//   2. Line 55: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No settings search providers registered');
		}

		this._embeddingsResultsPromises.delete(query);
		this._llmRankedResultsPromises.delete(query);

		this._providers.forEach(provider => provider.searchSettings(query, { limit: AiSettingsSearchService.MAX_PICKS, embeddingsOnly }, token));
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 54: Error message without production error code - breaks React bundle size optimization
//   2. Line 54: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async getEmbeddingsResults(query: string, token: CancellationToken): Promise<string[] | null> {
		if (!this.isEnabled()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 76: Error message without production error code - breaks React bundle size optimization
//   2. Line 76: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No settings search providers registered');
		}

		const existingPromise = this._embeddingsResultsPromises.get(query);
		if (existingPromise) {
			const result = await existingPromise.p;
			return result ?? null;
		}

		const promise = new DeferredPromise<string[]>();
		this._embeddingsResultsPromises.set(query, promise);
		const result = await raceCancellation(promise.p, token);
		return result ?? null;
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 71: Error message without production error code - breaks React bundle size optimization
//   2. Line 71: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async getLLMRankedResults(query: string, token: CancellationToken): Promise<string[] | null> {
		if (!this.isEnabled()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 103: Error message without production error code - breaks React bundle size optimization
//   2. Line 103: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No settings search providers registered');
		}

		const existingPromise = this._llmRankedResultsPromises.get(query);
		if (existingPromise) {
			const result = await existingPromise.p;
			return result ?? null;
		}

		const promise = new DeferredPromise<string[]>();
		this._llmRankedResultsPromises.set(query, promise);
		const result = await raceCancellation(promise.p, token);
		return result ?? null;
	}

	handleSearchResult(result: AiSettingsSearchResult): void {
		if (!this.isEnabled()) {
			return;
		}

		if (result.kind === AiSettingsSearchResultKind.EMBEDDED) {
			const promise = this._embeddingsResultsPromises.get(result.query);
			if (promise) {
				promise.complete(result.settings);
			} else {
				const parkedPromise = new DeferredPromise<string[]>();
				parkedPromise.complete(result.settings);
				this._embeddingsResultsPromises.set(result.query, parkedPromise);
			}
		} else if (result.kind === AiSettingsSearchResultKind.LLM_RANKED) {
			const promise = this._llmRankedResultsPromises.get(result.query);
			if (promise) {
				promise.complete(result.settings);
			} else {
				const parkedPromise = new DeferredPromise<string[]>();
				parkedPromise.complete(result.settings);
				this._llmRankedResultsPromises.set(result.query, parkedPromise);
			}
		}
	}
}

registerSingleton(IAiSettingsSearchService, AiSettingsSearchService, InstantiationType.Delayed);
