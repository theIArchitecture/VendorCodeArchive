/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import mkdirSpec from '../../../completions/upstream/mkdir';

const allOptions = [
	'--context <context>',
	'--help',
	'--mode <mode>',
	'--parents',
	'--verbose',
	'--version',
	'-Z <context>',
	'-m <mode>',
	'-p',
	'-v',
];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

const expectedCompletions = [{ label: 'mkdir', description: (mkdirSpec as any).description }];
export const mkdirTestSuiteSpec: ISuiteSpec = {
	name: 'mkdir',
	completionSpecs: mkdirSpec,
	availableCommands: 'mkdir',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'm|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'mkdir|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'mkdir |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },

		// Duplicate option
		// TODO: Duplicate options should not be presented https://github.com/microsoft/vscode/issues/239607
		// { input: 'mkdir -Z -|', expectedCompletions: removeArrayEntries(allOptions, '-z') },
		// { input: 'mkdir -Z -m -|', expectedCompletions: removeArrayEntries(allOptions, '-z', '-m') },
	]
};
