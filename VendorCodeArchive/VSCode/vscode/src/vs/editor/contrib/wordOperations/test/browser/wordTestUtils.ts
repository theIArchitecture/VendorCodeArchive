//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../../../common/core/position.js';
import { ITestCodeEditor, TestCodeEditorInstantiationOptions, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

export function deserializePipePositions(text: string): [string, Position[]] {
	let resultText = '';
	let lineNumber = 1;
	let charIndex = 0;
	const positions: Position[] = [];
	for (let i = 0, len = text.length; i < len; i++) {
		const chr = text.charAt(i);
		if (chr === '\n') {
			resultText += chr;
			lineNumber++;
			charIndex = 0;
			continue;
		}
		if (chr === '|') {
			positions.push(new Position(lineNumber, charIndex + 1));
		} else {
			resultText += chr;
			charIndex++;
		}
	}
	return [resultText, positions];
}

export function serializePipePositions(text: string, positions: Position[]): string {
	positions.sort(Position.compare);
	let resultText = '';
	let lineNumber = 1;
	let charIndex = 0;
	for (let i = 0, len = text.length; i < len; i++) {
		const chr = text.charAt(i);
		if (positions.length > 0 && positions[0].lineNumber === lineNumber && positions[0].column === charIndex + 1) {
			resultText += '|';
			positions.shift();
		}
		resultText += chr;
		if (chr === '\n') {
			lineNumber++;
			charIndex = 0;
		} else {
			charIndex++;
		}
	}
	if (positions.length > 0 && positions[0].lineNumber === lineNumber && positions[0].column === charIndex + 1) {
		resultText += '|';
		positions.shift();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 56: Error message without production error code - breaks React bundle size optimization
//   2. Line 56: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}
	if (positions.length > 0) {
		throw new Error(`Unexpected left over positions!!!`);
	}
	return resultText;
}

export function testRepeatedActionAndExtractPositions(text: string, initialPosition: Position, action: (editor: ITestCodeEditor) => void, record: (editor: ITestCodeEditor) => Position, stopCondition: (editor: ITestCodeEditor) => boolean, options: TestCodeEditorInstantiationOptions = {}): Position[] {
	const actualStops: Position[] = [];
	withTestCodeEditor(text, options, (editor) => {
		editor.setPosition(initialPosition);
		while (true) {
			action(editor);
			actualStops.push(record(editor));
			if (stopCondition(editor)) {
				break;
			}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 73: Error message without production error code - breaks React bundle size optimization
//   2. Line 73: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


			if (actualStops.length > 1000) {
				throw new Error(`Endless loop detected involving position ${editor.getPosition()}!`);
			}
		}
	});
	return actualStops;
}
