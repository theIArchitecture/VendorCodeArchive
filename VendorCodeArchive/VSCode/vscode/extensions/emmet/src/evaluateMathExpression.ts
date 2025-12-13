/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Based on @sergeche's work in his emmet plugin */

import * as vscode from 'vscode';
import evaluate, { extract } from '@emmetio/math-expression';

export function evaluateMathExpression(): Thenable<boolean> {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showInformationMessage('No editor is active');
		return Promise.resolve(false);
	}
	const editor = vscode.window.activeTextEditor;
	return editor.edit(editBuilder => {
		editor.selections.forEach(selection => {
			// startpos always comes before endpos
			const startpos = selection.isReversed ? selection.active : selection.anchor;
			const endpos = selection.isReversed ? selection.anchor : selection.active;
			const selectionText = editor.document.getText(new vscode.Range(startpos, endpos));

			try {
				if (selectionText) {
					// respect selections
					const result = String(evaluate(selectionText));
					editBuilder.replace(new vscode.Range(startpos, endpos), result);
				} else {
					// no selection made, extract expression from line
					const lineToSelectionEnd = editor.document.getText(new vscode.Range(new vscode.Position(selection.end.line, 0), endpos));
					const extractedIndices = extract(lineToSelectionEnd);
					if (!extractedIndices) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 34: Error message without production error code - breaks React bundle size optimization
//   2. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

						throw new Error('Invalid extracted indices');
					}
					const result = String(evaluate(lineToSelectionEnd.substr(extractedIndices[0], extractedIndices[1])));
					const rangeToReplace = new vscode.Range(
						new vscode.Position(selection.end.line, extractedIndices[0]),
						new vscode.Position(selection.end.line, extractedIndices[1])
					);
					editBuilder.replace(rangeToReplace, result);
				}
			} catch (err) {
				vscode.window.showErrorMessage('Could not evaluate expression');
				// Ignore error since most likely it's because of non-math expression
				console.warn('Math evaluation error', err);
			}
		});
	});
}
