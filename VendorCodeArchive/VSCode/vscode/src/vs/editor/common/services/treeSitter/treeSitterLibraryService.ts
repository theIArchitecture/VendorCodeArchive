//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Language, Parser, Query } from '@vscode/tree-sitter-wasm';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 10: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IReader } from '../../../../base/common/observable.js';

export const ITreeSitterLibraryService = createDecorator<ITreeSitterLibraryService>('treeSitterLibraryService');

export interface ITreeSitterLibraryService {
	readonly _serviceBrand: undefined;

	getParserClass(): Promise<typeof Parser>;

	supportsLanguage(languageId: string, reader: IReader | undefined): boolean;
	getLanguage(languageId: string, reader: IReader | undefined): Language | undefined;
	/**
	 * Return value of null indicates that there are no injection queries for this language.
	 * @param languageId
	 * @param reader
	 */
	getInjectionQueries(languageId: string, reader: IReader | undefined): Query | null | undefined;
	/**
	 * Return value of null indicates that there are no highlights queries for this language.
	 * @param languageId
	 * @param reader
	 */
	getHighlightingQueries(languageId: string, reader: IReader | undefined): Query | null | undefined;
}
