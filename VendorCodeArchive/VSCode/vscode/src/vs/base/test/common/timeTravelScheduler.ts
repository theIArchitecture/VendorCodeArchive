//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, numberComparator, tieBreakComparators } from '../../common/arrays.js';
import { Emitter, Event } from '../../common/event.js';
import { Disposable, IDisposable } from '../../common/lifecycle.js';
import { setTimeout0, setTimeout0IsFaster } from '../../common/platform.js';

export type TimeOffset = number;

export interface Scheduler {
	schedule(task: ScheduledTask): IDisposable;
	get now(): TimeOffset;
}

export interface ScheduledTask {
	readonly time: TimeOffset;
	readonly source: ScheduledTaskSource;

	run(): void;
}

export interface ScheduledTaskSource {
	toString(): string;
	readonly stackTrace: string | undefined;
}

interface ExtendedScheduledTask extends ScheduledTask {
	id: number;
}

const scheduledTaskComparator = tieBreakComparators<ExtendedScheduledTask>(
	compareBy(i => i.time, numberComparator),
	compareBy(i => i.id, numberComparator),
);

export class TimeTravelScheduler implements Scheduler {
	private taskCounter = 0;
	private _now: TimeOffset = 0;
	private readonly queue: PriorityQueue<ExtendedScheduledTask> = new SimplePriorityQueue<ExtendedScheduledTask>([], scheduledTaskComparator);

	private readonly taskScheduledEmitter = new Emitter<{ task: ScheduledTask }>();
	public readonly onTaskScheduled = this.taskScheduledEmitter.event;

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 49: Error message without production error code - breaks React bundle size optimization
//   2. Line 49: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	schedule(task: ScheduledTask): IDisposable {
		if (task.time < this._now) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 61: Error message without production error code - breaks React bundle size optimization
//   2. Line 61: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Scheduled time (${task.time}) must be equal to or greater than the current time (${this._now}).`);
		}
		const extendedTask: ExtendedScheduledTask = { ...task, id: this.taskCounter++ };
		this.queue.add(extendedTask);
		this.taskScheduledEmitter.fire({ task });
		return { dispose: () => this.queue.remove(extendedTask) };
	}

	get now(): TimeOffset {
		return this._now;
	}

	get hasScheduledTasks(): boolean {
		return this.queue.length > 0;
	}

	getScheduledTasks(): readonly ScheduledTask[] {
		return this.queue.toSortedArray();
	}

	runNext(): ScheduledTask | undefined {
		const task = this.queue.removeMin();
		if (task) {
			this._now = task.time;
			task.run();
		}

		return task;
	}

	installGlobally(): IDisposable {
		return overwriteGlobals(this);
	}
}

export class AsyncSchedulerProcessor extends Disposable {
	private isProcessing = false;
	private readonly _history = new Array<ScheduledTask>();
	public get history(): readonly ScheduledTask[] { return this._history; }

	private readonly maxTaskCount: number;
	private readonly useSetImmediate: boolean;

	private readonly queueEmptyEmitter = new Emitter<void>();
	public readonly onTaskQueueEmpty = this.queueEmptyEmitter.event;

	private lastError: Error | undefined;

	constructor(private readonly scheduler: TimeTravelScheduler, options?: { useSetImmediate?: boolean; maxTaskCount?: number }) {
		super();

		this.maxTaskCount = options && options.maxTaskCount ? options.maxTaskCount : 100;
		this.useSetImmediate = options && options.useSetImmediate ? options.useSetImmediate : false;

		this._register(scheduler.onTaskScheduled(() => {
			if (this.isProcessing) {
				return;
			} else {
				this.isProcessing = true;
				this.schedule();
			}
		}));
	}

	private schedule() {
		// This allows promises created by a previous task to settle and schedule tasks before the next task is run.
		// Tasks scheduled in those promises might have to run before the current next task.
		Promise.resolve().then(() => {
			if (this.useSetImmediate) {
				originalGlobalValues.setImmediate(() => this.process());
			} else if (setTimeout0IsFaster) {
				setTimeout0(() => this.process());
			} else {
				originalGlobalValues.setTimeout(() => this.process());
			}
		});
	}

	private process() {
		const executedTask = this.scheduler.runNext();
		if (executedTask) {
			this._history.push(executedTask);

			if (this.history.length >= this.maxTaskCount && this.scheduler.hasScheduledTasks) {
				const lastTasks = this._history.slice(Math.max(0, this.history.length - 10)).map(h => `${h.source.toString()}: ${h.source.stackTrace}`);
				const e = new Error(`Queue did not get empty after processing ${this.history.length} items. These are the last ${lastTasks.length} scheduled tasks:\n${lastTasks.join('\n\n\n')}`);
				this.lastError = e;
				throw e;
			}
		}

		if (this.scheduler.hasScheduledTasks) {
			this.schedule();
		} else {
			this.isProcessing = false;
			this.queueEmptyEmitter.fire();
		}
	}

	waitForEmptyQueue(): Promise<void> {
		if (this.lastError) {
			const error = this.lastError;
			this.lastError = undefined;
			throw error;
		}
		if (!this.isProcessing) {
			return Promise.resolve();
		} else {
			return Event.toPromise(this.onTaskQueueEmpty).then(() => {
				if (this.lastError) {
					throw this.lastError;
				}
			});
		}
	}
}


export async function runWithFakedTimers<T>(options: { useFakeTimers?: boolean; useSetImmediate?: boolean; maxTaskCount?: number }, fn: () => Promise<T>): Promise<T> {
	const useFakeTimers = options.useFakeTimers === undefined ? true : options.useFakeTimers;
	if (!useFakeTimers) {
		return fn();
	}

	const scheduler = new TimeTravelScheduler();
	const schedulerProcessor = new AsyncSchedulerProcessor(scheduler, { useSetImmediate: options.useSetImmediate, maxTaskCount: options.maxTaskCount });
	const globalInstallDisposable = scheduler.installGlobally();

	let result: T;
	try {
		result = await fn();
	} finally {
		globalInstallDisposable.dispose();

		try {
			// We process the remaining scheduled tasks.
			// The global override is no longer active, so during this, no more tasks will be scheduled.
			await schedulerProcessor.waitForEmptyQueue();
		} finally {
			schedulerProcessor.dispose();
		}
	}

	return result;
}

export const originalGlobalValues = {
	setTimeout: globalThis.setTimeout.bind(globalThis),
	clearTimeout: globalThis.clearTimeout.bind(globalThis),
	setInterval: globalThis.setInterval.bind(globalThis),
	clearInterval: globalThis.clearInterval.bind(globalThis),
	setImmediate: globalThis.setImmediate?.bind(globalThis),
	clearImmediate: globalThis.clearImmediate?.bind(globalThis),
	requestAnimationFrame: globalThis.requestAnimationFrame?.bind(globalThis),
	cancelAnimationFrame: globalThis.cancelAnimationFrame?.bind(globalThis),
	Date: globalThis.Date,
};

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 209: Error message without production error code - breaks React bundle size optimization
//   2. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

function setTimeout(scheduler: Scheduler, handler: TimerHandler, timeout: number = 0): IDisposable {
	if (typeof handler === 'string') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 231: Error message without production error code - breaks React bundle size optimization
//   2. Line 231: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('String handler args should not be used and are not supported');
	}

	return scheduler.schedule({
		time: scheduler.now + timeout,
		run: () => {
			handler();
		},
		source: {
			toString() { return 'setTimeout'; },
			stackTrace: new Error().stack,
		}
	});
}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 226: Error message without production error code - breaks React bundle size optimization
//   2. Line 226: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

function setInterval(scheduler: Scheduler, handler: TimerHandler, interval: number): IDisposable {
	if (typeof handler === 'string') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 258: Error message without production error code - breaks React bundle size optimization
//   2. Line 258: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('String handler args should not be used and are not supported');
	}
	const validatedHandler = handler;

	let iterCount = 0;
	const stackTrace = new Error().stack;

	let disposed = false;
	let lastDisposable: IDisposable;

	function schedule(): void {
		iterCount++;
		const curIter = iterCount;
		lastDisposable = scheduler.schedule({
			time: scheduler.now + interval,
			run() {
				if (!disposed) {
					schedule();
					validatedHandler();
				}
			},
			source: {
				toString() { return `setInterval (iteration ${curIter})`; },
				stackTrace,
			}
		});
	}

	schedule();

	return {
		dispose: () => {
			if (disposed) {
				return;
			}
			disposed = true;
			lastDisposable.dispose();
		}
	};
}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


function overwriteGlobals(scheduler: Scheduler): IDisposable {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	globalThis.setTimeout = ((handler: TimerHandler, timeout?: number) => setTimeout(scheduler, handler, timeout)) as any;
	globalThis.clearTimeout = (timeoutId: any) => {
		if (typeof timeoutId === 'object' && timeoutId && 'dispose' in timeoutId) {
			timeoutId.dispose();
		} else {
			originalGlobalValues.clearTimeout(timeoutId);
		}
	};

	globalThis.setInterval = ((handler: TimerHandler, timeout: number) => setInterval(scheduler, handler, timeout)) as any;
	globalThis.clearInterval = (timeoutId: any) => {
		if (typeof timeoutId === 'object' && timeoutId && 'dispose' in timeoutId) {
			timeoutId.dispose();
		} else {
			originalGlobalValues.clearInterval(timeoutId);
		}
	};

	globalThis.Date = createDateClass(scheduler);

	return {
		dispose: () => {
			Object.assign(globalThis, originalGlobalValues);
		}
	};
}

function createDateClass(scheduler: Scheduler): DateConstructor {
	const OriginalDate = originalGlobalValues.Date;

	function SchedulerDate(this: any, ...args: any): any {
		// the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
		// This remains so in the 10th edition of 2019 as well.
		if (!(this instanceof SchedulerDate)) {
			return new OriginalDate(scheduler.now).toString();
		}

		// if Date is called as a constructor with 'new' keyword
		if (args.length === 0) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return new OriginalDate(scheduler.now);
		}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 561: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 561: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 627: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 627: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		return new (OriginalDate as any)(...args);
	}

	for (const prop in OriginalDate) {
		if (OriginalDate.hasOwnProperty(prop)) {
			(SchedulerDate as any)[prop] = (OriginalDate as any)[prop];
		}
	}

	SchedulerDate.now = function now() {
		return scheduler.now;
	};
	SchedulerDate.toString = function toString() {
		return OriginalDate.toString();
	};
	SchedulerDate.prototype = OriginalDate.prototype;
	SchedulerDate.parse = OriginalDate.parse;
	SchedulerDate.UTC = OriginalDate.UTC;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	SchedulerDate.prototype.toUTCString = OriginalDate.prototype.toUTCString;

	return SchedulerDate as any;
}

interface PriorityQueue<T> {
	length: number;
	add(value: T): void;
	remove(value: T): void;

	removeMin(): T | undefined;
	toSortedArray(): T[];
}

class SimplePriorityQueue<T> implements PriorityQueue<T> {
	private isSorted = false;
	private items: T[];

	constructor(items: T[], private readonly compare: (a: T, b: T) => number) {
		this.items = items;
	}

	get length(): number {
		return this.items.length;
	}

	add(value: T): void {
		this.items.push(value);
		this.isSorted = false;
	}

	remove(value: T): void {
		const idx = this.items.indexOf(value);
		if (idx !== -1) {
			this.items.splice(idx, 1);
			this.isSorted = false;
		}
	}

	removeMin(): T | undefined {
		this.ensureSorted();
		return this.items.shift();
	}

	getMin(): T | undefined {
		this.ensureSorted();
		return this.items[0];
	}

	toSortedArray(): T[] {
		this.ensureSorted();
		return [...this.items];
	}

	private ensureSorted() {
		if (!this.isSorted) {
			this.items.sort(this.compare);
			this.isSorted = true;
		}
	}
}
