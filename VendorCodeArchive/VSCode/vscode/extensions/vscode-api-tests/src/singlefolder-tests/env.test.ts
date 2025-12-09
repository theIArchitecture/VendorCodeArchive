//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { env, ExtensionKind, extensions, UIKind, Uri } from 'vscode';
import { assertNoRpc } from '../utils';

suite('vscode API - env', () => {

	teardown(assertNoRpc);

	test('env is set', function () {
		assert.strictEqual(typeof env.language, 'string');
		assert.strictEqual(typeof env.appRoot, 'string');
		assert.strictEqual(typeof env.appName, 'string');
		assert.strictEqual(typeof env.machineId, 'string');
		assert.strictEqual(typeof env.sessionId, 'string');
		assert.strictEqual(typeof env.shell, 'string');
	});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 24: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 25: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 26: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 27: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 28: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 29: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	test('env is readonly', function () {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 40: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 41: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 42: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 43: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 44: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 54: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 55: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.throws(() => (env as any).language = '234');
		assert.throws(() => (env as any).appRoot = '234');
		assert.throws(() => (env as any).appName = '234');
		assert.throws(() => (env as any).machineId = '234');
		assert.throws(() => (env as any).sessionId = '234');
		assert.throws(() => (env as any).shell = '234');
	});

	test('env.remoteName', function () {
		const remoteName = env.remoteName;
		const knownWorkspaceExtension = extensions.getExtension('vscode.git');
		const knownUiAndWorkspaceExtension = extensions.getExtension('vscode.media-preview');
		if (typeof remoteName === 'undefined') {
			// not running in remote, so we expect both extensions
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 40: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.ok(knownWorkspaceExtension);
			assert.ok(knownUiAndWorkspaceExtension);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(ExtensionKind.UI, knownUiAndWorkspaceExtension!.extensionKind);
		} else if (typeof remoteName === 'string') {
			// running in remote, so we only expect workspace extensions
			assert.ok(knownWorkspaceExtension);
			if (env.uiKind === UIKind.Desktop) {
				assert.ok(!knownUiAndWorkspaceExtension); // we currently can only access extensions that run on same host
			} else {
				assert.ok(knownUiAndWorkspaceExtension);
			}
			assert.strictEqual(ExtensionKind.Workspace, knownWorkspaceExtension!.extensionKind);
		} else {
			assert.fail();
		}
	});

	test('env.uiKind', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);

		const kind = env.uiKind;
		if (result.scheme === 'http' || result.scheme === 'https') {
			assert.strictEqual(kind, UIKind.Web);
		} else {
			assert.strictEqual(kind, UIKind.Desktop);
		}
	});

	test('env.asExternalUri - with env.uriScheme', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);
		assert.ok(result);

		if (env.uiKind === UIKind.Desktop) {
			assert.strictEqual(uri.scheme, result.scheme);
			assert.strictEqual(uri.authority, result.authority);
			assert.strictEqual(uri.path, result.path);
		} else {
			assert.ok(result.scheme === 'http' || result.scheme === 'https');
		}
	});
});
