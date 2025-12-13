/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';

export function getOutput(instance: ITerminalInstance, startMarker?: IXtermMarker): string {
	if (!instance.xterm || !instance.xterm.raw) {
		return '';
	}
	const lines: string[] = [];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 14: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 15: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	for (let y = Math.min(startMarker?.line ?? 0, 0); y < instance.xterm!.raw.buffer.active.length; y++) {
		const line = instance.xterm!.raw.buffer.active.getLine(y);
		if (!line) {
			continue;
		}
		lines.push(line.translateToString(true));
	}
	return lines.join('\n');
}
