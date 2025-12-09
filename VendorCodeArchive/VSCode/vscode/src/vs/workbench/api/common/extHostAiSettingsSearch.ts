//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { SettingsSearchProvider, SettingsSearchResult } from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { AiSettingsSearchProviderOptions } from '../../services/aiSettingsSearch/common/aiSettingsSearch.js';
import { ExtHostAiSettingsSearchShape, IMainContext, MainContext, MainThreadAiSettingsSearchShape } from './extHost.protocol.js';
import { Disposable } from './extHostTypes.js';
import { Progress } from '../../../platform/progress/common/progress.js';
import { AiSettingsSearch } from './extHostTypeConverters.js';

export class ExtHostAiSettingsSearch implements ExtHostAiSettingsSearchShape {
	private _settingsSearchProviders: Map<number, SettingsSearchProvider> = new Map();
	private _nextHandle = 0;

	private readonly _proxy: MainThreadAiSettingsSearchShape;

	constructor(mainContext: IMainContext) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadAiSettingsSearch);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 27: Error message without production error code - breaks React bundle size optimization
//   2. Line 27: Error message without production error code - breaks React bundle size optimization
//   3. Line 32: Error message without production error code - breaks React bundle size optimization
//   4. Line 32: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async $startSearch(handle: number, query: string, option: AiSettingsSearchProviderOptions, token: CancellationToken): Promise<void> {
		if (this._settingsSearchProviders.size === 0) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 41: Error message without production error code - breaks React bundle size optimization
//   2. Line 41: Error message without production error code - breaks React bundle size optimization
//   3. Line 46: Error message without production error code - breaks React bundle size optimization
//   4. Line 46: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 53: Error message without production error code - breaks React bundle size optimization
//   2. Line 53: Error message without production error code - breaks React bundle size optimization
//   3. Line 58: Error message without production error code - breaks React bundle size optimization
//   4. Line 58: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 65: Error message without production error code - breaks React bundle size optimization
//   2. Line 65: Error message without production error code - breaks React bundle size optimization
//   3. Line 70: Error message without production error code - breaks React bundle size optimization
//   4. Line 70: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No related information providers registered');
		}

		const provider = this._settingsSearchProviders.get(handle);
		if (!provider) {
			throw new Error('Settings search provider not found');
		}

		const progressReporter = new Progress<SettingsSearchResult>((data) => {
			this._proxy.$handleSearchResult(handle, AiSettingsSearch.fromSettingsSearchResult(data));
		});

		return provider.provideSettingsSearchResults(query, option, progressReporter, token);
	}

	registerSettingsSearchProvider(extension: IExtensionDescription, provider: SettingsSearchProvider): Disposable {
		const handle = this._nextHandle;
		this._nextHandle++;
		this._settingsSearchProviders.set(handle, provider);
		this._proxy.$registerAiSettingsSearchProvider(handle);
		return new Disposable(() => {
			this._proxy.$unregisterAiSettingsSearchProvider(handle);
			this._settingsSearchProviders.delete(handle);
		});
	}
}
