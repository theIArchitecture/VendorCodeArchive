//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { language } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IQuickPickItem } from '../../quickinput/common/quickInput.js';
import { localize } from '../../../nls.js';
import { IExtensionGalleryService, IGalleryExtension } from '../../extensionManagement/common/extensionManagement.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export function getLocale(extension: IGalleryExtension): string | undefined {
	return extension.tags.find(t => t.startsWith('lp-'))?.split('lp-')[1];
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 87: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILanguagePackService = createDecorator<ILanguagePackService>('languagePackService');

export interface ILanguagePackItem extends IQuickPickItem {
	readonly extensionId?: string;
	readonly galleryExtension?: IGalleryExtension;
}

export interface ILanguagePackService {
	readonly _serviceBrand: undefined;
	getAvailableLanguages(): Promise<Array<ILanguagePackItem>>;
	getInstalledLanguages(): Promise<Array<ILanguagePackItem>>;
	getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined>;
}

export abstract class LanguagePackBaseService extends Disposable implements ILanguagePackService {
	declare readonly _serviceBrand: undefined;

	constructor(@IExtensionGalleryService protected readonly extensionGalleryService: IExtensionGalleryService) {
		super();
	}

	abstract getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined>;

	abstract getInstalledLanguages(): Promise<Array<ILanguagePackItem>>;

	async getAvailableLanguages(): Promise<ILanguagePackItem[]> {
		const timeout = new CancellationTokenSource();
		setTimeout(() => timeout.cancel(), 1000);

		let result;
		try {
			result = await this.extensionGalleryService.query({
				text: 'category:"language packs"',
				pageSize: 20
			}, timeout.token);
		} catch (_) {
			// This method is best effort. So, we ignore any errors.
			return [];
		}

		const languagePackExtensions = result.firstPage.filter(e => e.properties.localizedLanguages?.length && e.tags.some(t => t.startsWith('lp-')));
		const allFromMarketplace: ILanguagePackItem[] = languagePackExtensions.map(lp => {
			const languageName = lp.properties.localizedLanguages?.[0];
			const locale = getLocale(lp)!;
			const baseQuickPick = this.createQuickPickItem(locale, languageName, lp);
			return {
				...baseQuickPick,
				extensionId: lp.identifier.id,
				galleryExtension: lp
			};
		});

		allFromMarketplace.push(this.createQuickPickItem('en', 'English'));

		return allFromMarketplace;
	}

	protected createQuickPickItem(locale: string, languageName?: string, languagePack?: IGalleryExtension): IQuickPickItem {
		const label = languageName ?? locale;
		let description: string | undefined;
		if (label !== locale) {
			description = `(${locale})`;
		}

		if (locale.toLowerCase() === language.toLowerCase()) {
			description ??= '';
			description += localize('currentDisplayLanguage', " (Current)");
		}

		if (languagePack?.installCount) {
			description ??= '';

			const count = languagePack.installCount;
			let countLabel: string;
			if (count > 1000000) {
				countLabel = `${Math.floor(count / 100000) / 10}M`;
			} else if (count > 1000) {
				countLabel = `${Math.floor(count / 1000)}K`;
			} else {
				countLabel = String(count);
			}
			description += ` $(cloud-download) ${countLabel}`;
		}

		return {
			id: locale,
			label,
			description
		};
	}
}
