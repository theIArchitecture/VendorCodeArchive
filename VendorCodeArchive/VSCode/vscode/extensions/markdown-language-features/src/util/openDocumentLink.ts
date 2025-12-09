//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 7: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 7: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 7: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 8: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 8: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 8: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance


import * as vscode from 'vscode';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 24: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { MdLanguageClient } from '../client/client';
import * as proto from '../client/protocol';

enum OpenMarkdownLinks {
	beside = 'beside',
	currentGroup = 'currentGroup',
}

export class MdLinkOpener {

	constructor(
		private readonly _client: MdLanguageClient,
	) { }

	public async resolveDocumentLink(linkText: string, fromResource: vscode.Uri): Promise<proto.ResolvedDocumentLinkTarget> {
		return this._client.resolveLinkTarget(linkText, fromResource);
	}

	public async openDocumentLink(linkText: string, fromResource: vscode.Uri, viewColumn?: vscode.ViewColumn): Promise<void> {
		const resolved = await this._client.resolveLinkTarget(linkText, fromResource);
		if (!resolved) {
			return;
		}

		const uri = vscode.Uri.from(resolved.uri);
		switch (resolved.kind) {
			case 'external':
				return vscode.commands.executeCommand('vscode.open', uri);

			case 'folder':
				return vscode.commands.executeCommand('revealInExplorer', uri);

			case 'file': {
				// If no explicit viewColumn is given, check if the editor is already open in a tab
				if (typeof viewColumn === 'undefined') {
					for (const tab of vscode.window.tabGroups.all.flatMap(x => x.tabs)) {
						if (tab.input instanceof vscode.TabInputText) {
							if (tab.input.uri.fsPath === uri.fsPath) {
								viewColumn = tab.group.viewColumn;
								break;
							}
						}
					}
				}

				return vscode.commands.executeCommand('vscode.open', uri, {
					selection: resolved.position ? new vscode.Range(resolved.position.line, resolved.position.character, resolved.position.line, resolved.position.character) : undefined,
					viewColumn: viewColumn ?? getViewColumn(fromResource),
				} satisfies vscode.TextDocumentShowOptions);
			}
		}
	}
}

function getViewColumn(resource: vscode.Uri): vscode.ViewColumn {
	const config = vscode.workspace.getConfiguration('markdown', resource);
	const openLinks = config.get<OpenMarkdownLinks>('links.openLocation', OpenMarkdownLinks.currentGroup);
	switch (openLinks) {
		case OpenMarkdownLinks.beside:
			return vscode.ViewColumn.Beside;
		case OpenMarkdownLinks.currentGroup:
		default:
			return vscode.ViewColumn.Active;
	}
}

