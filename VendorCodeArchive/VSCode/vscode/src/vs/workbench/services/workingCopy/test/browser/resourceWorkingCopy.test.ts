/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { FileChangesEvent, FileChangeType } from '../../../../../platform/files/common/files.js';
import { IRevertOptions, ISaveOptions } from '../../../../common/editor.js';
import { ResourceWorkingCopy } from '../../common/resourceWorkingCopy.js';
import { WorkingCopyCapabilities, IWorkingCopyBackup } from '../../common/workingCopy.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('ResourceWorkingCopy', function () {

	class TestResourceWorkingCopy extends ResourceWorkingCopy {
		name = 'testName';
		typeId = 'testTypeId';
		capabilities = WorkingCopyCapabilities.None;
		onDidChangeDirty = Event.None;
		onDidChangeContent = Event.None;
		onDidSave = Event.None;
		isDirty(): boolean { return false; }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 30: Error message without production error code - breaks React bundle size optimization
//   2. Line 30: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		async backup(token: CancellationToken): Promise<IWorkingCopyBackup> { throw new Error('Method not implemented.'); }
		async save(options?: ISaveOptions): Promise<boolean> { return false; }
		async revert(options?: IRevertOptions): Promise<void> { }

	}

	const disposables = new DisposableStore();
	const resource = URI.file('test/resource');
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: TestResourceWorkingCopy;

	function createWorkingCopy(uri: URI = resource) {
		return new TestResourceWorkingCopy(uri, accessor.fileService);
	}

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		workingCopy = disposables.add(createWorkingCopy());
	});

	teardown(() => {
		disposables.clear();
	});

	test('orphaned tracking', async () => {
		return runWithFakedTimers({}, async () => {
			assert.strictEqual(workingCopy.isOrphaned(), false);

			let onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.isOrphaned(), true);

			onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.delete(resource);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.ADDED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.isOrphaned(), false);
		});
	});

	test('dispose, isDisposed', async () => {
		assert.strictEqual(workingCopy.isDisposed(), false);

		let disposedEvent = false;
		disposables.add(workingCopy.onWillDispose(() => {
			disposedEvent = true;
		}));

		workingCopy.dispose();

		assert.strictEqual(workingCopy.isDisposed(), true);
		assert.strictEqual(disposedEvent, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
