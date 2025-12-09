//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { deepStrictEqual, fail, strictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { getActiveDocument } from '../../../../../../base/browser/dom.js';
import { timeout } from '../../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { TerminalCapability, type ICommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import type { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ShellIntegrationAddon } from '../../../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';
import { workbenchInstantiationService, type TestTerminalConfigurationService } from '../../../../../test/browser/workbenchTestServices.js';
import { ITerminalConfigurationService } from '../../../../terminal/browser/terminal.js';

import { NullTelemetryService } from '../../../../../../platform/telemetry/common/telemetryUtils.js';
import { events as rich_windows11_pwsh7_echo_3_times } from './recordings/rich/windows11_pwsh7_echo_3_times.js';
import { events as rich_windows11_pwsh7_ls_one_time } from './recordings/rich/windows11_pwsh7_ls_one_time.js';
import { events as rich_windows11_pwsh7_type_foo } from './recordings/rich/windows11_pwsh7_type_foo.js';
import { events as rich_windows11_pwsh7_type_foo_left_twice } from './recordings/rich/windows11_pwsh7_type_foo_left_twice.js';
import { events as rich_macos_zsh_omz_echo_3_times } from './recordings/rich/macos_zsh_omz_echo_3_times.js';
import { events as rich_macos_zsh_omz_ls_one_time } from './recordings/rich/macos_zsh_omz_ls_one_time.js';
import { events as basic_macos_zsh_p10k_ls_one_time } from './recordings/basic/macos_zsh_p10k_ls_one_time.js';

// These are test cases recorded with the `Developer: Record Terminal Session` command. Once that is
// run, a terminal is created and the test case is manually executed. After nothing happens for a
// few seconds the test case will be put into the clipboard.
//
// They aim to guarantee the complex interactions within command detection result in a particular
// outcome.
//
// Some things to be aware of when recording tests:
// - Pwsh on non-Windows can add a bunch of spammy cursor reports (`CSI x;y R`)
// - It's best to record pwsh on Windows
// - It's best to record other shells on non-Windows
// - Turn off builtinCompletions to simplify the recording
// - Capitalization matters in the recorded events
type RecordedTestCase = {
	/**
	 * The test case name.
	 */
	name: string;
	/**
	 * A set of events that will play or be awaited for in order.
	 */
	events: RecordedSessionEvent[];
	/**
	 * Any assertions to perform after the events have been played and validated.
	 */
	finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => void;
};
const recordedTestCases: RecordedTestCase[] = [
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 66: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 94: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	{
		name: 'rich_windows11_pwsh7_echo_3_times',
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 134: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 530: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		events: rich_windows11_pwsh7_echo_3_times as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['echo a', 'echo b', 'echo c'], '|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_ls_one_time',
		events: rich_windows11_pwsh7_ls_one_time as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['ls'], '|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_type_foo',
		events: rich_windows11_pwsh7_type_foo as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, [], 'foo|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_type_foo_left_twice',
		events: rich_windows11_pwsh7_type_foo_left_twice as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, [], 'f|oo');
		}
	},
	{
		name: 'rich_macos_zsh_omz_echo_3_times',
		events: rich_macos_zsh_omz_echo_3_times as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['echo a', 'echo b', 'echo c'], '|');
		}
	},
	{
		name: 'rich_macos_zsh_omz_ls_one_time',
		events: rich_macos_zsh_omz_ls_one_time as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['ls'], '|');
		}
	},
	{
		name: 'basic_macos_zsh_p10k_ls_one_time',
		events: basic_macos_zsh_p10k_ls_one_time as any as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			// Prompt input model doesn't work for p10k yet
			// Assert a single command has completed
			deepStrictEqual(commandDetection!.commands.map(e => e.command), ['']);
		}
	},
];
function assertCommandDetectionState(commandDetection: ICommandDetectionCapability | undefined, commands: string[], promptInput: string) {
	if (!commandDetection) {
		fail('Command detection must be set');
	}
	deepStrictEqual(commandDetection!.commands.map(e => e.command), commands);
	strictEqual(commandDetection!.promptInputModel.getCombinedString(), promptInput);
}

type RecordedSessionEvent = (
	IRecordedSessionTerminalEvent |
	IRecordedSessionCommandEvent |
	IRecordedSessionResizeEvent
);

interface IRecordedSessionTerminalEvent {
	type: 'output' | 'input' | 'sendText' | 'promptInputChange';
	data: string;
}

interface IRecordedSessionCommandEvent {
	type: 'command';
	id: string;
}

interface IRecordedSessionResizeEvent {
	type: 'resize';
	cols: number;
	rows: number;
}

suite('Terminal Contrib Shell Integration Recordings', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let xterm: Terminal;
	let capabilities: TerminalCapabilityStore;

	setup(async () => {
		const terminalConfig = {
			integrated: {
			}
		};
		const instantiationService = workbenchInstantiationService({
			configurationService: () => new TestConfigurationService({
				files: { autoSave: false },
				terminal: terminalConfig,
				editor: { fontSize: 14, fontFamily: 'Arial', lineHeight: 12, fontWeight: 'bold' }
			})
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		}, store);
		const terminalConfigurationService = instantiationService.get(ITerminalConfigurationService) as TestTerminalConfigurationService;
		terminalConfigurationService.setConfig(terminalConfig as any);
		const shellIntegrationAddon = store.add(new ShellIntegrationAddon('', true, undefined, NullTelemetryService, new NullLogService));
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true }));
		capabilities = shellIntegrationAddon.capabilities;
		const testContainer = document.createElement('div');
		getActiveDocument().body.append(testContainer);

		xterm.open(testContainer);
		xterm.loadAddon(shellIntegrationAddon);
		xterm.focus();
	});

	for (const testCase of recordedTestCases) {
		test(testCase.name, async () => {
			for (const [i, event] of testCase.events.entries()) {
				// DEBUG: Uncomment to see the events as they are played
				// console.log(
				// 	event.type,
				// 	event.type === 'command'
				// 		? event.id
				// 		: event.type === 'resize'
				// 			? `${event.cols}x${event.rows}`
				// 			: (event.data.length > 50 ? event.data.slice(0, 50) + '...' : event.data).replaceAll('\x1b', '\\x1b').replace(/(\n|\r).+$/, '...')
				// );
				// console.log('promptInputModel', capabilities.get(TerminalCapability.CommandDetection)?.promptInputModel.getCombinedString());
				switch (event.type) {
					case 'resize': {
						xterm.resize(event.cols, event.rows);
						break;
					}
					case 'output': {
						const promises: Promise<unknown>[] = [];
						if (event.data.includes('\x1b]633;B')) {
							// If the output contains the command start sequence, allow time for the prompt to get
							// adjusted.
							promises.push(new Promise<void>(r => {
								const commandDetection = capabilities.get(TerminalCapability.CommandDetection)!;
								if (commandDetection) {
									const d = commandDetection.onCommandStarted(() => {
										d.dispose();
										r();
									});
								}
							}));
						}
						promises.push(new Promise<void>(r => xterm.write(event.data, () => r())));
						await Promise.all(promises);
						break;
					}
					case 'input': {
						xterm.input(event.data, true);
						break;
					}
					case 'promptInputChange': {
						// Ignore this event if it's followed by another promptInputChange as that
						// means this one isn't important and could cause a race condition in the
						// test
						if (testCase.events.length > i + 1 && testCase.events[i + 1].type === 'promptInputChange') {
							continue;
						}
						const promptInputModel = capabilities.get(TerminalCapability.CommandDetection)?.promptInputModel;
						if (promptInputModel && promptInputModel.getCombinedString() !== event.data) {
							await Promise.race([
								await timeout(1000).then(() => { throw new Error(`Prompt input change timed out current="${promptInputModel.getCombinedString()}", expected="${event.data}"`); }),
								await new Promise<void>(r => {
									const d = promptInputModel.onDidChangeInput(() => {
										if (promptInputModel.getCombinedString() === event.data) {
											d.dispose();
											r();
										}
									});
								})
							]);
						}
						break;
					}
				}
			}
			testCase.finalAssertions(capabilities.get(TerminalCapability.CommandDetection));
		});
	}
});
