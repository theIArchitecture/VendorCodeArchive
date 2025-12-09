//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IReference } from '../../../base/common/lifecycle.js';
import { isFunction } from '../../../base/common/types.js';

export namespace GPULifecycle {
	export async function requestDevice(fallback?: (message: string) => void): Promise<IReference<GPUDevice>> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 13: Error message without production error code - breaks React bundle size optimization
//   2. Line 13: Error message without production error code - breaks React bundle size optimization
//   3. Line 17: Error message without production error code - breaks React bundle size optimization
//   4. Line 17: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		try {
			if (!navigator.gpu) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 27: Error message without production error code - breaks React bundle size optimization
//   2. Line 27: Error message without production error code - breaks React bundle size optimization
//   3. Line 31: Error message without production error code - breaks React bundle size optimization
//   4. Line 31: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('This browser does not support WebGPU');
			}
			const adapter = (await navigator.gpu.requestAdapter())!;
			if (!adapter) {
				throw new Error('This browser supports WebGPU but it appears to be disabled');
			}
			return wrapDestroyableInDisposable(await adapter.requestDevice());
		} catch (e) {
			if (fallback) {
				fallback(e.message);
			}
			throw e;
		}
	}

	export function createBuffer(device: GPUDevice, descriptor: GPUBufferDescriptor, initialValues?: Float32Array | (() => Float32Array)): IReference<GPUBuffer> {
		const buffer = device.createBuffer(descriptor);
		if (initialValues) {
			device.queue.writeBuffer(buffer, 0, (isFunction(initialValues) ? initialValues() : initialValues) as Float32Array<ArrayBuffer>);
		}
		return wrapDestroyableInDisposable(buffer);
	}

	export function createTexture(device: GPUDevice, descriptor: GPUTextureDescriptor): IReference<GPUTexture> {
		return wrapDestroyableInDisposable(device.createTexture(descriptor));
	}
}

function wrapDestroyableInDisposable<T extends { destroy(): void }>(value: T): IReference<T> {
	return {
		object: value,
		dispose: () => value.destroy()
	};
}
