//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IconContribution } from '../../common/iconRegistry.js';
import { ColorScheme } from '../../common/theme.js';
import { IColorTheme, IFileIconTheme, IProductIconTheme, IThemeService, ITokenStyle } from '../../common/themeService.js';

export class TestColorTheme implements IColorTheme {

	public readonly label = 'test';

	constructor(
		private colors: { [id: string]: string | undefined } = {},
		public type = ColorScheme.DARK,
		public readonly semanticHighlighting = false
	) { }

	getColor(color: string, useDefault?: boolean): Color | undefined {
		const value = this.colors[color];
		if (value) {
			return Color.fromHex(value);
		}
		return undefined;
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	defines(color: string): boolean {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}

	getTokenStyleMetadata(type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined {
		return undefined;
	}

	get tokenColorMap(): string[] {
		return [];
	}
}

class TestFileIconTheme implements IFileIconTheme {
	hasFileIcons = false;
	hasFolderIcons = false;
	hidesExplorerArrows = false;
}

class UnthemedProductIconTheme implements IProductIconTheme {
	getIcon(contribution: IconContribution) {
		return undefined;
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export class TestThemeService implements IThemeService {

	declare readonly _serviceBrand: undefined;
	_colorTheme: IColorTheme;
	_fileIconTheme: IFileIconTheme;
	_productIconTheme: IProductIconTheme;
	_onThemeChange = new Emitter<IColorTheme>();
	_onFileIconThemeChange = new Emitter<IFileIconTheme>();
	_onProductIconThemeChange = new Emitter<IProductIconTheme>();

	constructor(theme = new TestColorTheme(), fileIconTheme = new TestFileIconTheme(), productIconTheme = new UnthemedProductIconTheme()) {
		this._colorTheme = theme;
		this._fileIconTheme = fileIconTheme;
		this._productIconTheme = productIconTheme;
	}

	getColorTheme(): IColorTheme {
		return this._colorTheme;
	}

	setTheme(theme: IColorTheme) {
		this._colorTheme = theme;
		this.fireThemeChange();
	}

	fireThemeChange() {
		this._onThemeChange.fire(this._colorTheme);
	}

	public get onDidColorThemeChange(): Event<IColorTheme> {
		return this._onThemeChange.event;
	}

	getFileIconTheme(): IFileIconTheme {
		return this._fileIconTheme;
	}

	public get onDidFileIconThemeChange(): Event<IFileIconTheme> {
		return this._onFileIconThemeChange.event;
	}

	getProductIconTheme(): IProductIconTheme {
		return this._productIconTheme;
	}

	public get onDidProductIconThemeChange(): Event<IProductIconTheme> {
		return this._onProductIconThemeChange.event;
	}
}
