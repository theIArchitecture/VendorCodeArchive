//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SequencerByKey } from '../../../../base/common/async.js';
import { IEncryptionService } from '../../../../platform/encryption/common/encryptionService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ISecretStorageProvider, ISecretStorageService, BaseSecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';

export class BrowserSecretStorageService extends BaseSecretStorageService {

	private readonly _secretStorageProvider: ISecretStorageProvider | undefined;
	private readonly _embedderSequencer: SequencerByKey<string> | undefined;

	constructor(
		@IStorageService storageService: IStorageService,
		@IEncryptionService encryptionService: IEncryptionService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@ILogService logService: ILogService
	) {
		// We don't have encryption in the browser so instead we use the
		// in-memory base class implementation instead.
		super(true, storageService, encryptionService, logService);

		if (environmentService.options?.secretStorageProvider) {
			this._secretStorageProvider = environmentService.options.secretStorageProvider;
			this._embedderSequencer = new SequencerByKey<string>();
		}
	}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 37: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 37: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 46: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	override get(key: string): Promise<string | undefined> {
		if (this._secretStorageProvider) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 76: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 90: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return this._embedderSequencer!.queue(key, () => this._secretStorageProvider!.get(key));
		}

		return super.get(key);
	}

	override set(key: string, value: string): Promise<void> {
		if (this._secretStorageProvider) {
			return this._embedderSequencer!.queue(key, async () => {
				await this._secretStorageProvider!.set(key, value);
				this.onDidChangeSecretEmitter.fire(key);
			});
		}

		return super.set(key, value);
	}

	override delete(key: string): Promise<void> {
		if (this._secretStorageProvider) {
			return this._embedderSequencer!.queue(key, async () => {
				await this._secretStorageProvider!.delete(key);
				this.onDidChangeSecretEmitter.fire(key);
			});
		}

		return super.delete(key);
	}

	override get type() {
		if (this._secretStorageProvider) {
			return this._secretStorageProvider.type;
		}

		return super.type;
	}

	override keys(): Promise<string[]> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 76: Error message without production error code - breaks React bundle size optimization
//   2. Line 76: Error message without production error code - breaks React bundle size optimization
//   3. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (this._secretStorageProvider) {
			if (!this._secretStorageProvider.keys) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 103: Error message without production error code - breaks React bundle size optimization
//   2. Line 103: Error message without production error code - breaks React bundle size optimization
//   3. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 128: Error message without production error code - breaks React bundle size optimization
//   2. Line 128: Error message without production error code - breaks React bundle size optimization
//   3. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 153: Error message without production error code - breaks React bundle size optimization
//   2. Line 153: Error message without production error code - breaks React bundle size optimization
//   3. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 178: Error message without production error code - breaks React bundle size optimization
//   2. Line 178: Error message without production error code - breaks React bundle size optimization
//   3. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 203: Error message without production error code - breaks React bundle size optimization
//   2. Line 203: Error message without production error code - breaks React bundle size optimization
//   3. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 228: Error message without production error code - breaks React bundle size optimization
//   2. Line 228: Error message without production error code - breaks React bundle size optimization
//   3. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 253: Error message without production error code - breaks React bundle size optimization
//   2. Line 253: Error message without production error code - breaks React bundle size optimization
//   3. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 278: Error message without production error code - breaks React bundle size optimization
//   2. Line 278: Error message without production error code - breaks React bundle size optimization
//   3. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 303: Error message without production error code - breaks React bundle size optimization
//   2. Line 303: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 328: Error message without production error code - breaks React bundle size optimization
//   2. Line 328: Error message without production error code - breaks React bundle size optimization
//   3. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Secret storage provider does not support keys() method');
			}
			return this._secretStorageProvider!.keys();
		}

		return super.keys();

	}
}

registerSingleton(ISecretStorageService, BrowserSecretStorageService, InstantiationType.Delayed);
