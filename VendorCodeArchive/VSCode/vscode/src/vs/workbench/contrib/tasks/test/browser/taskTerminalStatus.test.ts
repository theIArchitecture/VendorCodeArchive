//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok } from 'assert';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ACTIVE_TASK_STATUS, FAILED_TASK_STATUS, SUCCEEDED_TASK_STATUS, TaskTerminalStatus } from '../../browser/taskTerminalStatus.js';
import { AbstractProblemCollector } from '../../common/problemCollectors.js';
import { CommonTask, ITaskEvent, TaskEventKind, TaskRunType } from '../../common/tasks.js';
import { ITaskService, Task } from '../../common/taskService.js';
import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { ITerminalStatusList, TerminalStatusList } from '../../../terminal/browser/terminalStatusList.js';
import { ITerminalStatus } from '../../../terminal/common/terminal.js';

class TestTaskService implements Partial<ITaskService> {
	private readonly _onDidStateChange: Emitter<ITaskEvent> = new Emitter();
	public get onDidStateChange(): Event<ITaskEvent> {
		return this._onDidStateChange.event;
	}
	public triggerStateChange(event: Partial<ITaskEvent>): void {
		this._onDidStateChange.fire(event as ITaskEvent);
	}
}

class TestaccessibilitySignalService implements Partial<IAccessibilitySignalService> {
	async playSignal(cue: AccessibilitySignal): Promise<void> {
		return;
	}
}

class TestTerminal extends Disposable implements Partial<ITerminalInstance> {
	statusList: TerminalStatusList = this._register(new TerminalStatusList(new TestConfigurationService()));
	constructor() {
		super();
	}
	override dispose(): void {
		super.dispose();
	}
}

class TestTask extends CommonTask {

	constructor() {
		super('test', undefined, undefined, {}, {}, { kind: '', label: '' });
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 54: Error message without production error code - breaks React bundle size optimization
//   2. Line 54: Error message without production error code - breaks React bundle size optimization
//   3. Line 57: Error message without production error code - breaks React bundle size optimization
//   4. Line 57: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	protected getFolderId(): string | undefined {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 68: Error message without production error code - breaks React bundle size optimization
//   2. Line 68: Error message without production error code - breaks React bundle size optimization
//   3. Line 71: Error message without production error code - breaks React bundle size optimization
//   4. Line 71: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
	protected fromObject(object: any): Task {
		throw new Error('Method not implemented.');
	}
}

class TestProblemCollector extends Disposable implements Partial<AbstractProblemCollector> {
	protected readonly _onDidFindFirstMatch = new Emitter<void>();
	readonly onDidFindFirstMatch = this._onDidFindFirstMatch.event;
	protected readonly _onDidFindErrors = new Emitter<void>();
	readonly onDidFindErrors = this._onDidFindErrors.event;
	protected readonly _onDidRequestInvalidateLastMarker = new Emitter<void>();
	readonly onDidRequestInvalidateLastMarker = this._onDidRequestInvalidateLastMarker.event;
}

suite('Task Terminal Status', () => {
	let instantiationService: TestInstantiationService;
	let taskService: TestTaskService;
	let taskTerminalStatus: TaskTerminalStatus;
	let testTerminal: ITerminalInstance;
	let testTask: Task;
	let problemCollector: AbstractProblemCollector;
	let accessibilitySignalService: TestaccessibilitySignalService;
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	setup(() => {
		instantiationService = store.add(new TestInstantiationService());
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		taskService = new TestTaskService();
		accessibilitySignalService = new TestaccessibilitySignalService();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		taskTerminalStatus = store.add(new TaskTerminalStatus(taskService as any, accessibilitySignalService as any));
		testTerminal = store.add(instantiationService.createInstance(TestTerminal) as any);
		testTask = instantiationService.createInstance(TestTask) as unknown as Task;
		problemCollector = store.add(instantiationService.createInstance(TestProblemCollector) as any);
	});
	test('Should add failed status when there is an exit code on task end', async () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.End });
		await poll<void>(async () => Promise.resolve(), () => testTerminal?.statusList.primary?.id === FAILED_TASK_STATUS.id, 'terminal status should be updated');
	});
	test('Should add active status when a non-background task is run for a second time in the same terminal', () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.SingleRun });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
	});
	test('Should drop status when a background task exits', async () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.Background });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessEnded, exitCode: 0 });
		await poll<void>(async () => Promise.resolve(), () => testTerminal?.statusList.statuses?.includes(SUCCEEDED_TASK_STATUS) === false, 'terminal should have dropped status');
	});
	test('Should add succeeded status when a non-background task exits', () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.SingleRun });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessEnded, exitCode: 0 });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
	});
});

function assertStatus(actual: ITerminalStatusList, expected: ITerminalStatus): void {
	ok(actual.statuses.length === 1, '# of statuses');
	ok(actual.primary?.id === expected.id, 'ID');
	ok(actual.primary?.severity === expected.severity, 'Severity');
}

async function poll<T>(
	fn: () => Thenable<T>,
	acceptFn: (result: T) => boolean,
	timeoutMessage: string,
	retryCount: number = 200,
	retryInterval: number = 10 // millis
): Promise<T> {
	let trial = 1;
	let lastError: string = '';

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 146: Error message without production error code - breaks React bundle size optimization
//   2. Line 146: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	while (true) {
		if (trial > retryCount) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 182: Error message without production error code - breaks React bundle size optimization
//   2. Line 182: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Timeout: ${timeoutMessage} after ${(retryCount * retryInterval) / 1000} seconds.\r${lastError}`);
		}

		let result;
		try {
			result = await fn();
			if (acceptFn(result)) {
				return result;
			} else {
				lastError = 'Did not pass accept function';
			}
		} catch (e: any) {
			lastError = Array.isArray(e.stack) ? e.stack.join('\n') : e.stack;
		}

		await new Promise(resolve => setTimeout(resolve, retryInterval));
		trial++;
	}
}
