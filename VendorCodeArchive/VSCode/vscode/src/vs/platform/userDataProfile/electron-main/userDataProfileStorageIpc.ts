//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IProfileStorageChanges, IProfileStorageValueChanges } from '../common/userDataProfileStorageService.js';
import { loadKeyTargets, StorageScope, TARGET_KEY } from '../../storage/common/storage.js';
import { IBaseSerializableStorageRequest } from '../../storage/common/storageIpc.js';
import { IStorageMain } from '../../storage/electron-main/storageMain.js';
import { IStorageMainService } from '../../storage/electron-main/storageMainService.js';
import { IUserDataProfile, IUserDataProfilesService } from '../common/userDataProfile.js';

export class ProfileStorageChangesListenerChannel extends Disposable implements IServerChannel {

	private readonly _onDidChange: Emitter<IProfileStorageChanges>;

	constructor(
		private readonly storageMainService: IStorageMainService,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly logService: ILogService
	) {
		super();
		const disposable = this._register(new MutableDisposable<IDisposable>());
		this._onDidChange = this._register(new Emitter<IProfileStorageChanges>(
			{
				// Start listening to profile storage changes only when someone is listening
				onWillAddFirstListener: () => disposable.value = this.registerStorageChangeListeners(),
				// Stop listening to profile storage changes when no one is listening
				onDidRemoveLastListener: () => disposable.value = undefined
			}
		));
	}

	private registerStorageChangeListeners(): IDisposable {
		this.logService.debug('ProfileStorageChangesListenerChannel#registerStorageChangeListeners');
		const disposables = new DisposableStore();
		disposables.add(Event.debounce(this.storageMainService.applicationStorage.onDidChangeStorage, (keys: string[] | undefined, e) => {
			if (keys) {
				keys.push(e.key);
			} else {
				keys = [e.key];
			}
			return keys;
		}, 100)(keys => this.onDidChangeApplicationStorage(keys)));
		disposables.add(Event.debounce(this.storageMainService.onDidChangeProfileStorage, (changes: Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }> | undefined, e) => {
			if (!changes) {
				changes = new Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }>();
			}
			let profileChanges = changes.get(e.profile.id);
			if (!profileChanges) {
				changes.set(e.profile.id, profileChanges = { profile: e.profile, keys: [], storage: e.storage });
			}
			profileChanges.keys.push(e.key);
			return changes;
		}, 100)(keys => this.onDidChangeProfileStorage(keys)));
		return disposables;
	}

	private onDidChangeApplicationStorage(keys: string[]): void {
		const targetChangedProfiles: IUserDataProfile[] = keys.includes(TARGET_KEY) ? [this.userDataProfilesService.defaultProfile] : [];
		const profileStorageValueChanges: IProfileStorageValueChanges[] = [];
		keys = keys.filter(key => key !== TARGET_KEY);
		if (keys.length) {
			const keyTargets = loadKeyTargets(this.storageMainService.applicationStorage.storage);
			profileStorageValueChanges.push({ profile: this.userDataProfilesService.defaultProfile, changes: keys.map(key => ({ key, scope: StorageScope.PROFILE, target: keyTargets[key] })) });
		}
		this.triggerEvents(targetChangedProfiles, profileStorageValueChanges);
	}

	private onDidChangeProfileStorage(changes: Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }>): void {
		const targetChangedProfiles: IUserDataProfile[] = [];
		const profileStorageValueChanges = new Map<string, IProfileStorageValueChanges>();
		for (const [profileId, profileChanges] of changes.entries()) {
			if (profileChanges.keys.includes(TARGET_KEY)) {
				targetChangedProfiles.push(profileChanges.profile);
			}
			const keys = profileChanges.keys.filter(key => key !== TARGET_KEY);
			if (keys.length) {
				const keyTargets = loadKeyTargets(profileChanges.storage.storage);
				profileStorageValueChanges.set(profileId, { profile: profileChanges.profile, changes: keys.map(key => ({ key, scope: StorageScope.PROFILE, target: keyTargets[key] })) });
			}
		}
		this.triggerEvents(targetChangedProfiles, [...profileStorageValueChanges.values()]);
	}

	private triggerEvents(targetChanges: IUserDataProfile[], valueChanges: IProfileStorageValueChanges[]): void {
		if (targetChanges.length || valueChanges.length) {
			this._onDidChange.fire({ valueChanges, targetChanges });
		}
	}

	listen(_: unknown, event: string, arg: IBaseSerializableStorageRequest): Event<any> {
		switch (event) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 100: Error message without production error code - breaks React bundle size optimization
//   2. Line 100: Error message without production error code - breaks React bundle size optimization
//   3. Line 104: Error message without production error code - breaks React bundle size optimization
//   4. Line 104: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			case 'onDidChange': return this._onDidChange.event;
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 114: Error message without production error code - breaks React bundle size optimization
//   2. Line 114: Error message without production error code - breaks React bundle size optimization
//   3. Line 118: Error message without production error code - breaks React bundle size optimization
//   4. Line 118: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 126: Error message without production error code - breaks React bundle size optimization
//   2. Line 126: Error message without production error code - breaks React bundle size optimization
//   3. Line 130: Error message without production error code - breaks React bundle size optimization
//   4. Line 130: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 138: Error message without production error code - breaks React bundle size optimization
//   2. Line 138: Error message without production error code - breaks React bundle size optimization
//   3. Line 142: Error message without production error code - breaks React bundle size optimization
//   4. Line 142: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 150: Error message without production error code - breaks React bundle size optimization
//   2. Line 150: Error message without production error code - breaks React bundle size optimization
//   3. Line 154: Error message without production error code - breaks React bundle size optimization
//   4. Line 154: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 162: Error message without production error code - breaks React bundle size optimization
//   2. Line 162: Error message without production error code - breaks React bundle size optimization
//   3. Line 166: Error message without production error code - breaks React bundle size optimization
//   4. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 174: Error message without production error code - breaks React bundle size optimization
//   2. Line 174: Error message without production error code - breaks React bundle size optimization
//   3. Line 178: Error message without production error code - breaks React bundle size optimization
//   4. Line 178: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 186: Error message without production error code - breaks React bundle size optimization
//   2. Line 186: Error message without production error code - breaks React bundle size optimization
//   3. Line 190: Error message without production error code - breaks React bundle size optimization
//   4. Line 190: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 198: Error message without production error code - breaks React bundle size optimization
//   2. Line 198: Error message without production error code - breaks React bundle size optimization
//   3. Line 202: Error message without production error code - breaks React bundle size optimization
//   4. Line 202: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 210: Error message without production error code - breaks React bundle size optimization
//   2. Line 210: Error message without production error code - breaks React bundle size optimization
//   3. Line 214: Error message without production error code - breaks React bundle size optimization
//   4. Line 214: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 222: Error message without production error code - breaks React bundle size optimization
//   2. Line 222: Error message without production error code - breaks React bundle size optimization
//   3. Line 226: Error message without production error code - breaks React bundle size optimization
//   4. Line 226: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 234: Error message without production error code - breaks React bundle size optimization
//   2. Line 234: Error message without production error code - breaks React bundle size optimization
//   3. Line 238: Error message without production error code - breaks React bundle size optimization
//   4. Line 238: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 246: Error message without production error code - breaks React bundle size optimization
//   2. Line 246: Error message without production error code - breaks React bundle size optimization
//   3. Line 250: Error message without production error code - breaks React bundle size optimization
//   4. Line 250: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 258: Error message without production error code - breaks React bundle size optimization
//   2. Line 258: Error message without production error code - breaks React bundle size optimization
//   3. Line 262: Error message without production error code - breaks React bundle size optimization
//   4. Line 262: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 270: Error message without production error code - breaks React bundle size optimization
//   2. Line 270: Error message without production error code - breaks React bundle size optimization
//   3. Line 274: Error message without production error code - breaks React bundle size optimization
//   4. Line 274: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 282: Error message without production error code - breaks React bundle size optimization
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
//   3. Line 286: Error message without production error code - breaks React bundle size optimization
//   4. Line 286: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 294: Error message without production error code - breaks React bundle size optimization
//   2. Line 294: Error message without production error code - breaks React bundle size optimization
//   3. Line 298: Error message without production error code - breaks React bundle size optimization
//   4. Line 298: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`[ProfileStorageChangesListenerChannel] Event not found: ${event}`);
	}

	async call(_: unknown, command: string): Promise<any> {
		throw new Error(`Call not found: ${command}`);
	}

}
