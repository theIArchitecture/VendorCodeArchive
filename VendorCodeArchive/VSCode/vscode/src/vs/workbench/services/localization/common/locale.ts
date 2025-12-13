/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILanguagePackItem } from '../../../../platform/languagePacks/common/languagePacks.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 9: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILocaleService = createDecorator<ILocaleService>('localizationService');

export interface ILocaleService {
	readonly _serviceBrand: undefined;
	setLocale(languagePackItem: ILanguagePackItem, skipDialog?: boolean): Promise<void>;
	clearLocalePreference(): Promise<void>;
}

export const IActiveLanguagePackService = createDecorator<IActiveLanguagePackService>('activeLanguageService');

export interface IActiveLanguagePackService {
	readonly _serviceBrand: undefined;
	getExtensionIdProvidingCurrentLocale(): Promise<string | undefined>;
}
