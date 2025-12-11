//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import { workspace, Uri } from 'vscode';
import { getExtensionContext } from './main';
import { TextDecoder } from 'util';

const emojiRegex = /:([-+_a-z0-9]+):/g;

let emojiMap: Record<string, string> | undefined;
let emojiMapPromise: Promise<void> | undefined;

export async function ensureEmojis() {
	if (emojiMap === undefined) {
		if (emojiMapPromise === undefined) {
			emojiMapPromise = loadEmojiMap();
		}
		await emojiMapPromise;
	}
}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

async function loadEmojiMap() {
	const context = getExtensionContext();
	const uri = (Uri as any).joinPath(context.extensionUri, 'resources', 'emojis.json');
	emojiMap = JSON.parse(new TextDecoder('utf8').decode(await workspace.fs.readFile(uri)));
}

export function emojify(message: string) {
	if (emojiMap === undefined) {
		return message;
	}

	return message.replace(emojiRegex, (s, code) => {
		return emojiMap?.[code] || s;
	});
}
