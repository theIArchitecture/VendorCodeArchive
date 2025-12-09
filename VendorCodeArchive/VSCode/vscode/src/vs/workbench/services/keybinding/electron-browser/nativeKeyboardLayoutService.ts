//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeyboardLayoutInfo, IKeyboardMapping, IMacLinuxKeyboardMapping, IWindowsKeyboardMapping, macLinuxKeyboardMappingEquals, windowsKeyboardMappingEquals } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';
import { Emitter, Event } from '../../../../base/common/event.js';
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 11: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 25: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 29: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 31: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 37: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 53: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 101: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 137: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 151: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 151: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 161: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 173: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 187: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 187: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 247: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 247: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 259: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 259: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 271: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 271: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 281: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 295: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 295: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 319: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 319: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 331: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 331: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

import { INativeKeyboardLayoutService as IBaseNativeKeyboardLayoutService } from '../../../../platform/keyboardLayout/common/keyboardLayoutService.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INativeKeyboardLayoutService = createDecorator<INativeKeyboardLayoutService>('nativeKeyboardLayoutService');

export interface INativeKeyboardLayoutService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeKeyboardLayout: Event<void>;
	getRawKeyboardMapping(): IKeyboardMapping | null;
	getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null;
}

export class NativeKeyboardLayoutService extends Disposable implements INativeKeyboardLayoutService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeKeyboardLayout = this._register(new Emitter<void>());
	readonly onDidChangeKeyboardLayout = this._onDidChangeKeyboardLayout.event;

	private readonly _keyboardLayoutService: IBaseNativeKeyboardLayoutService;
	private _initPromise: Promise<void> | null;
	private _keyboardMapping: IKeyboardMapping | null;
	private _keyboardLayoutInfo: IKeyboardLayoutInfo | null;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		super();
		this._keyboardLayoutService = ProxyChannel.toService<IBaseNativeKeyboardLayoutService>(mainProcessService.getChannel('keyboardLayout'));
		this._initPromise = null;
		this._keyboardMapping = null;
		this._keyboardLayoutInfo = null;

		this._register(this._keyboardLayoutService.onDidChangeKeyboardLayout(async ({ keyboardLayoutInfo, keyboardMapping }) => {
			await this.initialize();
			if (keyboardMappingEquals(this._keyboardMapping, keyboardMapping)) {
				// the mappings are equal
				return;
			}

			this._keyboardMapping = keyboardMapping;
			this._keyboardLayoutInfo = keyboardLayoutInfo;
			this._onDidChangeKeyboardLayout.fire();
		}));
	}

	public initialize(): Promise<void> {
		if (!this._initPromise) {
			this._initPromise = this._doInitialize();
		}
		return this._initPromise;
	}

	private async _doInitialize(): Promise<void> {
		const keyboardLayoutData = await this._keyboardLayoutService.getKeyboardLayoutData();
		const { keyboardLayoutInfo, keyboardMapping } = keyboardLayoutData;
		this._keyboardMapping = keyboardMapping;
		this._keyboardLayoutInfo = keyboardLayoutInfo;
	}

	public getRawKeyboardMapping(): IKeyboardMapping | null {
		return this._keyboardMapping;
	}

	public getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null {
		return this._keyboardLayoutInfo;
	}
}

function keyboardMappingEquals(a: IKeyboardMapping | null, b: IKeyboardMapping | null): boolean {
	if (OS === OperatingSystem.Windows) {
		return windowsKeyboardMappingEquals(<IWindowsKeyboardMapping | null>a, <IWindowsKeyboardMapping | null>b);
	}

	return macLinuxKeyboardMappingEquals(<IMacLinuxKeyboardMapping | null>a, <IMacLinuxKeyboardMapping | null>b);
}
