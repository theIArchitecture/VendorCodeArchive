//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fail } from 'assert';
import { Emitter } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../../../platform/dialogs/test/common/testDialogService.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalInstance, ITerminalInstanceService, ITerminalService } from '../../browser/terminal.js';
import { TerminalService } from '../../browser/terminalService.js';
import { TERMINAL_CONFIG_SECTION } from '../../common/terminal.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('Workbench - TerminalService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let terminalService: TerminalService;
	let configurationService: TestConfigurationService;
	let dialogService: TestDialogService;

	setup(async () => {
		dialogService = new TestDialogService();
		configurationService = new TestConfigurationService({
			files: {},
			terminal: {
				integrated: {
					confirmOnKill: 'never'
				}
			}
		});

		const instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService,
		}, store);
		instantiationService.stub(IDialogService, dialogService);
		instantiationService.stub(ITerminalInstanceService, 'getBackend', undefined);
		instantiationService.stub(ITerminalInstanceService, 'getRegisteredBackends', []);
		instantiationService.stub(IRemoteAgentService, 'getConnection', null);

		terminalService = store.add(instantiationService.createInstance(TerminalService));
		instantiationService.stub(ITerminalService, terminalService);
	});

	suite('safeDisposeTerminal', () => {
		let onExitEmitter: Emitter<number | undefined>;

		setup(() => {
			onExitEmitter = store.add(new Emitter<number | undefined>());
		});

		test('should not show prompt when confirmOnKill is never', async () => {
			await setConfirmOnKill(configurationService, 'never');
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 69: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 94: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 91: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			} as Partial<ITerminalInstance> as any);
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
		});
		test('should not show prompt when any terminal editor is closed (handled by editor itself)', async () => {
			await setConfirmOnKill(configurationService, 'editor');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
			await setConfirmOnKill(configurationService, 'always');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
		});
		test('should not show prompt when confirmOnKill is editor and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'editor');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
		});
		test('should show prompt when confirmOnKill is panel and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'panel');
			// No child process cases
			dialogService.setConfirmResult({ confirmed: false });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			} as Partial<ITerminalInstance> as any);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
			// Child process cases
			dialogService.setConfirmResult({ confirmed: false });
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				dispose: () => fail()
			} as Partial<ITerminalInstance> as any);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
		});
		test('should show prompt when confirmOnKill is always and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'always');
			// No child process cases
			dialogService.setConfirmResult({ confirmed: false });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 626: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 633: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 692: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 716: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 761: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			} as Partial<ITerminalInstance> as any);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
			// Child process cases
			dialogService.setConfirmResult({ confirmed: false });
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				dispose: () => fail()
			} as Partial<ITerminalInstance> as any);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} as Partial<ITerminalInstance> as any);
		});
	});
});

async function setConfirmOnKill(configurationService: TestConfigurationService, value: 'never' | 'always' | 'panel' | 'editor') {
	await configurationService.setUserConfiguration(TERMINAL_CONFIG_SECTION, { confirmOnKill: value });
	configurationService.onDidChangeConfigurationEmitter.fire({
		affectsConfiguration: () => true,
		affectedKeys: ['terminal.integrated.confirmOnKill']
	} as any);
}
