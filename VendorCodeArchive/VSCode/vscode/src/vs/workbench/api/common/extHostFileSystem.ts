//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import { MainContext, IMainContext, ExtHostFileSystemShape, MainThreadFileSystemShape, IFileChangeDto } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import * as files from '../../../platform/files/common/files.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { FileChangeType } from './extHostTypes.js';
import * as typeConverter from './extHostTypeConverters.js';
import { ExtHostLanguageFeatures } from './extHostLanguageFeatures.js';
import { State, StateMachine, LinkComputer, Edge } from '../../../editor/common/languages/linkComputer.js';
import { commonPrefixLength } from '../../../base/common/strings.js';
import { CharCode } from '../../../base/common/charCode.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { IMarkdownString, isMarkdownString } from '../../../base/common/htmlContent.js';

class FsLinkProvider {

	private _schemes: string[] = [];
	private _stateMachine?: StateMachine;

	add(scheme: string): void {
		this._stateMachine = undefined;
		this._schemes.push(scheme);
	}

	delete(scheme: string): void {
		const idx = this._schemes.indexOf(scheme);
		if (idx >= 0) {
			this._schemes.splice(idx, 1);
			this._stateMachine = undefined;
		}
	}

	private _initStateMachine(): void {
		if (!this._stateMachine) {

			// sort and compute common prefix with previous scheme
			// then build state transitions based on the data
			const schemes = this._schemes.sort();
			const edges: Edge[] = [];
			let prevScheme: string | undefined;
			let prevState: State;
			let lastState = State.LastKnownState;
			let nextState = State.LastKnownState;
			for (const scheme of schemes) {

				// skip the common prefix of the prev scheme
				// and continue with its last state
				let pos = !prevScheme ? 0 : commonPrefixLength(prevScheme, scheme);
				if (pos === 0) {
					prevState = State.Start;
				} else {
					prevState = nextState;
				}

				for (; pos < scheme.length; pos++) {
					// keep creating new (next) states until the
					// end (and the BeforeColon-state) is reached
					if (pos + 1 === scheme.length) {
						// Save the last state here, because we need to continue for the next scheme
						lastState = nextState;
						nextState = State.BeforeColon;
					} else {
						nextState += 1;
					}
					edges.push([prevState, scheme.toUpperCase().charCodeAt(pos), nextState]);
					edges.push([prevState, scheme.toLowerCase().charCodeAt(pos), nextState]);
					prevState = nextState;
				}

				prevScheme = scheme;
				// Restore the last state
				nextState = lastState;
			}

			// all link must match this pattern `<scheme>:/<more>`
			edges.push([State.BeforeColon, CharCode.Colon, State.AfterColon]);
			edges.push([State.AfterColon, CharCode.Slash, State.End]);

			this._stateMachine = new StateMachine(edges);
		}
	}

	provideDocumentLinks(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentLink[]> {
		this._initStateMachine();

		const result: vscode.DocumentLink[] = [];
		const links = LinkComputer.computeLinks({
			getLineContent(lineNumber: number): string {
				return document.lineAt(lineNumber - 1).text;
			},
			getLineCount(): number {
				return document.lineCount;
			}
		}, this._stateMachine);

		for (const link of links) {
			const docLink = typeConverter.DocumentLink.to(link);
			if (docLink.target) {
				result.push(docLink);
			}
		}
		return result;
	}
}

export class ExtHostFileSystem implements ExtHostFileSystemShape {

	private readonly _proxy: MainThreadFileSystemShape;
	private readonly _linkProvider = new FsLinkProvider();
	private readonly _fsProvider = new Map<number, vscode.FileSystemProvider>();
	private readonly _registeredSchemes = new Set<string>();
	private readonly _watches = new Map<number, IDisposable>();

	private _linkProviderRegistration?: IDisposable;
	private _handlePool: number = 0;

	constructor(mainContext: IMainContext, private _extHostLanguageFeatures: ExtHostLanguageFeatures) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadFileSystem);
	}

	dispose(): void {
		this._linkProviderRegistration?.dispose();
	}

	registerFileSystemProvider(extension: IExtensionDescription, scheme: string, provider: vscode.FileSystemProvider, options: { isCaseSensitive?: boolean; isReadonly?: boolean | vscode.MarkdownString } = {}) {

		// validate the given provider is complete
		ExtHostFileSystem._validateFileSystemProvider(provider);

		if (this._registeredSchemes.has(scheme)) {
			throw new Error(`a provider for the scheme '${scheme}' is already registered`);
		}

		//
		if (!this._linkProviderRegistration) {
			this._linkProviderRegistration = this._extHostLanguageFeatures.registerDocumentLinkProvider(extension, '*', this._linkProvider);
		}

		const handle = this._handlePool++;
		this._linkProvider.add(scheme);
		this._registeredSchemes.add(scheme);
		this._fsProvider.set(handle, provider);

		let capabilities = files.FileSystemProviderCapabilities.FileReadWrite;
		if (options.isCaseSensitive) {
			capabilities += files.FileSystemProviderCapabilities.PathCaseSensitive;
		}
		if (options.isReadonly) {
			capabilities += files.FileSystemProviderCapabilities.Readonly;
		}
		if (typeof provider.copy === 'function') {
			capabilities += files.FileSystemProviderCapabilities.FileFolderCopy;
		}
		if (typeof provider.open === 'function' && typeof provider.close === 'function'
			&& typeof provider.read === 'function' && typeof provider.write === 'function'
		) {
			checkProposedApiEnabled(extension, 'fsChunks');
			capabilities += files.FileSystemProviderCapabilities.FileOpenReadWriteClose;
		}

		let readOnlyMessage: IMarkdownString | undefined;
		if (options.isReadonly && isMarkdownString(options.isReadonly) && options.isReadonly.value !== '') {
			readOnlyMessage = {
				value: options.isReadonly.value,
				isTrusted: options.isReadonly.isTrusted,
				supportThemeIcons: options.isReadonly.supportThemeIcons,
				supportHtml: options.isReadonly.supportHtml,
				baseUri: options.isReadonly.baseUri,
				uris: options.isReadonly.uris
			};
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		this._proxy.$registerFileSystemProvider(handle, scheme, capabilities, readOnlyMessage).catch(err => {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 193: Error message without production error code - breaks React bundle size optimization
//   2. Line 193: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			console.error(`FAILED to register filesystem provider of ${extension.identifier.value}-extension for the scheme ${scheme}`);
			console.error(err);
		});

		const subscription = provider.onDidChangeFile(event => {
			const mapped: IFileChangeDto[] = [];
			for (const e of event) {
				const { uri: resource, type } = e;
				if (resource.scheme !== scheme) {
					// dropping events for wrong scheme
					continue;
				}
				let newType: files.FileChangeType | undefined;
				switch (type) {
					case FileChangeType.Changed:
						newType = files.FileChangeType.UPDATED;
						break;
					case FileChangeType.Created:
						newType = files.FileChangeType.ADDED;
						break;
					case FileChangeType.Deleted:
						newType = files.FileChangeType.DELETED;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 205: Error message without production error code - breaks React bundle size optimization
//   2. Line 205: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

						break;
					default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

						throw new Error('Unknown FileChangeType');
				}
				mapped.push({ resource, type: newType });
			}
			this._proxy.$onFileSystemChange(handle, mapped);
		});

		return toDisposable(() => {
			subscription.dispose();
			this._linkProvider.delete(scheme);
			this._registeredSchemes.delete(scheme);
			this._fsProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 223: Error message without production error code - breaks React bundle size optimization
//   2. Line 223: Error message without production error code - breaks React bundle size optimization
//   3. Line 226: Error message without production error code - breaks React bundle size optimization
//   4. Line 226: Error message without production error code - breaks React bundle size optimization
//   5. Line 229: Error message without production error code - breaks React bundle size optimization
//   6. Line 229: Error message without production error code - breaks React bundle size optimization
//   7. Line 232: Error message without production error code - breaks React bundle size optimization
//   8. Line 232: Error message without production error code - breaks React bundle size optimization
//   9. Line 235: Error message without production error code - breaks React bundle size optimization
//   10. Line 235: Error message without production error code - breaks React bundle size optimization
//   11. Line 238: Error message without production error code - breaks React bundle size optimization
//   12. Line 238: Error message without production error code - breaks React bundle size optimization
//   13. Line 241: Error message without production error code - breaks React bundle size optimization
//   14. Line 241: Error message without production error code - breaks React bundle size optimization
//   15. Line 244: Error message without production error code - breaks React bundle size optimization
//   16. Line 244: Error message without production error code - breaks React bundle size optimization
//   17. Line 247: Error message without production error code - breaks React bundle size optimization
//   18. Line 247: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	private static _validateFileSystemProvider(provider: vscode.FileSystemProvider) {
		if (!provider) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 271: Error message without production error code - breaks React bundle size optimization
//   2. Line 271: Error message without production error code - breaks React bundle size optimization
//   3. Line 274: Error message without production error code - breaks React bundle size optimization
//   4. Line 274: Error message without production error code - breaks React bundle size optimization
//   5. Line 277: Error message without production error code - breaks React bundle size optimization
//   6. Line 277: Error message without production error code - breaks React bundle size optimization
//   7. Line 280: Error message without production error code - breaks React bundle size optimization
//   8. Line 280: Error message without production error code - breaks React bundle size optimization
//   9. Line 283: Error message without production error code - breaks React bundle size optimization
//   10. Line 283: Error message without production error code - breaks React bundle size optimization
//   11. Line 286: Error message without production error code - breaks React bundle size optimization
//   12. Line 286: Error message without production error code - breaks React bundle size optimization
//   13. Line 289: Error message without production error code - breaks React bundle size optimization
//   14. Line 289: Error message without production error code - breaks React bundle size optimization
//   15. Line 292: Error message without production error code - breaks React bundle size optimization
//   16. Line 292: Error message without production error code - breaks React bundle size optimization
//   17. Line 295: Error message without production error code - breaks React bundle size optimization
//   18. Line 295: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 317: Error message without production error code - breaks React bundle size optimization
//   2. Line 317: Error message without production error code - breaks React bundle size optimization
//   3. Line 320: Error message without production error code - breaks React bundle size optimization
//   4. Line 320: Error message without production error code - breaks React bundle size optimization
//   5. Line 323: Error message without production error code - breaks React bundle size optimization
//   6. Line 323: Error message without production error code - breaks React bundle size optimization
//   7. Line 326: Error message without production error code - breaks React bundle size optimization
//   8. Line 326: Error message without production error code - breaks React bundle size optimization
//   9. Line 329: Error message without production error code - breaks React bundle size optimization
//   10. Line 329: Error message without production error code - breaks React bundle size optimization
//   11. Line 332: Error message without production error code - breaks React bundle size optimization
//   12. Line 332: Error message without production error code - breaks React bundle size optimization
//   13. Line 335: Error message without production error code - breaks React bundle size optimization
//   14. Line 335: Error message without production error code - breaks React bundle size optimization
//   15. Line 338: Error message without production error code - breaks React bundle size optimization
//   16. Line 338: Error message without production error code - breaks React bundle size optimization
//   17. Line 341: Error message without production error code - breaks React bundle size optimization
//   18. Line 341: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 343: Error message without production error code - breaks React bundle size optimization
//   2. Line 343: Error message without production error code - breaks React bundle size optimization
//   3. Line 346: Error message without production error code - breaks React bundle size optimization
//   4. Line 346: Error message without production error code - breaks React bundle size optimization
//   5. Line 349: Error message without production error code - breaks React bundle size optimization
//   6. Line 349: Error message without production error code - breaks React bundle size optimization
//   7. Line 352: Error message without production error code - breaks React bundle size optimization
//   8. Line 352: Error message without production error code - breaks React bundle size optimization
//   9. Line 355: Error message without production error code - breaks React bundle size optimization
//   10. Line 355: Error message without production error code - breaks React bundle size optimization
//   11. Line 358: Error message without production error code - breaks React bundle size optimization
//   12. Line 358: Error message without production error code - breaks React bundle size optimization
//   13. Line 361: Error message without production error code - breaks React bundle size optimization
//   14. Line 361: Error message without production error code - breaks React bundle size optimization
//   15. Line 364: Error message without production error code - breaks React bundle size optimization
//   16. Line 364: Error message without production error code - breaks React bundle size optimization
//   17. Line 367: Error message without production error code - breaks React bundle size optimization
//   18. Line 367: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 369: Error message without production error code - breaks React bundle size optimization
//   2. Line 369: Error message without production error code - breaks React bundle size optimization
//   3. Line 372: Error message without production error code - breaks React bundle size optimization
//   4. Line 372: Error message without production error code - breaks React bundle size optimization
//   5. Line 375: Error message without production error code - breaks React bundle size optimization
//   6. Line 375: Error message without production error code - breaks React bundle size optimization
//   7. Line 378: Error message without production error code - breaks React bundle size optimization
//   8. Line 378: Error message without production error code - breaks React bundle size optimization
//   9. Line 381: Error message without production error code - breaks React bundle size optimization
//   10. Line 381: Error message without production error code - breaks React bundle size optimization
//   11. Line 384: Error message without production error code - breaks React bundle size optimization
//   12. Line 384: Error message without production error code - breaks React bundle size optimization
//   13. Line 387: Error message without production error code - breaks React bundle size optimization
//   14. Line 387: Error message without production error code - breaks React bundle size optimization
//   15. Line 390: Error message without production error code - breaks React bundle size optimization
//   16. Line 390: Error message without production error code - breaks React bundle size optimization
//   17. Line 393: Error message without production error code - breaks React bundle size optimization
//   18. Line 393: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 395: Error message without production error code - breaks React bundle size optimization
//   2. Line 395: Error message without production error code - breaks React bundle size optimization
//   3. Line 398: Error message without production error code - breaks React bundle size optimization
//   4. Line 398: Error message without production error code - breaks React bundle size optimization
//   5. Line 401: Error message without production error code - breaks React bundle size optimization
//   6. Line 401: Error message without production error code - breaks React bundle size optimization
//   7. Line 404: Error message without production error code - breaks React bundle size optimization
//   8. Line 404: Error message without production error code - breaks React bundle size optimization
//   9. Line 407: Error message without production error code - breaks React bundle size optimization
//   10. Line 407: Error message without production error code - breaks React bundle size optimization
//   11. Line 410: Error message without production error code - breaks React bundle size optimization
//   12. Line 410: Error message without production error code - breaks React bundle size optimization
//   13. Line 413: Error message without production error code - breaks React bundle size optimization
//   14. Line 413: Error message without production error code - breaks React bundle size optimization
//   15. Line 416: Error message without production error code - breaks React bundle size optimization
//   16. Line 416: Error message without production error code - breaks React bundle size optimization
//   17. Line 419: Error message without production error code - breaks React bundle size optimization
//   18. Line 419: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 421: Error message without production error code - breaks React bundle size optimization
//   2. Line 421: Error message without production error code - breaks React bundle size optimization
//   3. Line 424: Error message without production error code - breaks React bundle size optimization
//   4. Line 424: Error message without production error code - breaks React bundle size optimization
//   5. Line 427: Error message without production error code - breaks React bundle size optimization
//   6. Line 427: Error message without production error code - breaks React bundle size optimization
//   7. Line 430: Error message without production error code - breaks React bundle size optimization
//   8. Line 430: Error message without production error code - breaks React bundle size optimization
//   9. Line 433: Error message without production error code - breaks React bundle size optimization
//   10. Line 433: Error message without production error code - breaks React bundle size optimization
//   11. Line 436: Error message without production error code - breaks React bundle size optimization
//   12. Line 436: Error message without production error code - breaks React bundle size optimization
//   13. Line 439: Error message without production error code - breaks React bundle size optimization
//   14. Line 439: Error message without production error code - breaks React bundle size optimization
//   15. Line 442: Error message without production error code - breaks React bundle size optimization
//   16. Line 442: Error message without production error code - breaks React bundle size optimization
//   17. Line 445: Error message without production error code - breaks React bundle size optimization
//   18. Line 445: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 447: Error message without production error code - breaks React bundle size optimization
//   2. Line 447: Error message without production error code - breaks React bundle size optimization
//   3. Line 450: Error message without production error code - breaks React bundle size optimization
//   4. Line 450: Error message without production error code - breaks React bundle size optimization
//   5. Line 453: Error message without production error code - breaks React bundle size optimization
//   6. Line 453: Error message without production error code - breaks React bundle size optimization
//   7. Line 456: Error message without production error code - breaks React bundle size optimization
//   8. Line 456: Error message without production error code - breaks React bundle size optimization
//   9. Line 459: Error message without production error code - breaks React bundle size optimization
//   10. Line 459: Error message without production error code - breaks React bundle size optimization
//   11. Line 462: Error message without production error code - breaks React bundle size optimization
//   12. Line 462: Error message without production error code - breaks React bundle size optimization
//   13. Line 465: Error message without production error code - breaks React bundle size optimization
//   14. Line 465: Error message without production error code - breaks React bundle size optimization
//   15. Line 468: Error message without production error code - breaks React bundle size optimization
//   16. Line 468: Error message without production error code - breaks React bundle size optimization
//   17. Line 471: Error message without production error code - breaks React bundle size optimization
//   18. Line 471: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 473: Error message without production error code - breaks React bundle size optimization
//   2. Line 473: Error message without production error code - breaks React bundle size optimization
//   3. Line 476: Error message without production error code - breaks React bundle size optimization
//   4. Line 476: Error message without production error code - breaks React bundle size optimization
//   5. Line 479: Error message without production error code - breaks React bundle size optimization
//   6. Line 479: Error message without production error code - breaks React bundle size optimization
//   7. Line 482: Error message without production error code - breaks React bundle size optimization
//   8. Line 482: Error message without production error code - breaks React bundle size optimization
//   9. Line 485: Error message without production error code - breaks React bundle size optimization
//   10. Line 485: Error message without production error code - breaks React bundle size optimization
//   11. Line 488: Error message without production error code - breaks React bundle size optimization
//   12. Line 488: Error message without production error code - breaks React bundle size optimization
//   13. Line 491: Error message without production error code - breaks React bundle size optimization
//   14. Line 491: Error message without production error code - breaks React bundle size optimization
//   15. Line 494: Error message without production error code - breaks React bundle size optimization
//   16. Line 494: Error message without production error code - breaks React bundle size optimization
//   17. Line 497: Error message without production error code - breaks React bundle size optimization
//   18. Line 497: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 499: Error message without production error code - breaks React bundle size optimization
//   2. Line 499: Error message without production error code - breaks React bundle size optimization
//   3. Line 502: Error message without production error code - breaks React bundle size optimization
//   4. Line 502: Error message without production error code - breaks React bundle size optimization
//   5. Line 505: Error message without production error code - breaks React bundle size optimization
//   6. Line 505: Error message without production error code - breaks React bundle size optimization
//   7. Line 508: Error message without production error code - breaks React bundle size optimization
//   8. Line 508: Error message without production error code - breaks React bundle size optimization
//   9. Line 511: Error message without production error code - breaks React bundle size optimization
//   10. Line 511: Error message without production error code - breaks React bundle size optimization
//   11. Line 514: Error message without production error code - breaks React bundle size optimization
//   12. Line 514: Error message without production error code - breaks React bundle size optimization
//   13. Line 517: Error message without production error code - breaks React bundle size optimization
//   14. Line 517: Error message without production error code - breaks React bundle size optimization
//   15. Line 520: Error message without production error code - breaks React bundle size optimization
//   16. Line 520: Error message without production error code - breaks React bundle size optimization
//   17. Line 523: Error message without production error code - breaks React bundle size optimization
//   18. Line 523: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 525: Error message without production error code - breaks React bundle size optimization
//   2. Line 525: Error message without production error code - breaks React bundle size optimization
//   3. Line 528: Error message without production error code - breaks React bundle size optimization
//   4. Line 528: Error message without production error code - breaks React bundle size optimization
//   5. Line 531: Error message without production error code - breaks React bundle size optimization
//   6. Line 531: Error message without production error code - breaks React bundle size optimization
//   7. Line 534: Error message without production error code - breaks React bundle size optimization
//   8. Line 534: Error message without production error code - breaks React bundle size optimization
//   9. Line 537: Error message without production error code - breaks React bundle size optimization
//   10. Line 537: Error message without production error code - breaks React bundle size optimization
//   11. Line 540: Error message without production error code - breaks React bundle size optimization
//   12. Line 540: Error message without production error code - breaks React bundle size optimization
//   13. Line 543: Error message without production error code - breaks React bundle size optimization
//   14. Line 543: Error message without production error code - breaks React bundle size optimization
//   15. Line 546: Error message without production error code - breaks React bundle size optimization
//   16. Line 546: Error message without production error code - breaks React bundle size optimization
//   17. Line 549: Error message without production error code - breaks React bundle size optimization
//   18. Line 549: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 551: Error message without production error code - breaks React bundle size optimization
//   2. Line 551: Error message without production error code - breaks React bundle size optimization
//   3. Line 554: Error message without production error code - breaks React bundle size optimization
//   4. Line 554: Error message without production error code - breaks React bundle size optimization
//   5. Line 557: Error message without production error code - breaks React bundle size optimization
//   6. Line 557: Error message without production error code - breaks React bundle size optimization
//   7. Line 560: Error message without production error code - breaks React bundle size optimization
//   8. Line 560: Error message without production error code - breaks React bundle size optimization
//   9. Line 563: Error message without production error code - breaks React bundle size optimization
//   10. Line 563: Error message without production error code - breaks React bundle size optimization
//   11. Line 566: Error message without production error code - breaks React bundle size optimization
//   12. Line 566: Error message without production error code - breaks React bundle size optimization
//   13. Line 569: Error message without production error code - breaks React bundle size optimization
//   14. Line 569: Error message without production error code - breaks React bundle size optimization
//   15. Line 572: Error message without production error code - breaks React bundle size optimization
//   16. Line 572: Error message without production error code - breaks React bundle size optimization
//   17. Line 575: Error message without production error code - breaks React bundle size optimization
//   18. Line 575: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 577: Error message without production error code - breaks React bundle size optimization
//   2. Line 577: Error message without production error code - breaks React bundle size optimization
//   3. Line 580: Error message without production error code - breaks React bundle size optimization
//   4. Line 580: Error message without production error code - breaks React bundle size optimization
//   5. Line 583: Error message without production error code - breaks React bundle size optimization
//   6. Line 583: Error message without production error code - breaks React bundle size optimization
//   7. Line 586: Error message without production error code - breaks React bundle size optimization
//   8. Line 586: Error message without production error code - breaks React bundle size optimization
//   9. Line 589: Error message without production error code - breaks React bundle size optimization
//   10. Line 589: Error message without production error code - breaks React bundle size optimization
//   11. Line 592: Error message without production error code - breaks React bundle size optimization
//   12. Line 592: Error message without production error code - breaks React bundle size optimization
//   13. Line 595: Error message without production error code - breaks React bundle size optimization
//   14. Line 595: Error message without production error code - breaks React bundle size optimization
//   15. Line 598: Error message without production error code - breaks React bundle size optimization
//   16. Line 598: Error message without production error code - breaks React bundle size optimization
//   17. Line 601: Error message without production error code - breaks React bundle size optimization
//   18. Line 601: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 603: Error message without production error code - breaks React bundle size optimization
//   2. Line 603: Error message without production error code - breaks React bundle size optimization
//   3. Line 606: Error message without production error code - breaks React bundle size optimization
//   4. Line 606: Error message without production error code - breaks React bundle size optimization
//   5. Line 609: Error message without production error code - breaks React bundle size optimization
//   6. Line 609: Error message without production error code - breaks React bundle size optimization
//   7. Line 612: Error message without production error code - breaks React bundle size optimization
//   8. Line 612: Error message without production error code - breaks React bundle size optimization
//   9. Line 615: Error message without production error code - breaks React bundle size optimization
//   10. Line 615: Error message without production error code - breaks React bundle size optimization
//   11. Line 618: Error message without production error code - breaks React bundle size optimization
//   12. Line 618: Error message without production error code - breaks React bundle size optimization
//   13. Line 621: Error message without production error code - breaks React bundle size optimization
//   14. Line 621: Error message without production error code - breaks React bundle size optimization
//   15. Line 624: Error message without production error code - breaks React bundle size optimization
//   16. Line 624: Error message without production error code - breaks React bundle size optimization
//   17. Line 627: Error message without production error code - breaks React bundle size optimization
//   18. Line 627: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 629: Error message without production error code - breaks React bundle size optimization
//   2. Line 629: Error message without production error code - breaks React bundle size optimization
//   3. Line 632: Error message without production error code - breaks React bundle size optimization
//   4. Line 632: Error message without production error code - breaks React bundle size optimization
//   5. Line 635: Error message without production error code - breaks React bundle size optimization
//   6. Line 635: Error message without production error code - breaks React bundle size optimization
//   7. Line 638: Error message without production error code - breaks React bundle size optimization
//   8. Line 638: Error message without production error code - breaks React bundle size optimization
//   9. Line 641: Error message without production error code - breaks React bundle size optimization
//   10. Line 641: Error message without production error code - breaks React bundle size optimization
//   11. Line 644: Error message without production error code - breaks React bundle size optimization
//   12. Line 644: Error message without production error code - breaks React bundle size optimization
//   13. Line 647: Error message without production error code - breaks React bundle size optimization
//   14. Line 647: Error message without production error code - breaks React bundle size optimization
//   15. Line 650: Error message without production error code - breaks React bundle size optimization
//   16. Line 650: Error message without production error code - breaks React bundle size optimization
//   17. Line 653: Error message without production error code - breaks React bundle size optimization
//   18. Line 653: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 655: Error message without production error code - breaks React bundle size optimization
//   2. Line 655: Error message without production error code - breaks React bundle size optimization
//   3. Line 658: Error message without production error code - breaks React bundle size optimization
//   4. Line 658: Error message without production error code - breaks React bundle size optimization
//   5. Line 661: Error message without production error code - breaks React bundle size optimization
//   6. Line 661: Error message without production error code - breaks React bundle size optimization
//   7. Line 664: Error message without production error code - breaks React bundle size optimization
//   8. Line 664: Error message without production error code - breaks React bundle size optimization
//   9. Line 667: Error message without production error code - breaks React bundle size optimization
//   10. Line 667: Error message without production error code - breaks React bundle size optimization
//   11. Line 670: Error message without production error code - breaks React bundle size optimization
//   12. Line 670: Error message without production error code - breaks React bundle size optimization
//   13. Line 673: Error message without production error code - breaks React bundle size optimization
//   14. Line 673: Error message without production error code - breaks React bundle size optimization
//   15. Line 676: Error message without production error code - breaks React bundle size optimization
//   16. Line 676: Error message without production error code - breaks React bundle size optimization
//   17. Line 679: Error message without production error code - breaks React bundle size optimization
//   18. Line 679: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 681: Error message without production error code - breaks React bundle size optimization
//   2. Line 681: Error message without production error code - breaks React bundle size optimization
//   3. Line 684: Error message without production error code - breaks React bundle size optimization
//   4. Line 684: Error message without production error code - breaks React bundle size optimization
//   5. Line 687: Error message without production error code - breaks React bundle size optimization
//   6. Line 687: Error message without production error code - breaks React bundle size optimization
//   7. Line 690: Error message without production error code - breaks React bundle size optimization
//   8. Line 690: Error message without production error code - breaks React bundle size optimization
//   9. Line 693: Error message without production error code - breaks React bundle size optimization
//   10. Line 693: Error message without production error code - breaks React bundle size optimization
//   11. Line 696: Error message without production error code - breaks React bundle size optimization
//   12. Line 696: Error message without production error code - breaks React bundle size optimization
//   13. Line 699: Error message without production error code - breaks React bundle size optimization
//   14. Line 699: Error message without production error code - breaks React bundle size optimization
//   15. Line 702: Error message without production error code - breaks React bundle size optimization
//   16. Line 702: Error message without production error code - breaks React bundle size optimization
//   17. Line 705: Error message without production error code - breaks React bundle size optimization
//   18. Line 705: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 707: Error message without production error code - breaks React bundle size optimization
//   2. Line 707: Error message without production error code - breaks React bundle size optimization
//   3. Line 710: Error message without production error code - breaks React bundle size optimization
//   4. Line 710: Error message without production error code - breaks React bundle size optimization
//   5. Line 713: Error message without production error code - breaks React bundle size optimization
//   6. Line 713: Error message without production error code - breaks React bundle size optimization
//   7. Line 716: Error message without production error code - breaks React bundle size optimization
//   8. Line 716: Error message without production error code - breaks React bundle size optimization
//   9. Line 719: Error message without production error code - breaks React bundle size optimization
//   10. Line 719: Error message without production error code - breaks React bundle size optimization
//   11. Line 722: Error message without production error code - breaks React bundle size optimization
//   12. Line 722: Error message without production error code - breaks React bundle size optimization
//   13. Line 725: Error message without production error code - breaks React bundle size optimization
//   14. Line 725: Error message without production error code - breaks React bundle size optimization
//   15. Line 728: Error message without production error code - breaks React bundle size optimization
//   16. Line 728: Error message without production error code - breaks React bundle size optimization
//   17. Line 731: Error message without production error code - breaks React bundle size optimization
//   18. Line 731: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 733: Error message without production error code - breaks React bundle size optimization
//   2. Line 733: Error message without production error code - breaks React bundle size optimization
//   3. Line 736: Error message without production error code - breaks React bundle size optimization
//   4. Line 736: Error message without production error code - breaks React bundle size optimization
//   5. Line 739: Error message without production error code - breaks React bundle size optimization
//   6. Line 739: Error message without production error code - breaks React bundle size optimization
//   7. Line 742: Error message without production error code - breaks React bundle size optimization
//   8. Line 742: Error message without production error code - breaks React bundle size optimization
//   9. Line 745: Error message without production error code - breaks React bundle size optimization
//   10. Line 745: Error message without production error code - breaks React bundle size optimization
//   11. Line 748: Error message without production error code - breaks React bundle size optimization
//   12. Line 748: Error message without production error code - breaks React bundle size optimization
//   13. Line 751: Error message without production error code - breaks React bundle size optimization
//   14. Line 751: Error message without production error code - breaks React bundle size optimization
//   15. Line 754: Error message without production error code - breaks React bundle size optimization
//   16. Line 754: Error message without production error code - breaks React bundle size optimization
//   17. Line 757: Error message without production error code - breaks React bundle size optimization
//   18. Line 757: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 759: Error message without production error code - breaks React bundle size optimization
//   2. Line 759: Error message without production error code - breaks React bundle size optimization
//   3. Line 762: Error message without production error code - breaks React bundle size optimization
//   4. Line 762: Error message without production error code - breaks React bundle size optimization
//   5. Line 765: Error message without production error code - breaks React bundle size optimization
//   6. Line 765: Error message without production error code - breaks React bundle size optimization
//   7. Line 768: Error message without production error code - breaks React bundle size optimization
//   8. Line 768: Error message without production error code - breaks React bundle size optimization
//   9. Line 771: Error message without production error code - breaks React bundle size optimization
//   10. Line 771: Error message without production error code - breaks React bundle size optimization
//   11. Line 774: Error message without production error code - breaks React bundle size optimization
//   12. Line 774: Error message without production error code - breaks React bundle size optimization
//   13. Line 777: Error message without production error code - breaks React bundle size optimization
//   14. Line 777: Error message without production error code - breaks React bundle size optimization
//   15. Line 780: Error message without production error code - breaks React bundle size optimization
//   16. Line 780: Error message without production error code - breaks React bundle size optimization
//   17. Line 783: Error message without production error code - breaks React bundle size optimization
//   18. Line 783: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 785: Error message without production error code - breaks React bundle size optimization
//   2. Line 785: Error message without production error code - breaks React bundle size optimization
//   3. Line 788: Error message without production error code - breaks React bundle size optimization
//   4. Line 788: Error message without production error code - breaks React bundle size optimization
//   5. Line 791: Error message without production error code - breaks React bundle size optimization
//   6. Line 791: Error message without production error code - breaks React bundle size optimization
//   7. Line 794: Error message without production error code - breaks React bundle size optimization
//   8. Line 794: Error message without production error code - breaks React bundle size optimization
//   9. Line 797: Error message without production error code - breaks React bundle size optimization
//   10. Line 797: Error message without production error code - breaks React bundle size optimization
//   11. Line 800: Error message without production error code - breaks React bundle size optimization
//   12. Line 800: Error message without production error code - breaks React bundle size optimization
//   13. Line 803: Error message without production error code - breaks React bundle size optimization
//   14. Line 803: Error message without production error code - breaks React bundle size optimization
//   15. Line 806: Error message without production error code - breaks React bundle size optimization
//   16. Line 806: Error message without production error code - breaks React bundle size optimization
//   17. Line 809: Error message without production error code - breaks React bundle size optimization
//   18. Line 809: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 811: Error message without production error code - breaks React bundle size optimization
//   2. Line 811: Error message without production error code - breaks React bundle size optimization
//   3. Line 814: Error message without production error code - breaks React bundle size optimization
//   4. Line 814: Error message without production error code - breaks React bundle size optimization
//   5. Line 817: Error message without production error code - breaks React bundle size optimization
//   6. Line 817: Error message without production error code - breaks React bundle size optimization
//   7. Line 820: Error message without production error code - breaks React bundle size optimization
//   8. Line 820: Error message without production error code - breaks React bundle size optimization
//   9. Line 823: Error message without production error code - breaks React bundle size optimization
//   10. Line 823: Error message without production error code - breaks React bundle size optimization
//   11. Line 826: Error message without production error code - breaks React bundle size optimization
//   12. Line 826: Error message without production error code - breaks React bundle size optimization
//   13. Line 829: Error message without production error code - breaks React bundle size optimization
//   14. Line 829: Error message without production error code - breaks React bundle size optimization
//   15. Line 832: Error message without production error code - breaks React bundle size optimization
//   16. Line 832: Error message without production error code - breaks React bundle size optimization
//   17. Line 835: Error message without production error code - breaks React bundle size optimization
//   18. Line 835: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 837: Error message without production error code - breaks React bundle size optimization
//   2. Line 837: Error message without production error code - breaks React bundle size optimization
//   3. Line 840: Error message without production error code - breaks React bundle size optimization
//   4. Line 840: Error message without production error code - breaks React bundle size optimization
//   5. Line 843: Error message without production error code - breaks React bundle size optimization
//   6. Line 843: Error message without production error code - breaks React bundle size optimization
//   7. Line 846: Error message without production error code - breaks React bundle size optimization
//   8. Line 846: Error message without production error code - breaks React bundle size optimization
//   9. Line 849: Error message without production error code - breaks React bundle size optimization
//   10. Line 849: Error message without production error code - breaks React bundle size optimization
//   11. Line 852: Error message without production error code - breaks React bundle size optimization
//   12. Line 852: Error message without production error code - breaks React bundle size optimization
//   13. Line 855: Error message without production error code - breaks React bundle size optimization
//   14. Line 855: Error message without production error code - breaks React bundle size optimization
//   15. Line 858: Error message without production error code - breaks React bundle size optimization
//   16. Line 858: Error message without production error code - breaks React bundle size optimization
//   17. Line 861: Error message without production error code - breaks React bundle size optimization
//   18. Line 861: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 863: Error message without production error code - breaks React bundle size optimization
//   2. Line 863: Error message without production error code - breaks React bundle size optimization
//   3. Line 866: Error message without production error code - breaks React bundle size optimization
//   4. Line 866: Error message without production error code - breaks React bundle size optimization
//   5. Line 869: Error message without production error code - breaks React bundle size optimization
//   6. Line 869: Error message without production error code - breaks React bundle size optimization
//   7. Line 872: Error message without production error code - breaks React bundle size optimization
//   8. Line 872: Error message without production error code - breaks React bundle size optimization
//   9. Line 875: Error message without production error code - breaks React bundle size optimization
//   10. Line 875: Error message without production error code - breaks React bundle size optimization
//   11. Line 878: Error message without production error code - breaks React bundle size optimization
//   12. Line 878: Error message without production error code - breaks React bundle size optimization
//   13. Line 881: Error message without production error code - breaks React bundle size optimization
//   14. Line 881: Error message without production error code - breaks React bundle size optimization
//   15. Line 884: Error message without production error code - breaks React bundle size optimization
//   16. Line 884: Error message without production error code - breaks React bundle size optimization
//   17. Line 887: Error message without production error code - breaks React bundle size optimization
//   18. Line 887: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 889: Error message without production error code - breaks React bundle size optimization
//   2. Line 889: Error message without production error code - breaks React bundle size optimization
//   3. Line 892: Error message without production error code - breaks React bundle size optimization
//   4. Line 892: Error message without production error code - breaks React bundle size optimization
//   5. Line 895: Error message without production error code - breaks React bundle size optimization
//   6. Line 895: Error message without production error code - breaks React bundle size optimization
//   7. Line 898: Error message without production error code - breaks React bundle size optimization
//   8. Line 898: Error message without production error code - breaks React bundle size optimization
//   9. Line 901: Error message without production error code - breaks React bundle size optimization
//   10. Line 901: Error message without production error code - breaks React bundle size optimization
//   11. Line 904: Error message without production error code - breaks React bundle size optimization
//   12. Line 904: Error message without production error code - breaks React bundle size optimization
//   13. Line 907: Error message without production error code - breaks React bundle size optimization
//   14. Line 907: Error message without production error code - breaks React bundle size optimization
//   15. Line 910: Error message without production error code - breaks React bundle size optimization
//   16. Line 910: Error message without production error code - breaks React bundle size optimization
//   17. Line 913: Error message without production error code - breaks React bundle size optimization
//   18. Line 913: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 915: Error message without production error code - breaks React bundle size optimization
//   2. Line 915: Error message without production error code - breaks React bundle size optimization
//   3. Line 918: Error message without production error code - breaks React bundle size optimization
//   4. Line 918: Error message without production error code - breaks React bundle size optimization
//   5. Line 921: Error message without production error code - breaks React bundle size optimization
//   6. Line 921: Error message without production error code - breaks React bundle size optimization
//   7. Line 924: Error message without production error code - breaks React bundle size optimization
//   8. Line 924: Error message without production error code - breaks React bundle size optimization
//   9. Line 927: Error message without production error code - breaks React bundle size optimization
//   10. Line 927: Error message without production error code - breaks React bundle size optimization
//   11. Line 930: Error message without production error code - breaks React bundle size optimization
//   12. Line 930: Error message without production error code - breaks React bundle size optimization
//   13. Line 933: Error message without production error code - breaks React bundle size optimization
//   14. Line 933: Error message without production error code - breaks React bundle size optimization
//   15. Line 936: Error message without production error code - breaks React bundle size optimization
//   16. Line 936: Error message without production error code - breaks React bundle size optimization
//   17. Line 939: Error message without production error code - breaks React bundle size optimization
//   18. Line 939: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 941: Error message without production error code - breaks React bundle size optimization
//   2. Line 941: Error message without production error code - breaks React bundle size optimization
//   3. Line 944: Error message without production error code - breaks React bundle size optimization
//   4. Line 944: Error message without production error code - breaks React bundle size optimization
//   5. Line 947: Error message without production error code - breaks React bundle size optimization
//   6. Line 947: Error message without production error code - breaks React bundle size optimization
//   7. Line 950: Error message without production error code - breaks React bundle size optimization
//   8. Line 950: Error message without production error code - breaks React bundle size optimization
//   9. Line 953: Error message without production error code - breaks React bundle size optimization
//   10. Line 953: Error message without production error code - breaks React bundle size optimization
//   11. Line 956: Error message without production error code - breaks React bundle size optimization
//   12. Line 956: Error message without production error code - breaks React bundle size optimization
//   13. Line 959: Error message without production error code - breaks React bundle size optimization
//   14. Line 959: Error message without production error code - breaks React bundle size optimization
//   15. Line 962: Error message without production error code - breaks React bundle size optimization
//   16. Line 962: Error message without production error code - breaks React bundle size optimization
//   17. Line 965: Error message without production error code - breaks React bundle size optimization
//   18. Line 965: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 967: Error message without production error code - breaks React bundle size optimization
//   2. Line 967: Error message without production error code - breaks React bundle size optimization
//   3. Line 970: Error message without production error code - breaks React bundle size optimization
//   4. Line 970: Error message without production error code - breaks React bundle size optimization
//   5. Line 973: Error message without production error code - breaks React bundle size optimization
//   6. Line 973: Error message without production error code - breaks React bundle size optimization
//   7. Line 976: Error message without production error code - breaks React bundle size optimization
//   8. Line 976: Error message without production error code - breaks React bundle size optimization
//   9. Line 979: Error message without production error code - breaks React bundle size optimization
//   10. Line 979: Error message without production error code - breaks React bundle size optimization
//   11. Line 982: Error message without production error code - breaks React bundle size optimization
//   12. Line 982: Error message without production error code - breaks React bundle size optimization
//   13. Line 985: Error message without production error code - breaks React bundle size optimization
//   14. Line 985: Error message without production error code - breaks React bundle size optimization
//   15. Line 988: Error message without production error code - breaks React bundle size optimization
//   16. Line 988: Error message without production error code - breaks React bundle size optimization
//   17. Line 991: Error message without production error code - breaks React bundle size optimization
//   18. Line 991: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 993: Error message without production error code - breaks React bundle size optimization
//   2. Line 993: Error message without production error code - breaks React bundle size optimization
//   3. Line 996: Error message without production error code - breaks React bundle size optimization
//   4. Line 996: Error message without production error code - breaks React bundle size optimization
//   5. Line 999: Error message without production error code - breaks React bundle size optimization
//   6. Line 999: Error message without production error code - breaks React bundle size optimization
//   7. Line 1002: Error message without production error code - breaks React bundle size optimization
//   8. Line 1002: Error message without production error code - breaks React bundle size optimization
//   9. Line 1005: Error message without production error code - breaks React bundle size optimization
//   10. Line 1005: Error message without production error code - breaks React bundle size optimization
//   11. Line 1008: Error message without production error code - breaks React bundle size optimization
//   12. Line 1008: Error message without production error code - breaks React bundle size optimization
//   13. Line 1011: Error message without production error code - breaks React bundle size optimization
//   14. Line 1011: Error message without production error code - breaks React bundle size optimization
//   15. Line 1014: Error message without production error code - breaks React bundle size optimization
//   16. Line 1014: Error message without production error code - breaks React bundle size optimization
//   17. Line 1017: Error message without production error code - breaks React bundle size optimization
//   18. Line 1017: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 1019: Error message without production error code - breaks React bundle size optimization
//   2. Line 1019: Error message without production error code - breaks React bundle size optimization
//   3. Line 1022: Error message without production error code - breaks React bundle size optimization
//   4. Line 1022: Error message without production error code - breaks React bundle size optimization
//   5. Line 1025: Error message without production error code - breaks React bundle size optimization
//   6. Line 1025: Error message without production error code - breaks React bundle size optimization
//   7. Line 1028: Error message without production error code - breaks React bundle size optimization
//   8. Line 1028: Error message without production error code - breaks React bundle size optimization
//   9. Line 1031: Error message without production error code - breaks React bundle size optimization
//   10. Line 1031: Error message without production error code - breaks React bundle size optimization
//   11. Line 1034: Error message without production error code - breaks React bundle size optimization
//   12. Line 1034: Error message without production error code - breaks React bundle size optimization
//   13. Line 1037: Error message without production error code - breaks React bundle size optimization
//   14. Line 1037: Error message without production error code - breaks React bundle size optimization
//   15. Line 1040: Error message without production error code - breaks React bundle size optimization
//   16. Line 1040: Error message without production error code - breaks React bundle size optimization
//   17. Line 1043: Error message without production error code - breaks React bundle size optimization
//   18. Line 1043: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 1045: Error message without production error code - breaks React bundle size optimization
//   2. Line 1045: Error message without production error code - breaks React bundle size optimization
//   3. Line 1048: Error message without production error code - breaks React bundle size optimization
//   4. Line 1048: Error message without production error code - breaks React bundle size optimization
//   5. Line 1051: Error message without production error code - breaks React bundle size optimization
//   6. Line 1051: Error message without production error code - breaks React bundle size optimization
//   7. Line 1054: Error message without production error code - breaks React bundle size optimization
//   8. Line 1054: Error message without production error code - breaks React bundle size optimization
//   9. Line 1057: Error message without production error code - breaks React bundle size optimization
//   10. Line 1057: Error message without production error code - breaks React bundle size optimization
//   11. Line 1060: Error message without production error code - breaks React bundle size optimization
//   12. Line 1060: Error message without production error code - breaks React bundle size optimization
//   13. Line 1063: Error message without production error code - breaks React bundle size optimization
//   14. Line 1063: Error message without production error code - breaks React bundle size optimization
//   15. Line 1066: Error message without production error code - breaks React bundle size optimization
//   16. Line 1066: Error message without production error code - breaks React bundle size optimization
//   17. Line 1069: Error message without production error code - breaks React bundle size optimization
//   18. Line 1069: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (18):
//   1. Line 1071: Error message without production error code - breaks React bundle size optimization
//   2. Line 1071: Error message without production error code - breaks React bundle size optimization
//   3. Line 1074: Error message without production error code - breaks React bundle size optimization
//   4. Line 1074: Error message without production error code - breaks React bundle size optimization
//   5. Line 1077: Error message without production error code - breaks React bundle size optimization
//   6. Line 1077: Error message without production error code - breaks React bundle size optimization
//   7. Line 1080: Error message without production error code - breaks React bundle size optimization
//   8. Line 1080: Error message without production error code - breaks React bundle size optimization
//   9. Line 1083: Error message without production error code - breaks React bundle size optimization
//   10. Line 1083: Error message without production error code - breaks React bundle size optimization
//   11. Line 1086: Error message without production error code - breaks React bundle size optimization
//   12. Line 1086: Error message without production error code - breaks React bundle size optimization
//   13. Line 1089: Error message without production error code - breaks React bundle size optimization
//   14. Line 1089: Error message without production error code - breaks React bundle size optimization
//   15. Line 1092: Error message without production error code - breaks React bundle size optimization
//   16. Line 1092: Error message without production error code - breaks React bundle size optimization
//   17. Line 1095: Error message without production error code - breaks React bundle size optimization
//   18. Line 1095: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('MISSING provider');
		}
		if (typeof provider.watch !== 'function') {
			throw new Error('Provider does NOT implement watch');
		}
		if (typeof provider.stat !== 'function') {
			throw new Error('Provider does NOT implement stat');
		}
		if (typeof provider.readDirectory !== 'function') {
			throw new Error('Provider does NOT implement readDirectory');
		}
		if (typeof provider.createDirectory !== 'function') {
			throw new Error('Provider does NOT implement createDirectory');
		}
		if (typeof provider.readFile !== 'function') {
			throw new Error('Provider does NOT implement readFile');
		}
		if (typeof provider.writeFile !== 'function') {
			throw new Error('Provider does NOT implement writeFile');
		}
		if (typeof provider.delete !== 'function') {
			throw new Error('Provider does NOT implement delete');
		}
		if (typeof provider.rename !== 'function') {
			throw new Error('Provider does NOT implement rename');
		}
	}

	private static _asIStat(stat: vscode.FileStat): files.IStat {
		const { type, ctime, mtime, size, permissions } = stat;
		return { type, ctime, mtime, size, permissions };
	}

	$stat(handle: number, resource: UriComponents): Promise<files.IStat> {
		return Promise.resolve(this._getFsProvider(handle).stat(URI.revive(resource))).then(stat => ExtHostFileSystem._asIStat(stat));
	}

	$readdir(handle: number, resource: UriComponents): Promise<[string, files.FileType][]> {
		return Promise.resolve(this._getFsProvider(handle).readDirectory(URI.revive(resource)));
	}

	$readFile(handle: number, resource: UriComponents): Promise<VSBuffer> {
		return Promise.resolve(this._getFsProvider(handle).readFile(URI.revive(resource))).then(data => VSBuffer.wrap(data));
	}

	$writeFile(handle: number, resource: UriComponents, content: VSBuffer, opts: files.IFileWriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).writeFile(URI.revive(resource), content.buffer, opts));
	}

	$delete(handle: number, resource: UriComponents, opts: files.IFileDeleteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).delete(URI.revive(resource), opts));
	}

	$rename(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).rename(URI.revive(oldUri), URI.revive(newUri), opts));
	}

	$copy(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.copy) {
			throw new Error('FileSystemProvider does not implement "copy"');
		}
		return Promise.resolve(provider.copy(URI.revive(oldUri), URI.revive(newUri), opts));
	}

	$mkdir(handle: number, resource: UriComponents): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).createDirectory(URI.revive(resource)));
	}

	$watch(handle: number, session: number, resource: UriComponents, opts: files.IWatchOptions): void {
		const subscription = this._getFsProvider(handle).watch(URI.revive(resource), opts);
		this._watches.set(session, subscription);
	}

	$unwatch(_handle: number, session: number): void {
		const subscription = this._watches.get(session);
		if (subscription) {
			subscription.dispose();
			this._watches.delete(session);
		}
	}

	$open(handle: number, resource: UriComponents, opts: files.IFileOpenOptions): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.open) {
			throw new Error('FileSystemProvider does not implement "open"');
		}
		return Promise.resolve(provider.open(URI.revive(resource), opts));
	}

	$close(handle: number, fd: number): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.close) {
			throw new Error('FileSystemProvider does not implement "close"');
		}
		return Promise.resolve(provider.close(fd));
	}

	$read(handle: number, fd: number, pos: number, length: number): Promise<VSBuffer> {
		const provider = this._getFsProvider(handle);
		if (!provider.read) {
			throw new Error('FileSystemProvider does not implement "read"');
		}
		const data = VSBuffer.alloc(length);
		return Promise.resolve(provider.read(fd, pos, data.buffer, 0, length)).then(read => {
			return data.slice(0, read); // don't send zeros
		});
	}

	$write(handle: number, fd: number, pos: number, data: VSBuffer): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.write) {
			throw new Error('FileSystemProvider does not implement "write"');
		}
		return Promise.resolve(provider.write(fd, pos, data.buffer, 0, data.byteLength));
	}

	private _getFsProvider(handle: number): vscode.FileSystemProvider {
		const provider = this._fsProvider.get(handle);
		if (!provider) {
			const err = new Error();
			err.name = 'ENOPRO';
			err.message = `no provider`;
			throw err;
		}
		return provider;
	}
}
