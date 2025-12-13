/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import cdSpec from '../../completions/cd';
import { testPaths, type ISuiteSpec } from '../helpers';

const expectedCompletions = ['-'];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

const cdExpectedCompletions = [{ label: 'cd', description: (cdSpec as any).description }];
export const cdTestSuiteSpec: ISuiteSpec = {
	name: 'cd',
	completionSpecs: cdSpec,
	availableCommands: 'cd',
	testSpecs: [
		// Typing a path
		{ input: '.|', expectedCompletions: cdExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: './|', expectedCompletions: cdExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: './.|', expectedCompletions: cdExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'c|', expectedCompletions: cdExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'cd|', expectedCompletions: cdExpectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic arguments
		{ input: 'cd |', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd -|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },

		// Relative paths
		{ input: 'cd c|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd child|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd .|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd ./|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd ./child|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
		{ input: 'cd ..|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },

		// Relative directories (changes cwd due to /)
		{ input: 'cd child/|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwdChild } },
		{ input: 'cd ../|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwdParent } },
		{ input: 'cd ../sibling|', expectedCompletions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwdParent } },
	]
};
