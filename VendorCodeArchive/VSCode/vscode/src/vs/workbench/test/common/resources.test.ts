/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { ResourceGlobMatcher } from '../../common/resources.js';
import { TestContextService } from './workbenchTestServices.js';

suite('ResourceGlobMatcher', () => {

	const SETTING = 'test.matcher';

	let contextService: IWorkspaceContextService;
	let configurationService: TestConfigurationService;

	const disposables = new DisposableStore();

	setup(() => {
		contextService = new TestContextService();
		configurationService = new TestConfigurationService({
			[SETTING]: {
				'**/*.md': true,
				'**/*.txt': false
			}
		});
	});

	teardown(() => {
		disposables.clear();
	});

	test('Basics', async () => {
		const matcher = disposables.add(new ResourceGlobMatcher(() => configurationService.getValue(SETTING), e => e.affectsConfiguration(SETTING), contextService, configurationService));

		// Matching
		assert.equal(matcher.matches(URI.file('/foo/bar')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.md')), true);
		assert.equal(matcher.matches(URI.file('/foo/bar.txt')), false);

		// Events
		let eventCounter = 0;
		disposables.add(matcher.onExpressionChange(() => eventCounter++));

		await configurationService.setUserConfiguration(SETTING, { '**/*.foo': true });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);
		assert.equal(eventCounter, 1);

		assert.equal(matcher.matches(URI.file('/foo/bar.md')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.foo')), true);

		await configurationService.setUserConfiguration(SETTING, undefined);
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);
		assert.equal(eventCounter, 2);

		assert.equal(matcher.matches(URI.file('/foo/bar.md')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.foo')), false);

		await configurationService.setUserConfiguration(SETTING, {
			'**/*.md': true,
			'**/*.txt': false,
			'C:/bar/**': true,
			'/bar/**': true
		});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);

		assert.equal(matcher.matches(URI.file('/bar/foo.1')), true);
		assert.equal(matcher.matches(URI.file('C:/bar/foo.1')), true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
