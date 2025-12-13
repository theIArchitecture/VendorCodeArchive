/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../base/common/color.js';
import { ITokenThemeRule, TokenTheme } from '../../common/languages/supports/tokenization.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IColorTheme, IThemeService } from '../../../platform/theme/common/themeService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IStandaloneThemeService = createDecorator<IStandaloneThemeService>('themeService');

export type BuiltinTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
export type IColors = { [colorId: string]: string };

export interface IStandaloneThemeData {
	base: BuiltinTheme;
	inherit: boolean;
	rules: ITokenThemeRule[];
	encodedTokensColors?: string[];
	colors: IColors;
}

export interface IStandaloneTheme extends IColorTheme {
	tokenTheme: TokenTheme;
	themeName: string;
}

export interface IStandaloneThemeService extends IThemeService {
	readonly _serviceBrand: undefined;

	setTheme(themeName: string): void;

	setAutoDetectHighContrast(autoDetectHighContrast: boolean): void;

	defineTheme(themeName: string, themeData: IStandaloneThemeData): void;

	getColorTheme(): IStandaloneTheme;

	setColorMapOverride(colorMapOverride: Color[] | null): void;

}
