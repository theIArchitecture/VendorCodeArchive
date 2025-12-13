/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEncryptionService, KnownStorageProvider } from '../../../../platform/encryption/common/encryptionService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class EncryptionService implements IEncryptionService {

	declare readonly _serviceBrand: undefined;

	encrypt(value: string): Promise<string> {
		return Promise.resolve(value);
	}

	decrypt(value: string): Promise<string> {
		return Promise.resolve(value);
	}

	isEncryptionAvailable(): Promise<boolean> {
		return Promise.resolve(false);
	}

	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		return Promise.resolve(KnownStorageProvider.basicText);
	}

	setUsePlainTextEncryption(): Promise<void> {
		return Promise.resolve(undefined);
	}
}

registerSingleton(IEncryptionService, EncryptionService, InstantiationType.Delayed);
