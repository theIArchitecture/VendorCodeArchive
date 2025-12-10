//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { derived, IObservable, IReader, observableFromEvent } from '../../../../base/common/observable.js';
import { ITreeSitterThemeService } from '../../../../editor/common/services/treeSitter/treeSitterThemeService.js';
import { ColorThemeData, findMetadata } from '../../themes/common/colorThemeData.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IWorkbenchThemeService } from '../../themes/common/workbenchThemeService.js';

export class TreeSitterThemeService implements ITreeSitterThemeService {
	_serviceBrand: undefined;
	public readonly onChange: IObservable<void>;
	private readonly _colorTheme: IObservable<ColorThemeData>;

	constructor(
		@IWorkbenchThemeService private readonly _themeService: IWorkbenchThemeService,
	) {
		this._colorTheme = observableFromEvent(this._themeService.onDidColorThemeChange, () => this._themeService.getColorTheme() as ColorThemeData);
		this.onChange = derived(this, (reader) => {
			this._colorTheme.read(reader);
			reader.reportChange(void 0);
		});
	}

	findMetadata(captureNames: string[], languageId: number, bracket: boolean, reader: IReader | undefined): number {
		return findMetadata(this._colorTheme.read(reader), captureNames, languageId, bracket);
	}
}
