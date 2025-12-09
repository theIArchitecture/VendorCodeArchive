//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEncryptionService, KnownStorageProvider } from '../../../encryption/common/encryptionService.js';
import { NullLogService } from '../../../log/common/log.js';
import { BaseSecretStorageService } from '../../common/secrets.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { InMemoryStorageService } from '../../../storage/common/storage.js';

class TestEncryptionService implements IEncryptionService {
	_serviceBrand: undefined;
	private encryptedPrefix = 'encrypted+'; // prefix to simulate encryption
	setUsePlainTextEncryption(): Promise<void> {
		return Promise.resolve();
	}
	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		return Promise.resolve(KnownStorageProvider.basicText);
	}
	encrypt(value: string): Promise<string> {
		return Promise.resolve(this.encryptedPrefix + value);
	}
	decrypt(value: string): Promise<string> {
		return Promise.resolve(value.substring(this.encryptedPrefix.length));
	}
	isEncryptionAvailable(): Promise<boolean> {
		return Promise.resolve(true);
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 37: Error message without production error code - breaks React bundle size optimization
//   3. Line 37: Error message without production error code - breaks React bundle size optimization
//   4. Line 40: Error message without production error code - breaks React bundle size optimization
//   5. Line 40: Error message without production error code - breaks React bundle size optimization
//   6. Line 43: Error message without production error code - breaks React bundle size optimization
//   7. Line 43: Error message without production error code - breaks React bundle size optimization
//   8. Line 46: Error message without production error code - breaks React bundle size optimization
//   9. Line 46: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 63: Error message without production error code - breaks React bundle size optimization
//   3. Line 63: Error message without production error code - breaks React bundle size optimization
//   4. Line 66: Error message without production error code - breaks React bundle size optimization
//   5. Line 66: Error message without production error code - breaks React bundle size optimization
//   6. Line 69: Error message without production error code - breaks React bundle size optimization
//   7. Line 69: Error message without production error code - breaks React bundle size optimization
//   8. Line 72: Error message without production error code - breaks React bundle size optimization
//   9. Line 72: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 80: Error message without production error code - breaks React bundle size optimization
//   3. Line 80: Error message without production error code - breaks React bundle size optimization
//   4. Line 83: Error message without production error code - breaks React bundle size optimization
//   5. Line 83: Error message without production error code - breaks React bundle size optimization
//   6. Line 86: Error message without production error code - breaks React bundle size optimization
//   7. Line 86: Error message without production error code - breaks React bundle size optimization
//   8. Line 89: Error message without production error code - breaks React bundle size optimization
//   9. Line 89: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 97: Error message without production error code - breaks React bundle size optimization
//   3. Line 97: Error message without production error code - breaks React bundle size optimization
//   4. Line 100: Error message without production error code - breaks React bundle size optimization
//   5. Line 100: Error message without production error code - breaks React bundle size optimization
//   6. Line 103: Error message without production error code - breaks React bundle size optimization
//   7. Line 103: Error message without production error code - breaks React bundle size optimization
//   8. Line 106: Error message without production error code - breaks React bundle size optimization
//   9. Line 106: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 114: Error message without production error code - breaks React bundle size optimization
//   3. Line 114: Error message without production error code - breaks React bundle size optimization
//   4. Line 117: Error message without production error code - breaks React bundle size optimization
//   5. Line 117: Error message without production error code - breaks React bundle size optimization
//   6. Line 120: Error message without production error code - breaks React bundle size optimization
//   7. Line 120: Error message without production error code - breaks React bundle size optimization
//   8. Line 123: Error message without production error code - breaks React bundle size optimization
//   9. Line 123: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 128: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 131: Error message without production error code - breaks React bundle size optimization
//   3. Line 131: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
//   5. Line 134: Error message without production error code - breaks React bundle size optimization
//   6. Line 137: Error message without production error code - breaks React bundle size optimization
//   7. Line 137: Error message without production error code - breaks React bundle size optimization
//   8. Line 140: Error message without production error code - breaks React bundle size optimization
//   9. Line 140: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 148: Error message without production error code - breaks React bundle size optimization
//   3. Line 148: Error message without production error code - breaks React bundle size optimization
//   4. Line 151: Error message without production error code - breaks React bundle size optimization
//   5. Line 151: Error message without production error code - breaks React bundle size optimization
//   6. Line 154: Error message without production error code - breaks React bundle size optimization
//   7. Line 154: Error message without production error code - breaks React bundle size optimization
//   8. Line 157: Error message without production error code - breaks React bundle size optimization
//   9. Line 157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 165: Error message without production error code - breaks React bundle size optimization
//   3. Line 165: Error message without production error code - breaks React bundle size optimization
//   4. Line 168: Error message without production error code - breaks React bundle size optimization
//   5. Line 168: Error message without production error code - breaks React bundle size optimization
//   6. Line 171: Error message without production error code - breaks React bundle size optimization
//   7. Line 171: Error message without production error code - breaks React bundle size optimization
//   8. Line 174: Error message without production error code - breaks React bundle size optimization
//   9. Line 174: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 182: Error message without production error code - breaks React bundle size optimization
//   3. Line 182: Error message without production error code - breaks React bundle size optimization
//   4. Line 185: Error message without production error code - breaks React bundle size optimization
//   5. Line 185: Error message without production error code - breaks React bundle size optimization
//   6. Line 188: Error message without production error code - breaks React bundle size optimization
//   7. Line 188: Error message without production error code - breaks React bundle size optimization
//   8. Line 191: Error message without production error code - breaks React bundle size optimization
//   9. Line 191: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 196: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 199: Error message without production error code - breaks React bundle size optimization
//   3. Line 199: Error message without production error code - breaks React bundle size optimization
//   4. Line 202: Error message without production error code - breaks React bundle size optimization
//   5. Line 202: Error message without production error code - breaks React bundle size optimization
//   6. Line 205: Error message without production error code - breaks React bundle size optimization
//   7. Line 205: Error message without production error code - breaks React bundle size optimization
//   8. Line 208: Error message without production error code - breaks React bundle size optimization
//   9. Line 208: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 213: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 216: Error message without production error code - breaks React bundle size optimization
//   3. Line 216: Error message without production error code - breaks React bundle size optimization
//   4. Line 219: Error message without production error code - breaks React bundle size optimization
//   5. Line 219: Error message without production error code - breaks React bundle size optimization
//   6. Line 222: Error message without production error code - breaks React bundle size optimization
//   7. Line 222: Error message without production error code - breaks React bundle size optimization
//   8. Line 225: Error message without production error code - breaks React bundle size optimization
//   9. Line 225: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 233: Error message without production error code - breaks React bundle size optimization
//   3. Line 233: Error message without production error code - breaks React bundle size optimization
//   4. Line 236: Error message without production error code - breaks React bundle size optimization
//   5. Line 236: Error message without production error code - breaks React bundle size optimization
//   6. Line 239: Error message without production error code - breaks React bundle size optimization
//   7. Line 239: Error message without production error code - breaks React bundle size optimization
//   8. Line 242: Error message without production error code - breaks React bundle size optimization
//   9. Line 242: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 247: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 250: Error message without production error code - breaks React bundle size optimization
//   3. Line 250: Error message without production error code - breaks React bundle size optimization
//   4. Line 253: Error message without production error code - breaks React bundle size optimization
//   5. Line 253: Error message without production error code - breaks React bundle size optimization
//   6. Line 256: Error message without production error code - breaks React bundle size optimization
//   7. Line 256: Error message without production error code - breaks React bundle size optimization
//   8. Line 259: Error message without production error code - breaks React bundle size optimization
//   9. Line 259: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 264: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 267: Error message without production error code - breaks React bundle size optimization
//   3. Line 267: Error message without production error code - breaks React bundle size optimization
//   4. Line 270: Error message without production error code - breaks React bundle size optimization
//   5. Line 270: Error message without production error code - breaks React bundle size optimization
//   6. Line 273: Error message without production error code - breaks React bundle size optimization
//   7. Line 273: Error message without production error code - breaks React bundle size optimization
//   8. Line 276: Error message without production error code - breaks React bundle size optimization
//   9. Line 276: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 281: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 284: Error message without production error code - breaks React bundle size optimization
//   3. Line 284: Error message without production error code - breaks React bundle size optimization
//   4. Line 287: Error message without production error code - breaks React bundle size optimization
//   5. Line 287: Error message without production error code - breaks React bundle size optimization
//   6. Line 290: Error message without production error code - breaks React bundle size optimization
//   7. Line 290: Error message without production error code - breaks React bundle size optimization
//   8. Line 293: Error message without production error code - breaks React bundle size optimization
//   9. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 298: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
//   3. Line 301: Error message without production error code - breaks React bundle size optimization
//   4. Line 304: Error message without production error code - breaks React bundle size optimization
//   5. Line 304: Error message without production error code - breaks React bundle size optimization
//   6. Line 307: Error message without production error code - breaks React bundle size optimization
//   7. Line 307: Error message without production error code - breaks React bundle size optimization
//   8. Line 310: Error message without production error code - breaks React bundle size optimization
//   9. Line 310: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 315: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 318: Error message without production error code - breaks React bundle size optimization
//   3. Line 318: Error message without production error code - breaks React bundle size optimization
//   4. Line 321: Error message without production error code - breaks React bundle size optimization
//   5. Line 321: Error message without production error code - breaks React bundle size optimization
//   6. Line 324: Error message without production error code - breaks React bundle size optimization
//   7. Line 324: Error message without production error code - breaks React bundle size optimization
//   8. Line 327: Error message without production error code - breaks React bundle size optimization
//   9. Line 327: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 335: Error message without production error code - breaks React bundle size optimization
//   3. Line 335: Error message without production error code - breaks React bundle size optimization
//   4. Line 338: Error message without production error code - breaks React bundle size optimization
//   5. Line 338: Error message without production error code - breaks React bundle size optimization
//   6. Line 341: Error message without production error code - breaks React bundle size optimization
//   7. Line 341: Error message without production error code - breaks React bundle size optimization
//   8. Line 344: Error message without production error code - breaks React bundle size optimization
//   9. Line 344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 352: Error message without production error code - breaks React bundle size optimization
//   3. Line 352: Error message without production error code - breaks React bundle size optimization
//   4. Line 355: Error message without production error code - breaks React bundle size optimization
//   5. Line 355: Error message without production error code - breaks React bundle size optimization
//   6. Line 358: Error message without production error code - breaks React bundle size optimization
//   7. Line 358: Error message without production error code - breaks React bundle size optimization
//   8. Line 361: Error message without production error code - breaks React bundle size optimization
//   9. Line 361: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 366: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 369: Error message without production error code - breaks React bundle size optimization
//   3. Line 369: Error message without production error code - breaks React bundle size optimization
//   4. Line 372: Error message without production error code - breaks React bundle size optimization
//   5. Line 372: Error message without production error code - breaks React bundle size optimization
//   6. Line 375: Error message without production error code - breaks React bundle size optimization
//   7. Line 375: Error message without production error code - breaks React bundle size optimization
//   8. Line 378: Error message without production error code - breaks React bundle size optimization
//   9. Line 378: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 386: Error message without production error code - breaks React bundle size optimization
//   3. Line 386: Error message without production error code - breaks React bundle size optimization
//   4. Line 389: Error message without production error code - breaks React bundle size optimization
//   5. Line 389: Error message without production error code - breaks React bundle size optimization
//   6. Line 392: Error message without production error code - breaks React bundle size optimization
//   7. Line 392: Error message without production error code - breaks React bundle size optimization
//   8. Line 395: Error message without production error code - breaks React bundle size optimization
//   9. Line 395: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 403: Error message without production error code - breaks React bundle size optimization
//   3. Line 403: Error message without production error code - breaks React bundle size optimization
//   4. Line 406: Error message without production error code - breaks React bundle size optimization
//   5. Line 406: Error message without production error code - breaks React bundle size optimization
//   6. Line 409: Error message without production error code - breaks React bundle size optimization
//   7. Line 409: Error message without production error code - breaks React bundle size optimization
//   8. Line 412: Error message without production error code - breaks React bundle size optimization
//   9. Line 412: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 417: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 420: Error message without production error code - breaks React bundle size optimization
//   3. Line 420: Error message without production error code - breaks React bundle size optimization
//   4. Line 423: Error message without production error code - breaks React bundle size optimization
//   5. Line 423: Error message without production error code - breaks React bundle size optimization
//   6. Line 426: Error message without production error code - breaks React bundle size optimization
//   7. Line 426: Error message without production error code - breaks React bundle size optimization
//   8. Line 429: Error message without production error code - breaks React bundle size optimization
//   9. Line 429: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 434: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 437: Error message without production error code - breaks React bundle size optimization
//   3. Line 437: Error message without production error code - breaks React bundle size optimization
//   4. Line 440: Error message without production error code - breaks React bundle size optimization
//   5. Line 440: Error message without production error code - breaks React bundle size optimization
//   6. Line 443: Error message without production error code - breaks React bundle size optimization
//   7. Line 443: Error message without production error code - breaks React bundle size optimization
//   8. Line 446: Error message without production error code - breaks React bundle size optimization
//   9. Line 446: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 451: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 454: Error message without production error code - breaks React bundle size optimization
//   3. Line 454: Error message without production error code - breaks React bundle size optimization
//   4. Line 457: Error message without production error code - breaks React bundle size optimization
//   5. Line 457: Error message without production error code - breaks React bundle size optimization
//   6. Line 460: Error message without production error code - breaks React bundle size optimization
//   7. Line 460: Error message without production error code - breaks React bundle size optimization
//   8. Line 463: Error message without production error code - breaks React bundle size optimization
//   9. Line 463: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 468: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 471: Error message without production error code - breaks React bundle size optimization
//   3. Line 471: Error message without production error code - breaks React bundle size optimization
//   4. Line 474: Error message without production error code - breaks React bundle size optimization
//   5. Line 474: Error message without production error code - breaks React bundle size optimization
//   6. Line 477: Error message without production error code - breaks React bundle size optimization
//   7. Line 477: Error message without production error code - breaks React bundle size optimization
//   8. Line 480: Error message without production error code - breaks React bundle size optimization
//   9. Line 480: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 485: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 488: Error message without production error code - breaks React bundle size optimization
//   3. Line 488: Error message without production error code - breaks React bundle size optimization
//   4. Line 491: Error message without production error code - breaks React bundle size optimization
//   5. Line 491: Error message without production error code - breaks React bundle size optimization
//   6. Line 494: Error message without production error code - breaks React bundle size optimization
//   7. Line 494: Error message without production error code - breaks React bundle size optimization
//   8. Line 497: Error message without production error code - breaks React bundle size optimization
//   9. Line 497: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 502: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 505: Error message without production error code - breaks React bundle size optimization
//   3. Line 505: Error message without production error code - breaks React bundle size optimization
//   4. Line 508: Error message without production error code - breaks React bundle size optimization
//   5. Line 508: Error message without production error code - breaks React bundle size optimization
//   6. Line 511: Error message without production error code - breaks React bundle size optimization
//   7. Line 511: Error message without production error code - breaks React bundle size optimization
//   8. Line 514: Error message without production error code - breaks React bundle size optimization
//   9. Line 514: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 519: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 522: Error message without production error code - breaks React bundle size optimization
//   3. Line 522: Error message without production error code - breaks React bundle size optimization
//   4. Line 525: Error message without production error code - breaks React bundle size optimization
//   5. Line 525: Error message without production error code - breaks React bundle size optimization
//   6. Line 528: Error message without production error code - breaks React bundle size optimization
//   7. Line 528: Error message without production error code - breaks React bundle size optimization
//   8. Line 531: Error message without production error code - breaks React bundle size optimization
//   9. Line 531: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 536: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 539: Error message without production error code - breaks React bundle size optimization
//   3. Line 539: Error message without production error code - breaks React bundle size optimization
//   4. Line 542: Error message without production error code - breaks React bundle size optimization
//   5. Line 542: Error message without production error code - breaks React bundle size optimization
//   6. Line 545: Error message without production error code - breaks React bundle size optimization
//   7. Line 545: Error message without production error code - breaks React bundle size optimization
//   8. Line 548: Error message without production error code - breaks React bundle size optimization
//   9. Line 548: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 553: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 556: Error message without production error code - breaks React bundle size optimization
//   3. Line 556: Error message without production error code - breaks React bundle size optimization
//   4. Line 559: Error message without production error code - breaks React bundle size optimization
//   5. Line 559: Error message without production error code - breaks React bundle size optimization
//   6. Line 562: Error message without production error code - breaks React bundle size optimization
//   7. Line 562: Error message without production error code - breaks React bundle size optimization
//   8. Line 565: Error message without production error code - breaks React bundle size optimization
//   9. Line 565: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 570: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 573: Error message without production error code - breaks React bundle size optimization
//   3. Line 573: Error message without production error code - breaks React bundle size optimization
//   4. Line 576: Error message without production error code - breaks React bundle size optimization
//   5. Line 576: Error message without production error code - breaks React bundle size optimization
//   6. Line 579: Error message without production error code - breaks React bundle size optimization
//   7. Line 579: Error message without production error code - breaks React bundle size optimization
//   8. Line 582: Error message without production error code - breaks React bundle size optimization
//   9. Line 582: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

class TestNoEncryptionService implements IEncryptionService {
	_serviceBrand: undefined;
	setUsePlainTextEncryption(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		throw new Error('Method not implemented.');
	}
	encrypt(value: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	decrypt(value: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	isEncryptionAvailable(): Promise<boolean> {
		return Promise.resolve(false);
	}
}

suite('secrets', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('BaseSecretStorageService useInMemoryStorage=true', () => {
		let service: BaseSecretStorageService;
		let spyEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyEncryptionService = sandbox.spy(new TestEncryptionService());
			service = store.add(new BaseSecretStorageService(
				true,
				store.add(new InMemoryStorageService()),
				spyEncryptionService,
				store.add(new NullLogService())
			));
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'in-memory');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyEncryptionService.encrypt.callCount, 0);
			assert.strictEqual(spyEncryptionService.decrypt.callCount, 0);
		});

		test('delete', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			await service.delete(key);
			const result = await service.get(key);
			assert.strictEqual(result, undefined);
		});

		test('onDidChangeSecret', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			let eventFired = false;
			store.add(service.onDidChangeSecret((changedKey) => {
				assert.strictEqual(changedKey, key);
				eventFired = true;
			}));
			await service.set(key, value);
			assert.strictEqual(eventFired, true);
		});
	});

	suite('BaseSecretStorageService useInMemoryStorage=false', () => {
		let service: BaseSecretStorageService;
		let spyEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyEncryptionService = sandbox.spy(new TestEncryptionService());
			service = store.add(new BaseSecretStorageService(
				false,
				store.add(new InMemoryStorageService()),
				spyEncryptionService,
				store.add(new NullLogService()))
			);
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'persisted');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyEncryptionService.encrypt.callCount, 1);
			assert.strictEqual(spyEncryptionService.decrypt.callCount, 1);
		});

		test('delete', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			await service.delete(key);
			const result = await service.get(key);
			assert.strictEqual(result, undefined);
		});

		test('onDidChangeSecret', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			let eventFired = false;
			store.add(service.onDidChangeSecret((changedKey) => {
				assert.strictEqual(changedKey, key);
				eventFired = true;
			}));
			await service.set(key, value);
			assert.strictEqual(eventFired, true);
		});
	});

	suite('BaseSecretStorageService useInMemoryStorage=false, encryption not available', () => {
		let service: BaseSecretStorageService;
		let spyNoEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyNoEncryptionService = sandbox.spy(new TestNoEncryptionService());
			service = store.add(new BaseSecretStorageService(
				false,
				store.add(new InMemoryStorageService()),
				spyNoEncryptionService,
				store.add(new NullLogService()))
			);
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'in-memory');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyNoEncryptionService.encrypt.callCount, 0);
			assert.strictEqual(spyNoEncryptionService.decrypt.callCount, 0);
		});
	});
});
