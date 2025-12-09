//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as paths from '../../../../base/common/path.js';
import { IProcessEnvironment, isWindows } from '../../../../base/common/platform.js';
import * as process from '../../../../base/common/process.js';
import * as types from '../../../../base/common/types.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { allVariableKinds, IConfigurationResolverService, VariableError, VariableKind } from './configurationResolver.js';
import { ConfigurationResolverExpression, IResolvedValue, Replacement } from './configurationResolverExpression.js';

interface IVariableResolveContext {
	getFolderUri(folderName: string): uri | undefined;
	getWorkspaceFolderCount(): number;
	getConfigurationValue(folderUri: uri | undefined, section: string): string | undefined;
	getAppRoot(): string | undefined;
	getExecPath(): string | undefined;
	getFilePath(): string | undefined;
	getWorkspaceFolderPathForFile?(): string | undefined;
	getSelectedText(): string | undefined;
	getLineNumber(): string | undefined;
	getColumnNumber(): string | undefined;
	getExtension(id: string): Promise<{ readonly extensionLocation: uri } | undefined>;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

type Environment = { env: IProcessEnvironment | undefined; userHome: string | undefined };

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export abstract class AbstractVariableResolverService implements IConfigurationResolverService {

	declare readonly _serviceBrand: undefined;

	private _context: IVariableResolveContext;
	private _labelService?: ILabelService;
	private _envVariablesPromise?: Promise<IProcessEnvironment>;
	private _userHomePromise?: Promise<string>;
	protected _contributedVariables: Map<string, () => Promise<string | undefined>> = new Map();

	public readonly resolvableVariables = new Set<string>(allVariableKinds);

	constructor(_context: IVariableResolveContext, _labelService?: ILabelService, _userHomePromise?: Promise<string>, _envVariablesPromise?: Promise<IProcessEnvironment>) {
		this._context = _context;
		this._labelService = _labelService;
		this._userHomePromise = _userHomePromise;
		if (_envVariablesPromise) {
			this._envVariablesPromise = _envVariablesPromise.then(envVariables => {
				return this.prepareEnv(envVariables);
			});
		}
	}

	private prepareEnv(envVariables: IProcessEnvironment): IProcessEnvironment {
		// windows env variables are case insensitive
		if (isWindows) {
			const ev: IProcessEnvironment = Object.create(null);
			Object.keys(envVariables).forEach(key => {
				ev[key.toLowerCase()] = envVariables[key];
			});
			return ev;
		}
		return envVariables;
	}

	public async resolveWithEnvironment(environment: IProcessEnvironment, folder: IWorkspaceFolderData | undefined, value: string): Promise<string> {
		const expr = ConfigurationResolverExpression.parse(value);

		for (const replacement of expr.unresolved()) {
			const resolvedValue = await this.evaluateSingleVariable(replacement, folder?.uri, environment);
			if (resolvedValue !== undefined) {
				expr.resolve(replacement, String(resolvedValue));
			}
		}

		return expr.toObject();
	}

	public async resolveAsync<T>(folder: IWorkspaceFolderData | undefined, config: T): Promise<T extends ConfigurationResolverExpression<infer R> ? R : T> {
		const expr = ConfigurationResolverExpression.parse(config);

		for (const replacement of expr.unresolved()) {
			const resolvedValue = await this.evaluateSingleVariable(replacement, folder?.uri);
			if (resolvedValue !== undefined) {
				expr.resolve(replacement, String(resolvedValue));
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 97: Error message without production error code - breaks React bundle size optimization
//   3. Line 97: Error message without production error code - breaks React bundle size optimization
//   4. Line 101: Error message without production error code - breaks React bundle size optimization
//   5. Line 101: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 122: Error message without production error code - breaks React bundle size optimization
//   3. Line 122: Error message without production error code - breaks React bundle size optimization
//   4. Line 126: Error message without production error code - breaks React bundle size optimization
//   5. Line 126: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 145: Error message without production error code - breaks React bundle size optimization
//   3. Line 145: Error message without production error code - breaks React bundle size optimization
//   4. Line 149: Error message without production error code - breaks React bundle size optimization
//   5. Line 149: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 158: Error message without production error code - breaks React bundle size optimization
//   3. Line 158: Error message without production error code - breaks React bundle size optimization
//   4. Line 162: Error message without production error code - breaks React bundle size optimization
//   5. Line 162: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 171: Error message without production error code - breaks React bundle size optimization
//   3. Line 171: Error message without production error code - breaks React bundle size optimization
//   4. Line 175: Error message without production error code - breaks React bundle size optimization
//   5. Line 175: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Error message without production error code - breaks React bundle size optimization
//   3. Line 184: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
//   5. Line 188: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 197: Error message without production error code - breaks React bundle size optimization
//   3. Line 197: Error message without production error code - breaks React bundle size optimization
//   4. Line 201: Error message without production error code - breaks React bundle size optimization
//   5. Line 201: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 210: Error message without production error code - breaks React bundle size optimization
//   3. Line 210: Error message without production error code - breaks React bundle size optimization
//   4. Line 214: Error message without production error code - breaks React bundle size optimization
//   5. Line 214: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 223: Error message without production error code - breaks React bundle size optimization
//   3. Line 223: Error message without production error code - breaks React bundle size optimization
//   4. Line 227: Error message without production error code - breaks React bundle size optimization
//   5. Line 227: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Error message without production error code - breaks React bundle size optimization
//   3. Line 236: Error message without production error code - breaks React bundle size optimization
//   4. Line 240: Error message without production error code - breaks React bundle size optimization
//   5. Line 240: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
//   3. Line 249: Error message without production error code - breaks React bundle size optimization
//   4. Line 253: Error message without production error code - breaks React bundle size optimization
//   5. Line 253: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 262: Error message without production error code - breaks React bundle size optimization
//   3. Line 262: Error message without production error code - breaks React bundle size optimization
//   4. Line 266: Error message without production error code - breaks React bundle size optimization
//   5. Line 266: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 275: Error message without production error code - breaks React bundle size optimization
//   3. Line 275: Error message without production error code - breaks React bundle size optimization
//   4. Line 279: Error message without production error code - breaks React bundle size optimization
//   5. Line 279: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Error message without production error code - breaks React bundle size optimization
//   3. Line 288: Error message without production error code - breaks React bundle size optimization
//   4. Line 292: Error message without production error code - breaks React bundle size optimization
//   5. Line 292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 301: Error message without production error code - breaks React bundle size optimization
//   3. Line 301: Error message without production error code - breaks React bundle size optimization
//   4. Line 305: Error message without production error code - breaks React bundle size optimization
//   5. Line 305: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Error message without production error code - breaks React bundle size optimization
//   3. Line 314: Error message without production error code - breaks React bundle size optimization
//   4. Line 318: Error message without production error code - breaks React bundle size optimization
//   5. Line 318: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 327: Error message without production error code - breaks React bundle size optimization
//   3. Line 327: Error message without production error code - breaks React bundle size optimization
//   4. Line 331: Error message without production error code - breaks React bundle size optimization
//   5. Line 331: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 340: Error message without production error code - breaks React bundle size optimization
//   3. Line 340: Error message without production error code - breaks React bundle size optimization
//   4. Line 344: Error message without production error code - breaks React bundle size optimization
//   5. Line 344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
//   3. Line 353: Error message without production error code - breaks React bundle size optimization
//   4. Line 357: Error message without production error code - breaks React bundle size optimization
//   5. Line 357: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 366: Error message without production error code - breaks React bundle size optimization
//   3. Line 366: Error message without production error code - breaks React bundle size optimization
//   4. Line 370: Error message without production error code - breaks React bundle size optimization
//   5. Line 370: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 379: Error message without production error code - breaks React bundle size optimization
//   3. Line 379: Error message without production error code - breaks React bundle size optimization
//   4. Line 383: Error message without production error code - breaks React bundle size optimization
//   5. Line 383: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 392: Error message without production error code - breaks React bundle size optimization
//   3. Line 392: Error message without production error code - breaks React bundle size optimization
//   4. Line 396: Error message without production error code - breaks React bundle size optimization
//   5. Line 396: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 405: Error message without production error code - breaks React bundle size optimization
//   3. Line 405: Error message without production error code - breaks React bundle size optimization
//   4. Line 409: Error message without production error code - breaks React bundle size optimization
//   5. Line 409: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Error message without production error code - breaks React bundle size optimization
//   3. Line 418: Error message without production error code - breaks React bundle size optimization
//   4. Line 422: Error message without production error code - breaks React bundle size optimization
//   5. Line 422: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 431: Error message without production error code - breaks React bundle size optimization
//   3. Line 431: Error message without production error code - breaks React bundle size optimization
//   4. Line 435: Error message without production error code - breaks React bundle size optimization
//   5. Line 435: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 444: Error message without production error code - breaks React bundle size optimization
//   3. Line 444: Error message without production error code - breaks React bundle size optimization
//   4. Line 448: Error message without production error code - breaks React bundle size optimization
//   5. Line 448: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 457: Error message without production error code - breaks React bundle size optimization
//   3. Line 457: Error message without production error code - breaks React bundle size optimization
//   4. Line 461: Error message without production error code - breaks React bundle size optimization
//   5. Line 461: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 470: Error message without production error code - breaks React bundle size optimization
//   3. Line 470: Error message without production error code - breaks React bundle size optimization
//   4. Line 474: Error message without production error code - breaks React bundle size optimization
//   5. Line 474: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 483: Error message without production error code - breaks React bundle size optimization
//   3. Line 483: Error message without production error code - breaks React bundle size optimization
//   4. Line 487: Error message without production error code - breaks React bundle size optimization
//   5. Line 487: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		return expr.toObject() as any;
	}

	public resolveWithInteractionReplace(folder: IWorkspaceFolderData | undefined, config: any): Promise<any> {
		throw new Error('resolveWithInteractionReplace not implemented.');
	}

	public resolveWithInteraction(folder: IWorkspaceFolderData | undefined, config: any): Promise<Map<string, string> | undefined> {
		throw new Error('resolveWithInteraction not implemented.');
	}

	public contributeVariable(variable: string, resolution: () => Promise<string | undefined>): void {
		if (this._contributedVariables.has(variable)) {
			throw new Error('Variable ' + variable + ' is contributed twice.');
		} else {
			this.resolvableVariables.add(variable);
			this._contributedVariables.set(variable, resolution);
		}
	}

	private fsPath(displayUri: uri): string {
		return this._labelService ? this._labelService.getUriLabel(displayUri, { noPrefix: true }) : displayUri.fsPath;
	}

	protected async evaluateSingleVariable(replacement: Replacement, folderUri: uri | undefined, processEnvironment?: IProcessEnvironment, commandValueMapping?: IStringDictionary<IResolvedValue>): Promise<IResolvedValue | string | undefined> {


		const environment: Environment = {
			env: (processEnvironment !== undefined) ? this.prepareEnv(processEnvironment) : await this._envVariablesPromise,
			userHome: (processEnvironment !== undefined) ? undefined : await this._userHomePromise
		};

		const { name: variable, arg: argument } = replacement;

		// common error handling for all variables that require an open editor
		const getFilePath = (variableKind: VariableKind): string => {
			const filePath = this._context.getFilePath();
			if (filePath) {
				return normalizeDriveLetter(filePath);
			}
			throw new VariableError(variableKind, (localize('canNotResolveFile', "Variable {0} can not be resolved. Please open an editor.", replacement.id)));
		};

		// common error handling for all variables that require an open editor
		const getFolderPathForFile = (variableKind: VariableKind): string => {
			const filePath = getFilePath(variableKind);		// throws error if no editor open
			if (this._context.getWorkspaceFolderPathForFile) {
				const folderPath = this._context.getWorkspaceFolderPathForFile();
				if (folderPath) {
					return normalizeDriveLetter(folderPath);
				}
			}
			throw new VariableError(variableKind, localize('canNotResolveFolderForFile', "Variable {0}: can not find workspace folder of '{1}'.", replacement.id, paths.basename(filePath)));
		};

		// common error handling for all variables that require an open folder and accept a folder name argument
		const getFolderUri = (variableKind: VariableKind): uri => {
			if (argument) {
				const folder = this._context.getFolderUri(argument);
				if (folder) {
					return folder;
				}
				throw new VariableError(variableKind, localize('canNotFindFolder', "Variable {0} can not be resolved. No such folder '{1}'.", variableKind, argument));
			}

			if (folderUri) {
				return folderUri;
			}

			if (this._context.getWorkspaceFolderCount() > 1) {
				throw new VariableError(variableKind, localize('canNotResolveWorkspaceFolderMultiRoot', "Variable {0} can not be resolved in a multi folder workspace. Scope this variable using ':' and a workspace folder name.", variableKind));
			}
			throw new VariableError(variableKind, localize('canNotResolveWorkspaceFolder', "Variable {0} can not be resolved. Please open a folder.", variableKind));
		};

		switch (variable) {
			case 'env':
				if (argument) {
					if (environment.env) {
						const env = environment.env[isWindows ? argument.toLowerCase() : argument];
						if (types.isString(env)) {
							return env;
						}
					}
					return '';
				}
				throw new VariableError(VariableKind.Env, localize('missingEnvVarName', "Variable {0} can not be resolved because no environment variable name is given.", replacement.id));

			case 'config':
				if (argument) {
					const config = this._context.getConfigurationValue(folderUri, argument);
					if (types.isUndefinedOrNull(config)) {
						throw new VariableError(VariableKind.Config, localize('configNotFound', "Variable {0} can not be resolved because setting '{1}' not found.", replacement.id, argument));
					}
					if (types.isObject(config)) {
						throw new VariableError(VariableKind.Config, localize('configNoString', "Variable {0} can not be resolved because '{1}' is a structured value.", replacement.id, argument));
					}
					return config;
				}
				throw new VariableError(VariableKind.Config, localize('missingConfigName', "Variable {0} can not be resolved because no settings name is given.", replacement.id));

			case 'command':
				return this.resolveFromMap(VariableKind.Command, replacement.id, argument, commandValueMapping, 'command');

			case 'input':
				return this.resolveFromMap(VariableKind.Input, replacement.id, argument, commandValueMapping, 'input');

			case 'extensionInstallFolder':
				if (argument) {
					const ext = await this._context.getExtension(argument);
					if (!ext) {
						throw new VariableError(VariableKind.ExtensionInstallFolder, localize('extensionNotInstalled', "Variable {0} can not be resolved because the extension {1} is not installed.", replacement.id, argument));
					}
					return this.fsPath(ext.extensionLocation);
				}
				throw new VariableError(VariableKind.ExtensionInstallFolder, localize('missingExtensionName', "Variable {0} can not be resolved because no extension name is given.", replacement.id));

			default: {
				switch (variable) {
					case 'workspaceRoot':
					case 'workspaceFolder': {
						const uri = getFolderUri(VariableKind.WorkspaceFolder);
						return uri ? normalizeDriveLetter(this.fsPath(uri)) : undefined;
					}

					case 'cwd': {
						if (!folderUri && !argument) {
							return process.cwd();
						}
						const uri = getFolderUri(VariableKind.Cwd);
						return uri ? normalizeDriveLetter(this.fsPath(uri)) : undefined;
					}

					case 'workspaceRootFolderName':
					case 'workspaceFolderBasename': {
						const uri = getFolderUri(VariableKind.WorkspaceFolderBasename);
						return uri ? normalizeDriveLetter(paths.basename(this.fsPath(uri))) : undefined;
					}

					case 'userHome':
						if (environment.userHome) {
							return environment.userHome;
						}
						throw new VariableError(VariableKind.UserHome, localize('canNotResolveUserHome', "Variable {0} can not be resolved. UserHome path is not defined", replacement.id));

					case 'lineNumber': {
						const lineNumber = this._context.getLineNumber();
						if (lineNumber) {
							return lineNumber;
						}
						throw new VariableError(VariableKind.LineNumber, localize('canNotResolveLineNumber', "Variable {0} can not be resolved. Make sure to have a line selected in the active editor.", replacement.id));
					}

					case 'columnNumber': {
						const columnNumber = this._context.getColumnNumber();
						if (columnNumber) {
							return columnNumber;
						}
						throw new Error(localize('canNotResolveColumnNumber', "Variable {0} can not be resolved. Make sure to have a column selected in the active editor.", replacement.id));
					}

					case 'selectedText': {
						const selectedText = this._context.getSelectedText();
						if (selectedText) {
							return selectedText;
						}
						throw new VariableError(VariableKind.SelectedText, localize('canNotResolveSelectedText', "Variable {0} can not be resolved. Make sure to have some text selected in the active editor.", replacement.id));
					}

					case 'file':
						return getFilePath(VariableKind.File);

					case 'fileWorkspaceFolder':
						return getFolderPathForFile(VariableKind.FileWorkspaceFolder);

					case 'fileWorkspaceFolderBasename':
						return paths.basename(getFolderPathForFile(VariableKind.FileWorkspaceFolderBasename));

					case 'relativeFile':
						if (folderUri || argument) {
							return paths.relative(this.fsPath(getFolderUri(VariableKind.RelativeFile)), getFilePath(VariableKind.RelativeFile));
						}
						return getFilePath(VariableKind.RelativeFile);

					case 'relativeFileDirname': {
						const dirname = paths.dirname(getFilePath(VariableKind.RelativeFileDirname));
						if (folderUri || argument) {
							const relative = paths.relative(this.fsPath(getFolderUri(VariableKind.RelativeFileDirname)), dirname);
							return relative.length === 0 ? '.' : relative;
						}
						return dirname;
					}

					case 'fileDirname':
						return paths.dirname(getFilePath(VariableKind.FileDirname));

					case 'fileExtname':
						return paths.extname(getFilePath(VariableKind.FileExtname));

					case 'fileBasename':
						return paths.basename(getFilePath(VariableKind.FileBasename));

					case 'fileBasenameNoExtension': {
						const basename = paths.basename(getFilePath(VariableKind.FileBasenameNoExtension));
						return (basename.slice(0, basename.length - paths.extname(basename).length));
					}

					case 'fileDirnameBasename':
						return paths.basename(paths.dirname(getFilePath(VariableKind.FileDirnameBasename)));

					case 'execPath': {
						const ep = this._context.getExecPath();
						if (ep) {
							return ep;
						}
						return replacement.id;
					}

					case 'execInstallFolder': {
						const ar = this._context.getAppRoot();
						if (ar) {
							return ar;
						}
						return replacement.id;
					}

					case 'pathSeparator':
					case '/':
						return paths.sep;

					default: {
						try {
							return this.resolveFromMap(VariableKind.Unknown, replacement.id, argument, commandValueMapping, undefined);
						} catch {
							return replacement.id;
						}
					}
				}
			}
		}
	}

	private resolveFromMap(variableKind: VariableKind, match: string, argument: string | undefined, commandValueMapping: IStringDictionary<IResolvedValue> | undefined, prefix: string | undefined): string {
		if (argument && commandValueMapping) {
			const v = (prefix === undefined) ? commandValueMapping[argument] : commandValueMapping[prefix + ':' + argument];
			if (typeof v === 'string') {
				return v;
			}
			throw new VariableError(variableKind, localize('noValueForCommand', "Variable {0} can not be resolved because the command has no value.", match));
		}
		return match;
	}
}
