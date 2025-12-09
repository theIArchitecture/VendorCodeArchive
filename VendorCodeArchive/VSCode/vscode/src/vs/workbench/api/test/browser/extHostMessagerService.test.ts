//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadMessageService } from '../../browser/mainThreadMessageService.js';
import { IDialogService, IPrompt, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { INotificationService, INotification, NoOpNotification, INotificationHandle, Severity, IPromptChoice, IPromptOptions, IStatusMessageOptions, INotificationSource, INotificationSourceFilter, NotificationsFilter, IStatusHandle } from '../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { mock } from '../../../../base/test/common/mock.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestExtensionService } from '../../../test/common/workbenchTestServices.js';

const emptyCommandService: ICommandService = {
	_serviceBrand: undefined,
	onWillExecuteCommand: () => Disposable.None,
	onDidExecuteCommand: () => Disposable.None,
	executeCommand: (commandId: string, ...args: any[]): Promise<any> => {
		return Promise.resolve(undefined);
	}
};

const emptyNotificationService = new class implements INotificationService {
	declare readonly _serviceBrand: undefined;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
//   3. Line 34: Error message without production error code - breaks React bundle size optimization
//   4. Line 34: Error message without production error code - breaks React bundle size optimization
//   5. Line 37: Error message without production error code - breaks React bundle size optimization
//   6. Line 37: Error message without production error code - breaks React bundle size optimization
//   7. Line 40: Error message without production error code - breaks React bundle size optimization
//   8. Line 40: Error message without production error code - breaks React bundle size optimization
//   9. Line 43: Error message without production error code - breaks React bundle size optimization
//   10. Line 43: Error message without production error code - breaks React bundle size optimization
//   11. Line 49: Error message without production error code - breaks React bundle size optimization
//   12. Line 49: Error message without production error code - breaks React bundle size optimization
//   13. Line 52: Error message without production error code - breaks React bundle size optimization
//   14. Line 52: Error message without production error code - breaks React bundle size optimization
//   15. Line 55: Error message without production error code - breaks React bundle size optimization
//   16. Line 55: Error message without production error code - breaks React bundle size optimization
//   17. Line 58: Error message without production error code - breaks React bundle size optimization
//   18. Line 58: Error message without production error code - breaks React bundle size optimization
//   19. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	onDidChangeFilter: Event<void> = Event.None;
	notify(...args: any[]): never {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 60: Error message without production error code - breaks React bundle size optimization
//   2. Line 60: Error message without production error code - breaks React bundle size optimization
//   3. Line 63: Error message without production error code - breaks React bundle size optimization
//   4. Line 63: Error message without production error code - breaks React bundle size optimization
//   5. Line 66: Error message without production error code - breaks React bundle size optimization
//   6. Line 66: Error message without production error code - breaks React bundle size optimization
//   7. Line 69: Error message without production error code - breaks React bundle size optimization
//   8. Line 69: Error message without production error code - breaks React bundle size optimization
//   9. Line 72: Error message without production error code - breaks React bundle size optimization
//   10. Line 72: Error message without production error code - breaks React bundle size optimization
//   11. Line 78: Error message without production error code - breaks React bundle size optimization
//   12. Line 78: Error message without production error code - breaks React bundle size optimization
//   13. Line 81: Error message without production error code - breaks React bundle size optimization
//   14. Line 81: Error message without production error code - breaks React bundle size optimization
//   15. Line 84: Error message without production error code - breaks React bundle size optimization
//   16. Line 84: Error message without production error code - breaks React bundle size optimization
//   17. Line 87: Error message without production error code - breaks React bundle size optimization
//   18. Line 87: Error message without production error code - breaks React bundle size optimization
//   19. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 87: Error message without production error code - breaks React bundle size optimization
//   2. Line 87: Error message without production error code - breaks React bundle size optimization
//   3. Line 90: Error message without production error code - breaks React bundle size optimization
//   4. Line 90: Error message without production error code - breaks React bundle size optimization
//   5. Line 93: Error message without production error code - breaks React bundle size optimization
//   6. Line 93: Error message without production error code - breaks React bundle size optimization
//   7. Line 96: Error message without production error code - breaks React bundle size optimization
//   8. Line 96: Error message without production error code - breaks React bundle size optimization
//   9. Line 99: Error message without production error code - breaks React bundle size optimization
//   10. Line 99: Error message without production error code - breaks React bundle size optimization
//   11. Line 105: Error message without production error code - breaks React bundle size optimization
//   12. Line 105: Error message without production error code - breaks React bundle size optimization
//   13. Line 108: Error message without production error code - breaks React bundle size optimization
//   14. Line 108: Error message without production error code - breaks React bundle size optimization
//   15. Line 111: Error message without production error code - breaks React bundle size optimization
//   16. Line 111: Error message without production error code - breaks React bundle size optimization
//   17. Line 114: Error message without production error code - breaks React bundle size optimization
//   18. Line 114: Error message without production error code - breaks React bundle size optimization
//   19. Line 118: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('not implemented');
	}
	info(...args: any[]): never {
		throw new Error('not implemented');
	}
	warn(...args: any[]): never {
		throw new Error('not implemented');
	}
	error(...args: any[]): never {
		throw new Error('not implemented');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('not implemented');
	}
	status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('not implemented');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('not implemented');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('not implemented');
	}
	removeFilter(sourceId: string): void {
		throw new Error('not implemented');
	}
};

class EmptyNotificationService implements INotificationService {
	declare readonly _serviceBrand: undefined;
	filter: boolean = false;
	constructor(private withNotify: (notification: INotification) => void) {
	}

	onDidChangeFilter: Event<void> = Event.None;
	notify(notification: INotification): INotificationHandle {
		this.withNotify(notification);

		return new NoOpNotification();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 75: Error message without production error code - breaks React bundle size optimization
//   2. Line 75: Error message without production error code - breaks React bundle size optimization
//   3. Line 78: Error message without production error code - breaks React bundle size optimization
//   4. Line 78: Error message without production error code - breaks React bundle size optimization
//   5. Line 81: Error message without production error code - breaks React bundle size optimization
//   6. Line 81: Error message without production error code - breaks React bundle size optimization
//   7. Line 84: Error message without production error code - breaks React bundle size optimization
//   8. Line 84: Error message without production error code - breaks React bundle size optimization
//   9. Line 90: Error message without production error code - breaks React bundle size optimization
//   10. Line 90: Error message without production error code - breaks React bundle size optimization
//   11. Line 93: Error message without production error code - breaks React bundle size optimization
//   12. Line 93: Error message without production error code - breaks React bundle size optimization
//   13. Line 96: Error message without production error code - breaks React bundle size optimization
//   14. Line 96: Error message without production error code - breaks React bundle size optimization
//   15. Line 99: Error message without production error code - breaks React bundle size optimization
//   16. Line 99: Error message without production error code - breaks React bundle size optimization
//   17. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}
	info(message: any): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 131: Error message without production error code - breaks React bundle size optimization
//   2. Line 131: Error message without production error code - breaks React bundle size optimization
//   3. Line 134: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
//   5. Line 137: Error message without production error code - breaks React bundle size optimization
//   6. Line 137: Error message without production error code - breaks React bundle size optimization
//   7. Line 140: Error message without production error code - breaks React bundle size optimization
//   8. Line 140: Error message without production error code - breaks React bundle size optimization
//   9. Line 146: Error message without production error code - breaks React bundle size optimization
//   10. Line 146: Error message without production error code - breaks React bundle size optimization
//   11. Line 149: Error message without production error code - breaks React bundle size optimization
//   12. Line 149: Error message without production error code - breaks React bundle size optimization
//   13. Line 152: Error message without production error code - breaks React bundle size optimization
//   14. Line 152: Error message without production error code - breaks React bundle size optimization
//   15. Line 155: Error message without production error code - breaks React bundle size optimization
//   16. Line 155: Error message without production error code - breaks React bundle size optimization
//   17. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 185: Error message without production error code - breaks React bundle size optimization
//   2. Line 185: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
//   7. Line 194: Error message without production error code - breaks React bundle size optimization
//   8. Line 194: Error message without production error code - breaks React bundle size optimization
//   9. Line 200: Error message without production error code - breaks React bundle size optimization
//   10. Line 200: Error message without production error code - breaks React bundle size optimization
//   11. Line 203: Error message without production error code - breaks React bundle size optimization
//   12. Line 203: Error message without production error code - breaks React bundle size optimization
//   13. Line 206: Error message without production error code - breaks React bundle size optimization
//   14. Line 206: Error message without production error code - breaks React bundle size optimization
//   15. Line 209: Error message without production error code - breaks React bundle size optimization
//   16. Line 209: Error message without production error code - breaks React bundle size optimization
//   17. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
	warn(message: any): void {
		throw new Error('Method not implemented.');
	}
	error(message: any): void {
		throw new Error('Method not implemented.');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('Method not implemented');
	}
	status(message: string, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('Method not implemented.');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('Method not implemented.');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('Method not implemented.');
	}
	removeFilter(sourceId: string): void {
		throw new Error('Method not implemented.');
	}
}

suite('ExtHostMessageService', function () {

	test('propagte handle on select', async function () {

		const service = new MainThreadMessageService(null!, new EmptyNotificationService(notification => {
			assert.strictEqual(notification.actions!.primary!.length, 1);
			queueMicrotask(() => notification.actions!.primary![0].run());
		}), emptyCommandService, new TestDialogService(), new TestExtensionService());

		const handle = await service.$showMessage(1, 'h', {}, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
		assert.strictEqual(handle, 42);

		service.dispose();
	});

	suite('modal', () => {
		test('calls dialog service', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(type, 1);
					assert.strictEqual(message, 'h');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(buttons!.length, 1);
					assert.strictEqual((cancelButton as IPromptButton<unknown>)!.label, 'Cancel');
					return Promise.resolve({ result: buttons![0].run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});

		test('returns undefined when cancelled', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt(prompt: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					return Promise.resolve({ result: (prompt.cancelButton as IPromptButton<unknown>)!.run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, undefined);

			service.dispose();
		});

		test('hides Cancel button when not needed', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(buttons!.length, 0);
					assert.ok(cancelButton);
					return Promise.resolve({ result: (cancelButton as IPromptButton<unknown>).run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
