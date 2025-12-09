//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { createSimpleKeybinding, ResolvedKeybinding, KeyCodeChord, Keybinding } from '../../../../base/common/keybindings.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { OS } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ICommandService } from '../../../commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression, IContext, IContextKeyService, IContextKeyServiceTarget } from '../../../contextkey/common/contextkey.js';
import { AbstractKeybindingService } from '../../common/abstractKeybindingService.js';
import { IKeyboardEvent } from '../../common/keybinding.js';
import { KeybindingResolver } from '../../common/keybindingResolver.js';
import { ResolvedKeybindingItem } from '../../common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../common/usLayoutResolvedKeybinding.js';
import { createUSLayoutResolvedKeybinding } from './keybindingsTestUtils.js';
import { NullLogService } from '../../../log/common/log.js';
import { INotification, INotificationService, IPromptChoice, IPromptOptions, IStatusMessageOptions, NoOpNotification } from '../../../notification/common/notification.js';
import { NullTelemetryService } from '../../../telemetry/common/telemetryUtils.js';

function createContext(ctx: any) {
	return {
		getValue: (key: string) => {
			return ctx[key];
		}
	};
}

suite('AbstractKeybindingService', () => {

	class TestKeybindingService extends AbstractKeybindingService {
		private _resolver: KeybindingResolver;

		constructor(
			resolver: KeybindingResolver,
			contextKeyService: IContextKeyService,
			commandService: ICommandService,
			notificationService: INotificationService
		) {
			super(contextKeyService, commandService, NullTelemetryService, notificationService, new NullLogService());
			this._resolver = resolver;
		}

		protected _getResolver(): KeybindingResolver {
			return this._resolver;
		}

		protected _documentHasFocus(): boolean {
			return true;
		}

		public resolveKeybinding(kb: Keybinding): ResolvedKeybinding[] {
			return USLayoutResolvedKeybinding.resolveKeybinding(kb, OS);
		}

		public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
			const chord = new KeyCodeChord(
				keyboardEvent.ctrlKey,
				keyboardEvent.shiftKey,
				keyboardEvent.altKey,
				keyboardEvent.metaKey,
				keyboardEvent.keyCode
			).toKeybinding();
			return this.resolveKeybinding(chord)[0];
		}

		public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
			return [];
		}

		public testDispatch(kb: number): boolean {
			const keybinding = createSimpleKeybinding(kb, OS);
			return this._dispatch({
				_standardKeyboardEventBrand: true,
				ctrlKey: keybinding.ctrlKey,
				shiftKey: keybinding.shiftKey,
				altKey: keybinding.altKey,
				metaKey: keybinding.metaKey,
				altGraphKey: false,
				keyCode: keybinding.keyCode,
				code: null!
			}, null!);
		}

		public _dumpDebugInfo(): string {
			return '';
		}

		public _dumpDebugInfoJSON(): string {
			return '';
		}

		public registerSchemaContribution(): IDisposable {
			return Disposable.None;
		}

		public enableKeybindingHoldMode() {
			return undefined;
		}
	}

	let createTestKeybindingService: (items: ResolvedKeybindingItem[], contextValue?: any) => TestKeybindingService = null!;
	let currentContextValue: IContext | null = null;
	let executeCommandCalls: { commandId: string; args: any[] }[] = null!;
	let showMessageCalls: { sev: Severity; message: any }[] = null!;
	let statusMessageCalls: string[] | null = null;
	let statusMessageCallsDisposed: string[] | null = null;


	teardown(() => {
		currentContextValue = null;
		executeCommandCalls = null!;
		showMessageCalls = null!;
		createTestKeybindingService = null!;
		statusMessageCalls = null;
		statusMessageCallsDisposed = null;
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		createTestKeybindingService = (items: ResolvedKeybindingItem[]): TestKeybindingService => {

			const contextKeyService: IContextKeyService = {
				_serviceBrand: undefined,
				onDidChangeContext: undefined!,
				bufferChangeEvents() { },
				createKey: undefined!,
				contextMatchesRules: undefined!,
				getContextKeyValue: undefined!,
				createScoped: undefined!,
				createOverlay: undefined!,
				getContext: (target: IContextKeyServiceTarget): any => {
					return currentContextValue;
				},
				updateParent: () => { }
			};

			const commandService: ICommandService = {
				_serviceBrand: undefined,
				onWillExecuteCommand: () => Disposable.None,
				onDidExecuteCommand: () => Disposable.None,
				executeCommand: (commandId: string, ...args: any[]): Promise<any> => {
					executeCommandCalls.push({
						commandId: commandId,
						args: args
					});
					return Promise.resolve(undefined);
				}
			};

			const notificationService: INotificationService = {
				_serviceBrand: undefined,
				onDidChangeFilter: undefined!,
				notify: (notification: INotification) => {
					showMessageCalls.push({ sev: notification.severity, message: notification.message });
					return new NoOpNotification();
				},
				info: (message: any) => {
					showMessageCalls.push({ sev: Severity.Info, message });
					return new NoOpNotification();
				},
				warn: (message: any) => {
					showMessageCalls.push({ sev: Severity.Warning, message });
					return new NoOpNotification();
				},
				error: (message: any) => {
					showMessageCalls.push({ sev: Severity.Error, message });
					return new NoOpNotification();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 180: Error message without production error code - breaks React bundle size optimization
//   2. Line 180: Error message without production error code - breaks React bundle size optimization
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
//   7. Line 194: Error message without production error code - breaks React bundle size optimization
//   8. Line 194: Error message without production error code - breaks React bundle size optimization
//   9. Line 197: Error message without production error code - breaks React bundle size optimization
//   10. Line 197: Error message without production error code - breaks React bundle size optimization
//   11. Line 200: Error message without production error code - breaks React bundle size optimization
//   12. Line 200: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				},
				prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 202: Error message without production error code - breaks React bundle size optimization
//   2. Line 202: Error message without production error code - breaks React bundle size optimization
//   3. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 213: Error message without production error code - breaks React bundle size optimization
//   6. Line 213: Error message without production error code - breaks React bundle size optimization
//   7. Line 216: Error message without production error code - breaks React bundle size optimization
//   8. Line 216: Error message without production error code - breaks React bundle size optimization
//   9. Line 219: Error message without production error code - breaks React bundle size optimization
//   10. Line 219: Error message without production error code - breaks React bundle size optimization
//   11. Line 222: Error message without production error code - breaks React bundle size optimization
//   12. Line 222: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 222: Error message without production error code - breaks React bundle size optimization
//   2. Line 222: Error message without production error code - breaks React bundle size optimization
//   3. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 233: Error message without production error code - breaks React bundle size optimization
//   6. Line 233: Error message without production error code - breaks React bundle size optimization
//   7. Line 236: Error message without production error code - breaks React bundle size optimization
//   8. Line 236: Error message without production error code - breaks React bundle size optimization
//   9. Line 239: Error message without production error code - breaks React bundle size optimization
//   10. Line 239: Error message without production error code - breaks React bundle size optimization
//   11. Line 242: Error message without production error code - breaks React bundle size optimization
//   12. Line 242: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 242: Error message without production error code - breaks React bundle size optimization
//   2. Line 242: Error message without production error code - breaks React bundle size optimization
//   3. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 253: Error message without production error code - breaks React bundle size optimization
//   6. Line 253: Error message without production error code - breaks React bundle size optimization
//   7. Line 256: Error message without production error code - breaks React bundle size optimization
//   8. Line 256: Error message without production error code - breaks React bundle size optimization
//   9. Line 259: Error message without production error code - breaks React bundle size optimization
//   10. Line 259: Error message without production error code - breaks React bundle size optimization
//   11. Line 262: Error message without production error code - breaks React bundle size optimization
//   12. Line 262: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 262: Error message without production error code - breaks React bundle size optimization
//   2. Line 262: Error message without production error code - breaks React bundle size optimization
//   3. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 273: Error message without production error code - breaks React bundle size optimization
//   6. Line 273: Error message without production error code - breaks React bundle size optimization
//   7. Line 276: Error message without production error code - breaks React bundle size optimization
//   8. Line 276: Error message without production error code - breaks React bundle size optimization
//   9. Line 279: Error message without production error code - breaks React bundle size optimization
//   10. Line 279: Error message without production error code - breaks React bundle size optimization
//   11. Line 282: Error message without production error code - breaks React bundle size optimization
//   12. Line 282: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 282: Error message without production error code - breaks React bundle size optimization
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
//   3. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 293: Error message without production error code - breaks React bundle size optimization
//   6. Line 293: Error message without production error code - breaks React bundle size optimization
//   7. Line 296: Error message without production error code - breaks React bundle size optimization
//   8. Line 296: Error message without production error code - breaks React bundle size optimization
//   9. Line 299: Error message without production error code - breaks React bundle size optimization
//   10. Line 299: Error message without production error code - breaks React bundle size optimization
//   11. Line 302: Error message without production error code - breaks React bundle size optimization
//   12. Line 302: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 302: Error message without production error code - breaks React bundle size optimization
//   2. Line 302: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 313: Error message without production error code - breaks React bundle size optimization
//   6. Line 313: Error message without production error code - breaks React bundle size optimization
//   7. Line 316: Error message without production error code - breaks React bundle size optimization
//   8. Line 316: Error message without production error code - breaks React bundle size optimization
//   9. Line 319: Error message without production error code - breaks React bundle size optimization
//   10. Line 319: Error message without production error code - breaks React bundle size optimization
//   11. Line 322: Error message without production error code - breaks React bundle size optimization
//   12. Line 322: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 322: Error message without production error code - breaks React bundle size optimization
//   2. Line 322: Error message without production error code - breaks React bundle size optimization
//   3. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 333: Error message without production error code - breaks React bundle size optimization
//   6. Line 333: Error message without production error code - breaks React bundle size optimization
//   7. Line 336: Error message without production error code - breaks React bundle size optimization
//   8. Line 336: Error message without production error code - breaks React bundle size optimization
//   9. Line 339: Error message without production error code - breaks React bundle size optimization
//   10. Line 339: Error message without production error code - breaks React bundle size optimization
//   11. Line 342: Error message without production error code - breaks React bundle size optimization
//   12. Line 342: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 342: Error message without production error code - breaks React bundle size optimization
//   2. Line 342: Error message without production error code - breaks React bundle size optimization
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 353: Error message without production error code - breaks React bundle size optimization
//   6. Line 353: Error message without production error code - breaks React bundle size optimization
//   7. Line 356: Error message without production error code - breaks React bundle size optimization
//   8. Line 356: Error message without production error code - breaks React bundle size optimization
//   9. Line 359: Error message without production error code - breaks React bundle size optimization
//   10. Line 359: Error message without production error code - breaks React bundle size optimization
//   11. Line 362: Error message without production error code - breaks React bundle size optimization
//   12. Line 362: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 362: Error message without production error code - breaks React bundle size optimization
//   2. Line 362: Error message without production error code - breaks React bundle size optimization
//   3. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 373: Error message without production error code - breaks React bundle size optimization
//   6. Line 373: Error message without production error code - breaks React bundle size optimization
//   7. Line 376: Error message without production error code - breaks React bundle size optimization
//   8. Line 376: Error message without production error code - breaks React bundle size optimization
//   9. Line 379: Error message without production error code - breaks React bundle size optimization
//   10. Line 379: Error message without production error code - breaks React bundle size optimization
//   11. Line 382: Error message without production error code - breaks React bundle size optimization
//   12. Line 382: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 382: Error message without production error code - breaks React bundle size optimization
//   2. Line 382: Error message without production error code - breaks React bundle size optimization
//   3. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 393: Error message without production error code - breaks React bundle size optimization
//   6. Line 393: Error message without production error code - breaks React bundle size optimization
//   7. Line 396: Error message without production error code - breaks React bundle size optimization
//   8. Line 396: Error message without production error code - breaks React bundle size optimization
//   9. Line 399: Error message without production error code - breaks React bundle size optimization
//   10. Line 399: Error message without production error code - breaks React bundle size optimization
//   11. Line 402: Error message without production error code - breaks React bundle size optimization
//   12. Line 402: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 402: Error message without production error code - breaks React bundle size optimization
//   2. Line 402: Error message without production error code - breaks React bundle size optimization
//   3. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 413: Error message without production error code - breaks React bundle size optimization
//   6. Line 413: Error message without production error code - breaks React bundle size optimization
//   7. Line 416: Error message without production error code - breaks React bundle size optimization
//   8. Line 416: Error message without production error code - breaks React bundle size optimization
//   9. Line 419: Error message without production error code - breaks React bundle size optimization
//   10. Line 419: Error message without production error code - breaks React bundle size optimization
//   11. Line 422: Error message without production error code - breaks React bundle size optimization
//   12. Line 422: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 422: Error message without production error code - breaks React bundle size optimization
//   2. Line 422: Error message without production error code - breaks React bundle size optimization
//   3. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 433: Error message without production error code - breaks React bundle size optimization
//   6. Line 433: Error message without production error code - breaks React bundle size optimization
//   7. Line 436: Error message without production error code - breaks React bundle size optimization
//   8. Line 436: Error message without production error code - breaks React bundle size optimization
//   9. Line 439: Error message without production error code - breaks React bundle size optimization
//   10. Line 439: Error message without production error code - breaks React bundle size optimization
//   11. Line 442: Error message without production error code - breaks React bundle size optimization
//   12. Line 442: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 442: Error message without production error code - breaks React bundle size optimization
//   2. Line 442: Error message without production error code - breaks React bundle size optimization
//   3. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 453: Error message without production error code - breaks React bundle size optimization
//   6. Line 453: Error message without production error code - breaks React bundle size optimization
//   7. Line 456: Error message without production error code - breaks React bundle size optimization
//   8. Line 456: Error message without production error code - breaks React bundle size optimization
//   9. Line 459: Error message without production error code - breaks React bundle size optimization
//   10. Line 459: Error message without production error code - breaks React bundle size optimization
//   11. Line 462: Error message without production error code - breaks React bundle size optimization
//   12. Line 462: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 462: Error message without production error code - breaks React bundle size optimization
//   2. Line 462: Error message without production error code - breaks React bundle size optimization
//   3. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 473: Error message without production error code - breaks React bundle size optimization
//   6. Line 473: Error message without production error code - breaks React bundle size optimization
//   7. Line 476: Error message without production error code - breaks React bundle size optimization
//   8. Line 476: Error message without production error code - breaks React bundle size optimization
//   9. Line 479: Error message without production error code - breaks React bundle size optimization
//   10. Line 479: Error message without production error code - breaks React bundle size optimization
//   11. Line 482: Error message without production error code - breaks React bundle size optimization
//   12. Line 482: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 482: Error message without production error code - breaks React bundle size optimization
//   2. Line 482: Error message without production error code - breaks React bundle size optimization
//   3. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 493: Error message without production error code - breaks React bundle size optimization
//   6. Line 493: Error message without production error code - breaks React bundle size optimization
//   7. Line 496: Error message without production error code - breaks React bundle size optimization
//   8. Line 496: Error message without production error code - breaks React bundle size optimization
//   9. Line 499: Error message without production error code - breaks React bundle size optimization
//   10. Line 499: Error message without production error code - breaks React bundle size optimization
//   11. Line 502: Error message without production error code - breaks React bundle size optimization
//   12. Line 502: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 502: Error message without production error code - breaks React bundle size optimization
//   2. Line 502: Error message without production error code - breaks React bundle size optimization
//   3. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 508: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 513: Error message without production error code - breaks React bundle size optimization
//   6. Line 513: Error message without production error code - breaks React bundle size optimization
//   7. Line 516: Error message without production error code - breaks React bundle size optimization
//   8. Line 516: Error message without production error code - breaks React bundle size optimization
//   9. Line 519: Error message without production error code - breaks React bundle size optimization
//   10. Line 519: Error message without production error code - breaks React bundle size optimization
//   11. Line 522: Error message without production error code - breaks React bundle size optimization
//   12. Line 522: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 522: Error message without production error code - breaks React bundle size optimization
//   2. Line 522: Error message without production error code - breaks React bundle size optimization
//   3. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 533: Error message without production error code - breaks React bundle size optimization
//   6. Line 533: Error message without production error code - breaks React bundle size optimization
//   7. Line 536: Error message without production error code - breaks React bundle size optimization
//   8. Line 536: Error message without production error code - breaks React bundle size optimization
//   9. Line 539: Error message without production error code - breaks React bundle size optimization
//   10. Line 539: Error message without production error code - breaks React bundle size optimization
//   11. Line 542: Error message without production error code - breaks React bundle size optimization
//   12. Line 542: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 542: Error message without production error code - breaks React bundle size optimization
//   2. Line 542: Error message without production error code - breaks React bundle size optimization
//   3. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 553: Error message without production error code - breaks React bundle size optimization
//   6. Line 553: Error message without production error code - breaks React bundle size optimization
//   7. Line 556: Error message without production error code - breaks React bundle size optimization
//   8. Line 556: Error message without production error code - breaks React bundle size optimization
//   9. Line 559: Error message without production error code - breaks React bundle size optimization
//   10. Line 559: Error message without production error code - breaks React bundle size optimization
//   11. Line 562: Error message without production error code - breaks React bundle size optimization
//   12. Line 562: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 562: Error message without production error code - breaks React bundle size optimization
//   2. Line 562: Error message without production error code - breaks React bundle size optimization
//   3. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 568: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 573: Error message without production error code - breaks React bundle size optimization
//   6. Line 573: Error message without production error code - breaks React bundle size optimization
//   7. Line 576: Error message without production error code - breaks React bundle size optimization
//   8. Line 576: Error message without production error code - breaks React bundle size optimization
//   9. Line 579: Error message without production error code - breaks React bundle size optimization
//   10. Line 579: Error message without production error code - breaks React bundle size optimization
//   11. Line 582: Error message without production error code - breaks React bundle size optimization
//   12. Line 582: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error('not implemented');
				},
				status(message: string, options?: IStatusMessageOptions) {
					statusMessageCalls!.push(message);
					return {
						close: () => {
							statusMessageCallsDisposed!.push(message);
						}
					};
				},
				setFilter() {
					throw new Error('not implemented');
				},
				getFilter() {
					throw new Error('not implemented');
				},
				getFilters() {
					throw new Error('not implemented');
				},
				removeFilter() {
					throw new Error('not implemented');
				}
			};

			const resolver = new KeybindingResolver(items, [], () => { });

			return new TestKeybindingService(resolver, contextKeyService, commandService, notificationService);
		};
	});

	function kbItem(keybinding: number | number[], command: string | null, when?: ContextKeyExpression): ResolvedKeybindingItem {
		return new ResolvedKeybindingItem(
			createUSLayoutResolvedKeybinding(keybinding, OS),
			command,
			null,
			when,
			true,
			null,
			false
		);
	}

	function toUsLabel(keybinding: number): string {
		return createUSLayoutResolvedKeybinding(keybinding, OS)!.getLabel()!;
	}

	suite('simple tests: single- and multi-chord keybindings are dispatched', () => {

		test('a single-chord keybinding is dispatched correctly; this test makes sure the dispatch in general works before we test empty-string/null command ID', () => {

			const key = KeyMod.CtrlCmd | KeyCode.KeyK;
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
			]);

			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(key);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, ([{ commandId: "myCommand", args: [null] }]));
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a multi-chord keybinding is dispatched correctly', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(chord0);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(chord1);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, ([{ commandId: "myCommand", args: [null] }]));
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});
	});

	suite('keybindings with empty-string/null command ID', () => {

		test('a single-chord keybinding with an empty string command ID unbinds the keybinding (shouldPreventDefault = false)', () => {

			const kbService = createTestKeybindingService([
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'myCommand'),
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, ''),
			]);

			// send Ctrl/Cmd + K
			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a single-chord keybinding with a null command ID unbinds the keybinding (shouldPreventDefault = false)', () => {

			const kbService = createTestKeybindingService([
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'myCommand'),
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, null),
			]);

			// send Ctrl/Cmd + K
			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a multi-chord keybinding with an empty-string command ID keeps the keybinding (shouldPreventDefault = true)', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
				kbItem(key, ''),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyI);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`, `The key combination (${toUsLabel(chord0)}, ${toUsLabel(chord1)}) is not a command.`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});

		test('a multi-chord keybinding with a null command ID keeps the keybinding (shouldPreventDefault = true)', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
				kbItem(key, null),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyI);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`, `The key combination (${toUsLabel(chord0)}, ${toUsLabel(chord1)}) is not a command.`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});

	});

	test('issue #16498: chord mode is quit for invalid chords', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand'),
			kbItem(KeyCode.Backspace, 'simpleCommand'),
		]);

		// send Ctrl/Cmd + K
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send backspace
		shouldPreventDefault = kbService.testDispatch(KeyCode.Backspace);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`The key combination (${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}, ${toUsLabel(KeyCode.Backspace)}) is not a command.`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send backspace
		shouldPreventDefault = kbService.testDispatch(KeyCode.Backspace);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('issue #16833: Keybinding service should not testDispatch on modifier keys', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyCode.Ctrl, 'nope'),
			kbItem(KeyCode.Meta, 'nope'),
			kbItem(KeyCode.Alt, 'nope'),
			kbItem(KeyCode.Shift, 'nope'),

			kbItem(KeyMod.CtrlCmd, 'nope'),
			kbItem(KeyMod.WinCtrl, 'nope'),
			kbItem(KeyMod.Alt, 'nope'),
			kbItem(KeyMod.Shift, 'nope'),
		]);

		function assertIsIgnored(keybinding: number): void {
			const shouldPreventDefault = kbService.testDispatch(keybinding);
			assert.strictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);
			executeCommandCalls = [];
			showMessageCalls = [];
			statusMessageCalls = [];
			statusMessageCallsDisposed = [];
		}

		assertIsIgnored(KeyCode.Ctrl);
		assertIsIgnored(KeyCode.Meta);
		assertIsIgnored(KeyCode.Alt);
		assertIsIgnored(KeyCode.Shift);

		assertIsIgnored(KeyMod.CtrlCmd);
		assertIsIgnored(KeyMod.WinCtrl);
		assertIsIgnored(KeyMod.Alt);
		assertIsIgnored(KeyMod.Shift);

		kbService.dispose();
	});

	test('can trigger command that is sharing keybinding with chord', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand'),
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'simpleCommand', ContextKeyExpr.has('key1')),
		]);


		// send Ctrl/Cmd + K
		currentContextValue = createContext({
			key1: true
		});
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + X
		currentContextValue = createContext({});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyX);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'chordCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('cannot trigger chord if command is overwriting', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand', ContextKeyExpr.has('key1')),
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'simpleCommand'),
		]);


		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + K
		currentContextValue = createContext({
			key1: true
		});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + X
		currentContextValue = createContext({
			key1: true
		});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyX);
		assert.strictEqual(shouldPreventDefault, false);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('can have spying command', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, '^simpleCommand'),
		]);

		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, false);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});
});
