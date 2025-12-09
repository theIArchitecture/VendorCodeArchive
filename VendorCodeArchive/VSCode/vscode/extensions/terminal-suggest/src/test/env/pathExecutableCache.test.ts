//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { deepStrictEqual, strictEqual } from 'node:assert';
import type { MarkdownString } from 'vscode';
import { PathExecutableCache } from '../../env/pathExecutableCache';

suite('PathExecutableCache', () => {
	test('cache should return empty for empty PATH', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 15: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 16: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 24: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 24: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const cache = new PathExecutableCache();
		const result = await cache.getExecutablesInPath({ PATH: '' });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 29: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 30: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 38: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 38: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 41: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 42: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 54: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 90: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 134: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 134: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		strictEqual(Array.from(result!.completionResources!).length, 0);
		strictEqual(Array.from(result!.labels!).length, 0);
	});

	test('results are the same on successive calls', async () => {
		const cache = new PathExecutableCache();
		const env = { PATH: process.env.PATH };
		const result = await cache.getExecutablesInPath(env);
		const result2 = await cache.getExecutablesInPath(env);
		deepStrictEqual(result!.labels, result2!.labels);
	});

	test('refresh clears the cache', async () => {
		const cache = new PathExecutableCache();
		const env = { PATH: process.env.PATH };
		const result = await cache.getExecutablesInPath(env);
		cache.refresh();
		const result2 = await cache.getExecutablesInPath(env);
		strictEqual(result !== result2, true);
	});

	if (process.platform !== 'win32') {
		test('cache should include executables found via symbolic links', async () => {
			const path = require('path');
			// Always use the source fixture directory to ensure symlinks are present
			const fixtureDir = path.resolve(__dirname.replace(/out[\/].*$/, 'src/test/env'), '../fixtures/symlink-test');
			const env = { PATH: fixtureDir };
			const cache = new PathExecutableCache();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const result = await cache.getExecutablesInPath(env);
			cache.refresh();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 69: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const labels = Array.from(result!.labels!);

			strictEqual(labels.includes('real-executable.sh'), true);
			strictEqual(labels.includes('symlink-executable.sh'), true);
			strictEqual(result?.completionResources?.size, 2);

			const completionResources = result!.completionResources!;
			let realDocRaw: string | MarkdownString | undefined = undefined;
			let symlinkDocRaw: string | MarkdownString | undefined = undefined;
			for (const resource of completionResources) {
				if (resource.label === 'real-executable.sh') {
					realDocRaw = resource.documentation;
				} else if (resource.label === 'symlink-executable.sh') {
					symlinkDocRaw = resource.documentation;
				}
			}
			const realDoc = typeof realDocRaw === 'string' ? realDocRaw : (realDocRaw && 'value' in realDocRaw ? realDocRaw.value : undefined);
			const symlinkDoc = typeof symlinkDocRaw === 'string' ? symlinkDocRaw : (symlinkDocRaw && 'value' in symlinkDocRaw ? symlinkDocRaw.value : undefined);

			const realPath = path.join(fixtureDir, 'real-executable.sh');
			const symlinkPath = path.join(fixtureDir, 'symlink-executable.sh');
			strictEqual(realDoc, realPath);
			strictEqual(symlinkDoc, `${symlinkPath} -> ${realPath}`);
		});
	}
});
