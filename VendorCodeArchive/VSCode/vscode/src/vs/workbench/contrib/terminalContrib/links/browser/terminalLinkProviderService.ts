/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalExternalLinkProvider } from '../../../terminal/browser/terminal.js';
import { ITerminalLinkProviderService } from './links.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class TerminalLinkProviderService implements ITerminalLinkProviderService {
	declare _serviceBrand: undefined;

	private _linkProviders = new Set<ITerminalExternalLinkProvider>();
	get linkProviders(): ReadonlySet<ITerminalExternalLinkProvider> { return this._linkProviders; }

	private readonly _onDidAddLinkProvider = new Emitter<ITerminalExternalLinkProvider>();
	get onDidAddLinkProvider(): Event<ITerminalExternalLinkProvider> { return this._onDidAddLinkProvider.event; }
	private readonly _onDidRemoveLinkProvider = new Emitter<ITerminalExternalLinkProvider>();
	get onDidRemoveLinkProvider(): Event<ITerminalExternalLinkProvider> { return this._onDidRemoveLinkProvider.event; }

	registerLinkProvider(linkProvider: ITerminalExternalLinkProvider): IDisposable {
		const disposables: IDisposable[] = [];
		this._linkProviders.add(linkProvider);
		this._onDidAddLinkProvider.fire(linkProvider);
		return {
			dispose: () => {
				for (const disposable of disposables) {
					disposable.dispose();
				}
				this._linkProviders.delete(linkProvider);
				this._onDidRemoveLinkProvider.fire(linkProvider);
			}
		};
	}
}
