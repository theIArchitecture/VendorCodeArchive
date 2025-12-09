//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { SnippetsSynchroniser } from '../../common/snippetsSync.js';
import { IResourcePreview, ISyncData, IUserDataSyncStoreService, PREVIEW_DIR_NAME, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

const tsSnippet1 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console",
	}

}`;

const tsSnippet2 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console always",
	}

}`;

const htmlSnippet1 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div"
	}
}`;

const htmlSnippet2 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div changed"
	}
}`;

const htmlSnippet3 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div changed again"
	}
}`;

const globalSnippet = `{
	// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and {1: label}, { 2: another } for placeholders.
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
}`;

suite('SnippetsSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: SnippetsSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.Snippets) as SnippetsSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when snippets does not exist', async () => {
		const fileService = testClient.instantiationService.get(IFileService);
		const snippetsResource = testClient.instantiationService.get(IUserDataProfilesService).defaultProfile.snippetsHome;

		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);
		assert.ok(!await fileService.exists(snippetsResource));

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	});

	test('when snippet is created after first sync', async () => {
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await updateSnippet('html.json', htmlSnippet1, testClient);

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 634: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.deepStrictEqual(lastSyncUserData!.syncData!.content, JSON.stringify({ 'html.json': htmlSnippet1 }));
	});

	test('first time sync - outgoing to server (no snippets)', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet1, testClient);

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('first time sync - incoming from server (no snippets)', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);
	});

	test('first time sync when snippets exists', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('first time sync when snippets exists - has conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when snippets exists - has conflicts and accept conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet1);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1 });
	});

	test('first time sync when snippets exists - has multiple conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local1 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		const local2 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json');
		assertPreviews(testObject.conflicts.conflicts, [local1, local2]);
	});

	test('first time sync when snippets exists - has multiple conflicts and accept one conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		let conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);

		conflicts = testObject.conflicts.conflicts;
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when snippets exists - has multiple conflicts and accept all conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);
		await testObject.accept(conflicts[1].previewResource, tsSnippet1);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2, 'typescript.json': tsSnippet1 });
	});

	test('sync adding a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('sync adding a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);
	});

	test('sync updating a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2 });
	});

	test('sync updating a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);
	});

	test('sync updating a snippet - conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet3, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync updating a snippet - resolve conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet3, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, htmlSnippet2);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2 });
	});

	test('sync removing a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1 });
	});

	test('sync removing a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);
	});

	test('sync removing a snippet locally and updating it remotely', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await removeSnippet('html.json', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, htmlSnippet2);
	});

	test('sync removing a snippet - conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync removing a snippet - resolve conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, htmlSnippet3);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, htmlSnippet3);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1, 'html.json': htmlSnippet3 });
	});

	test('sync removing a snippet - resolve conflict by removing', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, null);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1 });
	});

	test('sync global and language snippet', async () => {
		await updateSnippet('global.code-snippets', globalSnippet, client2);
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('global.code-snippets', testClient);
		assert.strictEqual(actual2, globalSnippet);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'global.code-snippets': globalSnippet });
	});

	test('sync should ignore non snippets', async () => {
		await updateSnippet('global.code-snippets', globalSnippet, client2);
		await updateSnippet('html.html', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('global.code-snippets', testClient);
		assert.strictEqual(actual2, globalSnippet);
		const actual3 = await readSnippet('html.html', testClient);
		assert.strictEqual(actual3, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1, 'global.code-snippets': globalSnippet });
	});

	test('previews are reset after all conflicts resolved', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);
		await testObject.apply(false);

		const fileService = testClient.instantiationService.get(IFileService);
		assert.ok(!await fileService.exists(dirname(conflicts[0].previewResource)));
	});

	test('merge when there are multiple snippets and all snippets are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and all snippets are merged and applied', async () => {
		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and one snippet has no changes and one snippet is merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and one snippet has no changes and snippets is merged and applied', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets with conflicts and all snippets are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
	});

	test('accept when there are multiple snippets with conflicts and only one snippet is accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 783: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
	});

	test('accept when there are multiple snippets with conflicts and all snippets are accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 949: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 979: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 980: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1047: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1048: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1115: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1116: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1217: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1218: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1221: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1251: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1252: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1255: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1285: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1286: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1323: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1353: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1357: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1391: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1425: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1455: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1489: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1490: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1493: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1527: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);
		preview = await testObject.accept(preview!.resourcePreviews[1].previewResource, tsSnippet2);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('accept when there are multiple snippets with conflicts and all snippets are accepted and applied', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			]);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 952: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);
		preview = await testObject.accept(preview!.resourcePreviews[1].previewResource, tsSnippet2);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('sync profile snippets', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updateSnippet('html.json', htmlSnippet1, client2, profile);
		await client2.sync();

		await testClient.sync();

		const syncedProfile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const content = await readSnippet('html.json', testClient, syncedProfile);
		assert.strictEqual(content, htmlSnippet1);
	});

	function parseSnippets(content: string): IStringDictionary<string> {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	async function updateSnippet(name: string, content: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).snippetsHome, name);
		await fileService.writeFile(snippetsResource, VSBuffer.fromString(content));
	}

	async function removeSnippet(name: string, client: UserDataSyncClient): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, name);
		await fileService.del(snippetsResource);
	}

	async function readSnippet(name: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<string | null> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).snippetsHome, name);
		if (await fileService.exists(snippetsResource)) {
			const content = await fileService.readFile(snippetsResource);
			return content.value.toString();
		}
		return null;
	}

	function assertPreviews(actual: IResourcePreview[], expected: URI[]) {
		assert.deepStrictEqual(actual.map(({ previewResource }) => previewResource.toString()), expected.map(uri => uri.toString()));
	}

});
