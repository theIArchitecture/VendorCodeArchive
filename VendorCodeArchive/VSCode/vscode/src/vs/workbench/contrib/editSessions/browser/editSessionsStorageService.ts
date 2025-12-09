//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { createSyncHeaders, IAuthenticationProvider, IResourceRefHandle } from '../../../../platform/userDataSync/common/userDataSync.js';
import { AuthenticationSession, AuthenticationSessionsChangeEvent, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { EDIT_SESSIONS_SIGNED_IN, EditSession, EDIT_SESSION_SYNC_CATEGORY, IEditSessionsStorageService, EDIT_SESSIONS_SIGNED_IN_KEY, IEditSessionsLogService, SyncResource, EDIT_SESSIONS_PENDING_KEY } from '../common/editSessions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { getCurrentAuthenticationSessionInfo } from '../../../services/authentication/browser/authenticationService.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IUserDataSyncMachinesService, UserDataSyncMachinesService } from '../../../../platform/userDataSync/common/userDataSyncMachines.js';
import { Emitter } from '../../../../base/common/event.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { EditSessionsStoreClient } from '../common/editSessionsStorageClient.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';

type ExistingSession = IQuickPickItem & { session: AuthenticationSession & { providerId: string } };
type AuthenticationProviderOption = IQuickPickItem & { provider: IAuthenticationProvider };

export class EditSessionsWorkbenchService extends Disposable implements IEditSessionsStorageService {

	declare _serviceBrand: undefined;

	public readonly SIZE_LIMIT = Math.floor(1024 * 1024 * 1.9); // 2 MB

	private serverConfiguration;
	private machineClient: IUserDataSyncMachinesService | undefined;

	private authenticationInfo: { sessionId: string; token: string; providerId: string } | undefined;
	private static CACHED_SESSION_STORAGE_KEY = 'editSessionAccountPreference';

	private initialized = false;
	private readonly signedInContext: IContextKey<boolean>;

	get isSignedIn() {
		return this.existingSessionId !== undefined;
	}

	private _didSignIn = new Emitter<void>();
	get onDidSignIn() {
		return this._didSignIn.event;
	}

	private _didSignOut = new Emitter<void>();
	get onDidSignOut() {
		return this._didSignOut.event;
	}

	private _lastWrittenResources = new Map<SyncResource, { ref: string; content: string }>();
	get lastWrittenResources() {
		return this._lastWrittenResources;
	}

	private _lastReadResources = new Map<SyncResource, { ref: string; content: string }>();
	get lastReadResources() {
		return this._lastReadResources;
	}

	storeClient: EditSessionsStoreClient | undefined; // TODO@joyceerhl lifecycle hack

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IStorageService private readonly storageService: IStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IEditSessionsLogService private readonly logService: IEditSessionsLogService,
		@IProductService private readonly productService: IProductService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IDialogService private readonly dialogService: IDialogService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService
	) {
		super();
		this.serverConfiguration = this.productService['editSessions.store'];
		// If the user signs out of the current session, reset our cached auth state in memory and on disk
		this._register(this.authenticationService.onDidChangeSessions((e) => this.onDidChangeSessions(e.event)));

		// If another window changes the preferred session storage, reset our cached auth state in memory
		this._register(this.storageService.onDidChangeValue(StorageScope.APPLICATION, EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, this._store)(() => this.onDidChangeStorage()));

		this.registerSignInAction();
		this.registerResetAuthenticationAction();

		this.signedInContext = EDIT_SESSIONS_SIGNED_IN.bindTo(this.contextKeyService);
		this.signedInContext.set(this.existingSessionId !== undefined);
	}

	/**
	 * @param resource: The resource to retrieve content for.
	 * @param content An object representing resource state to be restored.
	 * @returns The ref of the stored state.
	 */
	async write(resource: SyncResource, content: string | EditSession): Promise<string> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 109: Error message without production error code - breaks React bundle size optimization
//   2. Line 109: Error message without production error code - breaks React bundle size optimization
//   3. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		await this.initialize('write', false);
		if (!this.initialized) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 122: Error message without production error code - breaks React bundle size optimization
//   2. Line 122: Error message without production error code - breaks React bundle size optimization
//   3. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 133: Error message without production error code - breaks React bundle size optimization
//   2. Line 133: Error message without production error code - breaks React bundle size optimization
//   3. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 144: Error message without production error code - breaks React bundle size optimization
//   2. Line 144: Error message without production error code - breaks React bundle size optimization
//   3. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 155: Error message without production error code - breaks React bundle size optimization
//   2. Line 155: Error message without production error code - breaks React bundle size optimization
//   3. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 166: Error message without production error code - breaks React bundle size optimization
//   2. Line 166: Error message without production error code - breaks React bundle size optimization
//   3. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 177: Error message without production error code - breaks React bundle size optimization
//   2. Line 177: Error message without production error code - breaks React bundle size optimization
//   3. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 188: Error message without production error code - breaks React bundle size optimization
//   2. Line 188: Error message without production error code - breaks React bundle size optimization
//   3. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 199: Error message without production error code - breaks React bundle size optimization
//   2. Line 199: Error message without production error code - breaks React bundle size optimization
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 210: Error message without production error code - breaks React bundle size optimization
//   2. Line 210: Error message without production error code - breaks React bundle size optimization
//   3. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 221: Error message without production error code - breaks React bundle size optimization
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 232: Error message without production error code - breaks React bundle size optimization
//   2. Line 232: Error message without production error code - breaks React bundle size optimization
//   3. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 243: Error message without production error code - breaks React bundle size optimization
//   2. Line 243: Error message without production error code - breaks React bundle size optimization
//   3. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 254: Error message without production error code - breaks React bundle size optimization
//   2. Line 254: Error message without production error code - breaks React bundle size optimization
//   3. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 265: Error message without production error code - breaks React bundle size optimization
//   2. Line 265: Error message without production error code - breaks React bundle size optimization
//   3. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 276: Error message without production error code - breaks React bundle size optimization
//   2. Line 276: Error message without production error code - breaks React bundle size optimization
//   3. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 287: Error message without production error code - breaks React bundle size optimization
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 298: Error message without production error code - breaks React bundle size optimization
//   2. Line 298: Error message without production error code - breaks React bundle size optimization
//   3. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 309: Error message without production error code - breaks React bundle size optimization
//   2. Line 309: Error message without production error code - breaks React bundle size optimization
//   3. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 320: Error message without production error code - breaks React bundle size optimization
//   2. Line 320: Error message without production error code - breaks React bundle size optimization
//   3. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 331: Error message without production error code - breaks React bundle size optimization
//   2. Line 331: Error message without production error code - breaks React bundle size optimization
//   3. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 342: Error message without production error code - breaks React bundle size optimization
//   2. Line 342: Error message without production error code - breaks React bundle size optimization
//   3. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 353: Error message without production error code - breaks React bundle size optimization
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
//   3. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 364: Error message without production error code - breaks React bundle size optimization
//   2. Line 364: Error message without production error code - breaks React bundle size optimization
//   3. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 375: Error message without production error code - breaks React bundle size optimization
//   2. Line 375: Error message without production error code - breaks React bundle size optimization
//   3. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 386: Error message without production error code - breaks React bundle size optimization
//   2. Line 386: Error message without production error code - breaks React bundle size optimization
//   3. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 397: Error message without production error code - breaks React bundle size optimization
//   2. Line 397: Error message without production error code - breaks React bundle size optimization
//   3. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 408: Error message without production error code - breaks React bundle size optimization
//   2. Line 408: Error message without production error code - breaks React bundle size optimization
//   3. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 419: Error message without production error code - breaks React bundle size optimization
//   2. Line 419: Error message without production error code - breaks React bundle size optimization
//   3. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 430: Error message without production error code - breaks React bundle size optimization
//   2. Line 430: Error message without production error code - breaks React bundle size optimization
//   3. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 441: Error message without production error code - breaks React bundle size optimization
//   2. Line 441: Error message without production error code - breaks React bundle size optimization
//   3. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Please sign in to store your edit session.');
		}

		if (typeof content !== 'string' && content.machine === undefined) {
			content.machine = await this.getOrCreateCurrentMachineId();
		}

		content = typeof content === 'string' ? content : JSON.stringify(content);
		const ref = await this.storeClient!.writeResource(resource, content, null, undefined, createSyncHeaders(generateUuid()));

		this._lastWrittenResources.set(resource, { ref, content });

		return ref;
	}

	/**
	 * @param resource: The resource to retrieve content for.
	 * @param ref: A specific content ref to retrieve content for, if it exists.
	 * If undefined, this method will return the latest saved edit session, if any.
	 *
	 * @returns An object representing the requested or latest state, if any.
	 */
	async read(resource: SyncResource, ref: string | undefined): Promise<{ ref: string; content: string } | undefined> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 134: Error message without production error code - breaks React bundle size optimization
//   2. Line 134: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		await this.initialize('read', false);
		if (!this.initialized) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Please sign in to apply your latest edit session.');
		}

		let content: string | undefined | null;
		const headers = createSyncHeaders(generateUuid());
		try {
			if (ref !== undefined) {
				content = await this.storeClient?.resolveResourceContent(resource, ref, undefined, headers);
			} else {
				const result = await this.storeClient?.readResource(resource, null, undefined, headers);
				content = result?.content;
				ref = result?.ref;
			}
		} catch (ex) {
			this.logService.error(ex);
		}

		// TODO@joyceerhl Validate session data, check schema version
		if (content !== undefined && content !== null && ref !== undefined) {
			this._lastReadResources.set(resource, { ref, content });
			return { ref, content };
		}
		return undefined;
	}

	async delete(resource: SyncResource, ref: string | null) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 162: Error message without production error code - breaks React bundle size optimization
//   2. Line 162: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		await this.initialize('write', false);
		if (!this.initialized) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 195: Error message without production error code - breaks React bundle size optimization
//   2. Line 195: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unable to delete edit session with ref ${ref}.`);
		}

		try {
			await this.storeClient?.deleteResource(resource, ref);
		} catch (ex) {
			this.logService.error(ex);
		}
	}

	async list(resource: SyncResource): Promise<IResourceRefHandle[]> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 175: Error message without production error code - breaks React bundle size optimization
//   2. Line 175: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		await this.initialize('read', false);
		if (!this.initialized) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 218: Error message without production error code - breaks React bundle size optimization
//   2. Line 218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unable to list edit sessions.`);
		}

		try {
			return this.storeClient?.getAllResourceRefs(resource) ?? [];
		} catch (ex) {
			this.logService.error(ex);
		}

		return [];
	}

	public async initialize(reason: 'read' | 'write', silent: boolean = false) {
		if (this.initialized) {
			return true;
		}
		this.initialized = await this.doInitialize(reason, silent);
		this.signedInContext.set(this.initialized);
		if (this.initialized) {
			this._didSignIn.fire();
		}
		return this.initialized;

	}

	/**
	 *
	 * Ensures that the store client is initialized,
	 * meaning that authentication is configured and it
	 * can be used to communicate with the remote storage service
	 */
	private async doInitialize(reason: 'read' | 'write', silent: boolean): Promise<boolean> {
		// Wait for authentication extensions to be registered
		await this.extensionService.whenInstalledExtensionsRegistered();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 211: Error message without production error code - breaks React bundle size optimization
//   2. Line 211: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!this.serverConfiguration?.url) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 264: Error message without production error code - breaks React bundle size optimization
//   2. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Unable to initialize sessions sync as session sync preference is not configured in product.json.');
		}

		if (this.storeClient === undefined) {
			return false;
		}

		this._register(this.storeClient.onTokenFailed(() => {
			this.logService.info('Clearing edit sessions authentication preference because of successive token failures.');
			this.clearAuthenticationPreference();
		}));

		if (this.machineClient === undefined) {
			this.machineClient = new UserDataSyncMachinesService(this.environmentService, this.fileService, this.storageService, this.storeClient, this.logService, this.productService);
		}

		// If we already have an existing auth session in memory, use that
		if (this.authenticationInfo !== undefined) {
			return true;
		}

		const authenticationSession = await this.getAuthenticationSession(reason, silent);
		if (authenticationSession !== undefined) {
			this.authenticationInfo = authenticationSession;
			this.storeClient.setAuthToken(authenticationSession.token, authenticationSession.providerId);
		}

		return authenticationSession !== undefined;
	}

	private cachedMachines: Map<string, string> | undefined;

	async getMachineById(machineId: string) {
		await this.initialize('read', false);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		if (!this.cachedMachines) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 613: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 728: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 774: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 889: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 912: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 938: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 981: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 984: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 985: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const machines = await this.machineClient!.getMachines();
			this.cachedMachines = machines.reduce((map, machine) => map.set(machine.id, machine.name), new Map<string, string>());
		}

		return this.cachedMachines.get(machineId);
	}

	private async getOrCreateCurrentMachineId(): Promise<string> {
		const currentMachineId = await this.machineClient!.getMachines().then((machines) => machines.find((m) => m.isCurrent)?.id);

		if (currentMachineId === undefined) {
			await this.machineClient!.addCurrentMachine();
			return await this.machineClient!.getMachines().then((machines) => machines.find((m) => m.isCurrent)!.id);
		}

		return currentMachineId;
	}

	private async getAuthenticationSession(reason: 'read' | 'write', silent: boolean) {
		// If the user signed in previously and the session is still available, reuse that without prompting the user again
		if (this.existingSessionId) {
			this.logService.info(`Searching for existing authentication session with ID ${this.existingSessionId}`);
			const existingSession = await this.getExistingSession();
			if (existingSession) {
				this.logService.info(`Found existing authentication session with ID ${existingSession.session.id}`);
				return { sessionId: existingSession.session.id, token: existingSession.session.idToken ?? existingSession.session.accessToken, providerId: existingSession.session.providerId };
			} else {
				this._didSignOut.fire();
			}
		}

		// If settings sync is already enabled, avoid asking again to authenticate
		if (this.shouldAttemptEditSessionInit()) {
			this.logService.info(`Reusing user data sync enablement`);
			const authenticationSessionInfo = await getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService);
			if (authenticationSessionInfo !== undefined) {
				this.logService.info(`Using current authentication session with ID ${authenticationSessionInfo.id}`);
				this.existingSessionId = authenticationSessionInfo.id;
				return { sessionId: authenticationSessionInfo.id, token: authenticationSessionInfo.accessToken, providerId: authenticationSessionInfo.providerId };
			}
		}

		// If we aren't supposed to prompt the user because
		// we're in a silent flow, just return here
		if (silent) {
			return;
		}

		// Ask the user to pick a preferred account
		const authenticationSession = await this.getAccountPreference(reason);
		if (authenticationSession !== undefined) {
			this.existingSessionId = authenticationSession.id;
			return { sessionId: authenticationSession.id, token: authenticationSession.idToken ?? authenticationSession.accessToken, providerId: authenticationSession.providerId };
		}

		return undefined;
	}

	private shouldAttemptEditSessionInit(): boolean {
		return isWeb && this.storageService.isNew(StorageScope.APPLICATION) && this.storageService.isNew(StorageScope.WORKSPACE);
	}

	/**
	 *
	 * Prompts the user to pick an authentication option for storing and getting edit sessions.
	 */
	private async getAccountPreference(reason: 'read' | 'write'): Promise<AuthenticationSession & { providerId: string } | undefined> {
		const disposables = new DisposableStore();
		const quickpick = disposables.add(this.quickInputService.createQuickPick<ExistingSession | AuthenticationProviderOption | IQuickPickItem>({ useSeparators: true }));
		quickpick.ok = false;
		quickpick.placeholder = reason === 'read' ? localize('choose account read placeholder', "Select an account to restore your working changes from the cloud") : localize('choose account placeholder', "Select an account to store your working changes in the cloud");
		quickpick.ignoreFocusOut = true;
		quickpick.items = await this.createQuickpickItems();

		return new Promise((resolve, reject) => {
			disposables.add(quickpick.onDidHide((e) => {
				reject(new CancellationError());
				disposables.dispose();
			}));

			disposables.add(quickpick.onDidAccept(async (e) => {
				const selection = quickpick.selectedItems[0];
				const session = 'provider' in selection ? { ...await this.authenticationService.createSession(selection.provider.id, selection.provider.scopes), providerId: selection.provider.id } : ('session' in selection ? selection.session : undefined);
				resolve(session);
				quickpick.hide();
			}));

			quickpick.show();
		});
	}

	private async createQuickpickItems(): Promise<(ExistingSession | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[]> {
		const options: (ExistingSession | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[] = [];

		options.push({ type: 'separator', label: localize('signed in', "Signed In") });

		const sessions = await this.getAllSessions();
		options.push(...sessions);

		options.push({ type: 'separator', label: localize('others', "Others") });

		for (const authenticationProvider of (await this.getAuthenticationProviders())) {
			const signedInForProvider = sessions.some(account => account.session.providerId === authenticationProvider.id);
			if (!signedInForProvider || this.authenticationService.getProvider(authenticationProvider.id).supportsMultipleAccounts) {
				const providerName = this.authenticationService.getProvider(authenticationProvider.id).label;
				options.push({ label: localize('sign in using account', "Sign in with {0}", providerName), provider: authenticationProvider });
			}
		}

		return options;
	}

	/**
	 *
	 * Returns all authentication sessions available from {@link getAuthenticationProviders}.
	 */
	private async getAllSessions() {
		const authenticationProviders = await this.getAuthenticationProviders();
		const accounts = new Map<string, ExistingSession>();
		let currentSession: ExistingSession | undefined;

		for (const provider of authenticationProviders) {
			const sessions = await this.authenticationService.getSessions(provider.id, provider.scopes);

			for (const session of sessions) {
				const item = {
					label: session.account.label,
					description: this.authenticationService.getProvider(provider.id).label,
					session: { ...session, providerId: provider.id }
				};
				accounts.set(item.session.account.id, item);
				if (this.existingSessionId === session.id) {
					currentSession = item;
				}
			}
		}

		if (currentSession !== undefined) {
			accounts.set(currentSession.session.account.id, currentSession);
		}

		return [...accounts.values()].sort((a, b) => a.label.localeCompare(b.label));
	}

	/**
	 *
	 * Returns all authentication providers which can be used to authenticate
	 * to the remote storage service, based on product.json configuration
	 * and registered authentication providers.
	 */
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 399: Error message without production error code - breaks React bundle size optimization
//   2. Line 399: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	private async getAuthenticationProviders() {
		if (!this.serverConfiguration) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 474: Error message without production error code - breaks React bundle size optimization
//   2. Line 474: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Unable to get configured authentication providers as session sync preference is not configured in product.json.');
		}

		// Get the list of authentication providers configured in product.json
		const authenticationProviders = this.serverConfiguration.authenticationProviders;
		const configuredAuthenticationProviders = Object.keys(authenticationProviders).reduce<IAuthenticationProvider[]>((result, id) => {
			result.push({ id, scopes: authenticationProviders[id].scopes });
			return result;
		}, []);

		// Filter out anything that isn't currently available through the authenticationService
		const availableAuthenticationProviders = this.authenticationService.declaredProviders;

		return configuredAuthenticationProviders.filter(({ id }) => availableAuthenticationProviders.some(provider => provider.id === id));
	}

	private get existingSessionId() {
		return this.storageService.get(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
	}

	private set existingSessionId(sessionId: string | undefined) {
		this.logService.trace(`Saving authentication session preference for ID ${sessionId}.`);
		if (sessionId === undefined) {
			this.storageService.remove(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
		} else {
			this.storageService.store(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, sessionId, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}
	}

	private async getExistingSession() {
		const accounts = await this.getAllSessions();
		return accounts.find((account) => account.session.id === this.existingSessionId);
	}

	private async onDidChangeStorage(): Promise<void> {
		const newSessionId = this.existingSessionId;
		const previousSessionId = this.authenticationInfo?.sessionId;

		if (previousSessionId !== newSessionId) {
			this.logService.trace(`Resetting authentication state because authentication session ID preference changed from ${previousSessionId} to ${newSessionId}.`);
			this.authenticationInfo = undefined;
			this.initialized = false;
		}
	}

	private clearAuthenticationPreference(): void {
		this.authenticationInfo = undefined;
		this.initialized = false;
		this.existingSessionId = undefined;
		this.signedInContext.set(false);
	}

	private onDidChangeSessions(e: AuthenticationSessionsChangeEvent): void {
		if (this.authenticationInfo?.sessionId && e.removed?.find(session => session.id === this.authenticationInfo?.sessionId)) {
			this.clearAuthenticationPreference();
		}
	}

	private registerSignInAction() {
		if (!this.serverConfiguration?.url) {
			return;
		}
		const that = this;
		const id = 'workbench.editSessions.actions.signIn';
		const when = ContextKeyExpr.and(ContextKeyExpr.equals(EDIT_SESSIONS_PENDING_KEY, false), ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, false));
		this._register(registerAction2(class ResetEditSessionAuthenticationAction extends Action2 {
			constructor() {
				super({
					id,
					title: localize('sign in', 'Turn on Cloud Changes...'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					precondition: when,
					menu: [{
						id: MenuId.CommandPalette,
					},
					{
						id: MenuId.AccountsContext,
						group: '2_editSessions',
						when,
					}]
				});
			}

			async run() {
				return await that.initialize('write', false);
			}
		}));

		this._register(MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '2_editSessions',
			command: {
				id,
				title: localize('sign in badge', 'Turn on Cloud Changes... (1)'),
			},
			when: ContextKeyExpr.and(ContextKeyExpr.equals(EDIT_SESSIONS_PENDING_KEY, true), ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, false))
		}));
	}

	private registerResetAuthenticationAction() {
		const that = this;
		this._register(registerAction2(class ResetEditSessionAuthenticationAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.resetAuth',
					title: localize('reset auth.v3', 'Turn off Cloud Changes...'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					precondition: ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, true),
					menu: [{
						id: MenuId.CommandPalette,
					},
					{
						id: MenuId.AccountsContext,
						group: '2_editSessions',
						when: ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, true),
					}]
				});
			}

			async run() {
				const result = await that.dialogService.confirm({
					message: localize('sign out of cloud changes clear data prompt', 'Do you want to disable storing working changes in the cloud?'),
					checkbox: { label: localize('delete all cloud changes', 'Delete all stored data from the cloud.') }
				});
				if (result.confirmed) {
					if (result.checkboxChecked) {
						that.storeClient?.deleteResource('editSessions', null);
					}
					that.clearAuthenticationPreference();
				}
			}
		}));
	}
}
