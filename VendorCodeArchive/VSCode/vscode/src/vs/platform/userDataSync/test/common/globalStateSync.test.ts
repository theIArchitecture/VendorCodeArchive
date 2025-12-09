//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../storage/common/storage.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { GlobalStateSynchroniser } from '../../common/globalStateSync.js';
import { IGlobalState, ISyncData, IUserDataSyncStoreService, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { IUserDataProfileStorageService } from '../../../userDataProfile/common/userDataProfileStorageService.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';


suite('GlobalStateSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: GlobalStateSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.GlobalState) as GlobalStateSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when global state does not exist', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 54: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 55: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 68: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 90: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	}));

	test('when global state is created after first sync', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		updateUserStorage('a', 'value1', testClient);

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.deepStrictEqual(JSON.parse(lastSyncUserData!.syncData!.content).storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('first time sync - outgoing to server (no state)', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		updateMachineStorage('b', 'value1', testClient);
		await updateLocale(testClient);

		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'globalState.argv.locale': { version: 1, value: 'en' }, 'a': { version: 1, value: 'value1' } });
	}));

	test('first time sync - incoming from server (no state)', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await updateLocale(client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(await readLocale(testClient), 'en');
	}));

	test('first time sync when storage exists', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await client2.sync();

		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' }, 'b': { version: 1, value: 'value2' } });
	}));

	test('first time sync when storage exists - has conflicts', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await client2.sync();

		updateUserStorage('a', 'value2', client2);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('sync adding a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' }, 'b': { version: 1, value: 'value2' } });
	}));

	test('sync updating a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		updateUserStorage('a', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value2' } });
	}));

	test('sync removing a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		removeStorage('b', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), undefined);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('sync profile state', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updateLocale(client2);
		await updateUserStorageForProfile('a', 'value1', profile, testClient);
		await client2.sync();

		await testClient.sync();

		const syncedProfile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const profileStorage = await testClient.instantiationService.get(IUserDataProfileStorageService).readStorageData(syncedProfile);
		assert.strictEqual(profileStorage.get('a')?.value, 'value1');
		assert.strictEqual(await readLocale(testClient), 'en');

		const { content } = await testClient.read(testObject.resource, '1');
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	function parseGlobalState(content: string): IGlobalState {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	async function updateLocale(client: UserDataSyncClient): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'en' })));
	}

	function updateUserStorage(key: string, value: string, client: UserDataSyncClient, profile?: IUserDataProfile): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.store(key, value, StorageScope.PROFILE, StorageTarget.USER);
	}

	async function updateUserStorageForProfile(key: string, value: string, profile: IUserDataProfile, client: UserDataSyncClient): Promise<void> {
		const storageService = client.instantiationService.get(IUserDataProfileStorageService);
		const data = new Map<string, string>();
		data.set(key, value);
		await storageService.updateStorageData(profile, data, StorageTarget.USER);
	}

	function updateMachineStorage(key: string, value: string, client: UserDataSyncClient): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.store(key, value, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	function removeStorage(key: string, client: UserDataSyncClient): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.remove(key, StorageScope.PROFILE);
	}

	function readStorage(key: string, client: UserDataSyncClient): string | undefined {
		const storageService = client.instantiationService.get(IStorageService);
		return storageService.get(key, StorageScope.PROFILE);
	}

	async function readLocale(client: UserDataSyncClient): Promise<string | undefined> {
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const content = await fileService.readFile(environmentService.argvResource);
		return JSON.parse(content.value.toString()).locale;
	}

});
