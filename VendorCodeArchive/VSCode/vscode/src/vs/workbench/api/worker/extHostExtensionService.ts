//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createApiFactoryAndRegisterActors } from '../common/extHost.api.impl.js';
import { ExtensionActivationTimesBuilder } from '../common/extHostExtensionActivator.js';
import { AbstractExtHostExtensionService } from '../common/extHostExtensionService.js';
import { URI } from '../../../base/common/uri.js';
import { RequireInterceptor } from '../common/extHostRequireInterceptor.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtensionRuntime } from '../common/extHostTypes.js';
import { timeout } from '../../../base/common/async.js';
import { ExtHostConsoleForwarder } from './extHostConsoleForwarder.js';
import { extname } from '../../../base/common/path.js';

class WorkerRequireInterceptor extends RequireInterceptor {

	protected _installInterceptor() { }

	getModule(request: string, parent: URI): undefined | any {
		for (const alternativeModuleName of this._alternatives) {
			const alternative = alternativeModuleName(request);
			if (alternative) {
				request = alternative;
				break;
			}
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (this._factories.has(request)) {
			return this._factories.get(request)!.load(request, parent, () => { throw new Error('CANNOT LOAD MODULE from here.'); });
		}
		return undefined;
	}
}

export class ExtHostExtensionService extends AbstractExtHostExtensionService {
	readonly extensionRuntime = ExtensionRuntime.Webworker;

	private _fakeModules?: WorkerRequireInterceptor;

	protected async _beforeAlmostReadyToRunExtensions(): Promise<void> {
		// make sure console.log calls make it to the render
		this._instaService.createInstance(ExtHostConsoleForwarder);

		// initialize API and register actors
		const apiFactory = this._instaService.invokeFunction(createApiFactoryAndRegisterActors);
		this._fakeModules = this._instaService.createInstance(WorkerRequireInterceptor, apiFactory, { mine: this._myRegistry, all: this._globalRegistry });
		await this._fakeModules.install();
		performance.mark('code/extHost/didInitAPI');

		await this._waitForDebuggerAttachment();
	}

	protected _getEntryPoint(extensionDescription: IExtensionDescription): string | undefined {
		return extensionDescription.browser;
	}

	protected async _loadCommonJSModule<T extends object | undefined>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		module = module.with({ path: ensureSuffix(module.path, '.js') });
		const extensionId = extension?.identifier.value;
		if (extensionId) {
			performance.mark(`code/extHost/willFetchExtensionCode/${extensionId}`);
		}

		// First resolve the extension entry point URI to something we can load using `fetch`
		// This needs to be done on the main thread due to a potential `resourceUriProvider` (workbench api)
		// which is only available in the main thread
		const browserUri = URI.revive(await this._mainThreadExtensionsProxy.$asBrowserUri(module));
		const response = await fetch(browserUri.toString(true));
		if (extensionId) {
			performance.mark(`code/extHost/didFetchExtensionCode/${extensionId}`);
		}

		if (response.status !== 200) {
			throw new Error(response.statusText);
		}

		// fetch JS sources as text and create a new function around it
		const source = await response.text();
		// Here we append #vscode-extension to serve as a marker, such that source maps
		// can be adjusted for the extra wrapping function.
		const sourceURL = `${module.toString(true)}#vscode-extension`;
		const fullSource = `${source}\n//# sourceURL=${sourceURL}`;
		let initFn: Function;
		try {
			initFn = new Function('module', 'exports', 'require', fullSource); // CodeQL [SM01632] js/eval-call there is no alternative until we move to ESM
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 90: Error message without production error code - breaks React bundle size optimization
//   2. Line 90: Error message without production error code - breaks React bundle size optimization
//   3. Line 92: Error message without production error code - breaks React bundle size optimization
//   4. Line 92: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		} catch (err) {
			if (extensionId) {
				console.error(`Loading code for extension ${extensionId} failed: ${err.message}`);
			} else {
				console.error(`Loading code failed: ${err.message}`);
			}
			console.error(`${module.toString(true)}${typeof err.line === 'number' ? ` line ${err.line}` : ''}${typeof err.column === 'number' ? ` column ${err.column}` : ''}`);
			console.error(err);
			throw err;
		}

		if (extension) {
			await this._extHostLocalizationService.initializeLocalizedMessages(extension);
		}

		// define commonjs globals: `module`, `exports`, and `require`
		const _exports = {};
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const _module = { exports: _exports };
		const _require = (request: string) => {
			const result = this._fakeModules!.getModule(request, module);
			if (result === undefined) {
				throw new Error(`Cannot load module '${request}'`);
			}
			return result;
		};

		try {
			activationTimesBuilder.codeLoadingStart();
			if (extensionId) {
				performance.mark(`code/extHost/willLoadExtensionCode/${extensionId}`);
			}
			initFn(_module, _exports, _require);
			return <T>(_module.exports !== _exports ? _module.exports : _exports);
		} finally {
			if (extensionId) {
				performance.mark(`code/extHost/didLoadExtensionCode/${extensionId}`);
			}
			activationTimesBuilder.codeLoadingStop();
		}
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 130: Error message without production error code - breaks React bundle size optimization
//   2. Line 130: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	protected override _loadESMModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		throw new Error('ESM modules are not supported in the web worker extension host');
	}

	async $setRemoteEnvironment(_env: { [key: string]: string | null }): Promise<void> {
		return;
	}

	private async _waitForDebuggerAttachment(waitTimeout = 5000) {
		// debugger attaches async, waiting for it fixes #106698 and #99222
		if (!this._initData.environment.isExtensionDevelopmentDebug) {
			return;
		}

		const deadline = Date.now() + waitTimeout;
		while (Date.now() < deadline && !('__jsDebugIsReady' in globalThis)) {
			await timeout(10);
		}
	}
}

function ensureSuffix(path: string, suffix: string): string {
	const extName = extname(path);
	return extName ? path : path + suffix;
}
