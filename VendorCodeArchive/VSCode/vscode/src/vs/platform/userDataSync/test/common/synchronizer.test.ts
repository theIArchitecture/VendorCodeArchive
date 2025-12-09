//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Barrier } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isEqual, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileService } from '../../../files/common/files.js';
import { IStorageService, StorageScope } from '../../../storage/common/storage.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { AbstractSynchroniser, IAcceptResult, IMergeResult, IResourcePreview, SyncStrategy } from '../../common/abstractSynchronizer.js';
import { Change, IRemoteUserData, IResourcePreview as IBaseResourcePreview, IUserDataSyncConfiguration, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus, USER_DATA_SYNC_SCHEME, IUserData } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

interface ITestResourcePreview extends IResourcePreview {
	ref: string;
}

class TestSynchroniser extends AbstractSynchroniser {

	syncBarrier: Barrier = new Barrier();
	syncResult: { hasConflicts: boolean; hasError: boolean } = { hasConflicts: false, hasError: false };
	onDoSyncCall: Emitter<void> = this._register(new Emitter<void>());
	failWhenGettingLatestRemoteUserData: boolean = false;

	protected readonly version: number = 1;

	private cancelled: boolean = false;
	readonly localResource = joinPath(this.environmentService.userRoamingDataHome, 'testResource.json');

	getMachineId(): Promise<string> { return this.currentMachineIdPromise; }
	getLastSyncResource(): URI { return this.lastSyncResource; }

	protected override getLatestRemoteUserData(refOrLatestData: string | IUserData | null, lastSyncUserData: IRemoteUserData | null): Promise<IRemoteUserData> {
		if (this.failWhenGettingLatestRemoteUserData) {
			throw new Error();
		}
		return super.getLatestRemoteUserData(refOrLatestData, lastSyncUserData);
	}

	protected override async doSync(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, strategy: SyncStrategy, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<SyncStatus> {
		this.cancelled = false;
		this.onDoSyncCall.fire();
		await this.syncBarrier.wait();

		if (this.cancelled) {
			return SyncStatus.Idle;
		}

		return super.doSync(remoteUserData, lastSyncUserData, strategy, userDataSyncConfiguration);
	}

	protected override async generateSyncPreview(remoteUserData: IRemoteUserData): Promise<ITestResourcePreview[]> {
		if (this.syncResult.hasError) {
			throw new Error('failed');
		}

		let fileContent = null;
		try {
			fileContent = await this.fileService.readFile(this.localResource);
		} catch (error) { }

		return [{
			baseResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' })),
			baseContent: null,
			localResource: this.localResource,
			localContent: fileContent ? fileContent.value.toString() : null,
			remoteResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' })),
			remoteContent: remoteUserData.syncData ? remoteUserData.syncData.content : null,
			previewResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'preview' })),
			ref: remoteUserData.ref,
			localChange: Change.Modified,
			remoteChange: Change.Modified,
			acceptedResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })),
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		return true;
	}

	protected async getMergeResult(resourcePreview: ITestResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return {
			content: resourcePreview.ref,
			localChange: Change.Modified,
			remoteChange: Change.Modified,
			hasConflicts: this.syncResult.hasConflicts,
		};
	}

	protected async getAcceptResult(resourcePreview: ITestResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		if (isEqual(resource, resourcePreview.localResource)) {
			return {
				content: resourcePreview.localContent,
				localChange: Change.None,
				remoteChange: resourcePreview.localContent === null ? Change.Deleted : Change.Modified,
			};
		}

		if (isEqual(resource, resourcePreview.remoteResource)) {
			return {
				content: resourcePreview.remoteContent,
				localChange: resourcePreview.remoteContent === null ? Change.Deleted : Change.Modified,
				remoteChange: Change.None,
			};
		}

		if (isEqual(resource, resourcePreview.previewResource)) {
			if (content === undefined) {
				return {
					content: resourcePreview.ref,
					localChange: Change.Modified,
					remoteChange: Change.Modified,
				};
			} else {
				return {
					content,
					localChange: content === null ? resourcePreview.localContent !== null ? Change.Deleted : Change.None : Change.Modified,
					remoteChange: content === null ? resourcePreview.remoteContent !== null ? Change.Deleted : Change.None : Change.Modified,
				};
			}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 132: Error message without production error code - breaks React bundle size optimization
//   2. Line 132: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 144: Error message without production error code - breaks React bundle size optimization
//   2. Line 144: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		if (resourcePreviews[0][1].localChange === Change.Deleted) {
			await this.fileService.del(this.localResource);
		}

		if (resourcePreviews[0][1].localChange === Change.Added || resourcePreviews[0][1].localChange === Change.Modified) {
			await this.fileService.writeFile(this.localResource, VSBuffer.fromString(resourcePreviews[0][1].content!));
		}

		if (resourcePreviews[0][1].remoteChange === Change.Deleted) {
			await this.applyRef(null, remoteUserData.ref);
		}

		if (resourcePreviews[0][1].remoteChange === Change.Added || resourcePreviews[0][1].remoteChange === Change.Modified) {
			await this.applyRef(resourcePreviews[0][1].content, remoteUserData.ref);
		}
	}

	async applyRef(content: string | null, ref: string): Promise<void> {
		const remoteUserData = await this.updateRemoteUserData(content === null ? '' : content, ref);
		await this.updateLastSyncUserData(remoteUserData);
	}

	override async stop(): Promise<void> {
		this.cancelled = true;
		this.syncBarrier.open();
		super.stop();
	}

	testTriggerLocalChange(): void {
		this.triggerLocalChange();
	}

	onDidTriggerLocalChangeCall: Emitter<void> = this._register(new Emitter<void>());
	protected override async doTriggerLocalChange(): Promise<void> {
		await super.doTriggerLocalChange();
		this.onDidTriggerLocalChangeCall.fire();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 174: Error message without production error code - breaks React bundle size optimization
//   2. Line 174: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 196: Error message without production error code - breaks React bundle size optimization
//   2. Line 196: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	hasLocalData(): Promise<boolean> { throw new Error('not implemented'); }
	async resolveContent(uri: URI): Promise<string | null> { return null; }
}

suite('TestSynchronizer - Auto Sync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('status is syncing', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));

			const promise = Event.toPromise(testObject.onDoSyncCall.event);

			testObject.sync(await client.getLatestRef(testObject.resource));
			await promise;

			assert.deepStrictEqual(actual, [SyncStatus.Syncing]);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);

			testObject.stop();
		});
	});

	test('status is set correctly when sync is finished', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, [SyncStatus.Syncing, SyncStatus.Idle]);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
		});
	});

	test('status is set correctly when sync has errors', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasError: true, hasConflicts: false };
			testObject.syncBarrier.open();

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));

			try {
				await testObject.sync(await client.getLatestRef(testObject.resource));
				assert.fail('Should fail');
			} catch (e) {
				assert.deepStrictEqual(actual, [SyncStatus.Syncing, SyncStatus.Idle]);
				assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			}
		});
	});

	test('status is set to hasConflicts when asked to sync if there are conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
			assertConflicts(testObject.conflicts.conflicts, [testObject.localResource]);
		});
	});

	test('sync should not run if syncing already', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			const promise = Event.toPromise(testObject.onDoSyncCall.event);

			testObject.sync(await client.getLatestRef(testObject.resource));
			await promise;

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, []);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);

			await testObject.stop();
		});
	});

	test('sync should not run if there are conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, []);
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
		});
	});

	test('accept preview during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const fileService = client.instantiationService.get(IFileService);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, (await fileService.readFile(testObject.localResource)).value.toString());
		});
	});

	test('accept remote during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const currentRemoteContent = (await testObject.getRemoteUserData(null)).syncData?.content;
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, currentRemoteContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), currentRemoteContent);
		});
	});

	test('accept local during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, newLocalContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), newLocalContent);
		});
	});

	test('accept new content during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			const mergeContent = 'newContent';
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, mergeContent);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, mergeContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), mergeContent);
		});
	});

	test('accept delete during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, null);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, '');
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('accept deleted local during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			await fileService.del(testObject.localResource);

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, '');
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('accept deleted remote during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			const fileService = client.instantiationService.get(IFileService);
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString('some content'));
			testObject.syncResult = { hasConflicts: true, hasError: false };

			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData, null);
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('request latest data on precondition failure', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			// Sync once
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			testObject.syncBarrier = new Barrier();

			// update remote data before syncing so that 412 is thrown by server
			const disposable = testObject.onDoSyncCall.event(async () => {
				disposable.dispose();
				await testObject.applyRef(ref, ref!);
				server.reset();
				testObject.syncBarrier.open();
			});

			// Start sycing
			const ref = await client.getLatestRef(testObject.resource);
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': ref } },
				{ type: 'GET', url: `${server.url}/v1/resource/${testObject.resource}/latest`, headers: {} },
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': `${parseInt(ref!) + 1}` } },
			]);
		});
	});

	test('no requests are made to server when local change is triggered', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			server.reset();
			const promise = Event.toPromise(testObject.onDidTriggerLocalChangeCall.event);
			testObject.testTriggerLocalChange();

			await promise;
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('status is reset when getting latest remote data fails', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.failWhenGettingLatestRemoteUserData = true;

			try {
				await testObject.sync(await client.getLatestRef(testObject.resource));
				assert.fail('Should throw an error');
			} catch (error) {
			}

			assert.strictEqual(testObject.status, SyncStatus.Idle);
		});
	});
});

suite('TestSynchronizer - Manual Sync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preview -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 601: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 649: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 653: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 693: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 715: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 726: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 770: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 774: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 814: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 828: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 840: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preview -> merge -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const ref = await client.getLatestRef(testObject.resource);
			let preview = await testObject.sync(ref, true);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('preview -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const ref = await client.getLatestRef(testObject.resource);
			let preview = await testObject.sync(ref, true);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('preivew -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 672: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 676: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 727: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 728: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 746: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 900: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 922: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 948: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 988: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 991: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1010: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1035: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1054: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1057: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1058: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1098: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1101: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1120: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1124: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1145: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1164: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1167: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1168: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 627: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 700: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 871: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 900: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 901: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 938: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1002: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1003: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1037: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1040: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1041: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1070: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1074: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1075: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1108: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1109: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1139: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1176: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1177: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1275: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1308: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1309: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1343: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1377: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1411: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1414: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1444: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1445: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1448: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1449: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1478: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1479: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1482: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1483: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> accept -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 644: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 645: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 649: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 735: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 736: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 809: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 948: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 949: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 995: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 997: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1000: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1001: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1047: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1048: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1089: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1090: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1095: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1232: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1282: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1324: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1329: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1330: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1371: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1372: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1373: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1376: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1377: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1418: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1419: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1424: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1465: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1467: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1470: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1471: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1514: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1517: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1518: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1559: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1560: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1561: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1564: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1565: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1607: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1608: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1611: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1653: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1654: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1655: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1658: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1659: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1700: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1701: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1702: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1705: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1748: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1749: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1752: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1794: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1795: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1796: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1799: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1800: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> accept -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 666: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 761: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 912: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 971: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1026: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1089: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1090: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1145: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1148: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1149: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1203: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1204: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1321: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1322: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1385: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1443: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1499: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1558: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1561: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1562: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1620: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1621: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1675: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1676: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1735: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1739: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1794: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1798: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1852: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1853: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1856: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1857: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1911: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1912: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1915: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1916: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1970: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1971: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2029: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2030: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2033: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2034: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2088: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2089: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2092: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2093: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 683: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 890: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 960: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1100: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1101: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1172: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1450: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1451: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1452: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1520: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1522: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1590: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1591: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1592: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1660: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1661: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1662: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1730: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1731: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1800: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1870: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1871: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1872: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1940: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1941: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1942: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2010: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2011: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2012: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2080: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2081: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2082: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2220: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2221: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2222: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2292: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2360: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2361: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2362: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('conflicts: preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1016: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1096: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1097: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1098: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1177: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1178: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1340: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1341: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1582: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1583: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1663: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1664: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1744: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1745: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1746: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1825: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1826: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1827: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1907: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1908: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1987: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1988: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1989: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2068: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2069: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2070: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2150: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2232: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2312: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2313: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2392: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2393: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2394: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2473: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2474: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2475: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2554: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2555: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2556: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2635: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2636: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2637: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Conflict);
			assertConflicts(testObject.conflicts.conflicts, [preview!.resourcePreviews[0].localResource]);
		});
	});

	test('conflicts: preview -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 716: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1065: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1248: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1249: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1340: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1341: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1429: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1432: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1433: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1521: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1705: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1708: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1709: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1800: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1889: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1984: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1985: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2076: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2077: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2165: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2168: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2169: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2257: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2349: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2441: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2444: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2445: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2533: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2536: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2537: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2625: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2628: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2629: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2717: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2720: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2721: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2809: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2812: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2813: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2904: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2905: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 736: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 874: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1011: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1213: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1217: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1317: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1419: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1625: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1626: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1629: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1728: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1832: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1835: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1938: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2037: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2038: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2041: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2141: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2449: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2450: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2453: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2552: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2553: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2556: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2655: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2656: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2659: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2758: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2759: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2762: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2861: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2862: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2865: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2964: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2965: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2968: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3067: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3068: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3071: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3170: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3171: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const content = await testObject.resolveContent(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, content);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept 2', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1046: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1049: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1160: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1274: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1391: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1505: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1615: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1619: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1843: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1844: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1957: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1958: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1961: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2072: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2075: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2186: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2189: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2299: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2300: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2303: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2414: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2417: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2527: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2528: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2531: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2641: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2642: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2645: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2755: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2756: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2759: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2869: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2870: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2873: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2983: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2984: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2987: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3097: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3098: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3101: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3211: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3215: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3326: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3329: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3443: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const content = await testObject.resolveContent(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, content);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			const ref = await client.getLatestRef(testObject.resource);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			let preview = await testObject.sync(ref, true);

			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('conflicts: preivew -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1488: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1491: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1492: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1741: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1742: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1863: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1988: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1991: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1992: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2363: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2488: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2491: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2492: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2617: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2741: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2742: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2863: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2988: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2991: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2992: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3241: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3363: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3488: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3491: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3492: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3617: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3741: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3742: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 986: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 991: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1427: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1428: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1432: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1564: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1565: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1568: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1569: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1701: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1702: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1705: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1838: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1842: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1979: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1980: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2112: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2113: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2116: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2117: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2249: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2386: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2387: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2390: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2391: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2527: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2528: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2660: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2661: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2664: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2665: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2797: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2798: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2801: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2802: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2938: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2939: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3072: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3075: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3076: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3212: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3213: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3345: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3346: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3349: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3482: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3483: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3486: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3619: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3620: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3623: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3624: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3756: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3757: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3760: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3761: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3893: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3894: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3897: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3898: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4030: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4031: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4034: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4035: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> accept -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1016: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1018: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1021: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1022: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1198: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1351: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1352: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1496: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1497: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1498: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1646: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1647: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1648: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1651: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1652: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1796: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1798: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1946: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1947: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1948: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1951: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1952: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2096: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2097: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2098: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2101: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2247: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2248: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2251: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2252: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2396: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2397: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2398: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2401: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2402: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2546: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2547: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2548: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2551: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2552: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2696: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2698: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2701: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2702: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2846: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2847: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2848: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2851: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2852: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2996: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2997: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2998: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3001: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3002: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3146: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3147: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3148: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3151: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3296: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3297: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3298: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3301: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3447: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3448: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3451: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3452: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3596: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3597: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3598: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3601: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3602: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3746: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3747: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3748: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3751: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3752: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 3896: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3897: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3898: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3901: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 3902: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 4046: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4047: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4048: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4051: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 4052: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 4196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4198: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4201: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 4202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 4346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4351: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 4352: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> accept -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1046: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1047: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1400: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1401: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1404: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1405: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1562: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1563: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1566: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1567: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1724: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1725: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1728: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1886: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1887: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1890: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1891: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2048: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2049: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2052: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2053: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2210: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2211: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2215: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2372: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2373: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2376: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2377: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2535: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2538: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2539: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2696: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2700: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2701: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2858: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2859: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2862: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3020: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3021: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3024: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3025: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3186: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3344: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3349: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3506: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3507: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3510: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3511: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3668: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3669: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3672: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3673: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3830: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3831: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3834: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3835: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3992: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3993: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3996: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3997: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4158: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4159: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4316: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4317: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4320: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4321: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4478: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4479: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4482: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4483: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4640: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4641: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4644: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4645: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1075: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('conflicts: preivew -> accept -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 880: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1107: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1108: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1109: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1321: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1322: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1493: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1666: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1668: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1839: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1840: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1841: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2012: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2013: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2014: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2186: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2358: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2359: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2360: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2531: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2532: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2704: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2705: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2706: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2877: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2878: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2879: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3050: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3051: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3052: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3223: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3224: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3225: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3396: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3397: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3569: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3570: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3571: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3742: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3743: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3744: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 3915: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3916: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3917: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4088: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4089: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4090: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4261: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4262: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4263: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4434: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4435: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4436: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4607: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4608: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4609: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4780: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4781: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4782: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 4953: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4954: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4955: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('remote is accepted if last sync state does not exists in server', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp();
			const synchronizer2: TestSynchroniser = disposableStore.add(client2.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client2.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			synchronizer2.syncBarrier.open();
			const ref = await client2.getLatestRef(testObject.resource);
			await synchronizer2.sync(ref);

			await fileService.del(testObject.getLastSyncResource());
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

});

suite('TestSynchronizer - Last Sync Data', () => {
	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('last sync data is null when not synced before', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));

			const actual = await testObject.getLastSyncUserData();

			assert.strictEqual(actual, null);
		});
	});

	test('last sync data is set after sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(JSON.parse((await fileService.readFile(testObject.getLastSyncResource())).value.toString()), { ref: '1', syncData: { version: 1, machineId, content: '0' } });
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
		});
	});

	test('last sync data is read from server after sync if last sync resource is deleted', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.del(testObject.getLastSyncResource());
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
		});
	});

	test('last sync data is read from server after sync and sync data is invalid', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				version: 1,
				content: JSON.stringify({
					content: '0',
					machineId,
					version: 1
				}),
				additionalData: {
					foo: 'bar'
				}
			})));
			server.reset();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
			assert.deepStrictEqual(server.requests, [{ headers: {}, type: 'GET', url: 'http://host:3000/v1/resource/settings/1' }]);
		});
	});

	test('last sync data is read from server after sync and stored sync data is tampered', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '2',
				syncData: {
					content: '0',
					machineId,
					version: 1
				}
			})));
			server.reset();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				}
			});
			assert.deepStrictEqual(server.requests, [{ headers: {}, type: 'GET', url: 'http://host:3000/v1/resource/settings/1' }]);
		});
	});

	test('reading last sync data: no requests are made to server when sync data is invalid', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				version: 1,
				content: JSON.stringify({
					content: '0',
					machineId,
					version: 1
				}),
				additionalData: {
					foo: 'bar'
				}
			})));
			await testObject.getLastSyncUserData();
			server.reset();

			await testObject.getLastSyncUserData();
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('reading last sync data: no requests are made to server when sync data is null', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			server.reset();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				syncData: null,
			})));
			await testObject.getLastSyncUserData();

			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('last sync data is null after sync if last sync state is deleted', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			storageService.remove('settings.lastSyncUserData', StorageScope.APPLICATION);
			const actual = await testObject.getLastSyncUserData();

			assert.strictEqual(actual, null);
		});
	});

	test('last sync data is null after sync if last sync content is deleted everywhere', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const userDataSyncStoreService = client.instantiationService.get(IUserDataSyncStoreService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			await fileService.del(testObject.getLastSyncResource());
			await userDataSyncStoreService.deleteResource(testObject.syncResource.syncResource, null);
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.strictEqual(actual, null);
		});
	});

});

function assertConflicts(actual: IBaseResourcePreview[], expected: URI[]) {
	assert.deepStrictEqual(actual.map(({ localResource }) => localResource.toString()), expected.map(uri => uri.toString()));
}

function assertPreviews(actual: IBaseResourcePreview[], expected: URI[]) {
	assert.deepStrictEqual(actual.map(({ localResource }) => localResource.toString()), expected.map(uri => uri.toString()));
}
