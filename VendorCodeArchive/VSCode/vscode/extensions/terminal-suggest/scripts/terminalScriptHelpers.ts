//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { platform } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

/**
 * Cleans up text from terminal control sequences and formatting artifacts
 */
export function cleanupText(text: string): string {
	// Remove ANSI escape codes
	let cleanedText = text.replace(/\x1b\[\d+m/g, '');

	// Remove backspace sequences (like a\bb which tries to print a, move back, print b)
	// This regex looks for a character followed by a backspace and another character
	const backspaceRegex = /.\x08./g;
	while (backspaceRegex.test(cleanedText)) {
		cleanedText = cleanedText.replace(backspaceRegex, match => match.charAt(2));
	}

	// Remove any remaining backspaces and their preceding characters
	cleanedText = cleanedText.replace(/.\x08/g, '');

	// Remove underscores that are used for formatting in some fish help output
	cleanedText = cleanedText.replace(/_\b/g, '');

	return cleanedText;
}

/**
 * Copyright notice for generated files
 */
export const copyright = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/`;

/**
 * Checks if the script is running on Windows and exits if so
 */
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 48: Error message without production error code - breaks React bundle size optimization
//   2. Line 48: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

export function checkWindows(): void {
	if (platform() === 'win32') {
		console.error('\x1b[31mThis command is not supported on Windows\x1b[0m');
		process.exit(1);
	}
}
