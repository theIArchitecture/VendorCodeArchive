//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as path from '../../../../../base/common/path.js';
import * as platform from '../../../../../base/common/platform.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFolderQuery, QueryType, IRawFileMatch } from '../../common/search.js';
import { Engine as FileSearchEngine, FileWalker } from '../../node/fileSearch.js';
import { flakySuite } from '../../../../../base/test/node/testUtils.js';
import { FileAccess } from '../../../../../base/common/network.js';

const TEST_FIXTURES = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath);
const EXAMPLES_FIXTURES = URI.file(path.join(TEST_FIXTURES, 'examples'));
const MORE_FIXTURES = URI.file(path.join(TEST_FIXTURES, 'more'));
const TEST_ROOT_FOLDER: IFolderQuery = { folder: URI.file(TEST_FIXTURES) };
const ROOT_FOLDER_QUERY: IFolderQuery[] = [
	TEST_ROOT_FOLDER
];

const ROOT_FOLDER_QUERY_36438: IFolderQuery[] = [
	{ folder: URI.file(path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures2/36438').fsPath)) }
];

const MULTIROOT_QUERIES: IFolderQuery[] = [
	{ folder: EXAMPLES_FIXTURES },
	{ folder: MORE_FIXTURES }
];

flakySuite('FileSearchEngine', () => {

	test('Files: *.js', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.js'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 4);
			done();
		});
	});

	test('Files: maxResults', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			maxResults: 1
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: maxResults without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			maxResults: 1,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/file.txt': true },
			exists: true
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: not exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/nofile.txt': true },
			exists: true
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(!complete.limitHit);
			done();
		});
	});

	test('Files: exists without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/file.txt': true },
			exists: true,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: not exists without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/nofile.txt': true },
			exists: true,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(!complete.limitHit);
			done();
		});
	});

	test('Files: examples/com*', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: path.join('examples', 'com*')
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: examples (fuzzy)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'xl'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 7);
			done();
		});
	});

	test('Files: multiroot', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			filePattern: 'file'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 3);
			done();
		});
	});

	test('Files: multiroot with includePattern and maxResults', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			maxResults: 1,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: multiroot with includePattern and exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			exists: true,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: NPE (CamelCase)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'NullPE'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: *.*', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 14);
			done();
		});
	});

	test('Files: *.as', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.as'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			done();
		});
	});

	test('Files: *.* without derived', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'site.*',
			excludePattern: { '**/*.css': { 'when': '$(basename).less' } }
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'site.less');
			done();
		});
	});

	test('Files: *.* exclude folder without wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { 'examples': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: exclude folder without wildcard #36438', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY_36438,
			excludePattern: { 'modules': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: include folder without wildcard #36438', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY_36438,
			includePattern: { 'modules/**': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: *.* exclude folder with leading wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { '**/examples': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: *.* exclude folder with trailing wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { 'examples/**': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: *.* exclude with unicode', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { '**/üm laut汉语': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 13);
			done();
		});
	});

	test('Files: *.* include with unicode', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			includePattern: { '**/üm laut汉语/*': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: multiroot with exclude', function (done: () => void) {
		const folderQueries: IFolderQuery[] = [
			{
				folder: EXAMPLES_FIXTURES,
				excludePattern: [{
					pattern: { '**/anotherfile.txt': true }
				}]
			},
			{
				folder: MORE_FIXTURES,
				excludePattern: [{
					pattern: {
						'**/file.txt': true
					}
				}]
			}
		];

		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries,
			filePattern: '*'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 5);
			done();
		});
	});

	test('Files: Unicode and Spaces', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '汉语'
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), '汉语.txt');
			done();
		});
	});

	test('Files: no results', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'nofilematch'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			done();
		});
	});

	test('Files: relative path matched once', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: path.normalize(path.join('examples', 'company.js'))
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'company.js');
			done();
		});
	});

	test('Files: Include pattern, single files', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: {
				'site.css': true,
				'examples/company.js': true,
				'examples/subfolder/subfile.txt': true
			}
		});

		const res: IRawFileMatch[] = [];
		engine.search((result) => {
			res.push(result);
		}, () => { }, (error) => {
			assert.ok(!error);
			const basenames = res.map(r => path.basename(r.relativePath));
			assert.ok(basenames.indexOf('site.css') !== -1, `site.css missing in ${JSON.stringify(basenames)}`);
			assert.ok(basenames.indexOf('company.js') !== -1, `company.js missing in ${JSON.stringify(basenames)}`);
			assert.ok(basenames.indexOf('subfile.txt') !== -1, `subfile.txt missing in ${JSON.stringify(basenames)}`);
			done();
		});
	});

	test('Files: extraFiles only', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.js'
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'company.js');
			done();
		});
	});

	test('Files: extraFiles only (with include)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.*',
			includePattern: { '**/*.css': true }
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'site.css');
			done();
		});
	});

	test('Files: extraFiles only (with exclude)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.*',
			excludePattern: { '**/*.css': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 2);
			done();
		});
	});

	test('Files: no dupes in nested folders', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [
				{ folder: EXAMPLES_FIXTURES },
				{ folder: joinPath(EXAMPLES_FIXTURES, 'subfolder') }
			],
			filePattern: 'subfile.txt'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});
});

flakySuite('FileWalker', () => {

	(platform.isWindows ? test.skip : test)('Find: exclude subfolder', function (done: () => void) {
		const file0 = './more/file.txt';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			excludePattern: { '**/something': true }
		});
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 765: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 776: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 776: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 871: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 943: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 979: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 980: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 980: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 981: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 991: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1003: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1016: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1016: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1040: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1040: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1041: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1063: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1065: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1075: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({
				type: QueryType.File,
				folderQueries: ROOT_FOLDER_QUERY,
				excludePattern: { '**/subfolder': true }
			});
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: folder excludes', function (done: () => void) {
		const folderQueries: IFolderQuery[] = [
			{
				folder: URI.file(TEST_FIXTURES),
				excludePattern: [{
					pattern: { '**/subfolder': true }
				}]
			}
		];

		const file0 = './more/file.txt';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries });
		const cmd1 = walker.spawnFindCmd(folderQueries[0]);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert(outputContains(stdout1!, file0), stdout1);
			assert(!outputContains(stdout1!, file1), stdout1);
			done();
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude multiple folders', function (done: () => void) {
		const file0 = './index.html';
		const file1 = './examples/small.js';
		const file2 = './more/file.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 868: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 922: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 928: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 948: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 980: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 981: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 998: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 999: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1000: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1024: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1025: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1026: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1033: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1058: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1059: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1060: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1084: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1128: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1129: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1130: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1162: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1163: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1164: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1182: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1215: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1233: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1260: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1268: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1285: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1286: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1318: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1344: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1345: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1364: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1370: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1371: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1372: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1389: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1390: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1396: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1397: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1414: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1415: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1416: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1424: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1440: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1441: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1442: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1448: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1449: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1450: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1468: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1474: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1475: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1476: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1492: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1493: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1500: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1518: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1519: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1520: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1526: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1527: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1528: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file2), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '{**/examples,**/more}': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				assert.strictEqual(stdout2!.split('\n').indexOf(file2), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude folder path suffix', function (done: () => void) {
		const file0 = './examples/company.js';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/examples/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 890: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 928: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1011: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1012: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1049: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1118: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1125: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1126: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1163: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1164: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1233: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1271: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1308: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1309: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1353: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1385: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1391: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1392: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1429: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1430: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1461: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1467: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1499: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1505: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1506: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1536: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1574: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1575: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1581: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1582: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1612: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1613: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1619: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1620: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1650: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1651: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1657: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1688: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1689: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1695: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1696: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1726: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1727: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1764: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1765: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1771: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1803: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1809: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1810: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1840: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1841: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1848: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1878: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1879: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1885: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1886: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/examples/subfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude subfolder path suffix', function (done: () => void) {
		const file0 = './examples/subfolder/subfile.txt';
		const file1 = './examples/subfolder/anotherfolder/anotherfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/subfolder/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 937: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 943: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 986: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1037: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1236: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1237: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1243: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1286: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1287: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1343: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1344: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1386: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1394: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1436: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1437: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1443: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1487: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1493: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1536: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1593: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1594: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1636: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1637: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1643: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1644: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1686: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1687: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1693: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1694: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1736: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1737: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1743: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1744: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1786: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1794: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1836: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1843: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1844: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1886: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1887: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1894: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1936: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1937: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1943: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1944: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1986: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1993: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1994: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2036: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2037: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2043: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2044: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2086: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2087: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2093: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2094: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2137: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2143: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2236: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2237: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2243: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2244: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/subfolder/anotherfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude folder path', function (done: () => void) {
		const file0 = './examples/company.js';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { 'examples/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 928: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1106: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1107: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1168: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1175: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1176: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1237: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1299: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1300: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1355: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1362: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1416: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1417: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1424: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1478: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1479: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1485: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1540: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1541: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1547: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1548: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1602: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1603: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1609: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1610: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1664: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1671: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1672: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1726: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1727: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1788: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1795: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1796: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1850: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1851: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1857: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1858: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1912: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1913: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1919: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1982: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2036: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2037: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2043: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2044: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2098: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2099: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2105: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2106: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2161: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2168: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2222: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2223: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2229: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2285: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2291: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2292: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2353: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2408: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2415: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2416: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2470: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2471: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2477: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2532: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2533: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2539: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2540: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2594: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2595: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2601: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2602: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { 'examples/subfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude combination of paths', function (done: () => void) {
		const filesIn = [
			'./examples/subfolder/subfile.txt',
			'./examples/company.js',
			'./index.html'
		];
		const filesOut = [
			'./examples/subfolder/anotherfolder/anotherfile.txt',
			'./more/file.txt'
		];

		const walker = new FileWalker({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			excludePattern: {
				'**/subfolder/anotherfolder': true,
				'**/something/else': true,
				'**/more': true,
				'**/andmore': true
			}
		});
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(err1, null);
			for (const fileIn of filesIn) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.notStrictEqual(stdout1!.split('\n').indexOf(fileIn), -1, stdout1);
			}
			for (const fileOut of filesOut) {
				assert.strictEqual(stdout1!.split('\n').indexOf(fileOut), -1, stdout1);
			}
			done();
		});
	});

	function outputContains(stdout: string, ...files: string[]): boolean {
		const lines = stdout.split('\n');
		return files.every(file => lines.indexOf(file) >= 0);
	}
});
