//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, VSBuffer } from '../../../common/buffer.js';
import { CancellationToken } from '../../../common/cancellation.js';
import { canceled } from '../../../common/errors.js';
import { IHeaders, IRequestContext, IRequestOptions, OfflineError } from './request.js';

export async function request(options: IRequestOptions, token: CancellationToken, isOnline?: () => boolean): Promise<IRequestContext> {
	if (token.isCancellationRequested) {
		throw canceled();
	}

	const cancellation = new AbortController();
	const disposable = token.onCancellationRequested(() => cancellation.abort());
	const signal = options.timeout ? AbortSignal.any([
		cancellation.signal,
		AbortSignal.timeout(options.timeout),
	]) : cancellation.signal;

	try {
		const fetchInit: RequestInit = {
			method: options.type || 'GET',
			headers: getRequestHeaders(options),
			body: options.data,
			signal
		};
		if (options.disableCache) {
			fetchInit.cache = 'no-store';
		}
		const res = await fetch(options.url || '', fetchInit);
		return {
			res: {
				statusCode: res.status,
				headers: getResponseHeaders(res),
			},
			stream: bufferToStream(VSBuffer.wrap(new Uint8Array(await res.arrayBuffer()))),
		};
	} catch (err) {
		if (isOnline && !isOnline()) {
			throw new OfflineError();
		}
		if (err?.name === 'AbortError') {
			throw canceled();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 49: Error message without production error code - breaks React bundle size optimization
//   2. Line 49: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}
		if (err?.name === 'TimeoutError') {
			throw new Error(`Fetch timeout: ${options.timeout}ms`);
		}
		throw err;
	} finally {
		disposable.dispose();
	}
}

function getRequestHeaders(options: IRequestOptions) {
	if (options.headers || options.user || options.password || options.proxyAuthorization) {
		const headers = new Headers();
		outer: for (const k in options.headers) {
			switch (k.toLowerCase()) {
				case 'user-agent':
				case 'accept-encoding':
				case 'content-length':
					// unsafe headers
					continue outer;
			}
			const header = options.headers[k];
			if (typeof header === 'string') {
				headers.set(k, header);
			} else if (Array.isArray(header)) {
				for (const h of header) {
					headers.append(k, h);
				}
			}
		}
		if (options.user || options.password) {
			headers.set('Authorization', 'Basic ' + btoa(`${options.user || ''}:${options.password || ''}`));
		}
		if (options.proxyAuthorization) {
			headers.set('Proxy-Authorization', options.proxyAuthorization);
		}
		return headers;
	}
	return undefined;
}

function getResponseHeaders(res: Response): IHeaders {
	const headers: IHeaders = Object.create(null);
	res.headers.forEach((value, key) => {
		if (headers[key]) {
			if (Array.isArray(headers[key])) {
				headers[key].push(value);
			} else {
				headers[key] = [headers[key], value];
			}
		} else {
			headers[key] = value;
		}
	});
	return headers;
}
