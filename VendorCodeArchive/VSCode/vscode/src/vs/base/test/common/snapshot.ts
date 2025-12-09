//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Lazy } from '../../common/lazy.js';
import { FileAccess } from '../../common/network.js';
import { URI } from '../../common/uri.js';

declare const __readFileInTests: (path: string) => Promise<string>;
declare const __writeFileInTests: (path: string, contents: string) => Promise<void>;
declare const __readDirInTests: (path: string) => Promise<string[]>;
declare const __unlinkInTests: (path: string) => Promise<void>;
declare const __mkdirPInTests: (path: string) => Promise<void>;

// setup on import so assertSnapshot has the current context without explicit passing
let context: Lazy<SnapshotContext> | undefined;
const sanitizeName = (name: string) => name.replace(/[^a-z0-9_-]/gi, '_');
const normalizeCrlf = (str: string) => str.replace(/\r\n/g, '\n');

export interface ISnapshotOptions {
	/** Name for snapshot file, rather than an incremented number */
	name?: string;
	/** Extension name of the snapshot file, defaults to `.snap` */
	extension?: string;
}

/**
 * This is exported only for tests against the snapshotting itself! Use
 * {@link assertSnapshot} as a consumer!
 */
export class SnapshotContext {
	private nextIndex = 0;
	protected snapshotsDir: URI;
	private readonly namePrefix: string;
	private readonly usedNames = new Set();

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 40: Error message without production error code - breaks React bundle size optimization
//   2. Line 40: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	constructor(private readonly test: Mocha.Test | undefined) {
		if (!test) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 52: Error message without production error code - breaks React bundle size optimization
//   2. Line 52: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('assertSnapshot can only be used in a test');
		}

		if (!test.file) {
			throw new Error('currentTest.file is not set, please open an issue with the test you\'re trying to run');
		}

		const src = URI.joinPath(FileAccess.asFileUri(''), '../src');
		const parts = test.file.split(/[/\\]/g);

		this.namePrefix = sanitizeName(test.fullTitle()) + '.';
		this.snapshotsDir = URI.joinPath(src, ...[...parts.slice(0, -1), '__snapshots__']);
	}

	public async assert(value: unknown, options?: ISnapshotOptions) {
		const originalStack = new Error().stack!; // save to make the stack nicer on failure
		const nameOrIndex = (options?.name ? sanitizeName(options.name) : this.nextIndex++);
		const fileName = this.namePrefix + nameOrIndex + '.' + (options?.extension || 'snap');
		this.usedNames.add(fileName);

		const fpath = URI.joinPath(this.snapshotsDir, fileName).fsPath;
		const actual = formatValue(value);
		let expected: string;
		try {
			expected = await __readFileInTests(fpath);
		} catch {
			console.info(`Creating new snapshot in: ${fpath}`);
			await __mkdirPInTests(this.snapshotsDir.fsPath);
			await __writeFileInTests(fpath, actual);
			return;
		}

		if (normalizeCrlf(expected) !== normalizeCrlf(actual)) {
			await __writeFileInTests(fpath + '.actual', actual);
			const err: any = new Error(`Snapshot #${nameOrIndex} does not match expected output`);
			err.expected = expected;
			err.actual = actual;
			err.snapshotPath = fpath;
			err.stack = (err.stack as string)
				.split('\n')
				// remove all frames from the async stack and keep the original caller's frame
				.slice(0, 1)
				.concat(originalStack.split('\n').slice(3))
				.join('\n');
			throw err;
		}
	}

	public async removeOldSnapshots() {
		const contents = await __readDirInTests(this.snapshotsDir.fsPath);
		const toDelete = contents.filter(f => f.startsWith(this.namePrefix) && !this.usedNames.has(f));
		if (toDelete.length) {
			console.info(`Deleting ${toDelete.length} old snapshots for ${this.test?.fullTitle()}`);
		}

		await Promise.all(toDelete.map(f => __unlinkInTests(URI.joinPath(this.snapshotsDir, f).fsPath)));
	}
}

const debugDescriptionSymbol = Symbol.for('debug.description');

function formatValue(value: unknown, level = 0, seen: unknown[] = []): string {
	switch (typeof value) {
		case 'bigint':
		case 'boolean':
		case 'number':
		case 'symbol':
		case 'undefined':
			return String(value);
		case 'string':
			return level === 0 ? value : JSON.stringify(value);
		case 'function':
			return `[Function ${value.name}]`;
		case 'object': {
			if (value === null) {
				return 'null';
			}
			if (value instanceof RegExp) {
				return String(value);
			}
			if (seen.includes(value)) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				return '[Circular]';
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			if (debugDescriptionSymbol in value && typeof (value as any)[debugDescriptionSymbol] === 'function') {
				return (value as any)[debugDescriptionSymbol]();
			}
			const oi = '  '.repeat(level);
			const ci = '  '.repeat(level + 1);
			if (Array.isArray(value)) {
				const children = value.map(v => formatValue(v, level + 1, [...seen, value]));
				const multiline = children.some(c => c.includes('\n')) || children.join(', ').length > 80;
				return multiline ? `[\n${ci}${children.join(`,\n${ci}`)}\n${oi}]` : `[ ${children.join(', ')} ]`;
			}

			let entries;
			let prefix = '';
			if (value instanceof Map) {
				prefix = 'Map ';
				entries = [...value.entries()];
			} else if (value instanceof Set) {
				prefix = 'Set ';
				entries = [...value.entries()];
			} else {
				entries = Object.entries(value);
			}

			const lines = entries.map(([k, v]) => `${k}: ${formatValue(v, level + 1, [...seen, value])}`);
			return prefix + (lines.length > 1
				? `{\n${ci}${lines.join(`,\n${ci}`)}\n${oi}}`
				: `{ ${lines.join(',\n')} }`);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 152: Error message without production error code - breaks React bundle size optimization
//   2. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}
		default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 184: Error message without production error code - breaks React bundle size optimization
//   2. Line 184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unknown type ${value}`);
	}
}

setup(function () {
	const currentTest = this.currentTest;
	context = new Lazy(() => new SnapshotContext(currentTest));
});
teardown(async function () {
	if (this.currentTest?.state === 'passed') {
		await context?.rawValue?.removeOldSnapshots();
	}
	context = undefined;
});

/**
 * Implements a snapshot testing utility. ⚠️ This is async! ⚠️
 *
 * The first time a snapshot test is run, it'll record the value it's called
 * with as the expected value. Subsequent runs will fail if the value differs,
 * but the snapshot can be regenerated by hand or using the Selfhost Test
 * Provider Extension which'll offer to update it.
 *
 * The snapshot will be associated with the currently running test and stored
 * in a `__snapshots__` directory next to the test file, which is expected to
 * be the first `.test.js` file in the callstack.
 */
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

export function assertSnapshot(value: unknown, options?: ISnapshotOptions): Promise<void> {
	if (!context) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 223: Error message without production error code - breaks React bundle size optimization
//   2. Line 223: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('assertSnapshot can only be used in a test');
	}

	return context.value.assert(value, options);
}
