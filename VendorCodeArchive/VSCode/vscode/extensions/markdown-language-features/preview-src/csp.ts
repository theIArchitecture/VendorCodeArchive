//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MessagePoster } from './messaging';
import { SettingsManager } from './settings';
import { getStrings } from './strings';

/**
 * Shows an alert when there is a content security policy violation.
 */
export class CspAlerter {
	private _didShow = false;
	private _didHaveCspWarning = false;

	private _messaging?: MessagePoster;

	constructor(
		private readonly _settingsManager: SettingsManager,
	) {
		document.addEventListener('securitypolicyviolation', () => {
			this._onCspWarning();
		});

		window.addEventListener('message', (event) => {
			if (event && event.data && event.data.name === 'vscode-did-block-svg') {
				this._onCspWarning();
			}
		});
	}

	public setPoster(poster: MessagePoster) {
		this._messaging = poster;
		if (this._didHaveCspWarning) {
			this._showCspWarning();
		}
	}

	private _onCspWarning() {
		this._didHaveCspWarning = true;
		this._showCspWarning();
	}

	private _showCspWarning() {
		const strings = getStrings();
		const settings = this._settingsManager.settings;

		if (this._didShow || settings.disableSecurityWarnings || !this._messaging) {
			return;
		}
		this._didShow = true;

		const notification = document.createElement('a');
		notification.innerText = strings.cspAlertMessageText;
		notification.setAttribute('id', 'code-csp-warning');
		notification.setAttribute('title', strings.cspAlertMessageTitle);

		notification.setAttribute('role', 'button');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		notification.setAttribute('aria-label', strings.cspAlertMessageLabel);
		notification.onclick = () => {
			this._messaging!.postMessage('showPreviewSecuritySelector', { source: settings.source });
		};
		document.body.appendChild(notification);
	}
}
