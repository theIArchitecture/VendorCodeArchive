/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ITaskSystem } from '../common/taskSystem.js';
import { ExecutionEngine } from '../common/tasks.js';
import { AbstractTaskService, IWorkspaceFolderConfigurationResult } from './abstractTaskService.js';
import { ITaskFilter, ITaskService } from '../common/taskService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class TaskService extends AbstractTaskService {
	private static readonly ProcessTaskSystemSupportMessage = nls.localize('taskService.processTaskSystem', 'Process task system is not support in the web.');

	protected _getTaskSystem(): ITaskSystem {
		if (this._taskSystem) {
			return this._taskSystem;
		}
		if (this.executionEngine !== ExecutionEngine.Terminal) {
			throw new Error(TaskService.ProcessTaskSystemSupportMessage);
		}
		this._taskSystem = this._createTerminalTaskSystem();
		this._taskSystemListeners =
			[
				this._taskSystem.onDidStateChange((event) => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					this._taskRunningState.set(this._taskSystem!.isActiveSync());
					this._onDidStateChange.fire(event);
				}),
			];
		return this._taskSystem;
	}

	protected _computeLegacyConfiguration(workspaceFolder: IWorkspaceFolder): Promise<IWorkspaceFolderConfigurationResult> {
		throw new Error(TaskService.ProcessTaskSystemSupportMessage);
	}

	protected _versionAndEngineCompatible(filter?: ITaskFilter): boolean {
		return this.executionEngine === ExecutionEngine.Terminal;
	}
}

registerSingleton(ITaskService, TaskService, InstantiationType.Delayed);
