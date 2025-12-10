//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Model } from '../model';
import { GitExtension, Repository, API } from './git';
import { ApiRepository, ApiImpl } from './api1';
import { Event, EventEmitter } from 'vscode';

function deprecated(original: any, context: ClassMemberDecoratorContext) {
	if (context.kind !== 'method') {
		throw new Error('not supported');
	}

	const key = context.name.toString();
	return function (this: any, ...args: any[]): any {
		console.warn(`Git extension API method '${key}' is deprecated.`);
		return original.apply(this, args);
	};
}

export class GitExtensionImpl implements GitExtension {

	enabled: boolean = false;

	private _onDidChangeEnablement = new EventEmitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _model: Model | undefined = undefined;

	set model(model: Model | undefined) {
		this._model = model;

		const enabled = !!model;

		if (this.enabled === enabled) {
			return;
		}

		this.enabled = enabled;
		this._onDidChangeEnablement.fire(this.enabled);
	}

	get model(): Model | undefined {
		return this._model;
	}

	constructor(model?: Model) {
		if (model) {
			this.enabled = true;
			this._model = model;
		}
	}

	@deprecated
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
//   3. Line 68: Error message without production error code - breaks React bundle size optimization
//   4. Line 68: Error message without production error code - breaks React bundle size optimization
//   5. Line 76: Error message without production error code - breaks React bundle size optimization
//   6. Line 76: Error message without production error code - breaks React bundle size optimization
//   7. Line 80: Error message without production error code - breaks React bundle size optimization
//   8. Line 80: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async getGitPath(): Promise<string> {
		if (!this._model) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 77: Error message without production error code - breaks React bundle size optimization
//   2. Line 77: Error message without production error code - breaks React bundle size optimization
//   3. Line 86: Error message without production error code - breaks React bundle size optimization
//   4. Line 86: Error message without production error code - breaks React bundle size optimization
//   5. Line 94: Error message without production error code - breaks React bundle size optimization
//   6. Line 94: Error message without production error code - breaks React bundle size optimization
//   7. Line 98: Error message without production error code - breaks React bundle size optimization
//   8. Line 98: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Git model not found');
		}

		return this._model.git.path;
	}

	@deprecated
	async getRepositories(): Promise<Repository[]> {
		if (!this._model) {
			throw new Error('Git model not found');
		}

		return this._model.repositories.map(repository => new ApiRepository(repository));
	}

	getAPI(version: number): API {
		if (!this._model) {
			throw new Error('Git model not found');
		}

		if (version !== 1) {
			throw new Error(`No API version ${version} found.`);
		}

		return new ApiImpl(this._model);
	}
}
