//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancelablePromise, createCancelablePromise, raceTimeout } from '../../../../base/common/async.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILogService } from '../../../../platform/log/common/log.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IAiRelatedInformationService, IAiRelatedInformationProvider, RelatedInformationType, RelatedInformationResult } from './aiRelatedInformation.js';

export class AiRelatedInformationService implements IAiRelatedInformationService {
	readonly _serviceBrand: undefined;

	static readonly DEFAULT_TIMEOUT = 1000 * 10; // 10 seconds

	private readonly _providers: Map<RelatedInformationType, IAiRelatedInformationProvider[]> = new Map();

	constructor(@ILogService private readonly logService: ILogService) { }

	isEnabled(): boolean {
		return this._providers.size > 0;
	}

	registerAiRelatedInformationProvider(type: RelatedInformationType, provider: IAiRelatedInformationProvider): IDisposable {
		const providers = this._providers.get(type) ?? [];
		providers.push(provider);
		this._providers.set(type, providers);


		return {
			dispose: () => {
				const providers = this._providers.get(type) ?? [];
				const index = providers.indexOf(provider);
				if (index !== -1) {
					providers.splice(index, 1);
				}
				if (providers.length === 0) {
					this._providers.delete(type);
				}
			}
		};
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 49: Error message without production error code - breaks React bundle size optimization
//   2. Line 49: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async getRelatedInformation(query: string, types: RelatedInformationType[], token: CancellationToken): Promise<RelatedInformationResult[]> {
		if (this._providers.size === 0) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 68: Error message without production error code - breaks React bundle size optimization
//   2. Line 68: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No related information providers registered');
		}

		// get providers for each type
		const providers: IAiRelatedInformationProvider[] = [];
		for (const type of types) {
			const typeProviders = this._providers.get(type);
			if (typeProviders) {
				providers.push(...typeProviders);
			}
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 62: Error message without production error code - breaks React bundle size optimization
//   2. Line 62: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (providers.length === 0) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 91: Error message without production error code - breaks React bundle size optimization
//   2. Line 91: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No related information providers registered for the given types');
		}

		const stopwatch = StopWatch.create();

		const cancellablePromises: Array<CancelablePromise<RelatedInformationResult[]>> = providers.map((provider) => {
			return createCancelablePromise(async t => {
				try {
					const result = await provider.provideAiRelatedInformation(query, t);
					// double filter just in case
					return result.filter(r => types.includes(r.type));
				} catch (e) {
					// logged in extension host
				}
				return [];
			});
		});

		try {
			const results = await raceTimeout(
				Promise.allSettled(cancellablePromises),
				AiRelatedInformationService.DEFAULT_TIMEOUT,
				() => {
					cancellablePromises.forEach(p => p.cancel());
					this.logService.warn('[AiRelatedInformationService]: Related information provider timed out');
				}
			);
			if (!results) {
				return [];
			}
			const result = results
				.filter(r => r.status === 'fulfilled')
				.flatMap(r => (r as PromiseFulfilledResult<RelatedInformationResult[]>).value);
			return result;
		} finally {
			stopwatch.stop();
			this.logService.trace(`[AiRelatedInformationService]: getRelatedInformation took ${stopwatch.elapsed()}ms`);
		}
	}
}

registerSingleton(IAiRelatedInformationService, AiRelatedInformationService, InstantiationType.Delayed);
