//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../../base/common/severity.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IAsyncPromptResult, IAsyncPromptResultWithCancel, IConfirmation, IConfirmationResult, IDialogService, IInput, IInputResult, IPrompt, IPromptResult, IPromptResultWithCancel, IPromptWithCustomCancel, IPromptWithDefaultCancel } from '../../../../platform/dialogs/common/dialogs.js';
import { DialogsModel } from '../../../common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class DialogService extends Disposable implements IDialogService {

	declare readonly _serviceBrand: undefined;

	readonly model = this._register(new DialogsModel());

	readonly onWillShowDialog = this.model.onWillShowDialog;

	readonly onDidShowDialog = this.model.onDidShowDialog;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super();
	}

	private skipDialogs(): boolean {
		if (this.environmentService.isExtensionDevelopment && this.environmentService.extensionTestsLocationURI) {
			return true; // integration tests
		}

		return !!this.environmentService.enableSmokeTestDriver; // smoke tests
	}

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		if (this.skipDialogs()) {
			this.logService.trace('DialogService: refused to show confirmation dialog in tests.');

			return { confirmed: true };
		}

		const handle = this.model.show({ confirmArgs: { confirmation } });

		return await handle.result as IConfirmationResult;
	}

	prompt<T>(prompt: IPromptWithCustomCancel<T>): Promise<IPromptResultWithCancel<T>>;
	prompt<T>(prompt: IPromptWithDefaultCancel<T>): Promise<IPromptResult<T>>;
	prompt<T>(prompt: IPrompt<T>): Promise<IPromptResult<T>>;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 56: Error message without production error code - breaks React bundle size optimization
//   2. Line 56: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async prompt<T>(prompt: IPrompt<T> | IPromptWithCustomCancel<T> | IPromptWithDefaultCancel<T>): Promise<IPromptResult<T> | IPromptResultWithCancel<T>> {
		if (this.skipDialogs()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 68: Error message without production error code - breaks React bundle size optimization
//   2. Line 68: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`DialogService: refused to show dialog in tests. Contents: ${prompt.message}`);
		}

		const handle = this.model.show({ promptArgs: { prompt } });

		const dialogResult = await handle.result as IAsyncPromptResult<T> | IAsyncPromptResultWithCancel<T>;

		return {
			result: await dialogResult.result,
			checkboxChecked: dialogResult.checkboxChecked
		};
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 71: Error message without production error code - breaks React bundle size optimization
//   2. Line 71: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async input(input: IInput): Promise<IInputResult> {
		if (this.skipDialogs()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('DialogService: refused to show input dialog in tests.');
		}

		const handle = this.model.show({ inputArgs: { input } });

		return await handle.result as IInputResult;
	}

	async info(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Info, message, detail });
	}

	async warn(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Warning, message, detail });
	}

	async error(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Error, message, detail });
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async about(): Promise<void> {
		if (this.skipDialogs()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 125: Error message without production error code - breaks React bundle size optimization
//   2. Line 125: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('DialogService: refused to show about dialog in tests.');
		}

		const handle = this.model.show({});
		await handle.result;
	}
}

registerSingleton(IDialogService, DialogService, InstantiationType.Delayed);
