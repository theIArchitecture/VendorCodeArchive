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
import { getMcpContentFromSyncContent, McpSynchroniser } from '../../common/mcpSync.js';
import { Change, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('McpSync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	let testObject: McpSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Mcp) as McpSynchroniser;
	});

	test('when mcp file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);
			assert.ok(!await fileService.exists(mcpResource));

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

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when mcp file does not exist and remote has changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await client2.instantiationService.get(IFileService).writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file exists locally and remote has no mcp', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('first time sync: when mcp file exists locally with same content as remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await client2.instantiationService.get(IFileService).writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file locally has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('when mcp file remotely has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely with same changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			const content = JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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
//   1. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), previewContent);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept modified preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					},
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 469: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 568: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 666: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 666: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
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

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept local', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			const content = JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 952: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1072: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1072: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1073: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file was removed in one client', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			await client2.sync();

			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			fileService2.del(mcpResource2);
			await client2.sync();

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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

			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(await fileService.exists(mcpResource), false);
		});
	});

	test('when mcp file is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			await fileService.createFile(mcpResource, VSBuffer.fromString(content));

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await client.getLatestRef(SyncResource.Mcp);
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

			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('apply remote when mcp file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			if (await fileService.exists(mcpResource)) {
				await fileService.del(mcpResource);
			}

			const preview = (await testObject.sync(await client.getLatestRef(SyncResource.Mcp), true))!;

			server.reset();
			const content = await testObject.resolveContent(preview.resourcePreviews[0].remoteResource);
			await testObject.accept(preview.resourcePreviews[0].remoteResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('sync profile mcp', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
			const expected = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			await client2.instantiationService.get(IFileService).createFile(profile.mcpResource, VSBuffer.fromString(expected));
			await client2.sync();

			await client.sync();

			const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
			const actual = (await client.instantiationService.get(IFileService).readFile(syncedProfile.mcpResource)).value.toString();
			assert.strictEqual(actual, expected);
		});
	});

});
