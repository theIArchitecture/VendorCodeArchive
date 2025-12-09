//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, newWriteableBufferStream, VSBuffer, VSBufferReadableStream, VSBufferWriteableStream } from '../../../../base/common/buffer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { StoredValue } from './storedValue.js';
import { HydratedTestResult, ITestResult } from './testResult.js';
import { ISerializedTestResults } from './testTypes.js';

export const RETAIN_MAX_RESULTS = 128;
const RETAIN_MIN_RESULTS = 16;
const RETAIN_MAX_BYTES = 1024 * 128;
const CLEANUP_PROBABILITY = 0.2;

export interface ITestResultStorage {
	_serviceBrand: undefined;

	/**
	 * Retrieves the list of stored test results.
	 */
	read(): Promise<HydratedTestResult[]>;

	/**
	 * Persists the list of test results.
	 */
	persist(results: ReadonlyArray<ITestResult>): Promise<void>;
}

export const ITestResultStorage = createDecorator('ITestResultStorage');

/**
 * Data revision this version of VS Code deals with. Should be bumped whenever
 * a breaking change is made to the stored results, which will cause previous
 * revisions to be discarded.
 */
const currentRevision = 1;

export abstract class BaseTestResultStorage extends Disposable implements ITestResultStorage {
	declare readonly _serviceBrand: undefined;

	protected readonly stored: StoredValue<ReadonlyArray<{ rev: number; id: string; bytes: number }>>;

	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IStorageService storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.stored = this._register(new StoredValue<ReadonlyArray<{ rev: number; id: string; bytes: number }>>({
			key: 'storedTestResults',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE
		}, storageService));
	}

	/**
	 * @override
	 */
	public async read(): Promise<HydratedTestResult[]> {
		const results = await Promise.all(this.stored.get([]).map(async (rec) => {
			if (rec.rev !== currentRevision) {
				return undefined;
			}

			try {
				const contents = await this.readForResultId(rec.id);
				if (!contents) {
					return undefined;
				}

				return { rec, result: new HydratedTestResult(this.uriIdentityService, contents) };
			} catch (e) {
				this.logService.warn(`Error deserializing stored test result ${rec.id}`, e);
				return undefined;
			}
		}));

		const defined = results.filter(isDefined);
		if (defined.length !== results.length) {
			this.stored.store(defined.map(({ rec }) => rec));
		}

		return defined.map(({ result }) => result);
	}

	/**
	 * @override
	 */
	public getResultOutputWriter(resultId: string) {
		const stream = newWriteableBufferStream();
		this.storeOutputForResultId(resultId, stream);
		return stream;
	}

	/**
	 * @override
	 */
	public async persist(results: ReadonlyArray<ITestResult>): Promise<void> {
		const toDelete = new Map(this.stored.get([]).map(({ id, bytes }) => [id, bytes]));
		const toStore: { rev: number; id: string; bytes: number }[] = [];
		const todo: Promise<unknown>[] = [];
		let budget = RETAIN_MAX_BYTES;

		// Run until either:
		// 1. We store all results
		// 2. We store the max results
		// 3. We store the min results, and have no more byte budget
		for (
			let i = 0;
			i < results.length && i < RETAIN_MAX_RESULTS && (budget > 0 || toStore.length < RETAIN_MIN_RESULTS);
			i++
		) {
			const result = results[i];
			const existingBytes = toDelete.get(result.id);
			if (existingBytes !== undefined) {
				toDelete.delete(result.id);
				toStore.push({ id: result.id, rev: currentRevision, bytes: existingBytes });
				budget -= existingBytes;
				continue;
			}

			const obj = result.toJSON();
			if (!obj) {
				continue;
			}

			const contents = VSBuffer.fromString(JSON.stringify(obj));
			todo.push(this.storeForResultId(result.id, obj));
			toStore.push({ id: result.id, rev: currentRevision, bytes: contents.byteLength });
			budget -= contents.byteLength;
		}

		for (const id of toDelete.keys()) {
			todo.push(this.deleteForResultId(id).catch(() => undefined));
		}

		this.stored.store(toStore);
		await Promise.all(todo);
	}

	/**
	 * Reads serialized results for the test. Is allowed to throw.
	 */
	protected abstract readForResultId(id: string): Promise<ISerializedTestResults | undefined>;

	/**
	 * Reads output as a stream for the test.
	 */
	protected abstract readOutputForResultId(id: string): Promise<VSBufferReadableStream>;

	/**
	 * Reads an output range for the test.
	 */
	protected abstract readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer>;

	/**
	 * Deletes serialized results for the test.
	 */
	protected abstract deleteForResultId(id: string): Promise<unknown>;

	/**
	 * Stores test results by ID.
	 */
	protected abstract storeForResultId(id: string, data: ISerializedTestResults): Promise<unknown>;

	/**
	 * Reads serialized results for the test. Is allowed to throw.
	 */
	protected abstract storeOutputForResultId(id: string, input: VSBufferWriteableStream): Promise<void>;
}

export class InMemoryResultStorage extends BaseTestResultStorage {
	public readonly cache = new Map<string, ISerializedTestResults>();

	protected async readForResultId(id: string) {
		return Promise.resolve(this.cache.get(id));
	}

	protected storeForResultId(id: string, contents: ISerializedTestResults) {
		this.cache.set(id, contents);
		return Promise.resolve();
	}

	protected deleteForResultId(id: string) {
		this.cache.delete(id);
		return Promise.resolve();
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 201: Error message without production error code - breaks React bundle size optimization
//   2. Line 201: Error message without production error code - breaks React bundle size optimization
//   3. Line 205: Error message without production error code - breaks React bundle size optimization
//   4. Line 205: Error message without production error code - breaks React bundle size optimization
//   5. Line 209: Error message without production error code - breaks React bundle size optimization
//   6. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	protected readOutputForResultId(id: string): Promise<VSBufferReadableStream> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 217: Error message without production error code - breaks React bundle size optimization
//   2. Line 217: Error message without production error code - breaks React bundle size optimization
//   3. Line 221: Error message without production error code - breaks React bundle size optimization
//   4. Line 221: Error message without production error code - breaks React bundle size optimization
//   5. Line 225: Error message without production error code - breaks React bundle size optimization
//   6. Line 225: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 231: Error message without production error code - breaks React bundle size optimization
//   2. Line 231: Error message without production error code - breaks React bundle size optimization
//   3. Line 235: Error message without production error code - breaks React bundle size optimization
//   4. Line 235: Error message without production error code - breaks React bundle size optimization
//   5. Line 239: Error message without production error code - breaks React bundle size optimization
//   6. Line 239: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 245: Error message without production error code - breaks React bundle size optimization
//   2. Line 245: Error message without production error code - breaks React bundle size optimization
//   3. Line 249: Error message without production error code - breaks React bundle size optimization
//   4. Line 249: Error message without production error code - breaks React bundle size optimization
//   5. Line 253: Error message without production error code - breaks React bundle size optimization
//   6. Line 253: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 259: Error message without production error code - breaks React bundle size optimization
//   2. Line 259: Error message without production error code - breaks React bundle size optimization
//   3. Line 263: Error message without production error code - breaks React bundle size optimization
//   4. Line 263: Error message without production error code - breaks React bundle size optimization
//   5. Line 267: Error message without production error code - breaks React bundle size optimization
//   6. Line 267: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 273: Error message without production error code - breaks React bundle size optimization
//   2. Line 273: Error message without production error code - breaks React bundle size optimization
//   3. Line 277: Error message without production error code - breaks React bundle size optimization
//   4. Line 277: Error message without production error code - breaks React bundle size optimization
//   5. Line 281: Error message without production error code - breaks React bundle size optimization
//   6. Line 281: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 287: Error message without production error code - breaks React bundle size optimization
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 291: Error message without production error code - breaks React bundle size optimization
//   4. Line 291: Error message without production error code - breaks React bundle size optimization
//   5. Line 295: Error message without production error code - breaks React bundle size optimization
//   6. Line 295: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 301: Error message without production error code - breaks React bundle size optimization
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Error message without production error code - breaks React bundle size optimization
//   4. Line 305: Error message without production error code - breaks React bundle size optimization
//   5. Line 309: Error message without production error code - breaks React bundle size optimization
//   6. Line 309: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 315: Error message without production error code - breaks React bundle size optimization
//   2. Line 315: Error message without production error code - breaks React bundle size optimization
//   3. Line 319: Error message without production error code - breaks React bundle size optimization
//   4. Line 319: Error message without production error code - breaks React bundle size optimization
//   5. Line 323: Error message without production error code - breaks React bundle size optimization
//   6. Line 323: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 329: Error message without production error code - breaks React bundle size optimization
//   2. Line 329: Error message without production error code - breaks React bundle size optimization
//   3. Line 333: Error message without production error code - breaks React bundle size optimization
//   4. Line 333: Error message without production error code - breaks React bundle size optimization
//   5. Line 337: Error message without production error code - breaks React bundle size optimization
//   6. Line 337: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 343: Error message without production error code - breaks React bundle size optimization
//   2. Line 343: Error message without production error code - breaks React bundle size optimization
//   3. Line 347: Error message without production error code - breaks React bundle size optimization
//   4. Line 347: Error message without production error code - breaks React bundle size optimization
//   5. Line 351: Error message without production error code - breaks React bundle size optimization
//   6. Line 351: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 357: Error message without production error code - breaks React bundle size optimization
//   2. Line 357: Error message without production error code - breaks React bundle size optimization
//   3. Line 361: Error message without production error code - breaks React bundle size optimization
//   4. Line 361: Error message without production error code - breaks React bundle size optimization
//   5. Line 365: Error message without production error code - breaks React bundle size optimization
//   6. Line 365: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 371: Error message without production error code - breaks React bundle size optimization
//   2. Line 371: Error message without production error code - breaks React bundle size optimization
//   3. Line 375: Error message without production error code - breaks React bundle size optimization
//   4. Line 375: Error message without production error code - breaks React bundle size optimization
//   5. Line 379: Error message without production error code - breaks React bundle size optimization
//   6. Line 379: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 385: Error message without production error code - breaks React bundle size optimization
//   2. Line 385: Error message without production error code - breaks React bundle size optimization
//   3. Line 389: Error message without production error code - breaks React bundle size optimization
//   4. Line 389: Error message without production error code - breaks React bundle size optimization
//   5. Line 393: Error message without production error code - breaks React bundle size optimization
//   6. Line 393: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 399: Error message without production error code - breaks React bundle size optimization
//   2. Line 399: Error message without production error code - breaks React bundle size optimization
//   3. Line 403: Error message without production error code - breaks React bundle size optimization
//   4. Line 403: Error message without production error code - breaks React bundle size optimization
//   5. Line 407: Error message without production error code - breaks React bundle size optimization
//   6. Line 407: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 413: Error message without production error code - breaks React bundle size optimization
//   2. Line 413: Error message without production error code - breaks React bundle size optimization
//   3. Line 417: Error message without production error code - breaks React bundle size optimization
//   4. Line 417: Error message without production error code - breaks React bundle size optimization
//   5. Line 421: Error message without production error code - breaks React bundle size optimization
//   6. Line 421: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 427: Error message without production error code - breaks React bundle size optimization
//   2. Line 427: Error message without production error code - breaks React bundle size optimization
//   3. Line 431: Error message without production error code - breaks React bundle size optimization
//   4. Line 431: Error message without production error code - breaks React bundle size optimization
//   5. Line 435: Error message without production error code - breaks React bundle size optimization
//   6. Line 435: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 441: Error message without production error code - breaks React bundle size optimization
//   2. Line 441: Error message without production error code - breaks React bundle size optimization
//   3. Line 445: Error message without production error code - breaks React bundle size optimization
//   4. Line 445: Error message without production error code - breaks React bundle size optimization
//   5. Line 449: Error message without production error code - breaks React bundle size optimization
//   6. Line 449: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 455: Error message without production error code - breaks React bundle size optimization
//   2. Line 455: Error message without production error code - breaks React bundle size optimization
//   3. Line 459: Error message without production error code - breaks React bundle size optimization
//   4. Line 459: Error message without production error code - breaks React bundle size optimization
//   5. Line 463: Error message without production error code - breaks React bundle size optimization
//   6. Line 463: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 469: Error message without production error code - breaks React bundle size optimization
//   2. Line 469: Error message without production error code - breaks React bundle size optimization
//   3. Line 473: Error message without production error code - breaks React bundle size optimization
//   4. Line 473: Error message without production error code - breaks React bundle size optimization
//   5. Line 477: Error message without production error code - breaks React bundle size optimization
//   6. Line 477: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 483: Error message without production error code - breaks React bundle size optimization
//   2. Line 483: Error message without production error code - breaks React bundle size optimization
//   3. Line 487: Error message without production error code - breaks React bundle size optimization
//   4. Line 487: Error message without production error code - breaks React bundle size optimization
//   5. Line 491: Error message without production error code - breaks React bundle size optimization
//   6. Line 491: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}

	protected storeOutputForResultId(id: string, input: VSBufferWriteableStream): Promise<void> {
		throw new Error('Method not implemented.');
	}

	protected readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer> {
		throw new Error('Method not implemented.');
	}
}

export class TestResultStorage extends BaseTestResultStorage {
	private readonly directory: URI;

	constructor(
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
		@IWorkspaceContextService workspaceContext: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
	) {
		super(uriIdentityService, storageService, logService);
		this.directory = URI.joinPath(environmentService.workspaceStorageHome, workspaceContext.getWorkspace().id, 'testResults');
	}

	protected async readForResultId(id: string) {
		const contents = await this.fileService.readFile(this.getResultJsonPath(id));
		return JSON.parse(contents.value.toString());
	}

	protected storeForResultId(id: string, contents: ISerializedTestResults) {
		return this.fileService.writeFile(this.getResultJsonPath(id), VSBuffer.fromString(JSON.stringify(contents)));
	}

	protected deleteForResultId(id: string) {
		return this.fileService.del(this.getResultJsonPath(id)).catch(() => undefined);
	}

	protected async readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer> {
		try {
			const { value } = await this.fileService.readFile(this.getResultOutputPath(id), { position: offset, length });
			return value;
		} catch {
			return VSBuffer.alloc(0);
		}
	}


	protected async readOutputForResultId(id: string): Promise<VSBufferReadableStream> {
		try {
			const { value } = await this.fileService.readFileStream(this.getResultOutputPath(id));
			return value;
		} catch {
			return bufferToStream(VSBuffer.alloc(0));
		}
	}

	protected async storeOutputForResultId(id: string, input: VSBufferWriteableStream) {
		await this.fileService.createFile(this.getResultOutputPath(id), input);
	}

	/**
	 * @inheritdoc
	 */
	public override async persist(results: ReadonlyArray<ITestResult>) {
		await super.persist(results);
		if (Math.random() < CLEANUP_PROBABILITY) {
			await this.cleanupDereferenced();
		}
	}

	/**
	 * Cleans up orphaned files. For instance, output can get orphaned if it's
	 * written but the editor is closed before the test run is complete.
	 */
	private async cleanupDereferenced() {
		const { children } = await this.fileService.resolve(this.directory);
		if (!children) {
			return;
		}

		const stored = new Set(this.stored.get([]).filter(s => s.rev === currentRevision).map(s => s.id));

		await Promise.all(
			children
				.filter(child => !stored.has(child.name.replace(/\.[a-z]+$/, '')))
				.map(child => this.fileService.del(child.resource).catch(() => undefined))
		);
	}

	private getResultJsonPath(id: string) {
		return URI.joinPath(this.directory, `${id}.json`);
	}

	private getResultOutputPath(id: string) {
		return URI.joinPath(this.directory, `${id}.output`);
	}
}
