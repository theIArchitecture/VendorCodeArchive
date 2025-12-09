//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileService } from '../../../files/common/files.js';
import { ILogService } from '../../../log/common/log.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { getTasksContentFromSyncContent, TasksSynchroniser } from '../../common/tasksSync.js';
import { Change, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('TasksSync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	let testObject: TasksSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Tasks) as TasksSynchroniser;
	});

	test('when tasks file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);
			assert.ok(!await fileService.exists(tasksResource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 64: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 76: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 120: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when tasks file does not exist and remote has changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await client2.instantiationService.get(IFileService).writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 92: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file exists locally and remote has no tasks', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('first time sync: when tasks file exists locally with same content as remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await client2.instantiationService.get(IFileService).writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file locally has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('when tasks file remotely has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely with same changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const previewContent = (await fileService.readFile(testObject.conflicts.conflicts[0].previewResource)).value.toString();
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
			assert.deepStrictEqual(testObject.conflicts.conflicts.length, 1);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].mergeState, MergeState.Conflict);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].localChange, Change.Modified);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].remoteChange, Change.Modified);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 577: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 577: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 666: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), previewContent);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept modified preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch 2'
				}]
			});
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 666: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 637: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 637: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept local', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1072: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file was removed in one client', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			await client2.sync();

			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			fileService2.del(tasksResource2);
			await client2.sync();

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 629: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 761: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1024: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1024: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1025: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(await fileService.exists(tasksResource), false);
		});
	});

	test('when tasks file is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			await fileService.createFile(tasksResource, VSBuffer.fromString(content));

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
			]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 673: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1106: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1107: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1107: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1249: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1251: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1251: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1394: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1395: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1395: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1538: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1539: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1539: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('apply remote when tasks file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			if (await fileService.exists(tasksResource)) {
				await fileService.del(tasksResource);
			}

			const preview = (await testObject.sync(await client.getLatestRef(SyncResource.Tasks), true))!;

			server.reset();
			const content = await testObject.resolveContent(preview.resourcePreviews[0].remoteResource);
			await testObject.accept(preview.resourcePreviews[0].remoteResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('sync profile tasks', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
			const expected = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			await client2.instantiationService.get(IFileService).createFile(profile.tasksResource, VSBuffer.fromString(expected));
			await client2.sync();

			await client.sync();

			const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
			const actual = (await client.instantiationService.get(IFileService).readFile(syncedProfile.tasksResource)).value.toString();
			assert.strictEqual(actual, expected);
		});
	});

});
