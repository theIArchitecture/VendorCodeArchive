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
