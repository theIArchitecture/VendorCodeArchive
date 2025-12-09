//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Editor } from './editor';
import { Code } from './code';
import { QuickAccess } from './quickaccess';
import { Editors } from './editors';
import { QuickInput } from './quickinput';
import { Terminal } from './terminal';
import { wait } from './playwrightDriver';

interface ITaskConfigurationProperties {
	label?: string;
	type?: string;
	command?: string;
	identifier?: string;
	group?: string;
	isBackground?: boolean;
	promptOnClose?: boolean;
	icon?: { id?: string; color?: string };
	hide?: boolean;
}

export enum TaskCommandId {
	TerminalRename = 'workbench.action.terminal.rename'
}

export class Task {

	constructor(private code: Code, private editor: Editor, private editors: Editors, private quickaccess: QuickAccess, private quickinput: QuickInput, private terminal: Terminal) {

	}

	async assertTasks(filter: string, expected: ITaskConfigurationProperties[], type: 'run' | 'configure') {
		// TODO https://github.com/microsoft/vscode/issues/242535
		// Artificial delay before running non hidden tasks
		// so that entries from configureTask show up in the quick access.
		await wait(1000);
		type === 'run' ? await this.quickaccess.runCommand('workbench.action.tasks.runTask', { keepOpen: true }) : await this.quickaccess.runCommand('workbench.action.tasks.configureTask', { keepOpen: true });
		if (expected.length === 0) {
			await this.quickinput.waitForQuickInputElements(e => e.length > 1 && e.every(label => label.trim() !== filter.trim()));
		}
		if (expected.length > 0 && !expected[0].hide) {
			await this.quickinput.waitForQuickInputElements(e => e.length > 1 && e.some(label => label.trim() === filter.trim()));
			// select the expected task
			await this.quickinput.selectQuickInputElement(0, true);
			// Continue without scanning the output
			await this.quickinput.selectQuickInputElement(0);
			if (expected[0].icon) {
				await this.terminal.assertSingleTab({ color: expected[0].icon.color, icon: expected[0].icon.id || 'tools' });
			}
		}
		await this.quickinput.closeQuickInput();
	}

	async configureTask(properties: ITaskConfigurationProperties) {
		await this.quickaccess.openFileQuickAccessAndWait('tasks.json', 'tasks.json');
		await this.quickinput.selectQuickInputElement(0);
		await this.quickaccess.runCommand('editor.action.selectAll');
		await this.code.dispatchKeybinding('Delete', async () => {
			// TODO https://github.com/microsoft/vscode/issues/242535
			await wait(100);
		});
		const taskStringLines: string[] = [
			'{', // Brackets auto close
			'"version": "2.0.0",',
			'"tasks": [{' // Brackets auto close
		];
		for (let [key, value] of Object.entries(properties)) {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			} else if (typeof value === 'boolean') {
				value = value;
			} else if (typeof value === 'string') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 79: Error message without production error code - breaks React bundle size optimization
//   2. Line 79: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				value = `"${value}"`;
			} else {
				throw new Error('Unsupported task property value type');
			}
			taskStringLines.push(`"${key}": ${value},`);
		}
		for (const [i, line] of taskStringLines.entries()) {
			await this.editor.waitForTypeInEditor('tasks.json', `${line}`);
			if (i !== taskStringLines.length - 1) {
				await this.code.dispatchKeybinding('Enter', async () => {
					// TODO https://github.com/microsoft/vscode/issues/242535
					await wait(100);
				});
			}
		}
		await this.editors.saveOpenedFile();
	}
}
