//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { isString } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ISaveProfileResult } from '../../services/userDataProfile/common/userDataProfile.js';
import type * as vscode from 'vscode';
import { ExtHostProfileContentHandlersShape, IMainContext, MainContext, MainThreadProfileContentHandlersShape } from './extHost.protocol.js';


export class ExtHostProfileContentHandlers implements ExtHostProfileContentHandlersShape {

	private readonly proxy: MainThreadProfileContentHandlersShape;

	private readonly handlers = new Map<string, vscode.ProfileContentHandler>();

	constructor(
		mainContext: IMainContext,
	) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadProfileContentHandlers);
	}

	registerProfileContentHandler(
		extension: IExtensionDescription,
		id: string,
		handler: vscode.ProfileContentHandler,
	): vscode.Disposable {
		checkProposedApiEnabled(extension, 'profileContentHandlers');
		if (this.handlers.has(id)) {
			throw new Error(`Handler with id '${id}' already registered`);
		}

		this.handlers.set(id, handler);
		this.proxy.$registerProfileContentHandler(id, handler.name, handler.description, extension.identifier.value);

		return toDisposable(() => {
			this.handlers.delete(id);
			this.proxy.$unregisterProfileContentHandler(id);
		});
	}

	async $saveProfile(id: string, name: string, content: string, token: CancellationToken): Promise<ISaveProfileResult | null> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 51: Error message without production error code - breaks React bundle size optimization
//   2. Line 51: Error message without production error code - breaks React bundle size optimization
//   3. Line 60: Error message without production error code - breaks React bundle size optimization
//   4. Line 60: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const handler = this.handlers.get(id);
		if (!handler) {
			throw new Error(`Unknown handler with id: ${id}`);
		}

		return handler.saveProfile(name, content, token);
	}

	async $readProfile(id: string, idOrUri: string | UriComponents, token: CancellationToken): Promise<string | null> {
		const handler = this.handlers.get(id);
		if (!handler) {
			throw new Error(`Unknown handler with id: ${id}`);
		}

		return handler.readProfile(isString(idOrUri) ? idOrUri : URI.revive(idOrUri), token);
	}
}
