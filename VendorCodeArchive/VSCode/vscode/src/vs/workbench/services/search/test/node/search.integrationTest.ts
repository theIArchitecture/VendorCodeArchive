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
