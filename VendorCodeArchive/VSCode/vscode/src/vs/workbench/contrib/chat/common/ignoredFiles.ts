//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface ILanguageModelIgnoredFileProvider {
	isFileIgnored(uri: URI, token: CancellationToken): Promise<boolean>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export const ILanguageModelIgnoredFilesService = createDecorator<ILanguageModelIgnoredFilesService>('languageModelIgnoredFilesService');
export interface ILanguageModelIgnoredFilesService {
	_serviceBrand: undefined;

	fileIsIgnored(uri: URI, token: CancellationToken): Promise<boolean>;
	registerIgnoredFileProvider(provider: ILanguageModelIgnoredFileProvider): IDisposable;
}

export class LanguageModelIgnoredFilesService implements ILanguageModelIgnoredFilesService {
	_serviceBrand: undefined;

	private readonly _providers = new Set<ILanguageModelIgnoredFileProvider>();

	async fileIsIgnored(uri: URI, token: CancellationToken): Promise<boolean> {
		// Just use the first provider
		const provider = this._providers.values().next().value;
		return provider ?
			provider.isFileIgnored(uri, token) :
			false;
	}

	registerIgnoredFileProvider(provider: ILanguageModelIgnoredFileProvider): IDisposable {
		this._providers.add(provider);
		return toDisposable(() => {
			this._providers.delete(provider);
		});
	}
}
