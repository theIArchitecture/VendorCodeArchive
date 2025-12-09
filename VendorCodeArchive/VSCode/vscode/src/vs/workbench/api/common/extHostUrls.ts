//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { MainContext, ExtHostUrlsShape, MainThreadUrlsShape } from './extHost.protocol.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { ExtensionIdentifierSet, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';

export class ExtHostUrls implements ExtHostUrlsShape {

	declare _serviceBrand: undefined;

	private static HandlePool = 0;
	private readonly _proxy: MainThreadUrlsShape;

	private handles = new ExtensionIdentifierSet();
	private handlers = new Map<number, vscode.UriHandler>();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadUrls);
	}

	registerUriHandler(extension: IExtensionDescription, handler: vscode.UriHandler): vscode.Disposable {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 34: Error message without production error code - breaks React bundle size optimization
//   2. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const extensionId = extension.identifier;
		if (this.handles.has(extensionId)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 46: Error message without production error code - breaks React bundle size optimization
//   2. Line 46: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Protocol handler already registered for extension ${extensionId}`);
		}

		const handle = ExtHostUrls.HandlePool++;
		this.handles.add(extensionId);
		this.handlers.set(handle, handler);
		this._proxy.$registerUriHandler(handle, extensionId, extension.displayName || extension.name);

		return toDisposable(() => {
			this.handles.delete(extensionId);
			this.handlers.delete(handle);
			this._proxy.$unregisterUriHandler(handle);
		});
	}

	$handleExternalUri(handle: number, uri: UriComponents): Promise<void> {
		const handler = this.handlers.get(handle);

		if (!handler) {
			return Promise.resolve(undefined);
		}
		try {
			handler.handleUri(URI.revive(uri));
		} catch (err) {
			onUnexpectedError(err);
		}

		return Promise.resolve(undefined);
	}

	async createAppUri(uri: URI): Promise<vscode.Uri> {
		return URI.revive(await this._proxy.$createAppUri(uri));
	}
}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding


export interface IExtHostUrlsService extends ExtHostUrls { }
export const IExtHostUrlsService = createDecorator<IExtHostUrlsService>('IExtHostUrlsService');
