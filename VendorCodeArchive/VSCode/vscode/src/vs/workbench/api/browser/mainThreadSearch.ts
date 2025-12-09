//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { DisposableStore, dispose, IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IFileMatch, IFileQuery, IRawFileMatch2, ISearchComplete, ISearchCompleteStats, ISearchProgressItem, ISearchQuery, ISearchResultProvider, ISearchService, ITextQuery, QueryType, SearchProviderType } from '../../services/search/common/search.js';
import { ExtHostContext, ExtHostSearchShape, MainContext, MainThreadSearchShape } from '../common/extHost.protocol.js';
import { revive } from '../../../base/common/marshalling.js';
import * as Constants from '../../contrib/search/common/constants.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { AISearchKeyword } from '../../services/search/common/searchExtTypes.js';

@extHostNamedCustomer(MainContext.MainThreadSearch)
export class MainThreadSearch implements MainThreadSearchShape {

	private readonly _proxy: ExtHostSearchShape;
	private readonly _searchProvider = new Map<number, RemoteSearchProvider>();

	constructor(
		extHostContext: IExtHostContext,
		@ISearchService private readonly _searchService: ISearchService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IConfigurationService _configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostSearch);
		this._proxy.$enableExtensionHostSearch();
	}

	dispose(): void {
		this._searchProvider.forEach(value => value.dispose());
		this._searchProvider.clear();
	}

	$registerTextSearchProvider(handle: number, scheme: string): void {
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.text, scheme, handle, this._proxy));
	}

	$registerAITextSearchProvider(handle: number, scheme: string): void {
		Constants.SearchContext.hasAIResultProvider.bindTo(this.contextKeyService).set(true);
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.aiText, scheme, handle, this._proxy));
	}

	$registerFileSearchProvider(handle: number, scheme: string): void {
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.file, scheme, handle, this._proxy));
	}

	$unregisterProvider(handle: number): void {
		dispose(this._searchProvider.get(handle));
		this._searchProvider.delete(handle);
	}

	$handleFileMatch(handle: number, session: number, data: UriComponents[]): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 62: Error message without production error code - breaks React bundle size optimization
//   2. Line 62: Error message without production error code - breaks React bundle size optimization
//   3. Line 71: Error message without production error code - breaks React bundle size optimization
//   4. Line 71: Error message without production error code - breaks React bundle size optimization
//   5. Line 80: Error message without production error code - breaks React bundle size optimization
//   6. Line 80: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const provider = this._searchProvider.get(handle);
		if (!provider) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 78: Error message without production error code - breaks React bundle size optimization
//   2. Line 78: Error message without production error code - breaks React bundle size optimization
//   3. Line 87: Error message without production error code - breaks React bundle size optimization
//   4. Line 87: Error message without production error code - breaks React bundle size optimization
//   5. Line 96: Error message without production error code - breaks React bundle size optimization
//   6. Line 96: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 92: Error message without production error code - breaks React bundle size optimization
//   2. Line 92: Error message without production error code - breaks React bundle size optimization
//   3. Line 101: Error message without production error code - breaks React bundle size optimization
//   4. Line 101: Error message without production error code - breaks React bundle size optimization
//   5. Line 110: Error message without production error code - breaks React bundle size optimization
//   6. Line 110: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 106: Error message without production error code - breaks React bundle size optimization
//   2. Line 106: Error message without production error code - breaks React bundle size optimization
//   3. Line 115: Error message without production error code - breaks React bundle size optimization
//   4. Line 115: Error message without production error code - breaks React bundle size optimization
//   5. Line 124: Error message without production error code - breaks React bundle size optimization
//   6. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 120: Error message without production error code - breaks React bundle size optimization
//   2. Line 120: Error message without production error code - breaks React bundle size optimization
//   3. Line 129: Error message without production error code - breaks React bundle size optimization
//   4. Line 129: Error message without production error code - breaks React bundle size optimization
//   5. Line 138: Error message without production error code - breaks React bundle size optimization
//   6. Line 138: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 134: Error message without production error code - breaks React bundle size optimization
//   2. Line 134: Error message without production error code - breaks React bundle size optimization
//   3. Line 143: Error message without production error code - breaks React bundle size optimization
//   4. Line 143: Error message without production error code - breaks React bundle size optimization
//   5. Line 152: Error message without production error code - breaks React bundle size optimization
//   6. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 148: Error message without production error code - breaks React bundle size optimization
//   2. Line 148: Error message without production error code - breaks React bundle size optimization
//   3. Line 157: Error message without production error code - breaks React bundle size optimization
//   4. Line 157: Error message without production error code - breaks React bundle size optimization
//   5. Line 166: Error message without production error code - breaks React bundle size optimization
//   6. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 162: Error message without production error code - breaks React bundle size optimization
//   2. Line 162: Error message without production error code - breaks React bundle size optimization
//   3. Line 171: Error message without production error code - breaks React bundle size optimization
//   4. Line 171: Error message without production error code - breaks React bundle size optimization
//   5. Line 180: Error message without production error code - breaks React bundle size optimization
//   6. Line 180: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 176: Error message without production error code - breaks React bundle size optimization
//   2. Line 176: Error message without production error code - breaks React bundle size optimization
//   3. Line 185: Error message without production error code - breaks React bundle size optimization
//   4. Line 185: Error message without production error code - breaks React bundle size optimization
//   5. Line 194: Error message without production error code - breaks React bundle size optimization
//   6. Line 194: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 190: Error message without production error code - breaks React bundle size optimization
//   2. Line 190: Error message without production error code - breaks React bundle size optimization
//   3. Line 199: Error message without production error code - breaks React bundle size optimization
//   4. Line 199: Error message without production error code - breaks React bundle size optimization
//   5. Line 208: Error message without production error code - breaks React bundle size optimization
//   6. Line 208: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 204: Error message without production error code - breaks React bundle size optimization
//   2. Line 204: Error message without production error code - breaks React bundle size optimization
//   3. Line 213: Error message without production error code - breaks React bundle size optimization
//   4. Line 213: Error message without production error code - breaks React bundle size optimization
//   5. Line 222: Error message without production error code - breaks React bundle size optimization
//   6. Line 222: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 218: Error message without production error code - breaks React bundle size optimization
//   2. Line 218: Error message without production error code - breaks React bundle size optimization
//   3. Line 227: Error message without production error code - breaks React bundle size optimization
//   4. Line 227: Error message without production error code - breaks React bundle size optimization
//   5. Line 236: Error message without production error code - breaks React bundle size optimization
//   6. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 232: Error message without production error code - breaks React bundle size optimization
//   2. Line 232: Error message without production error code - breaks React bundle size optimization
//   3. Line 241: Error message without production error code - breaks React bundle size optimization
//   4. Line 241: Error message without production error code - breaks React bundle size optimization
//   5. Line 250: Error message without production error code - breaks React bundle size optimization
//   6. Line 250: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 246: Error message without production error code - breaks React bundle size optimization
//   2. Line 246: Error message without production error code - breaks React bundle size optimization
//   3. Line 255: Error message without production error code - breaks React bundle size optimization
//   4. Line 255: Error message without production error code - breaks React bundle size optimization
//   5. Line 264: Error message without production error code - breaks React bundle size optimization
//   6. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 260: Error message without production error code - breaks React bundle size optimization
//   2. Line 260: Error message without production error code - breaks React bundle size optimization
//   3. Line 269: Error message without production error code - breaks React bundle size optimization
//   4. Line 269: Error message without production error code - breaks React bundle size optimization
//   5. Line 278: Error message without production error code - breaks React bundle size optimization
//   6. Line 278: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 274: Error message without production error code - breaks React bundle size optimization
//   2. Line 274: Error message without production error code - breaks React bundle size optimization
//   3. Line 283: Error message without production error code - breaks React bundle size optimization
//   4. Line 283: Error message without production error code - breaks React bundle size optimization
//   5. Line 292: Error message without production error code - breaks React bundle size optimization
//   6. Line 292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 288: Error message without production error code - breaks React bundle size optimization
//   2. Line 288: Error message without production error code - breaks React bundle size optimization
//   3. Line 297: Error message without production error code - breaks React bundle size optimization
//   4. Line 297: Error message without production error code - breaks React bundle size optimization
//   5. Line 306: Error message without production error code - breaks React bundle size optimization
//   6. Line 306: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 302: Error message without production error code - breaks React bundle size optimization
//   2. Line 302: Error message without production error code - breaks React bundle size optimization
//   3. Line 311: Error message without production error code - breaks React bundle size optimization
//   4. Line 311: Error message without production error code - breaks React bundle size optimization
//   5. Line 320: Error message without production error code - breaks React bundle size optimization
//   6. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 316: Error message without production error code - breaks React bundle size optimization
//   2. Line 316: Error message without production error code - breaks React bundle size optimization
//   3. Line 325: Error message without production error code - breaks React bundle size optimization
//   4. Line 325: Error message without production error code - breaks React bundle size optimization
//   5. Line 334: Error message without production error code - breaks React bundle size optimization
//   6. Line 334: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 330: Error message without production error code - breaks React bundle size optimization
//   2. Line 330: Error message without production error code - breaks React bundle size optimization
//   3. Line 339: Error message without production error code - breaks React bundle size optimization
//   4. Line 339: Error message without production error code - breaks React bundle size optimization
//   5. Line 348: Error message without production error code - breaks React bundle size optimization
//   6. Line 348: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 344: Error message without production error code - breaks React bundle size optimization
//   2. Line 344: Error message without production error code - breaks React bundle size optimization
//   3. Line 353: Error message without production error code - breaks React bundle size optimization
//   4. Line 353: Error message without production error code - breaks React bundle size optimization
//   5. Line 362: Error message without production error code - breaks React bundle size optimization
//   6. Line 362: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 358: Error message without production error code - breaks React bundle size optimization
//   2. Line 358: Error message without production error code - breaks React bundle size optimization
//   3. Line 367: Error message without production error code - breaks React bundle size optimization
//   4. Line 367: Error message without production error code - breaks React bundle size optimization
//   5. Line 376: Error message without production error code - breaks React bundle size optimization
//   6. Line 376: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 372: Error message without production error code - breaks React bundle size optimization
//   2. Line 372: Error message without production error code - breaks React bundle size optimization
//   3. Line 381: Error message without production error code - breaks React bundle size optimization
//   4. Line 381: Error message without production error code - breaks React bundle size optimization
//   5. Line 390: Error message without production error code - breaks React bundle size optimization
//   6. Line 390: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Got result for unknown provider');
		}

		provider.handleFindMatch(session, data);
	}

	$handleTextMatch(handle: number, session: number, data: IRawFileMatch2[]): void {
		const provider = this._searchProvider.get(handle);
		if (!provider) {
			throw new Error('Got result for unknown provider');
		}

		provider.handleFindMatch(session, data);
	}

	$handleKeywordResult(handle: number, session: number, data: AISearchKeyword): void {
		const provider = this._searchProvider.get(handle);
		if (!provider) {
			throw new Error('Got result for unknown provider');
		}

		provider.handleKeywordResult(session, data);
	}

	$handleTelemetry(eventName: string, data: any): void {
		this._telemetryService.publicLog(eventName, data);
	}
}

class SearchOperation {

	private static _idPool = 0;

	constructor(
		readonly progress?: (match: IFileMatch | AISearchKeyword) => any,
		readonly id: number = ++SearchOperation._idPool,
		readonly matches = new Map<string, IFileMatch>(),
		readonly keywords: AISearchKeyword[] = []
	) {
		//
	}

	addMatch(match: IFileMatch): void {
		const existingMatch = this.matches.get(match.resource.toString());
		if (existingMatch) {
			// TODO@rob clean up text/file result types
			// If a file search returns the same file twice, we would enter this branch.
			// It's possible that could happen, #90813
			if (existingMatch.results && match.results) {
				existingMatch.results.push(...match.results);
			}
		} else {
			this.matches.set(match.resource.toString(), match);
		}

		this.progress?.(match);
	}

	addKeyword(result: AISearchKeyword): void {
		this.keywords.push(result);
		this.progress?.(result);
	}
}

class RemoteSearchProvider implements ISearchResultProvider, IDisposable {

	private readonly _registrations = new DisposableStore();
	private readonly _searches = new Map<number, SearchOperation>();
	private cachedAIName: string | undefined;

	constructor(
		searchService: ISearchService,
		type: SearchProviderType,
		private readonly _scheme: string,
		private readonly _handle: number,
		private readonly _proxy: ExtHostSearchShape
	) {
		this._registrations.add(searchService.registerSearchResultProvider(this._scheme, type, this));
	}

	async getAIName(): Promise<string | undefined> {
		if (this.cachedAIName === undefined) {
			this.cachedAIName = await this._proxy.$getAIName(this._handle);
		}
		return this.cachedAIName;
	}

	dispose(): void {
		this._registrations.dispose();
	}

	fileSearch(query: IFileQuery, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		return this.doSearch(query, undefined, token);
	}

	textSearch(query: ITextQuery, onProgress?: (p: ISearchProgressItem) => void, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		return this.doSearch(query, onProgress, token);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 163: Error message without production error code - breaks React bundle size optimization
//   2. Line 163: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	doSearch(query: ISearchQuery, onProgress?: (p: ISearchProgressItem) => void, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		if (!query.folderQueries.length) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 189: Error message without production error code - breaks React bundle size optimization
//   2. Line 189: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Empty folderQueries');
		}

		const search = new SearchOperation(onProgress);
		this._searches.set(search.id, search);

		const searchP = this._provideSearchResults(query, search.id, token);

		return Promise.resolve(searchP).then((result: ISearchCompleteStats) => {
			this._searches.delete(search.id);
			return { results: Array.from(search.matches.values()), aiKeywords: Array.from(search.keywords), stats: result.stats, limitHit: result.limitHit, messages: result.messages };
		}, err => {
			this._searches.delete(search.id);
			return Promise.reject(err);
		});
	}

	clearCache(cacheKey: string): Promise<void> {
		return Promise.resolve(this._proxy.$clearCache(cacheKey));
	}

	handleFindMatch(session: number, dataOrUri: Array<UriComponents | IRawFileMatch2>): void {
		const searchOp = this._searches.get(session);

		if (!searchOp) {
			// ignore...
			return;
		}

		dataOrUri.forEach(result => {
			if ((<IRawFileMatch2>result).results) {
				searchOp.addMatch(revive((<IRawFileMatch2>result)));
			} else {
				searchOp.addMatch({
					resource: URI.revive(<UriComponents>result)
				});
			}
		});
	}

	handleKeywordResult(session: number, data: AISearchKeyword): void {
		const searchOp = this._searches.get(session);

		if (!searchOp) {
			// ignore...
			return;
		}
		searchOp.addKeyword(data);
	}

	private _provideSearchResults(query: ISearchQuery, session: number, token: CancellationToken): Promise<ISearchCompleteStats> {
		switch (query.type) {
			case QueryType.File:
				return this._proxy.$provideFileSearchResults(this._handle, session, query, token);
			case QueryType.Text:
				return this._proxy.$provideTextSearchResults(this._handle, session, query, token);
			default:
				return this._proxy.$provideAITextSearchResults(this._handle, session, query, token);
		}
	}
}
