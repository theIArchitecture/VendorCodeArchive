/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import echoSpec from '../../../completions/upstream/echo';

const allOptions = [
	'-E',
	'-e',
	'-n',
];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

const echoExpectedCompletions = [{ label: 'echo', description: (echoSpec as any).description }];
export const echoTestSuiteSpec: ISuiteSpec = {
	name: 'echo',
	completionSpecs: echoSpec,
	availableCommands: 'echo',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions: echoExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'e|', expectedCompletions: echoExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'ec|', expectedCompletions: echoExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'ech|', expectedCompletions: echoExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'echo|', expectedCompletions: echoExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'echo |', expectedCompletions: allOptions },

		// Duplicate option
		// TODO: Duplicate options should not be presented https://github.com/microsoft/vscode/issues/239607
		// { input: 'echo -e -|', expectedCompletions: removeArrayEntries(allOptions, '-e') },
		// { input: 'echo -e -E -|', expectedCompletions: removeArrayEntries(allOptions, '-e', '-E') },
	]
};
