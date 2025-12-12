/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ExtHostChatOutputRendererShape, IMainContext, MainContext, MainThreadChatOutputRendererShape } from './extHost.protocol.js';
import { Disposable } from './extHostTypes.js';
import { ExtHostWebviews } from './extHostWebview.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { VSBuffer } from '../../../base/common/buffer.js';

export class ExtHostChatOutputRenderer implements ExtHostChatOutputRendererShape {

	private readonly _proxy: MainThreadChatOutputRendererShape;

	private readonly _renderers = new Map</*viewType*/ string, {
		readonly renderer: vscode.ChatOutputRenderer;
		readonly extension: IExtensionDescription;
	}>();

	constructor(
		mainContext: IMainContext,
		private readonly webviews: ExtHostWebviews,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadChatOutputRenderer);
	}

	registerChatOutputRenderer(extension: IExtensionDescription, viewType: string, renderer: vscode.ChatOutputRenderer): vscode.Disposable {
		if (this._renderers.has(viewType)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 32: Error message without production error code - breaks React bundle size optimization
//   2. Line 32: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Chat output renderer already registered for: ${viewType}`);
		}

		this._renderers.set(viewType, { extension, renderer });
		this._proxy.$registerChatOutputRenderer(viewType, extension.identifier, extension.extensionLocation);

		return new Disposable(() => {
			this._renderers.delete(viewType);
			this._proxy.$unregisterChatOutputRenderer(viewType);
		});
	}

	async $renderChatOutput(viewType: string, mime: string, valueData: VSBuffer, webviewHandle: string, token: CancellationToken): Promise<void> {
		const entry = this._renderers.get(viewType);
		if (!entry) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 47: Error message without production error code - breaks React bundle size optimization
//   2. Line 47: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`No chat output renderer registered for: ${viewType}`);
		}

		const webview = this.webviews.createNewWebview(webviewHandle, {}, entry.extension);
		return entry.renderer.renderChatOutput(Object.freeze({ mime, value: valueData.buffer }), webview, {}, token);
	}
}
