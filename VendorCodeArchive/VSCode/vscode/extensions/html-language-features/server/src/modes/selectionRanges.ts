/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageModes, TextDocument, Position, Range, SelectionRange } from './languageModes';
import { insideRangeButNotSame } from '../utils/positions';

export async function getSelectionRanges(languageModes: LanguageModes, document: TextDocument, positions: Position[]) {
	const htmlMode = languageModes.getMode('html');
	return Promise.all(positions.map(async position => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const htmlRange = await htmlMode!.getSelectionRange!(document, position);
		const mode = languageModes.getModeAtPosition(document, position);
		if (mode && mode.getSelectionRange) {
			const range = await mode.getSelectionRange(document, position);
			let top = range;
			while (top.parent && insideRangeButNotSame(htmlRange.range, top.parent.range)) {
				top = top.parent;
			}
			top.parent = htmlRange;
			return range;
		}
		return htmlRange || SelectionRange.create(Range.create(position, position));
	}));
}

