//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';

export interface ICodeMapperResponse {
	textEdit: (resource: URI, textEdit: TextEdit[]) => void;
	notebookEdit: (resource: URI, edit: ICellEditOperation[]) => void;
}

export interface ICodeMapperCodeBlock {
	readonly code: string;
	readonly resource: URI;
	readonly markdownBeforeBlock?: string;
}

export interface ICodeMapperRequest {
	readonly codeBlocks: ICodeMapperCodeBlock[];
	readonly chatRequestId?: string;
	readonly chatRequestModel?: string;
	readonly chatSessionId?: string;
	readonly location?: string;
}

export interface ICodeMapperResult {
	readonly errorMessage?: string;
}

export interface ICodeMapperProvider {
	readonly displayName: string;
	mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken): Promise<ICodeMapperResult | undefined>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 64: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 88: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ICodeMapperService = createDecorator<ICodeMapperService>('codeMapperService');

export interface ICodeMapperService {
	readonly _serviceBrand: undefined;
	readonly providers: ICodeMapperProvider[];
	registerCodeMapperProvider(handle: number, provider: ICodeMapperProvider): IDisposable;
	mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken): Promise<ICodeMapperResult | undefined>;
}

export class CodeMapperService implements ICodeMapperService {
	_serviceBrand: undefined;

	public readonly providers: ICodeMapperProvider[] = [];

	registerCodeMapperProvider(handle: number, provider: ICodeMapperProvider): IDisposable {
		this.providers.push(provider);
		return {
			dispose: () => {
				const index = this.providers.indexOf(provider);
				if (index >= 0) {
					this.providers.splice(index, 1);
				}
			}
		};
	}

	async mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken) {
		for (const provider of this.providers) {
			const result = await provider.mapCode(request, response, token);
			if (token.isCancellationRequested) {
				return undefined;
			}
			return result;
		}
		return undefined;
	}
}
