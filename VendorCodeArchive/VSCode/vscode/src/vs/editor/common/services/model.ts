/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { ITextBufferFactory, ITextModel, ITextModelCreationOptions } from '../model.js';
import { ILanguageSelection } from '../languages/language.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { DocumentSemanticTokensProvider, DocumentRangeSemanticTokensProvider } from '../languages.js';
import { TextModelEditSource } from '../textModelEditSource.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IModelService = createDecorator<IModelService>('modelService');

export type DocumentTokensProvider = DocumentSemanticTokensProvider | DocumentRangeSemanticTokensProvider;

export interface IModelService {
	readonly _serviceBrand: undefined;

	createModel(value: string | ITextBufferFactory, languageSelection: ILanguageSelection | null, resource?: URI, isForSimpleWidget?: boolean): ITextModel;

	updateModel(model: ITextModel, value: string | ITextBufferFactory, reason?: TextModelEditSource): void;

	destroyModel(resource: URI): void;

	getModels(): ITextModel[];

	getCreationOptions(language: string, resource: URI, isForSimpleWidget: boolean): ITextModelCreationOptions;

	getModel(resource: URI): ITextModel | null;

	readonly onModelAdded: Event<ITextModel>;

	readonly onModelRemoved: Event<ITextModel>;

	readonly onModelLanguageChanged: Event<{ readonly model: ITextModel; readonly oldLanguageId: string }>;
}
