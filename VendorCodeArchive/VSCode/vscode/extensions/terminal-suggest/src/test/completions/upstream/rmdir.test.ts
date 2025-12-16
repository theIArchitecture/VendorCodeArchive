/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import rmdirSpec from '../../../completions/upstream/rmdir';

const allOptions = [
	'-p',
];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

const expectedCompletions = [{ label: 'rmdir', description: (rmdirSpec as any).description }];

export const rmdirTestSuiteSpec: ISuiteSpec = {
	name: 'rmdir',
	completionSpecs: rmdirSpec,
	availableCommands: 'rmdir',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'r|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'rmdir|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'rmdir |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
	]
};
