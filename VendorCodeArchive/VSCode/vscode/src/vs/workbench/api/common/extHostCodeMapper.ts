/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ICodeMapperResult } from '../../contrib/chat/common/chatCodeMapperService.js';
import * as extHostProtocol from './extHost.protocol.js';
import { NotebookEdit, TextEdit } from './extHostTypeConverters.js';
import { URI } from '../../../base/common/uri.js';
import { asArray } from '../../../base/common/arrays.js';

export class ExtHostCodeMapper implements extHostProtocol.ExtHostCodeMapperShape {

	private static _providerHandlePool: number = 0;
	private readonly _proxy: extHostProtocol.MainThreadCodeMapperShape;
	private readonly providers = new Map<number, vscode.MappedEditsProvider2>();

	constructor(
		mainContext: extHostProtocol.IMainContext
	) {
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadCodeMapper);
	}

	async $mapCode(handle: number, internalRequest: extHostProtocol.ICodeMapperRequestDto, token: CancellationToken): Promise<ICodeMapperResult | null> {
		// Received request to map code from the main thread
		const provider = this.providers.get(handle);
		if (!provider) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Received request to map code for unknown provider handle ${handle}`);
		}

		// Construct a response object to pass to the provider
		const stream: vscode.MappedEditsResponseStream = {
			textEdit: (target: vscode.Uri, edits: vscode.TextEdit | vscode.TextEdit[]) => {
				edits = asArray(edits);
				this._proxy.$handleProgress(internalRequest.requestId, {
					uri: target,
					edits: edits.map(TextEdit.from)
				});
			},
			notebookEdit: (target: vscode.Uri, edits: vscode.NotebookEdit | vscode.NotebookEdit[]) => {
				edits = asArray(edits);
				this._proxy.$handleProgress(internalRequest.requestId, {
					uri: target,
					edits: edits.map(NotebookEdit.from)
				});
			}
		};

		const request: vscode.MappedEditsRequest = {
			location: internalRequest.location,
			chatRequestId: internalRequest.chatRequestId,
			chatRequestModel: internalRequest.chatRequestModel,
			chatSessionId: internalRequest.chatSessionId,
			codeBlocks: internalRequest.codeBlocks.map(block => {
				return {
					code: block.code,
					resource: URI.revive(block.resource),
					markdownBeforeBlock: block.markdownBeforeBlock
				};
			})
		};

		const result = await provider.provideMappedEdits(request, stream, token);
		return result ?? null;
	}

	registerMappedEditsProvider(extension: IExtensionDescription, provider: vscode.MappedEditsProvider2): vscode.Disposable {
		const handle = ExtHostCodeMapper._providerHandlePool++;
		this._proxy.$registerCodeMapperProvider(handle, extension.displayName ?? extension.name);
		this.providers.set(handle, provider);
		return {
			dispose: () => {
				return this._proxy.$unregisterCodeMapperProvider(handle);
			}
		};
	}
}
