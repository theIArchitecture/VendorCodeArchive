/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import rmSpec from '../../../completions/upstream/rm';

const allOptions = [
	'-P',
	'-R',
	'-d',
	'-f',
	'-i',
	'-r',
	'-v',
];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

const expectedCompletions = [{ label: 'rm', description: (rmSpec as any).description }];
export const rmTestSuiteSpec: ISuiteSpec = {
	name: 'rm',
	completionSpecs: rmSpec,
	availableCommands: 'rm',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'r|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'rm|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'rm |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Duplicate option
		// TODO: Duplicate options should not be presented https://github.com/microsoft/vscode/issues/239607
		// { input: `rm -${allOptions[0]} -|`, expectedCompletions: removeArrayEntries(allOptions, allOptions[0]) },
		// { input: `rm -${allOptions[0]} -${allOptions[1]} -|`, expectedCompletions: removeArrayEntries(allOptions, allOptions[0], allOptions[1]) },
	]
};
