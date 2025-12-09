//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IRange } from '../core/range.js';
import { IDocumentDiff, IDocumentDiffProviderOptions } from '../diff/documentDiffProvider.js';
import { IChange } from '../diff/legacyLinesDiffComputer.js';
import { IColorInformation, IInplaceReplaceSupportResult, TextEdit } from '../languages.js';
import { UnicodeHighlighterOptions } from './unicodeTextModelHighlighter.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import type { EditorWorker } from './editorWebWorker.js';
import { SectionHeader, FindSectionHeaderOptions } from './findSectionHeaders.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { StringEdit } from '../core/edits/stringEdit.js';

export const IEditorWorkerService = createDecorator<IEditorWorkerService>('editorWorkerService');

export type DiffAlgorithmName = 'legacy' | 'advanced';

export interface IEditorWorkerService {
	readonly _serviceBrand: undefined;

	canComputeUnicodeHighlights(uri: URI): boolean;
	computedUnicodeHighlights(uri: URI, options: UnicodeHighlighterOptions, range?: IRange): Promise<IUnicodeHighlightsResult>;

	/** Implementation in {@link EditorWorker.computeDiff} */
	computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null>;

	canComputeDirtyDiff(original: URI, modified: URI): boolean;
	computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null>;

	computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined, pretty?: boolean): Promise<TextEdit[] | undefined>;
	computeHumanReadableDiff(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined>;

	computeStringEditFromDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): Promise<StringEdit>;

	canComputeWordRanges(resource: URI): boolean;
	computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null>;

	canNavigateValueSet(resource: URI): boolean;
	navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null>;

	findSectionHeaders(uri: URI, options: FindSectionHeaderOptions): Promise<SectionHeader[]>;

	computeDefaultDocumentColors(uri: URI): Promise<IColorInformation[] | null>;

}

export interface IDiffComputationResult {
	quitEarly: boolean;
	changes: ILineChange[];
	identical: boolean;
	moves: ITextMove[];
}

export type ILineChange = [
	originalStartLine: number,
	originalEndLine: number,
	modifiedStartLine: number,
	modifiedEndLine: number,
	charChanges: ICharChange[] | undefined,
];

export type ICharChange = [
	originalStartLine: number,
	originalStartColumn: number,
	originalEndLine: number,
	originalEndColumn: number,

	modifiedStartLine: number,
	modifiedStartColumn: number,
	modifiedEndLine: number,
	modifiedEndColumn: number,
];

export type ITextMove = [
	originalStartLine: number,
	originalEndLine: number,
	modifiedStartLine: number,
	modifiedEndLine: number,
	changes: ILineChange[],
];

export interface IUnicodeHighlightsResult {
	ranges: IRange[];
	hasMore: boolean;
	nonBasicAsciiCharacterCount: number;
	invisibleCharacterCount: number;
	ambiguousCharacterCount: number;
}
