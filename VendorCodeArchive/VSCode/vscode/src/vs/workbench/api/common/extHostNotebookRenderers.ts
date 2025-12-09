//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostNotebookRenderersShape, IMainContext, MainContext, MainThreadNotebookRenderersShape } from './extHost.protocol.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { ExtHostNotebookEditor } from './extHostNotebookEditor.js';
import * as vscode from 'vscode';


export class ExtHostNotebookRenderers implements ExtHostNotebookRenderersShape {
	private readonly _rendererMessageEmitters = new Map<string /* rendererId */, Emitter<{ editor: vscode.NotebookEditor; message: unknown }>>();
	private readonly proxy: MainThreadNotebookRenderersShape;

	constructor(mainContext: IMainContext, private readonly _extHostNotebook: ExtHostNotebookController) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadNotebookRenderers);
	}

	public $postRendererMessage(editorId: string, rendererId: string, message: unknown): void {
		const editor = this._extHostNotebook.getEditorById(editorId);
		this._rendererMessageEmitters.get(rendererId)?.fire({ editor: editor.apiEditor, message });
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	public createRendererMessaging(manifest: IExtensionDescription, rendererId: string): vscode.NotebookRendererMessaging {
		if (!manifest.contributes?.notebookRenderer?.some(r => r.id === rendererId)) {
			throw new Error(`Extensions may only call createRendererMessaging() for renderers they contribute (got ${rendererId})`);
		}

		const messaging: vscode.NotebookRendererMessaging = {
			onDidReceiveMessage: (listener, thisArg, disposables) => {
				return this.getOrCreateEmitterFor(rendererId).event(listener, thisArg, disposables);
			},
			postMessage: (message, editorOrAlias) => {
				if (ExtHostNotebookEditor.apiEditorsToExtHost.has(message)) { // back compat for swapped args
					[message, editorOrAlias] = [editorOrAlias, message];
				}

				const extHostEditor = editorOrAlias && ExtHostNotebookEditor.apiEditorsToExtHost.get(editorOrAlias);
				return this.proxy.$postMessage(extHostEditor?.id, rendererId, message);
			},
		};

		return messaging;
	}

	private getOrCreateEmitterFor(rendererId: string) {
		let emitter = this._rendererMessageEmitters.get(rendererId);
		if (emitter) {
			return emitter;
		}

		emitter = new Emitter({
			onDidRemoveLastListener: () => {
				emitter?.dispose();
				this._rendererMessageEmitters.delete(rendererId);
			}
		});

		this._rendererMessageEmitters.set(rendererId, emitter);

		return emitter;
	}
}
