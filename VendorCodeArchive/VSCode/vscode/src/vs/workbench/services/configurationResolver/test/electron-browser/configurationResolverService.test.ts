//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { stub } from 'sinon';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IPath, normalize } from '../../../../../base/common/path.js';
import * as platform from '../../../../../base/common/platform.js';
import { isLinux, isMacintosh, isWindows } from '../../../../../base/common/platform.js';
import { isObject } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { EditorType } from '../../../../../editor/common/editorCommon.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationOverrides, IConfigurationService, IConfigurationValue } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IExtensionDescription } from '../../../../../platform/extensions/common/extensions.js';
import { IFormatterChangeEvent, ILabelService, ResourceLabelFormatter, Verbosity } from '../../../../../platform/label/common/label.js';
import { IWorkspace, IWorkspaceFolder, IWorkspaceIdentifier, Workspace } from '../../../../../platform/workspace/common/workspace.js';
import { testWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { TestEditorService, TestQuickInputService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IExtensionService } from '../../../extensions/common/extensions.js';
import { IPathService } from '../../../path/common/pathService.js';
import { BaseConfigurationResolverService } from '../../browser/baseConfigurationResolverService.js';
import { IConfigurationResolverService } from '../../common/configurationResolver.js';
import { ConfigurationResolverExpression } from '../../common/configurationResolverExpression.js';

const mockLineNumber = 10;
class TestEditorServiceWithActiveEditor extends TestEditorService {
	override get activeTextEditorControl(): any {
		return {
			getEditorType() {
				return EditorType.ICodeEditor;
			},
			getSelection() {
				return new Selection(mockLineNumber, 1, mockLineNumber, 10);
			}
		};
	}
	override get activeEditor(): any {
		return {
			get resource(): any {
				return URI.parse('file:///VSCode/workspaceLocation/file');
			}
		};
	}
}

class TestConfigurationResolverService extends BaseConfigurationResolverService {

}

const nullContext = {
	getAppRoot: () => undefined,
	getExecPath: () => undefined
};

suite('Configuration Resolver Service', () => {
	let configurationResolverService: IConfigurationResolverService | null;
	const envVariables: { [key: string]: string } = { key1: 'Value for key1', key2: 'Value for key2' };
	// let environmentService: MockWorkbenchEnvironmentService;
	let mockCommandService: MockCommandService;
	let editorService: TestEditorServiceWithActiveEditor;
	let containingWorkspace: Workspace;
	let workspace: IWorkspaceFolder;
	let quickInputService: TestQuickInputService;
	let labelService: MockLabelService;
	let pathService: MockPathService;
	let extensionService: IExtensionService;

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		mockCommandService = new MockCommandService();
		editorService = disposables.add(new TestEditorServiceWithActiveEditor());
		quickInputService = new TestQuickInputService();
		// environmentService = new MockWorkbenchEnvironmentService(envVariables);
		labelService = new MockLabelService();
		pathService = new MockPathService();
		extensionService = new TestExtensionService();
		containingWorkspace = testWorkspace(URI.parse('file:///VSCode/workspaceLocation'));
		workspace = containingWorkspace.folders[0];
		configurationResolverService = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), editorService, new MockInputsConfigurationService(), mockCommandService, new TestContextService(containingWorkspace), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
	});

	teardown(() => {
		configurationResolverService = null;
	});

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 98: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('substitute one', async () => {
		if (platform.isWindows) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('does not preserve platform config even when not matched', async () => {
		const obj = {
			program: 'osx.sh',
			windows: {
				program: 'windows.exe'
			},
			linux: {
				program: 'linux.sh'
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			}
		};
		const config: any = await configurationResolverService!.resolveAsync(workspace, obj);

		const expected = isWindows ? 'windows.exe' : isMacintosh ? 'osx.sh' : isLinux ? 'linux.sh' : undefined;

		assert.strictEqual(config.windows, undefined);
		assert.strictEqual(config.osx, undefined);
		assert.strictEqual(config.linux, undefined);
		assert.strictEqual(config.program, expected);
	});

	test('apples platform specific config', async () => {
		const expected = isWindows ? 'windows.exe' : isMacintosh ? 'osx.sh' : isLinux ? 'linux.sh' : undefined;
		const obj = {
			windows: {
				program: 'windows.exe'
			},
			osx: {
				program: 'osx.sh'
			},
			linux: {
				program: 'linux.sh'
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};
		const originalObj = JSON.stringify(obj);
		const config: any = await configurationResolverService!.resolveAsync(workspace, obj);

		assert.strictEqual(config.program, expected);
		assert.strictEqual(config.windows, undefined);
		assert.strictEqual(config.osx, undefined);
		assert.strictEqual(config.linux, undefined);
		assert.strictEqual(JSON.stringify(obj), originalObj); // did not mutate original
	});

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('workspace folder with argument', async () => {
		if (platform.isWindows) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (24):
//   1. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('workspace folder with invalid argument', async () => {
		await assert.rejects(async () => await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:invalidLocation} xyz'));
	});

	test('workspace folder with undefined workspace folder', async () => {
		await assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder} xyz'));
	});

	test('workspace folder with argument and undefined workspace folder', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('workspace folder with invalid argument and undefined workspace folder', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:invalidLocation} xyz'));
	});

	test('workspace root folder name', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceRootFolderName} xyz'), 'abc workspaceLocation xyz');
	});

	test('current selected line number', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${lineNumber} xyz'), `abc ${mockLineNumber} xyz`);
	});

	test('relative file', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile} xyz'), 'abc file xyz');
	});

	test('relative file with argument', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile:workspaceLocation} xyz'), 'abc file xyz');
	});

	test('relative file with invalid argument', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile:invalidLocation} xyz'));
	});

	test('relative file with undefined workspace folder', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile} xyz'), 'abc \\VSCode\\workspaceLocation\\file xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile} xyz'), 'abc /VSCode/workspaceLocation/file xyz');
		}
	});

	test('relative file with argument and undefined workspace folder', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile:workspaceLocation} xyz'), 'abc file xyz');
	});

	test('relative file with invalid argument and undefined workspace folder', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile:invalidLocation} xyz'));
	});

	test('substitute many', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation');
		}
	});

	test('substitute one env variable', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} ${env:key1} xyz'), 'abc \\VSCode\\workspaceLocation Value for key1 xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} ${env:key1} xyz'), 'abc /VSCode/workspaceLocation Value for key1 xyz');
		}
	});

	test('substitute many env variable', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for key1 - Value for key2');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation Value for key1 - Value for key2');
		}
	});

	test('disallows nested keys (#77289)', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} ${env:key1${env:key2}}'), 'Value for key1 ');
	});

	test('supports extensionDir', async () => {
		const getExtension = stub(extensionService, 'getExtension');
		getExtension.withArgs('publisher.extId').returns(Promise.resolve({ extensionLocation: URI.file('/some/path') } as IExtensionDescription));

		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${extensionInstallFolder:publisher.extId}'), URI.file('/some/path').fsPath);
	});

	// test('substitute keys and values in object', () => {
	// 	const myObject = {
	// 		'${workspaceRootFolderName}': '${lineNumber}',
	// 		'hey ${env:key1} ': '${workspaceRootFolderName}'
	// 	};
	// 	assert.deepStrictEqual(configurationResolverService!.resolveAsync(workspace, myObject), {
	// 		'workspaceLocation': `${editorService.mockLineNumber}`,
	// 		'hey Value for key1 ': 'workspaceLocation'
	// 	});
	// });


// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('substitute one env variable using platform case sensitivity', async () => {
		if (platform.isWindows) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} - ${env:Key1}'), 'Value for key1 - Value for key1');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} - ${env:Key1}'), 'Value for key1 - ');
		}
	});

	test('substitute one configuration variable', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} xyz'), 'abc foo xyz');
	});

	test('inlines an array (#245718)', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: ['foo', 'bar']
			},
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} xyz'), 'abc foo,bar xyz');
	});

	test('substitute configuration variable with undefined workspace folder', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(undefined, 'abc ${config:editor.fontFamily} xyz'), 'abc foo xyz');
	});

	test('substitute many configuration variables', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo bar xyz');
	});

	test('substitute one env variable and a configuration variable', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		if (platform.isWindows) {
			assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${workspaceFolder} ${env:key1} xyz'), 'abc foo \\VSCode\\workspaceLocation Value for key1 xyz');
		} else {
			assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${workspaceFolder} ${env:key1} xyz'), 'abc foo /VSCode/workspaceLocation Value for key1 xyz');
		}
	});

	test('recursively resolve variables', async () => {
		const configurationService = new TestConfigurationService({
			key1: 'key1=${config:key2}',
			key2: 'key2=${config:key3}',
			key3: 'we did it!',
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, '${config:key1}'), 'key1=key2=we did it!');
	});

	test('substitute many env variable and a configuration variable', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		if (platform.isWindows) {
			assert.strictEqual(await service.resolveAsync(workspace, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), 'foo bar \\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for key1 - Value for key2');
		} else {
			assert.strictEqual(await service.resolveAsync(workspace, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), 'foo bar /VSCode/workspaceLocation - /VSCode/workspaceLocation Value for key1 - Value for key2');
		}
	});

	test('mixed types of configuration variables', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo',
				lineNumbers: 123,
				insertSpaces: false
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			},
			json: {
				schemas: [
					{
						fileMatch: [
							'/myfile',
							'/myOtherfile'
						],
						url: 'schemaURL'
					}
				]
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${config:editor.lineNumbers} ${config:editor.insertSpaces} xyz'), 'abc foo 123 false xyz');
	});

	test('uses original variable as fallback', async () => {
		const configurationService = new TestConfigurationService({
			editor: {}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${unknownVariable} xyz'), 'abc ${unknownVariable} xyz');
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${env:unknownVariable} xyz'), 'abc  xyz');
	});

	test('configuration variables with invalid accessor', () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));

		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${env} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${env:} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor..fontFamily} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor.none.none2} xyz'));
	});

	test('a single command variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:command1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('an old style command variable', () => {
		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};
		const commandVariables = Object.create(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('multiple new and old-style command variables', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'pid': '${command:command2}',
			'sourceMaps': false,
			'outDir': 'src/${command:command2}',
			'env': {
				'processId': '__${command:command2}__',
			}
		};
		const commandVariables = Object.create(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {
			const expected = {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'pid': 'command2-result',
				'sourceMaps': false,
				'outDir': 'src/command2-result',
				'env': {
					'processId': '__command2-result__',
				}
			};

			assert.deepStrictEqual(Object.keys(result), Object.keys(expected));
			Object.keys(result).forEach(property => {
				const expectedProperty = (<any>expected)[property];
				if (isObject(result[property])) {
					assert.deepStrictEqual({ ...result[property] }, expectedProperty);
				} else {
					assert.deepStrictEqual(result[property], expectedProperty);
				}
			});
			assert.strictEqual(2, mockCommandService.callCount);
		});
	});

	test('a command variable that relies on resolved env vars', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'value': '${env:key1}'
		};
		const commandVariables = Object.create(null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'Value for key1',
				'value': 'Value for key1'
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('a single prompt input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'resolvedEnterinput1',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('a single pick input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input2}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'selectedPick',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('a single command input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input4}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'arg for command',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('several input variables and command', () => {

		const configuration = {
			'name': '${input:input3}',
			'type': '${command:command1}',
			'request': '${input:input1}',
			'processId': '${input:input2}',
			'command': '${input:input4}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'resolvedEnterinput3',
				'type': 'command1-result',
				'request': 'resolvedEnterinput1',
				'processId': 'selectedPick',
				'command': 'arg for command',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(2, mockCommandService.callCount);
		});
	});

	test('input variable with undefined workspace folder', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'resolvedEnterinput1',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('contributed variable', () => {
		const buildTask = 'npm: compile';
		const variable = 'defaultBuildTask';
		const configuration = {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			'name': '${' + variable + '}',
		};
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		configurationResolverService!.contributeVariable(variable, async () => { return buildTask; });
		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': `${buildTask}`
			});
		});
	});

	test('resolveWithEnvironment', async () => {
		const env = {
			'VAR_1': 'VAL_1',
			'VAR_2': 'VAL_2'
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};
		const configuration = 'echo ${env:VAR_1}${env:VAR_2}';
		const resolvedResult = await configurationResolverService!.resolveWithEnvironment({ ...env }, undefined, configuration);
		assert.deepStrictEqual(resolvedResult, 'echo VAL_1VAL_2');
	});

	test('substitution in object key', async () => {

		const configuration = {
			'name': 'Test',
			'mappings': {
				'pos1': 'value1',
				'${workspaceFolder}/test1': '${workspaceFolder}/test2',
				'pos3': 'value3'
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			if (platform.isWindows) {
				assert.deepStrictEqual({ ...result }, {
					'name': 'Test',
					'mappings': {
						'pos1': 'value1',
						'\\VSCode\\workspaceLocation/test1': '\\VSCode\\workspaceLocation/test2',
						'pos3': 'value3'
					}
				});
			} else {
				assert.deepStrictEqual({ ...result }, {
					'name': 'Test',
					'mappings': {
						'pos1': 'value1',
						'/VSCode/workspaceLocation/test1': '/VSCode/workspaceLocation/test2',
						'pos3': 'value3'
					}
				});
			}

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});
});
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding



class MockCommandService implements ICommandService {

	public _serviceBrand: undefined;
	public callCount = 0;

	onWillExecuteCommand = () => Disposable.None;
	onDidExecuteCommand = () => Disposable.None;
	public executeCommand(commandId: string, ...args: any[]): Promise<any> {
		this.callCount++;

		let result = `${commandId}-result`;
		if (args.length >= 1) {
			if (args[0] && args[0].value) {
				result = args[0].value;
			}
		}

		return Promise.resolve(result);
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 779: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 785: Error message without production error code - breaks React bundle size optimization
//   3. Line 785: Error message without production error code - breaks React bundle size optimization
//   4. Line 788: Error message without production error code - breaks React bundle size optimization
//   5. Line 788: Error message without production error code - breaks React bundle size optimization
//   6. Line 791: Error message without production error code - breaks React bundle size optimization
//   7. Line 791: Error message without production error code - breaks React bundle size optimization
//   8. Line 794: Error message without production error code - breaks React bundle size optimization
//   9. Line 794: Error message without production error code - breaks React bundle size optimization
//   10. Line 797: Error message without production error code - breaks React bundle size optimization
//   11. Line 797: Error message without production error code - breaks React bundle size optimization
//   12. Line 800: Error message without production error code - breaks React bundle size optimization
//   13. Line 800: Error message without production error code - breaks React bundle size optimization
//   14. Line 803: Error message without production error code - breaks React bundle size optimization
//   15. Line 803: Error message without production error code - breaks React bundle size optimization
//   16. Line 808: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 811: Error message without production error code - breaks React bundle size optimization
//   18. Line 811: Error message without production error code - breaks React bundle size optimization
//   19. Line 815: Error message without production error code - breaks React bundle size optimization
//   20. Line 815: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 969: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 975: Error message without production error code - breaks React bundle size optimization
//   3. Line 975: Error message without production error code - breaks React bundle size optimization
//   4. Line 978: Error message without production error code - breaks React bundle size optimization
//   5. Line 978: Error message without production error code - breaks React bundle size optimization
//   6. Line 981: Error message without production error code - breaks React bundle size optimization
//   7. Line 981: Error message without production error code - breaks React bundle size optimization
//   8. Line 984: Error message without production error code - breaks React bundle size optimization
//   9. Line 984: Error message without production error code - breaks React bundle size optimization
//   10. Line 987: Error message without production error code - breaks React bundle size optimization
//   11. Line 987: Error message without production error code - breaks React bundle size optimization
//   12. Line 990: Error message without production error code - breaks React bundle size optimization
//   13. Line 990: Error message without production error code - breaks React bundle size optimization
//   14. Line 993: Error message without production error code - breaks React bundle size optimization
//   15. Line 993: Error message without production error code - breaks React bundle size optimization
//   16. Line 998: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1001: Error message without production error code - breaks React bundle size optimization
//   18. Line 1001: Error message without production error code - breaks React bundle size optimization
//   19. Line 1005: Error message without production error code - breaks React bundle size optimization
//   20. Line 1005: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1059: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1065: Error message without production error code - breaks React bundle size optimization
//   3. Line 1065: Error message without production error code - breaks React bundle size optimization
//   4. Line 1068: Error message without production error code - breaks React bundle size optimization
//   5. Line 1068: Error message without production error code - breaks React bundle size optimization
//   6. Line 1071: Error message without production error code - breaks React bundle size optimization
//   7. Line 1071: Error message without production error code - breaks React bundle size optimization
//   8. Line 1074: Error message without production error code - breaks React bundle size optimization
//   9. Line 1074: Error message without production error code - breaks React bundle size optimization
//   10. Line 1077: Error message without production error code - breaks React bundle size optimization
//   11. Line 1077: Error message without production error code - breaks React bundle size optimization
//   12. Line 1080: Error message without production error code - breaks React bundle size optimization
//   13. Line 1080: Error message without production error code - breaks React bundle size optimization
//   14. Line 1083: Error message without production error code - breaks React bundle size optimization
//   15. Line 1083: Error message without production error code - breaks React bundle size optimization
//   16. Line 1088: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1091: Error message without production error code - breaks React bundle size optimization
//   18. Line 1091: Error message without production error code - breaks React bundle size optimization
//   19. Line 1095: Error message without production error code - breaks React bundle size optimization
//   20. Line 1095: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1119: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1125: Error message without production error code - breaks React bundle size optimization
//   3. Line 1125: Error message without production error code - breaks React bundle size optimization
//   4. Line 1128: Error message without production error code - breaks React bundle size optimization
//   5. Line 1128: Error message without production error code - breaks React bundle size optimization
//   6. Line 1131: Error message without production error code - breaks React bundle size optimization
//   7. Line 1131: Error message without production error code - breaks React bundle size optimization
//   8. Line 1134: Error message without production error code - breaks React bundle size optimization
//   9. Line 1134: Error message without production error code - breaks React bundle size optimization
//   10. Line 1137: Error message without production error code - breaks React bundle size optimization
//   11. Line 1137: Error message without production error code - breaks React bundle size optimization
//   12. Line 1140: Error message without production error code - breaks React bundle size optimization
//   13. Line 1140: Error message without production error code - breaks React bundle size optimization
//   14. Line 1143: Error message without production error code - breaks React bundle size optimization
//   15. Line 1143: Error message without production error code - breaks React bundle size optimization
//   16. Line 1148: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1151: Error message without production error code - breaks React bundle size optimization
//   18. Line 1151: Error message without production error code - breaks React bundle size optimization
//   19. Line 1155: Error message without production error code - breaks React bundle size optimization
//   20. Line 1155: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1179: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1185: Error message without production error code - breaks React bundle size optimization
//   3. Line 1185: Error message without production error code - breaks React bundle size optimization
//   4. Line 1188: Error message without production error code - breaks React bundle size optimization
//   5. Line 1188: Error message without production error code - breaks React bundle size optimization
//   6. Line 1191: Error message without production error code - breaks React bundle size optimization
//   7. Line 1191: Error message without production error code - breaks React bundle size optimization
//   8. Line 1194: Error message without production error code - breaks React bundle size optimization
//   9. Line 1194: Error message without production error code - breaks React bundle size optimization
//   10. Line 1197: Error message without production error code - breaks React bundle size optimization
//   11. Line 1197: Error message without production error code - breaks React bundle size optimization
//   12. Line 1200: Error message without production error code - breaks React bundle size optimization
//   13. Line 1200: Error message without production error code - breaks React bundle size optimization
//   14. Line 1203: Error message without production error code - breaks React bundle size optimization
//   15. Line 1203: Error message without production error code - breaks React bundle size optimization
//   16. Line 1208: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1211: Error message without production error code - breaks React bundle size optimization
//   18. Line 1211: Error message without production error code - breaks React bundle size optimization
//   19. Line 1215: Error message without production error code - breaks React bundle size optimization
//   20. Line 1215: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1239: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1245: Error message without production error code - breaks React bundle size optimization
//   3. Line 1245: Error message without production error code - breaks React bundle size optimization
//   4. Line 1248: Error message without production error code - breaks React bundle size optimization
//   5. Line 1248: Error message without production error code - breaks React bundle size optimization
//   6. Line 1251: Error message without production error code - breaks React bundle size optimization
//   7. Line 1251: Error message without production error code - breaks React bundle size optimization
//   8. Line 1254: Error message without production error code - breaks React bundle size optimization
//   9. Line 1254: Error message without production error code - breaks React bundle size optimization
//   10. Line 1257: Error message without production error code - breaks React bundle size optimization
//   11. Line 1257: Error message without production error code - breaks React bundle size optimization
//   12. Line 1260: Error message without production error code - breaks React bundle size optimization
//   13. Line 1260: Error message without production error code - breaks React bundle size optimization
//   14. Line 1263: Error message without production error code - breaks React bundle size optimization
//   15. Line 1263: Error message without production error code - breaks React bundle size optimization
//   16. Line 1268: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1271: Error message without production error code - breaks React bundle size optimization
//   18. Line 1271: Error message without production error code - breaks React bundle size optimization
//   19. Line 1275: Error message without production error code - breaks React bundle size optimization
//   20. Line 1275: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1299: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1305: Error message without production error code - breaks React bundle size optimization
//   3. Line 1305: Error message without production error code - breaks React bundle size optimization
//   4. Line 1308: Error message without production error code - breaks React bundle size optimization
//   5. Line 1308: Error message without production error code - breaks React bundle size optimization
//   6. Line 1311: Error message without production error code - breaks React bundle size optimization
//   7. Line 1311: Error message without production error code - breaks React bundle size optimization
//   8. Line 1314: Error message without production error code - breaks React bundle size optimization
//   9. Line 1314: Error message without production error code - breaks React bundle size optimization
//   10. Line 1317: Error message without production error code - breaks React bundle size optimization
//   11. Line 1317: Error message without production error code - breaks React bundle size optimization
//   12. Line 1320: Error message without production error code - breaks React bundle size optimization
//   13. Line 1320: Error message without production error code - breaks React bundle size optimization
//   14. Line 1323: Error message without production error code - breaks React bundle size optimization
//   15. Line 1323: Error message without production error code - breaks React bundle size optimization
//   16. Line 1328: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1331: Error message without production error code - breaks React bundle size optimization
//   18. Line 1331: Error message without production error code - breaks React bundle size optimization
//   19. Line 1335: Error message without production error code - breaks React bundle size optimization
//   20. Line 1335: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1359: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1365: Error message without production error code - breaks React bundle size optimization
//   3. Line 1365: Error message without production error code - breaks React bundle size optimization
//   4. Line 1368: Error message without production error code - breaks React bundle size optimization
//   5. Line 1368: Error message without production error code - breaks React bundle size optimization
//   6. Line 1371: Error message without production error code - breaks React bundle size optimization
//   7. Line 1371: Error message without production error code - breaks React bundle size optimization
//   8. Line 1374: Error message without production error code - breaks React bundle size optimization
//   9. Line 1374: Error message without production error code - breaks React bundle size optimization
//   10. Line 1377: Error message without production error code - breaks React bundle size optimization
//   11. Line 1377: Error message without production error code - breaks React bundle size optimization
//   12. Line 1380: Error message without production error code - breaks React bundle size optimization
//   13. Line 1380: Error message without production error code - breaks React bundle size optimization
//   14. Line 1383: Error message without production error code - breaks React bundle size optimization
//   15. Line 1383: Error message without production error code - breaks React bundle size optimization
//   16. Line 1388: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1391: Error message without production error code - breaks React bundle size optimization
//   18. Line 1391: Error message without production error code - breaks React bundle size optimization
//   19. Line 1395: Error message without production error code - breaks React bundle size optimization
//   20. Line 1395: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (20):
//   1. Line 1419: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1425: Error message without production error code - breaks React bundle size optimization
//   3. Line 1425: Error message without production error code - breaks React bundle size optimization
//   4. Line 1428: Error message without production error code - breaks React bundle size optimization
//   5. Line 1428: Error message without production error code - breaks React bundle size optimization
//   6. Line 1431: Error message without production error code - breaks React bundle size optimization
//   7. Line 1431: Error message without production error code - breaks React bundle size optimization
//   8. Line 1434: Error message without production error code - breaks React bundle size optimization
//   9. Line 1434: Error message without production error code - breaks React bundle size optimization
//   10. Line 1437: Error message without production error code - breaks React bundle size optimization
//   11. Line 1437: Error message without production error code - breaks React bundle size optimization
//   12. Line 1440: Error message without production error code - breaks React bundle size optimization
//   13. Line 1440: Error message without production error code - breaks React bundle size optimization
//   14. Line 1443: Error message without production error code - breaks React bundle size optimization
//   15. Line 1443: Error message without production error code - breaks React bundle size optimization
//   16. Line 1448: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1451: Error message without production error code - breaks React bundle size optimization
//   18. Line 1451: Error message without production error code - breaks React bundle size optimization
//   19. Line 1455: Error message without production error code - breaks React bundle size optimization
//   20. Line 1455: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

class MockLabelService implements ILabelService {
	_serviceBrand: undefined;
	getUriLabel(resource: URI, options?: { relative?: boolean | undefined; noPrefix?: boolean | undefined }): string {
		return normalize(resource.fsPath);
	}
	getUriBasenameLabel(resource: URI): string {
		throw new Error('Method not implemented.');
	}
	getWorkspaceLabel(workspace: URI | IWorkspaceIdentifier | IWorkspace, options?: { verbose: Verbosity }): string {
		throw new Error('Method not implemented.');
	}
	getHostLabel(scheme: string, authority?: string): string {
		throw new Error('Method not implemented.');
	}
	public getHostTooltip(): string | undefined {
		throw new Error('Method not implemented.');
	}
	getSeparator(scheme: string, authority?: string): '/' | '\\' {
		throw new Error('Method not implemented.');
	}
	registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	onDidChangeFormatters: Event<IFormatterChangeEvent> = new Emitter<IFormatterChangeEvent>().event;
}

class MockPathService implements IPathService {
	_serviceBrand: undefined;
	get path(): Promise<IPath> {
		throw new Error('Property not implemented');
	}
	defaultUriScheme: string = Schemas.file;
	fileURI(path: string): Promise<URI> {
		throw new Error('Method not implemented.');
	}
	userHome(options?: { preferLocal: boolean }): Promise<URI>;
	userHome(options: { preferLocal: true }): URI;
	userHome(options?: { preferLocal: boolean }): Promise<URI> | URI {
		const uri = URI.file('c:\\users\\username');
		return options?.preferLocal ? uri : Promise.resolve(uri);
	}
	hasValidBasename(resource: URI, basename?: string): Promise<boolean>;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 826: Error message without production error code - breaks React bundle size optimization
//   2. Line 826: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	hasValidBasename(resource: URI, os: platform.OperatingSystem, basename?: string): boolean;
	hasValidBasename(resource: URI, arg2?: string | platform.OperatingSystem, name?: string): boolean | Promise<boolean> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 1026: Error message without production error code - breaks React bundle size optimization
//   2. Line 1026: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
	resolvedUserHome: URI | undefined;
}

class MockInputsConfigurationService extends TestConfigurationService {
	public override getValue(arg1?: any, arg2?: any): any {
		let configuration;
		if (arg1 === 'tasks') {
			configuration = {
				inputs: [
					{
						id: 'input1',
						type: 'promptString',
						description: 'Enterinput1',
						default: 'default input1'
					},
					{
						id: 'input2',
						type: 'pickString',
						description: 'Enterinput1',
						default: 'option2',
						options: ['option1', 'option2', 'option3']
					},
					{
						id: 'input3',
						type: 'promptString',
						description: 'Enterinput3',
						default: 'default input3',
						provide: true,
						password: true
					},
					{
						id: 'input4',
						type: 'command',
						command: 'command1',
						args: {
							value: 'arg for command'
						}
					}
				]
			};
		}
		return configuration;
	}

	public override inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<T> {
		return {
			value: undefined,
			defaultValue: undefined,
			userValue: undefined,
			overrideIdentifiers: []
		};
	}
}

suite('ConfigurationResolverExpression', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse empty object', () => {
		const expr = ConfigurationResolverExpression.parse({});
		assert.strictEqual(Array.from(expr.unresolved()).length, 0);
		assert.deepStrictEqual(expr.toObject(), {});
	});

	test('parse simple string', () => {
		const expr = ConfigurationResolverExpression.parse({ value: '${env:HOME}' });
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');
	});

	test('parse string with argument and colon', () => {
		const expr = ConfigurationResolverExpression.parse({ value: '${config:path:to:value}' });
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'config');
		assert.strictEqual(unresolved[0].arg, 'path:to:value');
	});

	test('parse object with nested variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}',
			path: '${env:HOME}/folder',
			settings: {
				value: '${config:path}'
			},
			array: ['${env:TERM}', { key: '${env:KEY}' }]
		});

		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 5);
		assert.deepStrictEqual(unresolved.map(r => r.name).sort(), ['config', 'env', 'env', 'env', 'env']);
	});

	test('resolve and get result', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}',
			path: '${env:HOME}/folder'
		});

		expr.resolve({ inner: 'env:USERNAME', id: '${env:USERNAME}', name: 'env', arg: 'USERNAME' }, 'testuser');
		expr.resolve({ inner: 'env:HOME', id: '${env:HOME}', name: 'env', arg: 'HOME' }, '/home/testuser');

		assert.deepStrictEqual(expr.toObject(), {
			name: 'testuser',
			path: '/home/testuser/folder'
		});
	});

	test('keeps unresolved variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}'
		});

		assert.deepStrictEqual(expr.toObject(), {
			name: '${env:USERNAME}'
		});
	});

	test('deduplicates identical variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			first: '${env:HOME}',
			second: '${env:HOME}'
		});

		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');

		expr.resolve(unresolved[0], '/home/user');
		assert.deepStrictEqual(expr.toObject(), {
			first: '/home/user',
			second: '/home/user'
		});
	});

	test('handles root string value', () => {
		const expr = ConfigurationResolverExpression.parse('abc ${env:HOME} xyz');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');

		expr.resolve(unresolved[0], '/home/user');
		assert.strictEqual(expr.toObject(), 'abc /home/user xyz');
	});

	test('handles root string value with multiple variables', () => {
		const expr = ConfigurationResolverExpression.parse('${env:HOME}/folder${env:SHELL}');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 2);

		expr.resolve({ id: '${env:HOME}', inner: 'env:HOME', name: 'env', arg: 'HOME' }, '/home/user');
		expr.resolve({ id: '${env:SHELL}', inner: 'env:SHELL', name: 'env', arg: 'SHELL' }, '/bin/bash');
		assert.strictEqual(expr.toObject(), '/home/user/folder/bin/bash');
	});

	test('handles root string with escaped variables', () => {
		const expr = ConfigurationResolverExpression.parse('abc ${env:HOME${env:USER}} xyz');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME${env:USER}');
	});

	test('resolves nested values', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:REDIRECTED}',
			'key that is ${env:REDIRECTED}': 'cool!',
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'REDIRECTED') {
				expr.resolve(r, 'username: ${env:USERNAME}');
			} else if (r.arg === 'USERNAME') {
				expr.resolve(r, 'testuser');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			name: 'username: testuser',
			'key that is username: testuser': 'cool!'
		});
	});

	test('resolves nested values 2 (#245798)', () => {
		const expr = ConfigurationResolverExpression.parse({
			env: {
				SITE: "${input:site}",
				TLD: "${input:tld}",
				HOST: "${input:host}",
			},
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'site') {
				expr.resolve(r, 'example');
			} else if (r.arg === 'tld') {
				expr.resolve(r, 'com');
			} else if (r.arg === 'host') {
				expr.resolve(r, 'local.${input:site}.${input:tld}');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			env: {
				SITE: 'example',
				TLD: 'com',
				HOST: 'local.example.com'
			}
		});
	});

	test('out-of-order key resolution (#248550)', () => {
		const expr = ConfigurationResolverExpression.parse({
			'${input:key}': "${input:value}",
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'key') {
				expr.resolve(r, 'the-key');
			}
		}
		for (const r of expr.unresolved()) {
			if (r.arg === 'value') {
				expr.resolve(r, 'the-value');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			'the-key': 'the-value'
		});
	});
});
