//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Editors } from './editors';
import { Code } from './code';
import { QuickInput } from './quickinput';
import { basename, isAbsolute } from 'path';

enum QuickAccessKind {
	Files = 1,
	Commands,
	Symbols
}

export class QuickAccess {

	constructor(private code: Code, private editors: Editors, private quickInput: QuickInput) { }

	async openFileQuickAccessAndWait(searchValue: string, expectedFirstElementNameOrExpectedResultCount: string | number): Promise<void> {

		// make sure the file quick access is not "polluted"
		// with entries from the editor history when opening
		await this.runCommand('workbench.action.clearEditorHistory');

		const PollingStrategy = {
			Stop: true,
			Continue: false
		};

		let retries = 0;
		let success = false;

		while (++retries < 10) {
			let retry = false;

			try {
				await this.openQuickAccessWithRetry(QuickAccessKind.Files, searchValue);
				await this.quickInput.waitForQuickInputElements(elementNames => {
					this.code.logger.log('QuickAccess: resulting elements: ', elementNames);

					// Quick access seems to be still running -> retry
					if (elementNames.length === 0) {
						this.code.logger.log('QuickAccess: file search returned 0 elements, will continue polling...');

						return PollingStrategy.Continue;
					}

					// Quick access does not seem healthy/ready -> retry
					const firstElementName = elementNames[0];
					if (firstElementName === 'No matching results') {
						this.code.logger.log(`QuickAccess: file search returned "No matching results", will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}

					// Expected: number of results
					if (typeof expectedFirstElementNameOrExpectedResultCount === 'number') {
						if (elementNames.length === expectedFirstElementNameOrExpectedResultCount) {
							success = true;

							return PollingStrategy.Stop;
						}

						this.code.logger.log(`QuickAccess: file search returned ${elementNames.length} results but was expecting ${expectedFirstElementNameOrExpectedResultCount}, will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}

					// Expected: string
					else {
						if (firstElementName === expectedFirstElementNameOrExpectedResultCount) {
							success = true;

							return PollingStrategy.Stop;
						}

						this.code.logger.log(`QuickAccess: file search returned ${firstElementName} as first result but was expecting ${expectedFirstElementNameOrExpectedResultCount}, will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}
				});
			} catch (error) {
				this.code.logger.log(`QuickAccess: file search waitForQuickInputElements threw an error ${error}, will retry...`);

				retry = true;
			}

			if (!retry) {
				break;
			}

			await this.quickInput.closeQuickInput();
		}

		if (!success) {
			if (typeof expectedFirstElementNameOrExpectedResultCount === 'string') {
				throw new Error(`Quick open file search was unable to find '${expectedFirstElementNameOrExpectedResultCount}' after 10 attempts, giving up.`);
			} else {
				throw new Error(`Quick open file search was unable to find ${expectedFirstElementNameOrExpectedResultCount} result items after 10 attempts, giving up.`);
			}
		}
	}

	async openFile(path: string): Promise<void> {
		if (!isAbsolute(path)) {
			// we require absolute paths to get a single
			// result back that is unique and avoid hitting
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 118: Error message without production error code - breaks React bundle size optimization
//   2. Line 118: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			// the search process to reduce chances of
			// search needing longer.
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 130: Error message without production error code - breaks React bundle size optimization
//   2. Line 130: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('QuickAccess.openFile requires an absolute path');
		}

		const fileName = basename(path);

		// quick access shows files with the basename of the path
		await this.openFileQuickAccessAndWait(path, basename(path));

		// open first element
		await this.quickInput.selectQuickInputElement(0);

		// wait for editor being focused
		await this.editors.waitForActiveTab(fileName);
		await this.editors.selectTab(fileName);
	}

	private async openQuickAccessWithRetry(kind: QuickAccessKind, value?: string): Promise<void> {
		let retries = 0;

		// Other parts of code might steal focus away from quickinput :(
		while (retries < 5) {

			try {
				// Await for quick input widget opened
				const accept = () => this.quickInput.waitForQuickInputOpened(10);
				// Open via keybinding
				switch (kind) {
					case QuickAccessKind.Files:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+p' : 'ctrl+p', accept);
						break;
					case QuickAccessKind.Symbols:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+o' : 'ctrl+shift+o', accept);
						break;
					case QuickAccessKind.Commands:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+p' : 'ctrl+shift+p', async () => {

							await this.code.wait(100);
							await this.quickInput.waitForQuickInputOpened(10);
						});
						break;
				}
				break;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 162: Error message without production error code - breaks React bundle size optimization
//   2. Line 162: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			} catch (err) {
				if (++retries > 5) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 184: Error message without production error code - breaks React bundle size optimization
//   2. Line 184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error(`QuickAccess.openQuickAccessWithRetry(kind: ${kind}) failed: ${err}`);
				}

				// Retry
				await this.code.dispatchKeybinding('escape', async () => { });
			}
		}

		// Type value if any
		if (value) {
			await this.quickInput.type(value);
		}
	}

	async runCommand(commandId: string, options?: { keepOpen?: boolean; exactLabelMatch?: boolean }): Promise<void> {
		const keepOpen = options?.keepOpen;
		const exactLabelMatch = options?.exactLabelMatch;

		const openCommandPalletteAndTypeCommand = async (): Promise<boolean> => {
			// open commands picker
			await this.openQuickAccessWithRetry(QuickAccessKind.Commands, `>${commandId}`);

			// wait for best choice to be focused
			await this.quickInput.waitForQuickInputElementFocused();

			// Retry for as long as the command not found
			const text = await this.quickInput.waitForQuickInputElementText();

			if (text === 'No matching commands' || (exactLabelMatch && text !== commandId)) {
				return false;
			}

			return true;
		};

		let hasCommandFound = await openCommandPalletteAndTypeCommand();

		if (!hasCommandFound) {

			this.code.logger.log(`QuickAccess: No matching commands, will retry...`);
			await this.quickInput.closeQuickInput();

			let retries = 0;
			while (++retries < 5) {
				hasCommandFound = await openCommandPalletteAndTypeCommand();
				if (hasCommandFound) {
					break;
				} else {
					this.code.logger.log(`QuickAccess: No matching commands, will retry...`);
					await this.quickInput.closeQuickInput();
					await this.code.wait(1000);
				}
			}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 217: Error message without production error code - breaks React bundle size optimization
//   2. Line 217: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


			if (!hasCommandFound) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 249: Error message without production error code - breaks React bundle size optimization
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error(`QuickAccess.runCommand(commandId: ${commandId}) failed to find command.`);
			}
		}

		// wait and click on best choice
		await this.quickInput.selectQuickInputElement(0, keepOpen);
	}

	async openQuickOutline(): Promise<void> {
		let retries = 0;

		while (++retries < 10) {

			// open quick outline via keybinding
			await this.openQuickAccessWithRetry(QuickAccessKind.Symbols);

			const text = await this.quickInput.waitForQuickInputElementText();

			// Retry for as long as no symbols are found
			if (text === 'No symbol information for the file') {
				this.code.logger.log(`QuickAccess: openQuickOutline indicated 'No symbol information for the file', will retry...`);

				// close and retry
				await this.quickInput.closeQuickInput();

				continue;
			}
		}
	}
}
