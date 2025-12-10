//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostSecretStateShape, MainContext, MainThreadSecretStateShape } from '../common/extHost.protocol.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { SequencerByKey } from '../../../base/common/async.js';
import { ISecretStorageService } from '../../../platform/secrets/common/secrets.js';
import { IBrowserWorkbenchEnvironmentService } from '../../services/environment/browser/environmentService.js';

@extHostNamedCustomer(MainContext.MainThreadSecretState)
export class MainThreadSecretState extends Disposable implements MainThreadSecretStateShape {
	private readonly _proxy: ExtHostSecretStateShape;

	private readonly _sequencer = new SequencerByKey<string>();

	constructor(
		extHostContext: IExtHostContext,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@ILogService private readonly logService: ILogService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService
	) {
		super();

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostSecretState);

		this._register(this.secretStorageService.onDidChangeSecret((e: string) => {
			const parsedKey = this.parseKey(e);
			if (parsedKey) {
				this._proxy.$onDidChangePassword(parsedKey);
			}
		}));
	}

	$getPassword(extensionId: string, key: string): Promise<string | undefined> {
		this.logService.trace(`[mainThreadSecretState] Getting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doGetPassword(extensionId, key));
	}

	private async doGetPassword(extensionId: string, key: string): Promise<string | undefined> {
		const fullKey = this.getKey(extensionId, key);
		const password = await this.secretStorageService.get(fullKey);
		this.logService.trace(`[mainThreadSecretState] ${password ? 'P' : 'No p'}assword found for: `, extensionId, key);
		return password;
	}

	$setPassword(extensionId: string, key: string, value: string): Promise<void> {
		this.logService.trace(`[mainThreadSecretState] Setting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doSetPassword(extensionId, key, value));
	}

	private async doSetPassword(extensionId: string, key: string, value: string): Promise<void> {
		const fullKey = this.getKey(extensionId, key);
		await this.secretStorageService.set(fullKey, value);
		this.logService.trace('[mainThreadSecretState] Password set for: ', extensionId, key);
	}

	$deletePassword(extensionId: string, key: string): Promise<void> {
		this.logService.trace(`[mainThreadSecretState] Deleting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doDeletePassword(extensionId, key));
	}

	private async doDeletePassword(extensionId: string, key: string): Promise<void> {
		const fullKey = this.getKey(extensionId, key);
		await this.secretStorageService.delete(fullKey);
		this.logService.trace('[mainThreadSecretState] Password deleted for: ', extensionId, key);
	}

	$getKeys(extensionId: string): Promise<string[]> {
		this.logService.trace(`[mainThreadSecretState] Getting keys for ${extensionId} extension: `);
		return this._sequencer.queue(extensionId, () => this.doGetKeys(extensionId));
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 79: Error message without production error code - breaks React bundle size optimization
//   2. Line 79: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	private async doGetKeys(extensionId: string): Promise<string[]> {
		if (!this.secretStorageService.keys) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 91: Error message without production error code - breaks React bundle size optimization
//   2. Line 91: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Secret storage service does not support keys() method');
		}
		const allKeys = await this.secretStorageService.keys();
		const keys = allKeys
			.map(key => this.parseKey(key))
			.filter((parsedKey): parsedKey is { extensionId: string; key: string } => parsedKey !== undefined && parsedKey.extensionId === extensionId)
			.map(({ key }) => key); // Return only my keys
		this.logService.trace(`[mainThreadSecretState] Got ${keys.length}key(s) for: `, extensionId);
		return keys;
	}

	private getKey(extensionId: string, key: string): string {
		return JSON.stringify({ extensionId, key });
	}

	private parseKey(key: string): { extensionId: string; key: string } | undefined {
		try {
			return JSON.parse(key);
		} catch {
			return undefined;
		}
	}
}
