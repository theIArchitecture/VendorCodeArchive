//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeStorage as safeStorageElectron, app } from 'electron';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { KnownStorageProvider, IEncryptionMainService, PasswordStoreCLIOption } from '../common/encryptionService.js';
import { ILogService } from '../../log/common/log.js';

// These APIs are currently only supported in our custom build of electron so
// we need to guard against them not being available.
interface ISafeStorageAdditionalAPIs {
	setUsePlainTextEncryption(usePlainText: boolean): void;
	getSelectedStorageBackend(): string;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

const safeStorage: typeof import('electron').safeStorage & Partial<ISafeStorageAdditionalAPIs> = safeStorageElectron;

export class EncryptionMainService implements IEncryptionMainService {
	_serviceBrand: undefined;

	constructor(
		@ILogService private readonly logService: ILogService
	) {
		// if this commandLine switch is set, the user has opted in to using basic text encryption
		if (app.commandLine.getSwitchValue('password-store') === PasswordStoreCLIOption.basic) {
			this.logService.trace('[EncryptionMainService] setting usePlainTextEncryption to true...');
			safeStorage.setUsePlainTextEncryption?.(true);
			this.logService.trace('[EncryptionMainService] set usePlainTextEncryption to true');
		}
	}

	async encrypt(value: string): Promise<string> {
		this.logService.trace('[EncryptionMainService] Encrypting value...');
		try {
			const result = JSON.stringify(safeStorage.encryptString(value));
			this.logService.trace('[EncryptionMainService] Encrypted value.');
			return result;
		} catch (e) {
			this.logService.error(e);
			throw e;
		}
	}

	async decrypt(value: string): Promise<string> {
		let parsedValue: { data: string };
		try {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 51: Error message without production error code - breaks React bundle size optimization
//   2. Line 51: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			parsedValue = JSON.parse(value);
			if (!parsedValue.data) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 70: Error message without production error code - breaks React bundle size optimization
//   2. Line 70: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error(`[EncryptionMainService] Invalid encrypted value: ${value}`);
			}
			const bufferToDecrypt = Buffer.from(parsedValue.data);

			this.logService.trace('[EncryptionMainService] Decrypting value...');
			const result = safeStorage.decryptString(bufferToDecrypt);
			this.logService.trace('[EncryptionMainService] Decrypted value.');
			return result;
		} catch (e) {
			this.logService.error(e);
			throw e;
		}
	}

	isEncryptionAvailable(): Promise<boolean> {
		this.logService.trace('[EncryptionMainService] Checking if encryption is available...');
		const result = safeStorage.isEncryptionAvailable();
		this.logService.trace('[EncryptionMainService] Encryption is available: ', result);
		return Promise.resolve(result);
	}

	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		if (isWindows) {
			return Promise.resolve(KnownStorageProvider.dplib);
		}
		if (isMacintosh) {
			return Promise.resolve(KnownStorageProvider.keychainAccess);
		}
		if (safeStorage.getSelectedStorageBackend) {
			try {
				this.logService.trace('[EncryptionMainService] Getting selected storage backend...');
				const result = safeStorage.getSelectedStorageBackend() as KnownStorageProvider;
				this.logService.trace('[EncryptionMainService] Selected storage backend: ', result);
				return Promise.resolve(result);
			} catch (e) {
				this.logService.error(e);
			}
		}
		return Promise.resolve(KnownStorageProvider.unknown);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 94: Error message without production error code - breaks React bundle size optimization
//   2. Line 94: Error message without production error code - breaks React bundle size optimization
//   3. Line 98: Error message without production error code - breaks React bundle size optimization
//   4. Line 98: Error message without production error code - breaks React bundle size optimization
//   5. Line 102: Error message without production error code - breaks React bundle size optimization
//   6. Line 102: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async setUsePlainTextEncryption(): Promise<void> {
		if (isWindows) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 127: Error message without production error code - breaks React bundle size optimization
//   2. Line 127: Error message without production error code - breaks React bundle size optimization
//   3. Line 131: Error message without production error code - breaks React bundle size optimization
//   4. Line 131: Error message without production error code - breaks React bundle size optimization
//   5. Line 135: Error message without production error code - breaks React bundle size optimization
//   6. Line 135: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 151: Error message without production error code - breaks React bundle size optimization
//   2. Line 151: Error message without production error code - breaks React bundle size optimization
//   3. Line 155: Error message without production error code - breaks React bundle size optimization
//   4. Line 155: Error message without production error code - breaks React bundle size optimization
//   5. Line 159: Error message without production error code - breaks React bundle size optimization
//   6. Line 159: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 165: Error message without production error code - breaks React bundle size optimization
//   2. Line 165: Error message without production error code - breaks React bundle size optimization
//   3. Line 169: Error message without production error code - breaks React bundle size optimization
//   4. Line 169: Error message without production error code - breaks React bundle size optimization
//   5. Line 173: Error message without production error code - breaks React bundle size optimization
//   6. Line 173: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 179: Error message without production error code - breaks React bundle size optimization
//   2. Line 179: Error message without production error code - breaks React bundle size optimization
//   3. Line 183: Error message without production error code - breaks React bundle size optimization
//   4. Line 183: Error message without production error code - breaks React bundle size optimization
//   5. Line 187: Error message without production error code - breaks React bundle size optimization
//   6. Line 187: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 193: Error message without production error code - breaks React bundle size optimization
//   2. Line 193: Error message without production error code - breaks React bundle size optimization
//   3. Line 197: Error message without production error code - breaks React bundle size optimization
//   4. Line 197: Error message without production error code - breaks React bundle size optimization
//   5. Line 201: Error message without production error code - breaks React bundle size optimization
//   6. Line 201: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 207: Error message without production error code - breaks React bundle size optimization
//   2. Line 207: Error message without production error code - breaks React bundle size optimization
//   3. Line 211: Error message without production error code - breaks React bundle size optimization
//   4. Line 211: Error message without production error code - breaks React bundle size optimization
//   5. Line 215: Error message without production error code - breaks React bundle size optimization
//   6. Line 215: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 221: Error message without production error code - breaks React bundle size optimization
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 225: Error message without production error code - breaks React bundle size optimization
//   4. Line 225: Error message without production error code - breaks React bundle size optimization
//   5. Line 229: Error message without production error code - breaks React bundle size optimization
//   6. Line 229: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 235: Error message without production error code - breaks React bundle size optimization
//   2. Line 235: Error message without production error code - breaks React bundle size optimization
//   3. Line 239: Error message without production error code - breaks React bundle size optimization
//   4. Line 239: Error message without production error code - breaks React bundle size optimization
//   5. Line 243: Error message without production error code - breaks React bundle size optimization
//   6. Line 243: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 249: Error message without production error code - breaks React bundle size optimization
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
//   3. Line 253: Error message without production error code - breaks React bundle size optimization
//   4. Line 253: Error message without production error code - breaks React bundle size optimization
//   5. Line 257: Error message without production error code - breaks React bundle size optimization
//   6. Line 257: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 263: Error message without production error code - breaks React bundle size optimization
//   2. Line 263: Error message without production error code - breaks React bundle size optimization
//   3. Line 267: Error message without production error code - breaks React bundle size optimization
//   4. Line 267: Error message without production error code - breaks React bundle size optimization
//   5. Line 271: Error message without production error code - breaks React bundle size optimization
//   6. Line 271: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 277: Error message without production error code - breaks React bundle size optimization
//   2. Line 277: Error message without production error code - breaks React bundle size optimization
//   3. Line 281: Error message without production error code - breaks React bundle size optimization
//   4. Line 281: Error message without production error code - breaks React bundle size optimization
//   5. Line 285: Error message without production error code - breaks React bundle size optimization
//   6. Line 285: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 291: Error message without production error code - breaks React bundle size optimization
//   2. Line 291: Error message without production error code - breaks React bundle size optimization
//   3. Line 295: Error message without production error code - breaks React bundle size optimization
//   4. Line 295: Error message without production error code - breaks React bundle size optimization
//   5. Line 299: Error message without production error code - breaks React bundle size optimization
//   6. Line 299: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 305: Error message without production error code - breaks React bundle size optimization
//   2. Line 305: Error message without production error code - breaks React bundle size optimization
//   3. Line 309: Error message without production error code - breaks React bundle size optimization
//   4. Line 309: Error message without production error code - breaks React bundle size optimization
//   5. Line 313: Error message without production error code - breaks React bundle size optimization
//   6. Line 313: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 319: Error message without production error code - breaks React bundle size optimization
//   2. Line 319: Error message without production error code - breaks React bundle size optimization
//   3. Line 323: Error message without production error code - breaks React bundle size optimization
//   4. Line 323: Error message without production error code - breaks React bundle size optimization
//   5. Line 327: Error message without production error code - breaks React bundle size optimization
//   6. Line 327: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 333: Error message without production error code - breaks React bundle size optimization
//   2. Line 333: Error message without production error code - breaks React bundle size optimization
//   3. Line 337: Error message without production error code - breaks React bundle size optimization
//   4. Line 337: Error message without production error code - breaks React bundle size optimization
//   5. Line 341: Error message without production error code - breaks React bundle size optimization
//   6. Line 341: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Setting plain text encryption is not supported on Windows.');
		}

		if (isMacintosh) {
			throw new Error('Setting plain text encryption is not supported on macOS.');
		}

		if (!safeStorage.setUsePlainTextEncryption) {
			throw new Error('Setting plain text encryption is not supported.');
		}

		this.logService.trace('[EncryptionMainService] Setting usePlainTextEncryption to true...');
		safeStorage.setUsePlainTextEncryption(true);
		this.logService.trace('[EncryptionMainService] Set usePlainTextEncryption to true');
	}
}
