//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { RequestQueue, RequestQueueingType } from '../../tsServer/requestQueue';

suite('RequestQueue', () => {
	test('should be empty on creation', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);
		assert.strictEqual(queue.dequeue(), undefined);
	});

	suite('RequestQueue.createRequest', () => {
		test('should create items with increasing sequence numbers', async () => {
			const queue = new RequestQueue();

			for (let i = 0; i < 100; ++i) {
				const command = `command-${i}`;
				const request = queue.createRequest(command, i);
				assert.strictEqual(request.seq, i);
				assert.strictEqual(request.command, command);
				assert.strictEqual(request.arguments, i);
			}
		});
	});

	test('should queue normal requests in first in first out order', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		const request1 = queue.createRequest('a', 1);
		queue.enqueue({ request: request1, expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		assert.strictEqual(queue.length, 1);

		const request2 = queue.createRequest('b', 2);
		queue.enqueue({ request: request2, expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		assert.strictEqual(queue.length, 2);

		{
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 46: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 58: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(item!.request.command, 'a');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'b');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(item, undefined);
			assert.strictEqual(queue.length, 0);
		}
	});

	test('should put normal requests in front of low priority requests', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		queue.enqueue({ request: queue.createRequest('low-1', 1), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('low-2', 1), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('normal-1', 2), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		queue.enqueue({ request: queue.createRequest('normal-2', 2), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });

		{
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 77: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const item = queue.dequeue();
			assert.strictEqual(queue.length, 3);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 147: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 217: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(item!.request.command, 'normal-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 2);
			assert.strictEqual(item!.request.command, 'normal-2');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
			assert.strictEqual(item!.request.command, 'low-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'low-2');
		}
	});

	test('should not push fence requests front of low priority requests', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		queue.enqueue({ request: queue.createRequest('low-1', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('fence', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Fence });
		queue.enqueue({ request: queue.createRequest('low-2', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('normal', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });

		{
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const item = queue.dequeue();
			assert.strictEqual(queue.length, 3);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(item!.request.command, 'low-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 2);
			assert.strictEqual(item!.request.command, 'fence');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
			assert.strictEqual(item!.request.command, 'normal');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'low-2');
		}
	});
});

