//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface PreviewSettings {
	readonly source: string;
	readonly line?: number;
	readonly fragment?: string;
	readonly selectedLine?: number;

	readonly scrollPreviewWithEditor?: boolean;
	readonly scrollEditorWithPreview: boolean;
	readonly disableSecurityWarnings: boolean;
	readonly doubleClickToSwitchToEditor: boolean;
	readonly webviewResourceRoot: string;
}

export function getRawData(key: string): string {
	const element = document.getElementById('vscode-markdown-preview-data');
	if (element) {
		const data = element.getAttribute(key);
		if (data) {
			return data;
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 28: Error message without production error code - breaks React bundle size optimization
//   2. Line 28: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}

	throw new Error(`Could not load data for ${key}`);
}

export function getData<T = {}>(key: string): T {
	return JSON.parse(getRawData(key));
}

export class SettingsManager {
	private _settings: PreviewSettings = getData('data-settings');

	public get settings(): PreviewSettings {
		return this._settings;
	}

	public updateSettings(newSettings: PreviewSettings) {
		this._settings = newSettings;
	}
}
