//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService } from '../../workbenchTestServices.js';
import { AbstractResourceEditorInput } from '../../../../common/editor/resourceEditorInput.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { EditorInputCapabilities, Verbosity } from '../../../../common/editor.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { CustomEditorLabelService, ICustomEditorLabelService } from '../../../../services/editor/common/customEditorLabelService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';

suite('ResourceEditorInput', () => {

	const disposables = new DisposableStore();

	class TestResourceEditorInput extends AbstractResourceEditorInput {

		readonly typeId = 'test.typeId';

		constructor(
			resource: URI,
			@ILabelService labelService: ILabelService,
			@IFileService fileService: IFileService,
			@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
			@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
			@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
		) {
			super(resource, resource, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
		}
	}

	async function createServices(): Promise<[IInstantiationService, TestConfigurationService, CustomEditorLabelService]> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const testConfigurationService = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, testConfigurationService);

		const customEditorLabelService = disposables.add(new CustomEditorLabelService(testConfigurationService, instantiationService.get(IWorkspaceContextService)));
		instantiationService.stub(ICustomEditorLabelService, customEditorLabelService);

		return [instantiationService, testConfigurationService, customEditorLabelService];
	}

	teardown(() => {
		disposables.clear();
	});

	test('basics', async () => {
		const [instantiationService] = await createServices();

		const resource = URI.from({ scheme: 'testResource', path: 'thePath/of/the/resource.txt' });

		const input = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource));

		assert.ok(input.getName().length > 0);

		assert.ok(input.getDescription(Verbosity.SHORT)!.length > 0);
		assert.ok(input.getDescription(Verbosity.MEDIUM)!.length > 0);
		assert.ok(input.getDescription(Verbosity.LONG)!.length > 0);

		assert.ok(input.getTitle(Verbosity.SHORT).length > 0);
		assert.ok(input.getTitle(Verbosity.MEDIUM).length > 0);
		assert.ok(input.getTitle(Verbosity.LONG).length > 0);

		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Untitled), true);
	});

	test('custom editor name', async () => {
		const [instantiationService, testConfigurationService, customEditorLabelService] = await createServices();

		const resource1 = URI.from({ scheme: 'testResource', path: 'thePath/of/the/resource.txt' });
		const resource2 = URI.from({ scheme: 'testResource', path: 'theOtherPath/of/the/resource.md' });

		const input1 = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource1));
		const input2 = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource2));

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS, {
			'**/theOtherPath/**': 'Label 1',
			'**/*.txt': 'Label 2',
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			'**/resource.txt': 'Label 3',
		});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 120: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_PATTERNS; }, source: ConfigurationTarget.USER } as any);

		let label1Name: string = '';
		let label2Name = '';
		disposables.add(customEditorLabelService.onDidChange(() => {
			label1Name = input1.getName();
			label2Name = input2.getName();
		}));

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, true);
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'Label 3');
		assert.ok(label2Name === 'Label 1');

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, false);
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'resource.txt' as string);
		assert.ok(label2Name === 'resource.md' as string);

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, true);
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS, {
			'thePath/**/resource.txt': 'Label 4',
			'thePath/of/*/resource.txt': 'Label 5',
		});
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_PATTERNS; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'Label 5' as string);
		assert.ok(label2Name === 'resource.md' as string);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
