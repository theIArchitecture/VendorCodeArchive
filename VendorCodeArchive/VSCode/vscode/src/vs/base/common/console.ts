//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from './uri.js';

export interface IRemoteConsoleLog {
	type: string;
	severity: string;
	arguments: string;
}

export interface IStackArgument {
	__$stack: string;
}

export interface IStackFrame {
	uri: URI;
	line: number;
	column: number;
}

export function isRemoteConsoleLog(obj: unknown): obj is IRemoteConsoleLog {
	const entry = obj as IRemoteConsoleLog;

	return entry && typeof entry.type === 'string' && typeof entry.severity === 'string';
}

export function parse(entry: IRemoteConsoleLog): { args: any[]; stack?: string } {
	const args: any[] = [];
	let stack: string | undefined;

	// Parse Entry
	try {
		const parsedArguments: any[] = JSON.parse(entry.arguments);

		// Check for special stack entry as last entry
		const stackArgument = parsedArguments[parsedArguments.length - 1] as IStackArgument;
		if (stackArgument && stackArgument.__$stack) {
			parsedArguments.pop(); // stack is handled specially
			stack = stackArgument.__$stack;
		}

		args.push(...parsedArguments);
	} catch (error) {
		args.push('Unable to log remote console arguments', entry.arguments);
	}

	return { args, stack };
}

export function getFirstFrame(entry: IRemoteConsoleLog): IStackFrame | undefined;
export function getFirstFrame(stack: string | undefined): IStackFrame | undefined;
export function getFirstFrame(arg0: IRemoteConsoleLog | string | undefined): IStackFrame | undefined {
	if (typeof arg0 !== 'string') {
		return getFirstFrame(parse(arg0!).stack);
	}

	// Parse a source information out of the stack if we have one. Format can be:
	// at vscode.commands.registerCommand (/Users/someone/Desktop/test-ts/out/src/extension.js:18:17)
	// or
	// at /Users/someone/Desktop/test-ts/out/src/extension.js:18:17
	// or
	// at c:\Users\someone\Desktop\end-js\extension.js:19:17
	// or
	// at e.$executeContributedCommand(c:\Users\someone\Desktop\end-js\extension.js:19:17)
	const stack = arg0;
	if (stack) {
		const topFrame = findFirstFrame(stack);

		// at [^\/]* => line starts with "at" followed by any character except '/' (to not capture unix paths too late)
		// (?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\) => windows drive letter OR unix root OR unc root
		// (?:.+) => simple pattern for the path, only works because of the line/col pattern after
		// :(?:\d+):(?:\d+) => :line:column data
		const matches = /at [^\/]*((?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\))(?:.+)):(\d+):(\d+)/.exec(topFrame || '');
		if (matches && matches.length === 4) {
			return {
				uri: URI.file(matches[1]),
				line: Number(matches[2]),
				column: Number(matches[3])
			};
		}
	}

	return undefined;
}

function findFirstFrame(stack: string | undefined): string | undefined {
	if (!stack) {
		return stack;
	}

	const newlineIndex = stack.indexOf('\n');
	if (newlineIndex === -1) {
		return stack;
	}

	return stack.substring(0, newlineIndex);
}

export function log(entry: IRemoteConsoleLog, label: string): void {
	const { args, stack } = parse(entry);

	const isOneStringArg = typeof args[0] === 'string' && args.length === 1;

	let topFrame = findFirstFrame(stack);
	if (topFrame) {
		topFrame = `(${topFrame.trim()})`;
	}

	let consoleArgs: string[] = [];

	// First arg is a string
	if (typeof args[0] === 'string') {
		if (topFrame && isOneStringArg) {
			consoleArgs = [`%c[${label}] %c${args[0]} %c${topFrame}`, color('blue'), color(''), color('grey')];
		} else {
			consoleArgs = [`%c[${label}] %c${args[0]}`, color('blue'), color(''), ...args.slice(1)];
		}
	}

	// First arg is something else, just apply all
	else {
		consoleArgs = [`%c[${label}]%`, color('blue'), ...args];
	}

	// Stack: add to args unless already added
	if (topFrame && !isOneStringArg) {
		consoleArgs.push(topFrame);
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 134: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 135: Error message without production error code - breaks React bundle size optimization
//   3. Line 135: Error message without production error code - breaks React bundle size optimization
//   4. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	// Log it
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Error message without production error code - breaks React bundle size optimization
//   3. Line 149: Error message without production error code - breaks React bundle size optimization
//   4. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 161: Error message without production error code - breaks React bundle size optimization
//   3. Line 161: Error message without production error code - breaks React bundle size optimization
//   4. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 173: Error message without production error code - breaks React bundle size optimization
//   3. Line 173: Error message without production error code - breaks React bundle size optimization
//   4. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 185: Error message without production error code - breaks React bundle size optimization
//   3. Line 185: Error message without production error code - breaks React bundle size optimization
//   4. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 197: Error message without production error code - breaks React bundle size optimization
//   3. Line 197: Error message without production error code - breaks React bundle size optimization
//   4. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 209: Error message without production error code - breaks React bundle size optimization
//   3. Line 209: Error message without production error code - breaks React bundle size optimization
//   4. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 221: Error message without production error code - breaks React bundle size optimization
//   3. Line 221: Error message without production error code - breaks React bundle size optimization
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 232: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 233: Error message without production error code - breaks React bundle size optimization
//   3. Line 233: Error message without production error code - breaks React bundle size optimization
//   4. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Error message without production error code - breaks React bundle size optimization
//   3. Line 245: Error message without production error code - breaks React bundle size optimization
//   4. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Error message without production error code - breaks React bundle size optimization
//   4. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 269: Error message without production error code - breaks React bundle size optimization
//   3. Line 269: Error message without production error code - breaks React bundle size optimization
//   4. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 281: Error message without production error code - breaks React bundle size optimization
//   3. Line 281: Error message without production error code - breaks React bundle size optimization
//   4. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 293: Error message without production error code - breaks React bundle size optimization
//   3. Line 293: Error message without production error code - breaks React bundle size optimization
//   4. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 305: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Error message without production error code - breaks React bundle size optimization
//   4. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 317: Error message without production error code - breaks React bundle size optimization
//   3. Line 317: Error message without production error code - breaks React bundle size optimization
//   4. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 329: Error message without production error code - breaks React bundle size optimization
//   3. Line 329: Error message without production error code - breaks React bundle size optimization
//   4. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 341: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
//   4. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
//   3. Line 353: Error message without production error code - breaks React bundle size optimization
//   4. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 365: Error message without production error code - breaks React bundle size optimization
//   3. Line 365: Error message without production error code - breaks React bundle size optimization
//   4. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 377: Error message without production error code - breaks React bundle size optimization
//   3. Line 377: Error message without production error code - breaks React bundle size optimization
//   4. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	if (typeof (console as any)[entry.severity] !== 'function') {
		throw new Error('Unknown console method');
	}
	(console as any)[entry.severity].apply(console, consoleArgs);
}

function color(color: string): string {
	return `color: ${color}`;
}
