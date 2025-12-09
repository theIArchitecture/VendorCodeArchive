//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { UserDataProfilesManifestSynchroniser } from '../../common/userDataProfilesManifestSync.js';
import { ISyncData, ISyncUserDataProfile, IUserDataSyncStoreService, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('UserDataProfilesManifestSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: UserDataProfilesManifestSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.Profiles) as UserDataProfilesManifestSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when profiles does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 48: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 94: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when profile is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', '1');

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/collection`, headers: {} },
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
			]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.deepStrictEqual(JSON.parse(lastSyncUserData!.syncData!.content), [{ 'name': '1', 'id': '1', 'collection': '1' }]);
		});
	});

	test('first time sync - outgoing to server (no state)', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', '1');

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			assert.deepStrictEqual(JSON.parse(JSON.parse(content).content), [{ 'name': '1', 'id': '1', 'collection': '1' }]);
		});
	});

	test('first time sync - incoming from server (no state)', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }]);
		});
	});

	test('first time sync when profiles exists', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }, { id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('first time sync when storage exists - has conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }]);
		});
	});

	test('sync adding a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }, { id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('sync updating a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { name: 'name 2' });
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '1', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 2', collection: '1' }]);
		});
	});

	test('sync removing a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			testClient.instantiationService.get(IUserDataProfilesService).removeProfile(profile);
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('sync profile that uses default profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1', { useDefaultFlags: { keybindings: true } });
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);

			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	test('sync profile when the profile is updated to use default profile locally', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			const profile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === '1')!;
			testClient.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { useDefaultFlags: { keybindings: true } });

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	test('sync profile when the profile is updated to use default profile remotely', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			client2.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { useDefaultFlags: { keybindings: true } });
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);

			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	function parseRemoteProfiles(content: string): ISyncUserDataProfile[] {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	function getLocalProfiles(client: UserDataSyncClient): { id: string; name: string }[] {
		return client.instantiationService.get(IUserDataProfilesService).profiles
			.slice(1).sort((a, b) => a.name.localeCompare(b.name))
			.map(profile => ({ id: profile.id, name: profile.name, useDefaultFlags: profile.useDefaultFlags }));
	}


});
