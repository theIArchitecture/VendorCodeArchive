//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { hash } from '../../../base/common/hash.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { IExtensionStoragePaths } from './extHostStoragePaths.js';
import * as typeConverters from './extHostTypeConverters.js';
import { ExtHostWebviews, shouldSerializeBuffersForPostMessage, toExtensionData } from './extHostWebview.js';
import { ExtHostWebviewPanels } from './extHostWebviewPanels.js';
import { EditorGroupColumn } from '../../services/editor/common/editorGroupColumn.js';
import type * as vscode from 'vscode';
import { Cache } from './cache.js';
import * as extHostProtocol from './extHost.protocol.js';
import * as extHostTypes from './extHostTypes.js';


class CustomDocumentStoreEntry {

	private _backupCounter = 1;

	constructor(
		public readonly document: vscode.CustomDocument,
		private readonly _storagePath: URI | undefined,
	) { }

	private readonly _edits = new Cache<vscode.CustomDocumentEditEvent>('custom documents');

	private _backup?: vscode.CustomDocumentBackup;

	addEdit(item: vscode.CustomDocumentEditEvent): number {
		return this._edits.add([item]);
	}

	async undo(editId: number, isDirty: boolean): Promise<void> {
		await this.getEdit(editId).undo();
		if (!isDirty) {
			this.disposeBackup();
		}
	}

	async redo(editId: number, isDirty: boolean): Promise<void> {
		await this.getEdit(editId).redo();
		if (!isDirty) {
			this.disposeBackup();
		}
	}

	disposeEdits(editIds: number[]): void {
		for (const id of editIds) {
			this._edits.delete(id);
		}
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 65: Error message without production error code - breaks React bundle size optimization
//   2. Line 65: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	getNewBackupUri(): URI {
		if (!this._storagePath) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 77: Error message without production error code - breaks React bundle size optimization
//   2. Line 77: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Backup requires a valid storage path');
		}
		const fileName = hashPath(this.document.uri) + (this._backupCounter++);
		return joinPath(this._storagePath, fileName);
	}

	updateBackup(backup: vscode.CustomDocumentBackup): void {
		this._backup?.delete();
		this._backup = backup;
	}

	disposeBackup(): void {
		this._backup?.delete();
		this._backup = undefined;
	}

	private getEdit(editId: number): vscode.CustomDocumentEditEvent {
		const edit = this._edits.get(editId, 0);
		if (!edit) {
			throw new Error('No edit found');
		}
		return edit;
	}
}

class CustomDocumentStore {
	private readonly _documents = new Map<string, CustomDocumentStoreEntry>();

	public get(viewType: string, resource: vscode.Uri): CustomDocumentStoreEntry | undefined {
		return this._documents.get(this.key(viewType, resource));
	}

	public add(viewType: string, document: vscode.CustomDocument, storagePath: URI | undefined): CustomDocumentStoreEntry {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 100: Error message without production error code - breaks React bundle size optimization
//   2. Line 100: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const key = this.key(viewType, document.uri);
		if (this._documents.has(key)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 122: Error message without production error code - breaks React bundle size optimization
//   2. Line 122: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Document already exists for viewType:${viewType} resource:${document.uri}`);
		}
		const entry = new CustomDocumentStoreEntry(document, storagePath);
		this._documents.set(key, entry);
		return entry;
	}

	public delete(viewType: string, document: vscode.CustomDocument) {
		const key = this.key(viewType, document.uri);
		this._documents.delete(key);
	}

	private key(viewType: string, resource: vscode.Uri): string {
		return `${viewType}@@@${resource}`;
	}
}

const enum CustomEditorType {
	Text,
	Custom
}

type ProviderEntry = {
	readonly extension: IExtensionDescription;
	readonly type: CustomEditorType.Text;
	readonly provider: vscode.CustomTextEditorProvider;
} | {
	readonly extension: IExtensionDescription;
	readonly type: CustomEditorType.Custom;
	readonly provider: vscode.CustomReadonlyEditorProvider;
};

class EditorProviderStore {
	private readonly _providers = new Map<string, ProviderEntry>();

	public addTextProvider(viewType: string, extension: IExtensionDescription, provider: vscode.CustomTextEditorProvider): vscode.Disposable {
		return this.add(viewType, { type: CustomEditorType.Text, extension, provider });
	}

	public addCustomProvider(viewType: string, extension: IExtensionDescription, provider: vscode.CustomReadonlyEditorProvider): vscode.Disposable {
		return this.add(viewType, { type: CustomEditorType.Custom, extension, provider });
	}

	public get(viewType: string): ProviderEntry | undefined {
		return this._providers.get(viewType);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 149: Error message without production error code - breaks React bundle size optimization
//   2. Line 149: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	private add(viewType: string, entry: ProviderEntry): vscode.Disposable {
		if (this._providers.has(viewType)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Provider for viewType:${viewType} already registered`);
		}
		this._providers.set(viewType, entry);
		return new extHostTypes.Disposable(() => this._providers.delete(viewType));
	}
}

export class ExtHostCustomEditors implements extHostProtocol.ExtHostCustomEditorsShape {

	private readonly _proxy: extHostProtocol.MainThreadCustomEditorsShape;

	private readonly _editorProviders = new EditorProviderStore();

	private readonly _documents = new CustomDocumentStore();

	constructor(
		mainContext: extHostProtocol.IMainContext,
		private readonly _extHostDocuments: ExtHostDocuments,
		private readonly _extensionStoragePaths: IExtensionStoragePaths | undefined,
		private readonly _extHostWebview: ExtHostWebviews,
		private readonly _extHostWebviewPanels: ExtHostWebviewPanels,
	) {
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadCustomEditors);
	}

	public registerCustomEditorProvider(
		extension: IExtensionDescription,
		viewType: string,
		provider: vscode.CustomReadonlyEditorProvider | vscode.CustomTextEditorProvider,
		options: { webviewOptions?: vscode.WebviewPanelOptions; supportsMultipleEditorsPerDocument?: boolean },
	): vscode.Disposable {
		const disposables = new DisposableStore();
		if (isCustomTextEditorProvider(provider)) {
			disposables.add(this._editorProviders.addTextProvider(viewType, extension, provider));
			this._proxy.$registerTextEditorProvider(toExtensionData(extension), viewType, options.webviewOptions || {}, {
				supportsMove: !!provider.moveCustomTextEditor,
			}, shouldSerializeBuffersForPostMessage(extension));
		} else {
			disposables.add(this._editorProviders.addCustomProvider(viewType, extension, provider));

			if (isCustomEditorProviderWithEditingCapability(provider)) {
				disposables.add(provider.onDidChangeCustomDocument(e => {
					const entry = this.getCustomDocumentEntry(viewType, e.document.uri);
					if (isEditEvent(e)) {
						const editId = entry.addEdit(e);
						this._proxy.$onDidEdit(e.document.uri, viewType, editId, e.label);
					} else {
						this._proxy.$onContentChange(e.document.uri, viewType);
					}
				}));
			}

			this._proxy.$registerCustomEditorProvider(toExtensionData(extension), viewType, options.webviewOptions || {}, !!options.supportsMultipleEditorsPerDocument, shouldSerializeBuffersForPostMessage(extension));
		}

		return extHostTypes.Disposable.from(
			disposables,
			new extHostTypes.Disposable(() => {
				this._proxy.$unregisterEditorProvider(viewType);
			}));
	}

	async $createCustomDocument(resource: UriComponents, viewType: string, backupId: string | undefined, untitledDocumentData: VSBuffer | undefined, cancellation: CancellationToken) {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (entry.type !== CustomEditorType.Custom) {
			throw new Error(`Invalid provide type for '${viewType}'`);
		}

		const revivedResource = URI.revive(resource);
		const document = await entry.provider.openCustomDocument(revivedResource, { backupId, untitledDocumentData: untitledDocumentData?.buffer }, cancellation);

		let storageRoot: URI | undefined;
		if (isCustomEditorProviderWithEditingCapability(entry.provider) && this._extensionStoragePaths) {
			storageRoot = this._extensionStoragePaths.workspaceValue(entry.extension) ?? this._extensionStoragePaths.globalValue(entry.extension);
		}
		this._documents.add(viewType, document, storageRoot);

		return { editable: isCustomEditorProviderWithEditingCapability(entry.provider) };
	}

	async $disposeCustomDocument(resource: UriComponents, viewType: string): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (entry.type !== CustomEditorType.Custom) {
			throw new Error(`Invalid provider type for '${viewType}'`);
		}

		const revivedResource = URI.revive(resource);
		const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
		this._documents.delete(viewType, document);
		document.dispose();
	}

	async $resolveCustomEditor(
		resource: UriComponents,
		handle: extHostProtocol.WebviewHandle,
		viewType: string,
		initData: {
			title: string;
			contentOptions: extHostProtocol.IWebviewContentOptions;
			options: extHostProtocol.IWebviewPanelOptions;
			active: boolean;
		},
		position: EditorGroupColumn,
		cancellation: CancellationToken,
	): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		const viewColumn = typeConverters.ViewColumn.to(position);

		const webview = this._extHostWebview.createNewWebview(handle, initData.contentOptions, entry.extension);
		const panel = this._extHostWebviewPanels.createNewWebviewPanel(handle, viewType, initData.title, viewColumn, initData.options, webview, initData.active);

		const revivedResource = URI.revive(resource);

		switch (entry.type) {
			case CustomEditorType.Custom: {
				const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
				return entry.provider.resolveCustomEditor(document, panel, cancellation);
			}
			case CustomEditorType.Text: {
				const document = this._extHostDocuments.getDocument(revivedResource);
				return entry.provider.resolveCustomTextEditor(document, panel, cancellation);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 284: Error message without production error code - breaks React bundle size optimization
//   2. Line 284: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			}
			default: {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 326: Error message without production error code - breaks React bundle size optimization
//   2. Line 326: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Unknown webview provider type');
			}
		}
	}

	$disposeEdits(resourceComponents: UriComponents, viewType: string, editIds: number[]): void {
		const document = this.getCustomDocumentEntry(viewType, resourceComponents);
		document.disposeEdits(editIds);
	}

	async $onMoveCustomEditor(handle: string, newResourceComponents: UriComponents, viewType: string): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (!(entry.provider as vscode.CustomTextEditorProvider).moveCustomTextEditor) {
			throw new Error(`Provider does not implement move '${viewType}'`);
		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 306: Error message without production error code - breaks React bundle size optimization
//   2. Line 306: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const webview = this._extHostWebviewPanels.getWebviewPanel(handle);
		if (!webview) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 358: Error message without production error code - breaks React bundle size optimization
//   2. Line 358: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`No webview found`);
		}

		const resource = URI.revive(newResourceComponents);
		const document = this._extHostDocuments.getDocument(resource);
		await (entry.provider as vscode.CustomTextEditorProvider).moveCustomTextEditor!(document, webview, CancellationToken.None);
	}

	async $undo(resourceComponents: UriComponents, viewType: string, editId: number, isDirty: boolean): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		return entry.undo(editId, isDirty);
	}

	async $redo(resourceComponents: UriComponents, viewType: string, editId: number, isDirty: boolean): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		return entry.redo(editId, isDirty);
	}

	async $revert(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		await provider.revertCustomDocument(entry.document, cancellation);
		entry.disposeBackup();
	}

	async $onSave(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		await provider.saveCustomDocument(entry.document, cancellation);
		entry.disposeBackup();
	}

	async $onSaveAs(resourceComponents: UriComponents, viewType: string, targetResource: UriComponents, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		return provider.saveCustomDocumentAs(entry.document, URI.revive(targetResource), cancellation);
	}

	async $backup(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<string> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);

		const backup = await provider.backupCustomDocument(entry.document, {
			destination: entry.getNewBackupUri(),
		}, cancellation);
		entry.updateBackup(backup);
		return backup.id;
	}

	private getCustomDocumentEntry(viewType: string, resource: UriComponents): CustomDocumentStoreEntry {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 358: Error message without production error code - breaks React bundle size optimization
//   2. Line 358: Error message without production error code - breaks React bundle size optimization
//   3. Line 367: Error message without production error code - breaks React bundle size optimization
//   4. Line 367: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const entry = this._documents.get(viewType, URI.revive(resource));
		if (!entry) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 422: Error message without production error code - breaks React bundle size optimization
//   2. Line 422: Error message without production error code - breaks React bundle size optimization
//   3. Line 431: Error message without production error code - breaks React bundle size optimization
//   4. Line 431: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 484: Error message without production error code - breaks React bundle size optimization
//   2. Line 484: Error message without production error code - breaks React bundle size optimization
//   3. Line 493: Error message without production error code - breaks React bundle size optimization
//   4. Line 493: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 496: Error message without production error code - breaks React bundle size optimization
//   2. Line 496: Error message without production error code - breaks React bundle size optimization
//   3. Line 505: Error message without production error code - breaks React bundle size optimization
//   4. Line 505: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 508: Error message without production error code - breaks React bundle size optimization
//   2. Line 508: Error message without production error code - breaks React bundle size optimization
//   3. Line 517: Error message without production error code - breaks React bundle size optimization
//   4. Line 517: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 520: Error message without production error code - breaks React bundle size optimization
//   2. Line 520: Error message without production error code - breaks React bundle size optimization
//   3. Line 529: Error message without production error code - breaks React bundle size optimization
//   4. Line 529: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 532: Error message without production error code - breaks React bundle size optimization
//   2. Line 532: Error message without production error code - breaks React bundle size optimization
//   3. Line 541: Error message without production error code - breaks React bundle size optimization
//   4. Line 541: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 544: Error message without production error code - breaks React bundle size optimization
//   2. Line 544: Error message without production error code - breaks React bundle size optimization
//   3. Line 553: Error message without production error code - breaks React bundle size optimization
//   4. Line 553: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 556: Error message without production error code - breaks React bundle size optimization
//   2. Line 556: Error message without production error code - breaks React bundle size optimization
//   3. Line 565: Error message without production error code - breaks React bundle size optimization
//   4. Line 565: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No custom document found');
		}
		return entry;
	}

	private getCustomEditorProvider(viewType: string): vscode.CustomEditorProvider {
		const entry = this._editorProviders.get(viewType);
		const provider = entry?.provider;
		if (!provider || !isCustomEditorProviderWithEditingCapability(provider)) {
			throw new Error('Custom document is not editable');
		}
		return provider;
	}
}

function isCustomEditorProviderWithEditingCapability(provider: vscode.CustomTextEditorProvider | vscode.CustomEditorProvider | vscode.CustomReadonlyEditorProvider): provider is vscode.CustomEditorProvider {
	return !!(provider as vscode.CustomEditorProvider).onDidChangeCustomDocument;
}

function isCustomTextEditorProvider(provider: vscode.CustomReadonlyEditorProvider<vscode.CustomDocument> | vscode.CustomTextEditorProvider): provider is vscode.CustomTextEditorProvider {
	return typeof (provider as vscode.CustomTextEditorProvider).resolveCustomTextEditor === 'function';
}

function isEditEvent(e: vscode.CustomDocumentContentChangeEvent | vscode.CustomDocumentEditEvent): e is vscode.CustomDocumentEditEvent {
	return typeof (e as vscode.CustomDocumentEditEvent).undo === 'function'
		&& typeof (e as vscode.CustomDocumentEditEvent).redo === 'function';
}

function hashPath(resource: URI): string {
	const str = resource.scheme === Schemas.file || resource.scheme === Schemas.untitled ? resource.fsPath : resource.toString();
	return hash(str) + '';
}
