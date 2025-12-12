/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extensions } from 'vscode';
import { API as GitBaseAPI, GitBaseExtension } from './typings/git-base';

export class GitBaseApi {

	private static _gitBaseApi: GitBaseAPI | undefined;

	static getAPI(): GitBaseAPI {
		if (!this._gitBaseApi) {
			const gitBaseExtension = extensions.getExtension<GitBaseExtension>('vscode.git-base')!.exports;
			const onDidChangeGitBaseExtensionEnablement = (enabled: boolean) => {
				this._gitBaseApi = enabled ? gitBaseExtension.getAPI(1) : undefined;
			};

			gitBaseExtension.onDidChangeEnablement(onDidChangeGitBaseExtensionEnablement);
			onDidChangeGitBaseExtensionEnablement(gitBaseExtension.enabled);

			if (!this._gitBaseApi) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 24: Error message without production error code - breaks React bundle size optimization
//   2. Line 24: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('vscode.git-base extension is not enabled.');
			}
		}

		return this._gitBaseApi;
	}
}
