//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { LanguageId, MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { IState, Token } from '../../../common/languages.js';
import { TokenTheme } from '../../../common/languages/supports/tokenization.js';
import { LanguageService } from '../../../common/services/languageService.js';
import { ILineTokens, IToken, TokenizationSupportAdapter, TokensProvider } from '../../browser/standaloneLanguages.js';
import { IStandaloneTheme, IStandaloneThemeData, IStandaloneThemeService } from '../../common/standaloneTheme.js';
import { UnthemedProductIconTheme } from '../../../../platform/theme/browser/iconsStyleSheet.js';
import { ColorIdentifier } from '../../../../platform/theme/common/colorRegistry.js';
import { ColorScheme } from '../../../../platform/theme/common/theme.js';
import { IColorTheme, IFileIconTheme, IProductIconTheme, ITokenStyle } from '../../../../platform/theme/common/themeService.js';

suite('TokenizationSupport2Adapter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const languageId = 'tttt';
	// const tokenMetadata = (LanguageId.PlainText << MetadataConsts.LANGUAGEID_OFFSET);

	class MockTokenTheme extends TokenTheme {
		private counter = 0;
		constructor() {
			super(null!, null!);
		}
		public override match(languageId: LanguageId, token: string): number {
			return (
				((this.counter++) << MetadataConsts.FOREGROUND_OFFSET)
				| (languageId << MetadataConsts.LANGUAGEID_OFFSET)
			) >>> 0;
		}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Error message without production error code - breaks React bundle size optimization
//   3. Line 45: Error message without production error code - breaks React bundle size optimization
//   4. Line 48: Error message without production error code - breaks React bundle size optimization
//   5. Line 48: Error message without production error code - breaks React bundle size optimization
//   6. Line 51: Error message without production error code - breaks React bundle size optimization
//   7. Line 51: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 59: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 62: Error message without production error code - breaks React bundle size optimization
//   3. Line 62: Error message without production error code - breaks React bundle size optimization
//   4. Line 65: Error message without production error code - breaks React bundle size optimization
//   5. Line 65: Error message without production error code - breaks React bundle size optimization
//   6. Line 68: Error message without production error code - breaks React bundle size optimization
//   7. Line 68: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 77: Error message without production error code - breaks React bundle size optimization
//   3. Line 77: Error message without production error code - breaks React bundle size optimization
//   4. Line 80: Error message without production error code - breaks React bundle size optimization
//   5. Line 80: Error message without production error code - breaks React bundle size optimization
//   6. Line 83: Error message without production error code - breaks React bundle size optimization
//   7. Line 83: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 92: Error message without production error code - breaks React bundle size optimization
//   3. Line 92: Error message without production error code - breaks React bundle size optimization
//   4. Line 95: Error message without production error code - breaks React bundle size optimization
//   5. Line 95: Error message without production error code - breaks React bundle size optimization
//   6. Line 98: Error message without production error code - breaks React bundle size optimization
//   7. Line 98: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 107: Error message without production error code - breaks React bundle size optimization
//   3. Line 107: Error message without production error code - breaks React bundle size optimization
//   4. Line 110: Error message without production error code - breaks React bundle size optimization
//   5. Line 110: Error message without production error code - breaks React bundle size optimization
//   6. Line 113: Error message without production error code - breaks React bundle size optimization
//   7. Line 113: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 119: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 122: Error message without production error code - breaks React bundle size optimization
//   3. Line 122: Error message without production error code - breaks React bundle size optimization
//   4. Line 125: Error message without production error code - breaks React bundle size optimization
//   5. Line 125: Error message without production error code - breaks React bundle size optimization
//   6. Line 128: Error message without production error code - breaks React bundle size optimization
//   7. Line 128: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 137: Error message without production error code - breaks React bundle size optimization
//   3. Line 137: Error message without production error code - breaks React bundle size optimization
//   4. Line 140: Error message without production error code - breaks React bundle size optimization
//   5. Line 140: Error message without production error code - breaks React bundle size optimization
//   6. Line 143: Error message without production error code - breaks React bundle size optimization
//   7. Line 143: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 149: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 152: Error message without production error code - breaks React bundle size optimization
//   3. Line 152: Error message without production error code - breaks React bundle size optimization
//   4. Line 155: Error message without production error code - breaks React bundle size optimization
//   5. Line 155: Error message without production error code - breaks React bundle size optimization
//   6. Line 158: Error message without production error code - breaks React bundle size optimization
//   7. Line 158: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 167: Error message without production error code - breaks React bundle size optimization
//   3. Line 167: Error message without production error code - breaks React bundle size optimization
//   4. Line 170: Error message without production error code - breaks React bundle size optimization
//   5. Line 170: Error message without production error code - breaks React bundle size optimization
//   6. Line 173: Error message without production error code - breaks React bundle size optimization
//   7. Line 173: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 182: Error message without production error code - breaks React bundle size optimization
//   3. Line 182: Error message without production error code - breaks React bundle size optimization
//   4. Line 185: Error message without production error code - breaks React bundle size optimization
//   5. Line 185: Error message without production error code - breaks React bundle size optimization
//   6. Line 188: Error message without production error code - breaks React bundle size optimization
//   7. Line 188: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 194: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 197: Error message without production error code - breaks React bundle size optimization
//   3. Line 197: Error message without production error code - breaks React bundle size optimization
//   4. Line 200: Error message without production error code - breaks React bundle size optimization
//   5. Line 200: Error message without production error code - breaks React bundle size optimization
//   6. Line 203: Error message without production error code - breaks React bundle size optimization
//   7. Line 203: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 212: Error message without production error code - breaks React bundle size optimization
//   3. Line 212: Error message without production error code - breaks React bundle size optimization
//   4. Line 215: Error message without production error code - breaks React bundle size optimization
//   5. Line 215: Error message without production error code - breaks React bundle size optimization
//   6. Line 218: Error message without production error code - breaks React bundle size optimization
//   7. Line 218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 224: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
//   3. Line 227: Error message without production error code - breaks React bundle size optimization
//   4. Line 230: Error message without production error code - breaks React bundle size optimization
//   5. Line 230: Error message without production error code - breaks React bundle size optimization
//   6. Line 233: Error message without production error code - breaks React bundle size optimization
//   7. Line 233: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 239: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 242: Error message without production error code - breaks React bundle size optimization
//   3. Line 242: Error message without production error code - breaks React bundle size optimization
//   4. Line 245: Error message without production error code - breaks React bundle size optimization
//   5. Line 245: Error message without production error code - breaks React bundle size optimization
//   6. Line 248: Error message without production error code - breaks React bundle size optimization
//   7. Line 248: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 257: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Error message without production error code - breaks React bundle size optimization
//   4. Line 260: Error message without production error code - breaks React bundle size optimization
//   5. Line 260: Error message without production error code - breaks React bundle size optimization
//   6. Line 263: Error message without production error code - breaks React bundle size optimization
//   7. Line 263: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 272: Error message without production error code - breaks React bundle size optimization
//   3. Line 272: Error message without production error code - breaks React bundle size optimization
//   4. Line 275: Error message without production error code - breaks React bundle size optimization
//   5. Line 275: Error message without production error code - breaks React bundle size optimization
//   6. Line 278: Error message without production error code - breaks React bundle size optimization
//   7. Line 278: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 284: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 287: Error message without production error code - breaks React bundle size optimization
//   4. Line 290: Error message without production error code - breaks React bundle size optimization
//   5. Line 290: Error message without production error code - breaks React bundle size optimization
//   6. Line 293: Error message without production error code - breaks React bundle size optimization
//   7. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 302: Error message without production error code - breaks React bundle size optimization
//   3. Line 302: Error message without production error code - breaks React bundle size optimization
//   4. Line 305: Error message without production error code - breaks React bundle size optimization
//   5. Line 305: Error message without production error code - breaks React bundle size optimization
//   6. Line 308: Error message without production error code - breaks React bundle size optimization
//   7. Line 308: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 314: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 317: Error message without production error code - breaks React bundle size optimization
//   3. Line 317: Error message without production error code - breaks React bundle size optimization
//   4. Line 320: Error message without production error code - breaks React bundle size optimization
//   5. Line 320: Error message without production error code - breaks React bundle size optimization
//   6. Line 323: Error message without production error code - breaks React bundle size optimization
//   7. Line 323: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 332: Error message without production error code - breaks React bundle size optimization
//   3. Line 332: Error message without production error code - breaks React bundle size optimization
//   4. Line 335: Error message without production error code - breaks React bundle size optimization
//   5. Line 335: Error message without production error code - breaks React bundle size optimization
//   6. Line 338: Error message without production error code - breaks React bundle size optimization
//   7. Line 338: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 347: Error message without production error code - breaks React bundle size optimization
//   3. Line 347: Error message without production error code - breaks React bundle size optimization
//   4. Line 350: Error message without production error code - breaks React bundle size optimization
//   5. Line 350: Error message without production error code - breaks React bundle size optimization
//   6. Line 353: Error message without production error code - breaks React bundle size optimization
//   7. Line 353: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 359: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 362: Error message without production error code - breaks React bundle size optimization
//   3. Line 362: Error message without production error code - breaks React bundle size optimization
//   4. Line 365: Error message without production error code - breaks React bundle size optimization
//   5. Line 365: Error message without production error code - breaks React bundle size optimization
//   6. Line 368: Error message without production error code - breaks React bundle size optimization
//   7. Line 368: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 377: Error message without production error code - breaks React bundle size optimization
//   3. Line 377: Error message without production error code - breaks React bundle size optimization
//   4. Line 380: Error message without production error code - breaks React bundle size optimization
//   5. Line 380: Error message without production error code - breaks React bundle size optimization
//   6. Line 383: Error message without production error code - breaks React bundle size optimization
//   7. Line 383: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 389: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 392: Error message without production error code - breaks React bundle size optimization
//   3. Line 392: Error message without production error code - breaks React bundle size optimization
//   4. Line 395: Error message without production error code - breaks React bundle size optimization
//   5. Line 395: Error message without production error code - breaks React bundle size optimization
//   6. Line 398: Error message without production error code - breaks React bundle size optimization
//   7. Line 398: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	class MockThemeService implements IStandaloneThemeService {
		declare readonly _serviceBrand: undefined;
		public setTheme(themeName: string): string {
			throw new Error('Not implemented');
		}
		public setAutoDetectHighContrast(autoDetectHighContrast: boolean): void {
			throw new Error('Not implemented');
		}
		public defineTheme(themeName: string, themeData: IStandaloneThemeData): void {
			throw new Error('Not implemented');
		}
		public getColorTheme(): IStandaloneTheme {
			return {
				label: 'mock',

				tokenTheme: new MockTokenTheme(),

				themeName: ColorScheme.LIGHT,

				type: ColorScheme.LIGHT,
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 64: Error message without production error code - breaks React bundle size optimization
//   2. Line 64: Error message without production error code - breaks React bundle size optimization
//   3. Line 68: Error message without production error code - breaks React bundle size optimization
//   4. Line 68: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


				getColor: (color: ColorIdentifier, useDefault?: boolean): Color => {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
//   3. Line 97: Error message without production error code - breaks React bundle size optimization
//   4. Line 97: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 120: Error message without production error code - breaks React bundle size optimization
//   2. Line 120: Error message without production error code - breaks React bundle size optimization
//   3. Line 124: Error message without production error code - breaks React bundle size optimization
//   4. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 147: Error message without production error code - breaks React bundle size optimization
//   2. Line 147: Error message without production error code - breaks React bundle size optimization
//   3. Line 151: Error message without production error code - breaks React bundle size optimization
//   4. Line 151: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 174: Error message without production error code - breaks React bundle size optimization
//   2. Line 174: Error message without production error code - breaks React bundle size optimization
//   3. Line 178: Error message without production error code - breaks React bundle size optimization
//   4. Line 178: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 201: Error message without production error code - breaks React bundle size optimization
//   2. Line 201: Error message without production error code - breaks React bundle size optimization
//   3. Line 205: Error message without production error code - breaks React bundle size optimization
//   4. Line 205: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 228: Error message without production error code - breaks React bundle size optimization
//   2. Line 228: Error message without production error code - breaks React bundle size optimization
//   3. Line 232: Error message without production error code - breaks React bundle size optimization
//   4. Line 232: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 255: Error message without production error code - breaks React bundle size optimization
//   2. Line 255: Error message without production error code - breaks React bundle size optimization
//   3. Line 259: Error message without production error code - breaks React bundle size optimization
//   4. Line 259: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 282: Error message without production error code - breaks React bundle size optimization
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
//   3. Line 286: Error message without production error code - breaks React bundle size optimization
//   4. Line 286: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 309: Error message without production error code - breaks React bundle size optimization
//   2. Line 309: Error message without production error code - breaks React bundle size optimization
//   3. Line 313: Error message without production error code - breaks React bundle size optimization
//   4. Line 313: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 336: Error message without production error code - breaks React bundle size optimization
//   2. Line 336: Error message without production error code - breaks React bundle size optimization
//   3. Line 340: Error message without production error code - breaks React bundle size optimization
//   4. Line 340: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 363: Error message without production error code - breaks React bundle size optimization
//   2. Line 363: Error message without production error code - breaks React bundle size optimization
//   3. Line 367: Error message without production error code - breaks React bundle size optimization
//   4. Line 367: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 390: Error message without production error code - breaks React bundle size optimization
//   2. Line 390: Error message without production error code - breaks React bundle size optimization
//   3. Line 394: Error message without production error code - breaks React bundle size optimization
//   4. Line 394: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 417: Error message without production error code - breaks React bundle size optimization
//   2. Line 417: Error message without production error code - breaks React bundle size optimization
//   3. Line 421: Error message without production error code - breaks React bundle size optimization
//   4. Line 421: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 444: Error message without production error code - breaks React bundle size optimization
//   2. Line 444: Error message without production error code - breaks React bundle size optimization
//   3. Line 448: Error message without production error code - breaks React bundle size optimization
//   4. Line 448: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 471: Error message without production error code - breaks React bundle size optimization
//   2. Line 471: Error message without production error code - breaks React bundle size optimization
//   3. Line 475: Error message without production error code - breaks React bundle size optimization
//   4. Line 475: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 498: Error message without production error code - breaks React bundle size optimization
//   2. Line 498: Error message without production error code - breaks React bundle size optimization
//   3. Line 502: Error message without production error code - breaks React bundle size optimization
//   4. Line 502: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 525: Error message without production error code - breaks React bundle size optimization
//   2. Line 525: Error message without production error code - breaks React bundle size optimization
//   3. Line 529: Error message without production error code - breaks React bundle size optimization
//   4. Line 529: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 552: Error message without production error code - breaks React bundle size optimization
//   2. Line 552: Error message without production error code - breaks React bundle size optimization
//   3. Line 556: Error message without production error code - breaks React bundle size optimization
//   4. Line 556: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 579: Error message without production error code - breaks React bundle size optimization
//   2. Line 579: Error message without production error code - breaks React bundle size optimization
//   3. Line 583: Error message without production error code - breaks React bundle size optimization
//   4. Line 583: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 606: Error message without production error code - breaks React bundle size optimization
//   2. Line 606: Error message without production error code - breaks React bundle size optimization
//   3. Line 610: Error message without production error code - breaks React bundle size optimization
//   4. Line 610: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 633: Error message without production error code - breaks React bundle size optimization
//   2. Line 633: Error message without production error code - breaks React bundle size optimization
//   3. Line 637: Error message without production error code - breaks React bundle size optimization
//   4. Line 637: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 660: Error message without production error code - breaks React bundle size optimization
//   2. Line 660: Error message without production error code - breaks React bundle size optimization
//   3. Line 664: Error message without production error code - breaks React bundle size optimization
//   4. Line 664: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 687: Error message without production error code - breaks React bundle size optimization
//   2. Line 687: Error message without production error code - breaks React bundle size optimization
//   3. Line 691: Error message without production error code - breaks React bundle size optimization
//   4. Line 691: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error('Not implemented');
				},

				defines: (color: ColorIdentifier): boolean => {
					throw new Error('Not implemented');
				},

				getTokenStyleMetadata: (type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined => {
					return undefined;
				},

				semanticHighlighting: false,

				tokenColorMap: []
			};
		}
		setColorMapOverride(colorMapOverride: Color[] | null): void {
		}
		public getFileIconTheme(): IFileIconTheme {
			return {
				hasFileIcons: false,
				hasFolderIcons: false,
				hidesExplorerArrows: false
			};
		}

		private _builtInProductIconTheme = new UnthemedProductIconTheme();

		public getProductIconTheme(): IProductIconTheme {
			return this._builtInProductIconTheme;
		}
		public readonly onDidColorThemeChange = new Emitter<IColorTheme>().event;
		public readonly onDidFileIconThemeChange = new Emitter<IFileIconTheme>().event;
		public readonly onDidProductIconThemeChange = new Emitter<IProductIconTheme>().event;
	}

	class MockState implements IState {
		public static readonly INSTANCE = new MockState();
		private constructor() { }
		public clone(): IState {
			return this;
		}
		public equals(other: IState): boolean {
			return this === other;
		}
	}

	function testBadTokensProvider(providerTokens: IToken[], expectedClassicTokens: Token[], expectedModernTokens: number[]): void {

		class BadTokensProvider implements TokensProvider {
			public getInitialState(): IState {
				return MockState.INSTANCE;
			}
			public tokenize(line: string, state: IState): ILineTokens {
				return {
					tokens: providerTokens,
					endState: MockState.INSTANCE
				};
			}
		}

		const disposables = new DisposableStore();
		const languageService = disposables.add(new LanguageService());
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const adapter = new TokenizationSupportAdapter(
			languageId,
			new BadTokensProvider(),
			languageService,
			new MockThemeService()
		);

		const actualClassicTokens = adapter.tokenize('whatever', true, MockState.INSTANCE);
		assert.deepStrictEqual(actualClassicTokens.tokens, expectedClassicTokens);

		const actualModernTokens = adapter.tokenizeEncoded('whatever', true, MockState.INSTANCE);
		const modernTokens: number[] = [];
		for (let i = 0; i < actualModernTokens.tokens.length; i++) {
			modernTokens[i] = actualModernTokens.tokens[i];
		}

		// Add the encoded language id to the expected tokens
		const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);
		const tokenLanguageMetadata = (encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET);
		for (let i = 1; i < expectedModernTokens.length; i += 2) {
			expectedModernTokens[i] |= tokenLanguageMetadata;
		}
		assert.deepStrictEqual(modernTokens, expectedModernTokens);

		disposables.dispose();
	}

	test('tokens always start at index 0', () => {
		testBadTokensProvider(
			[
				{ startIndex: 7, scopes: 'foo' },
				{ startIndex: 0, scopes: 'bar' }
			],
			[
				new Token(0, 'foo', languageId),
				new Token(0, 'bar', languageId),
			],
			[
				0, (0 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				0, (1 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK
			]
		);
	});

	test('tokens always start after each other', () => {
		testBadTokensProvider(
			[
				{ startIndex: 0, scopes: 'foo' },
				{ startIndex: 5, scopes: 'bar' },
				{ startIndex: 3, scopes: 'foo' },
			],
			[
				new Token(0, 'foo', languageId),
				new Token(5, 'bar', languageId),
				new Token(5, 'foo', languageId),
			],
			[
				0, (0 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				5, (1 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				5, (2 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK
			]
		);
	});
});
