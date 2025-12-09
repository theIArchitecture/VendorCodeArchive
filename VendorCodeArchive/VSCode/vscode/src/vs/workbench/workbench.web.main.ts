//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// ####################################
// ###                              ###
// ### !!! PLEASE DO NOT MODIFY !!! ###
// ###                              ###
// ####################################

// TODO@esm remove me once we stop supporting our web-esm-bridge

(function () {

	// #region Types
	type IGlobalDefine = {
		(moduleName: string, dependencies: string[], callback: (...args: any[]) => any): any;
		(moduleName: string, dependencies: string[], definition: any): any;
		(moduleName: string, callback: (...args: any[]) => any): any;
		(moduleName: string, definition: any): any;
		(dependencies: string[], callback: (...args: any[]) => any): any;
		(dependencies: string[], definition: any): any;
	};

	interface ILoaderPlugin {
		load: (pluginParam: string, parentRequire: IRelativeRequire, loadCallback: IPluginLoadCallback, options: IConfigurationOptions) => void;
		write?: (pluginName: string, moduleName: string, write: IPluginWriteCallback) => void;
		writeFile?: (pluginName: string, moduleName: string, req: IRelativeRequire, write: IPluginWriteFileCallback, config: IConfigurationOptions) => void;
		finishBuild?: (write: (filename: string, contents: string) => void) => void;
	}
	interface IRelativeRequire {
		(dependencies: string[], callback: Function, errorback?: (error: Error) => void): void;
		toUrl(id: string): string;
	}
	interface IPluginLoadCallback {
		(value: any): void;
		error(err: any): void;
	}
	interface IConfigurationOptions {
		isBuild: boolean | undefined;
		[key: string]: any;
	}
	interface IPluginWriteCallback {
		(contents: string): void;
		getEntryPoint(): string;
		asModule(moduleId: string, contents: string): void;
	}
	interface IPluginWriteFileCallback {
		(filename: string, contents: string): void;
		getEntryPoint(): string;
		asModule(moduleId: string, contents: string): void;
	}

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 59: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 62: Error message without production error code - breaks React bundle size optimization
//   4. Line 62: Error message without production error code - breaks React bundle size optimization
//   5. Line 67: Error message without production error code - breaks React bundle size optimization
//   6. Line 67: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	//#endregion

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 78: Error message without production error code - breaks React bundle size optimization
//   4. Line 78: Error message without production error code - breaks React bundle size optimization
//   5. Line 83: Error message without production error code - breaks React bundle size optimization
//   6. Line 83: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 92: Error message without production error code - breaks React bundle size optimization
//   4. Line 92: Error message without production error code - breaks React bundle size optimization
//   5. Line 97: Error message without production error code - breaks React bundle size optimization
//   6. Line 97: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Error message without production error code - breaks React bundle size optimization
//   4. Line 106: Error message without production error code - breaks React bundle size optimization
//   5. Line 111: Error message without production error code - breaks React bundle size optimization
//   6. Line 111: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 117: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 120: Error message without production error code - breaks React bundle size optimization
//   4. Line 120: Error message without production error code - breaks React bundle size optimization
//   5. Line 125: Error message without production error code - breaks React bundle size optimization
//   6. Line 125: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 134: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
//   5. Line 139: Error message without production error code - breaks React bundle size optimization
//   6. Line 139: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 148: Error message without production error code - breaks React bundle size optimization
//   4. Line 148: Error message without production error code - breaks React bundle size optimization
//   5. Line 153: Error message without production error code - breaks React bundle size optimization
//   6. Line 153: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 162: Error message without production error code - breaks React bundle size optimization
//   4. Line 162: Error message without production error code - breaks React bundle size optimization
//   5. Line 167: Error message without production error code - breaks React bundle size optimization
//   6. Line 167: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 176: Error message without production error code - breaks React bundle size optimization
//   4. Line 176: Error message without production error code - breaks React bundle size optimization
//   5. Line 181: Error message without production error code - breaks React bundle size optimization
//   6. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Error message without production error code - breaks React bundle size optimization
//   4. Line 190: Error message without production error code - breaks React bundle size optimization
//   5. Line 195: Error message without production error code - breaks React bundle size optimization
//   6. Line 195: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 204: Error message without production error code - breaks React bundle size optimization
//   4. Line 204: Error message without production error code - breaks React bundle size optimization
//   5. Line 209: Error message without production error code - breaks React bundle size optimization
//   6. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 218: Error message without production error code - breaks React bundle size optimization
//   4. Line 218: Error message without production error code - breaks React bundle size optimization
//   5. Line 223: Error message without production error code - breaks React bundle size optimization
//   6. Line 223: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 232: Error message without production error code - breaks React bundle size optimization
//   4. Line 232: Error message without production error code - breaks React bundle size optimization
//   5. Line 237: Error message without production error code - breaks React bundle size optimization
//   6. Line 237: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Error message without production error code - breaks React bundle size optimization
//   4. Line 246: Error message without production error code - breaks React bundle size optimization
//   5. Line 251: Error message without production error code - breaks React bundle size optimization
//   6. Line 251: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 260: Error message without production error code - breaks React bundle size optimization
//   4. Line 260: Error message without production error code - breaks React bundle size optimization
//   5. Line 265: Error message without production error code - breaks React bundle size optimization
//   6. Line 265: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 274: Error message without production error code - breaks React bundle size optimization
//   4. Line 274: Error message without production error code - breaks React bundle size optimization
//   5. Line 279: Error message without production error code - breaks React bundle size optimization
//   6. Line 279: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Error message without production error code - breaks React bundle size optimization
//   4. Line 288: Error message without production error code - breaks React bundle size optimization
//   5. Line 293: Error message without production error code - breaks React bundle size optimization
//   6. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 302: Error message without production error code - breaks React bundle size optimization
//   4. Line 302: Error message without production error code - breaks React bundle size optimization
//   5. Line 307: Error message without production error code - breaks React bundle size optimization
//   6. Line 307: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 316: Error message without production error code - breaks React bundle size optimization
//   4. Line 316: Error message without production error code - breaks React bundle size optimization
//   5. Line 321: Error message without production error code - breaks React bundle size optimization
//   6. Line 321: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 330: Error message without production error code - breaks React bundle size optimization
//   4. Line 330: Error message without production error code - breaks React bundle size optimization
//   5. Line 335: Error message without production error code - breaks React bundle size optimization
//   6. Line 335: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 344: Error message without production error code - breaks React bundle size optimization
//   4. Line 344: Error message without production error code - breaks React bundle size optimization
//   5. Line 349: Error message without production error code - breaks React bundle size optimization
//   6. Line 349: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const define: IGlobalDefine = (globalThis as any).define;
	const require: { getConfig?(): any } | undefined = (globalThis as any).require;

	if (!define || !require || typeof require.getConfig !== 'function') {
		throw new Error('Expected global define() and require() functions. Please only load this module in an AMD context!');
	}

	let baseUrl = require?.getConfig().baseUrl;
	if (!baseUrl) {
		throw new Error('Failed to determine baseUrl for loading AMD modules (tried require.getConfig().baseUrl)');
	}
	if (!baseUrl.endsWith('/')) {
		baseUrl = baseUrl + '/';
	}
	globalThis._VSCODE_FILE_ROOT = baseUrl;

	const trustedTypesPolicy: Pick<TrustedTypePolicy<{ createScriptURL(value: string): string }>, 'name' | 'createScriptURL'> | undefined = require.getConfig().trustedTypesPolicy;
	if (trustedTypesPolicy) {
		globalThis._VSCODE_WEB_PACKAGE_TTP = trustedTypesPolicy;
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	const promise = new Promise(resolve => {
		(globalThis as any).__VSCODE_WEB_ESM_PROMISE = resolve;
	});

	define('vs/web-api', [], (): ILoaderPlugin => {
		return {
			load: (_name, _req, _load, _config) => {
				const script: any = document.createElement('script');
				script.type = 'module';
				script.src = trustedTypesPolicy ? trustedTypesPolicy.createScriptURL(`${baseUrl}vs/workbench/workbench.web.main.internal.js`) as any as string : `${baseUrl}vs/workbench/workbench.web.main.internal.js`;
				document.head.appendChild(script);

				return promise.then(mod => _load(mod));
			}
		};
	});

	define(
		'vs/workbench/workbench.web.main',
		['require', 'exports', 'vs/web-api!'],
		function (_require, exports, webApi) {
			Object.assign(exports, webApi);
		}
	);
})();
