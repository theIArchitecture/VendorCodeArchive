/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageFeatureRegistry, NotebookInfoResolver } from '../languageFeatureRegistry.js';
import { CodeActionProvider, CodeLensProvider, CompletionItemProvider, DeclarationProvider, DefinitionProvider, DocumentColorProvider, DocumentFormattingEditProvider, DocumentHighlightProvider, DocumentDropEditProvider, DocumentPasteEditProvider, DocumentRangeFormattingEditProvider, DocumentRangeSemanticTokensProvider, DocumentSemanticTokensProvider, DocumentSymbolProvider, EvaluatableExpressionProvider, FoldingRangeProvider, HoverProvider, ImplementationProvider, InlayHintsProvider, InlineCompletionsProvider, InlineValuesProvider, LinkedEditingRangeProvider, LinkProvider, MultiDocumentHighlightProvider, NewSymbolNamesProvider, OnTypeFormattingEditProvider, ReferenceProvider, RenameProvider, SelectionRangeProvider, SignatureHelpProvider, TypeDefinitionProvider } from '../languages.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 10: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILanguageFeaturesService = createDecorator<ILanguageFeaturesService>('ILanguageFeaturesService');

export interface ILanguageFeaturesService {

	readonly _serviceBrand: undefined;

	readonly referenceProvider: LanguageFeatureRegistry<ReferenceProvider>;

	readonly definitionProvider: LanguageFeatureRegistry<DefinitionProvider>;

	readonly typeDefinitionProvider: LanguageFeatureRegistry<TypeDefinitionProvider>;

	readonly declarationProvider: LanguageFeatureRegistry<DeclarationProvider>;

	readonly implementationProvider: LanguageFeatureRegistry<ImplementationProvider>;

	readonly codeActionProvider: LanguageFeatureRegistry<CodeActionProvider>;

	readonly documentPasteEditProvider: LanguageFeatureRegistry<DocumentPasteEditProvider>;

	readonly renameProvider: LanguageFeatureRegistry<RenameProvider>;

	readonly newSymbolNamesProvider: LanguageFeatureRegistry<NewSymbolNamesProvider>;

	readonly documentFormattingEditProvider: LanguageFeatureRegistry<DocumentFormattingEditProvider>;

	readonly documentRangeFormattingEditProvider: LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>;

	readonly onTypeFormattingEditProvider: LanguageFeatureRegistry<OnTypeFormattingEditProvider>;

	readonly documentSymbolProvider: LanguageFeatureRegistry<DocumentSymbolProvider>;

	readonly inlayHintsProvider: LanguageFeatureRegistry<InlayHintsProvider>;

	readonly colorProvider: LanguageFeatureRegistry<DocumentColorProvider>;

	readonly codeLensProvider: LanguageFeatureRegistry<CodeLensProvider>;

	readonly signatureHelpProvider: LanguageFeatureRegistry<SignatureHelpProvider>;

	readonly hoverProvider: LanguageFeatureRegistry<HoverProvider>;

	readonly documentHighlightProvider: LanguageFeatureRegistry<DocumentHighlightProvider>;

	readonly multiDocumentHighlightProvider: LanguageFeatureRegistry<MultiDocumentHighlightProvider>;

	readonly documentRangeSemanticTokensProvider: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>;

	readonly documentSemanticTokensProvider: LanguageFeatureRegistry<DocumentSemanticTokensProvider>;

	readonly selectionRangeProvider: LanguageFeatureRegistry<SelectionRangeProvider>;

	readonly foldingRangeProvider: LanguageFeatureRegistry<FoldingRangeProvider>;

	readonly linkProvider: LanguageFeatureRegistry<LinkProvider>;

	readonly inlineCompletionsProvider: LanguageFeatureRegistry<InlineCompletionsProvider>;

	readonly completionProvider: LanguageFeatureRegistry<CompletionItemProvider>;

	readonly linkedEditingRangeProvider: LanguageFeatureRegistry<LinkedEditingRangeProvider>;

	readonly inlineValuesProvider: LanguageFeatureRegistry<InlineValuesProvider>;

	readonly evaluatableExpressionProvider: LanguageFeatureRegistry<EvaluatableExpressionProvider>;

	readonly documentDropEditProvider: LanguageFeatureRegistry<DocumentDropEditProvider>;

	// --

	setNotebookTypeResolver(resolver: NotebookInfoResolver | undefined): void;
}
