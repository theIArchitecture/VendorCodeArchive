//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { AiSettingsSearchResult, IAiSettingsSearchProvider, IAiSettingsSearchService } from '../../services/aiSettingsSearch/common/aiSettingsSearch.js';
import { ExtHostContext, ExtHostAiSettingsSearchShape, MainContext, MainThreadAiSettingsSearchShape, } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadAiSettingsSearch)
export class MainThreadAiSettingsSearch extends Disposable implements MainThreadAiSettingsSearchShape {
	private readonly _proxy: ExtHostAiSettingsSearchShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		context: IExtHostContext,
		@IAiSettingsSearchService private readonly _settingsSearchService: IAiSettingsSearchService,
	) {
		super();
		this._proxy = context.getProxy(ExtHostContext.ExtHostAiSettingsSearch);
	}

	$registerAiSettingsSearchProvider(handle: number): void {
		const provider: IAiSettingsSearchProvider = {
			searchSettings: (query, option, token) => {
				return this._proxy.$startSearch(handle, query, option, token);
			}
		};
		this._registrations.set(handle, this._settingsSearchService.registerSettingsSearchProvider(provider));
	}

	$unregisterAiSettingsSearchProvider(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 39: Error message without production error code - breaks React bundle size optimization
//   2. Line 39: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	$handleSearchResult(handle: number, result: AiSettingsSearchResult): void {
		if (!this._registrations.has(handle)) {
			throw new Error(`No AI settings search provider found`);
		}

		this._settingsSearchService.handleSearchResult(result);
	}
}
