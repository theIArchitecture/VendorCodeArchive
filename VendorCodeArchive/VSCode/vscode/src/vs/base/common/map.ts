//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from './uri.js';

export function getOrSet<K, V>(map: Map<K, V>, key: K, value: V): V {
	let result = map.get(key);
	if (result === undefined) {
		result = value;
		map.set(key, result);
	}

	return result;
}

export function mapToString<K, V>(map: Map<K, V>): string {
	const entries: string[] = [];
	map.forEach((value, key) => {
		entries.push(`${key} => ${value}`);
	});

	return `Map(${map.size}) {${entries.join(', ')}}`;
}

export function setToString<K>(set: Set<K>): string {
	const entries: K[] = [];
	set.forEach(value => {
		entries.push(value);
	});

	return `Set(${set.size}) {${entries.join(', ')}}`;
}

interface ResourceMapKeyFn {
	(resource: URI): string;
}

class ResourceMapEntry<T> {
	constructor(readonly uri: URI, readonly value: T) { }
}

function isEntries<T>(arg: ResourceMap<T> | ResourceMapKeyFn | readonly (readonly [URI, T])[] | undefined): arg is readonly (readonly [URI, T])[] {
	return Array.isArray(arg);
}

export class ResourceMap<T> implements Map<URI, T> {

	private static readonly defaultToKey = (resource: URI) => resource.toString();

	readonly [Symbol.toStringTag] = 'ResourceMap';

	private readonly map: Map<string, ResourceMapEntry<T>>;
	private readonly toKey: ResourceMapKeyFn;

	/**
	 *
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(toKey?: ResourceMapKeyFn);

	/**
	 *
	 * @param other Another resource which this maps is created from
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(other?: ResourceMap<T>, toKey?: ResourceMapKeyFn);

	/**
	 *
	 * @param other Another resource which this maps is created from
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(entries?: readonly (readonly [URI, T])[], toKey?: ResourceMapKeyFn);

	constructor(arg?: ResourceMap<T> | ResourceMapKeyFn | readonly (readonly [URI, T])[], toKey?: ResourceMapKeyFn) {
		if (arg instanceof ResourceMap) {
			this.map = new Map(arg.map);
			this.toKey = toKey ?? ResourceMap.defaultToKey;
		} else if (isEntries(arg)) {
			this.map = new Map();
			this.toKey = toKey ?? ResourceMap.defaultToKey;

			for (const [resource, value] of arg) {
				this.set(resource, value);
			}
		} else {
			this.map = new Map();
			this.toKey = arg ?? ResourceMap.defaultToKey;
		}
	}

	set(resource: URI, value: T): this {
		this.map.set(this.toKey(resource), new ResourceMapEntry(resource, value));
		return this;
	}

	get(resource: URI): T | undefined {
		return this.map.get(this.toKey(resource))?.value;
	}

	has(resource: URI): boolean {
		return this.map.has(this.toKey(resource));
	}

	get size(): number {
		return this.map.size;
	}

	clear(): void {
		this.map.clear();
	}

	delete(resource: URI): boolean {
		return this.map.delete(this.toKey(resource));
	}

	forEach(clb: (value: T, key: URI, map: Map<URI, T>) => void, thisArg?: any): void {
		if (typeof thisArg !== 'undefined') {
			clb = clb.bind(thisArg);
		}
		for (const [_, entry] of this.map) {
			clb(entry.value, entry.uri, <any>this);
		}
	}

	*values(): IterableIterator<T> {
		for (const entry of this.map.values()) {
			yield entry.value;
		}
	}

	*keys(): IterableIterator<URI> {
		for (const entry of this.map.values()) {
			yield entry.uri;
		}
	}

	*entries(): IterableIterator<[URI, T]> {
		for (const entry of this.map.values()) {
			yield [entry.uri, entry.value];
		}
	}

	*[Symbol.iterator](): IterableIterator<[URI, T]> {
		for (const [, entry] of this.map) {
			yield [entry.uri, entry.value];
		}
	}
}

export class ResourceSet implements Set<URI> {

	readonly [Symbol.toStringTag]: string = 'ResourceSet';

	private readonly _map: ResourceMap<URI>;

	constructor(toKey?: ResourceMapKeyFn);
	constructor(entries: readonly URI[], toKey?: ResourceMapKeyFn);
	constructor(entriesOrKey?: readonly URI[] | ResourceMapKeyFn, toKey?: ResourceMapKeyFn) {
		if (!entriesOrKey || typeof entriesOrKey === 'function') {
			this._map = new ResourceMap(entriesOrKey);
		} else {
			this._map = new ResourceMap(toKey);
			entriesOrKey.forEach(this.add, this);
		}
	}


	get size(): number {
		return this._map.size;
	}

	add(value: URI): this {
		this._map.set(value, value);
		return this;
	}

	clear(): void {
		this._map.clear();
	}

	delete(value: URI): boolean {
		return this._map.delete(value);
	}

	forEach(callbackfn: (value: URI, value2: URI, set: Set<URI>) => void, thisArg?: any): void {
		this._map.forEach((_value, key) => callbackfn.call(thisArg, key, key, this));
	}

	has(value: URI): boolean {
		return this._map.has(value);
	}

	entries(): IterableIterator<[URI, URI]> {
		return this._map.entries();
	}

	keys(): IterableIterator<URI> {
		return this._map.keys();
	}

	values(): IterableIterator<URI> {
		return this._map.keys();
	}

	[Symbol.iterator](): IterableIterator<URI> {
		return this.keys();
	}
}


interface Item<K, V> {
	previous: Item<K, V> | undefined;
	next: Item<K, V> | undefined;
	key: K;
	value: V;
}

export const enum Touch {
	None = 0,
	AsOld = 1,
	AsNew = 2
}

export class LinkedMap<K, V> implements Map<K, V> {

	readonly [Symbol.toStringTag] = 'LinkedMap';

	private _map: Map<K, Item<K, V>>;
	private _head: Item<K, V> | undefined;
	private _tail: Item<K, V> | undefined;
	private _size: number;

	private _state: number;

	constructor() {
		this._map = new Map<K, Item<K, V>>();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state = 0;
	}

	clear(): void {
		this._map.clear();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state++;
	}

	isEmpty(): boolean {
		return !this._head && !this._tail;
	}

	get size(): number {
		return this._size;
	}

	get first(): V | undefined {
		return this._head?.value;
	}

	get last(): V | undefined {
		return this._tail?.value;
	}

	has(key: K): boolean {
		return this._map.has(key);
	}

	get(key: K, touch: Touch = Touch.None): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		if (touch !== Touch.None) {
			this.touch(item, touch);
		}
		return item.value;
	}

	set(key: K, value: V, touch: Touch = Touch.None): this {
		let item = this._map.get(key);
		if (item) {
			item.value = value;
			if (touch !== Touch.None) {
				this.touch(item, touch);
			}
		} else {
			item = { key, value, next: undefined, previous: undefined };
			switch (touch) {
				case Touch.None:
					this.addItemLast(item);
					break;
				case Touch.AsOld:
					this.addItemFirst(item);
					break;
				case Touch.AsNew:
					this.addItemLast(item);
					break;
				default:
					this.addItemLast(item);
					break;
			}
			this._map.set(key, item);
			this._size++;
		}
		return this;
	}

	delete(key: K): boolean {
		return !!this.remove(key);
	}

	remove(key: K): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		this._map.delete(key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	shift(): V | undefined {
		if (!this._head && !this._tail) {
			return undefined;
		}
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		const item = this._head;
		this._map.delete(item.key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	forEach(callbackfn: (value: V, key: K, map: LinkedMap<K, V>) => void, thisArg?: any): void {
		const state = this._state;
		let current = this._head;
		while (current) {
			if (thisArg) {
				callbackfn.bind(thisArg)(current.value, current.key, this);
			} else {
				callbackfn(current.value, current.key, this);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 353: Error message without production error code - breaks React bundle size optimization
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			}
			if (this._state !== state) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 365: Error message without production error code - breaks React bundle size optimization
//   2. Line 365: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error(`LinkedMap got modified during iteration.`);
			}
			current = current.next;
		}
	}

	keys(): IterableIterator<K> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<K> = {
			[Symbol.iterator]() {
				return iterator;
			},
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 369: Error message without production error code - breaks React bundle size optimization
//   2. Line 369: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			next(): IteratorResult<K> {
				if (map._state !== state) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 391: Error message without production error code - breaks React bundle size optimization
//   2. Line 391: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.key, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	values(): IterableIterator<V> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<V> = {
			[Symbol.iterator]() {
				return iterator;
			},
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 393: Error message without production error code - breaks React bundle size optimization
//   2. Line 393: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			next(): IteratorResult<V> {
				if (map._state !== state) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 425: Error message without production error code - breaks React bundle size optimization
//   2. Line 425: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.value, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	entries(): IterableIterator<[K, V]> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<[K, V]> = {
			[Symbol.iterator]() {
				return iterator;
			},
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 417: Error message without production error code - breaks React bundle size optimization
//   2. Line 417: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			next(): IteratorResult<[K, V]> {
				if (map._state !== state) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 459: Error message without production error code - breaks React bundle size optimization
//   2. Line 459: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result: IteratorResult<[K, V]> = { value: [current.key, current.value], done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	protected trimOld(newSize: number) {
		if (newSize >= this.size) {
			return;
		}
		if (newSize === 0) {
			this.clear();
			return;
		}
		let current = this._head;
		let currentSize = this.size;
		while (current && currentSize > newSize) {
			this._map.delete(current.key);
			current = current.next;
			currentSize--;
		}
		this._head = current;
		this._size = currentSize;
		if (current) {
			current.previous = undefined;
		}
		this._state++;
	}

	protected trimNew(newSize: number) {
		if (newSize >= this.size) {
			return;
		}
		if (newSize === 0) {
			this.clear();
			return;
		}
		let current = this._tail;
		let currentSize = this.size;
		while (current && currentSize > newSize) {
			this._map.delete(current.key);
			current = current.previous;
			currentSize--;
		}
		this._tail = current;
		this._size = currentSize;
		if (current) {
			current.next = undefined;
		}
		this._state++;
	}

	private addItemFirst(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._tail = item;
		} else if (!this._head) {
			throw new Error('Invalid list');
		} else {
			item.next = this._head;
			this._head.previous = item;
		}
		this._head = item;
		this._state++;
	}

	private addItemLast(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._head = item;
		} else if (!this._tail) {
			throw new Error('Invalid list');
		} else {
			item.previous = this._tail;
			this._tail.next = item;
		}
		this._tail = item;
		this._state++;
	}

	private removeItem(item: Item<K, V>): void {
		if (item === this._head && item === this._tail) {
			this._head = undefined;
			this._tail = undefined;
		}
		else if (item === this._head) {
			// This can only happen if size === 1 which is handled
			// by the case above.
			if (!item.next) {
				throw new Error('Invalid list');
			}
			item.next.previous = undefined;
			this._head = item.next;
		}
		else if (item === this._tail) {
			// This can only happen if size === 1 which is handled
			// by the case above.
			if (!item.previous) {
				throw new Error('Invalid list');
			}
			item.previous.next = undefined;
			this._tail = item.previous;
		}
		else {
			const next = item.next;
			const previous = item.previous;
			if (!next || !previous) {
				throw new Error('Invalid list');
			}
			next.previous = previous;
			previous.next = next;
		}
		item.next = undefined;
		item.previous = undefined;
		this._state++;
	}

	private touch(item: Item<K, V>, touch: Touch): void {
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		if ((touch !== Touch.AsOld && touch !== Touch.AsNew)) {
			return;
		}

		if (touch === Touch.AsOld) {
			if (item === this._head) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item
			if (item === this._tail) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				// previous must be defined since item was not head but is tail
				// So there are more than on item in the map
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 676: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 687: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 692: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 698: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 708: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 709: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 714: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 725: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 736: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 742: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 764: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 774: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 780: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				previous!.next = undefined;
				this._tail = previous;
			}
			else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}

			// Insert the node at head
			item.previous = undefined;
			item.next = this._head;
			this._head.previous = item;
			this._head = item;
			this._state++;
		} else if (touch === Touch.AsNew) {
			if (item === this._tail) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item.
			if (item === this._head) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				// next must be defined since item was not tail but is head
				// So there are more than on item in the map
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 661: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 745: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 746: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 767: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 900: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 917: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 922: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 943: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 988: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1009: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1010: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				next!.previous = undefined;
				this._head = next;
			} else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}
			item.next = undefined;
			item.previous = this._tail;
			this._tail.next = item;
			this._tail = item;
			this._state++;
		}
	}

	toJSON(): [K, V][] {
		const data: [K, V][] = [];

		this.forEach((value, key) => {
			data.push([key, value]);
		});

		return data;
	}

	fromJSON(data: [K, V][]): void {
		this.clear();

		for (const [key, value] of data) {
			this.set(key, value);
		}
	}
}

abstract class Cache<K, V> extends LinkedMap<K, V> {

	protected _limit: number;
	protected _ratio: number;

	constructor(limit: number, ratio: number = 1) {
		super();
		this._limit = limit;
		this._ratio = Math.min(Math.max(0, ratio), 1);
	}

	get limit(): number {
		return this._limit;
	}

	set limit(limit: number) {
		this._limit = limit;
		this.checkTrim();
	}

	get ratio(): number {
		return this._ratio;
	}

	set ratio(ratio: number) {
		this._ratio = Math.min(Math.max(0, ratio), 1);
		this.checkTrim();
	}

	override get(key: K, touch: Touch = Touch.AsNew): V | undefined {
		return super.get(key, touch);
	}

	peek(key: K): V | undefined {
		return super.get(key, Touch.None);
	}

	override set(key: K, value: V): this {
		super.set(key, value, Touch.AsNew);
		return this;
	}

	protected checkTrim() {
		if (this.size > this._limit) {
			this.trim(Math.round(this._limit * this._ratio));
		}
	}

	protected abstract trim(newSize: number): void;
}

export class LRUCache<K, V> extends Cache<K, V> {

	constructor(limit: number, ratio: number = 1) {
		super(limit, ratio);
	}

	protected override trim(newSize: number) {
		this.trimOld(newSize);
	}

	override set(key: K, value: V): this {
		super.set(key, value);
		this.checkTrim();
		return this;
	}
}

export class MRUCache<K, V> extends Cache<K, V> {

	constructor(limit: number, ratio: number = 1) {
		super(limit, ratio);
	}

	protected override trim(newSize: number) {
		this.trimNew(newSize);
	}

	override set(key: K, value: V): this {
		if (this._limit <= this.size && !this.has(key)) {
			this.trim(Math.round(this._limit * this._ratio) - 1);
		}

		super.set(key, value);
		return this;
	}
}

export class CounterSet<T> {

	private map = new Map<T, number>();

	add(value: T): CounterSet<T> {
		this.map.set(value, (this.map.get(value) || 0) + 1);
		return this;
	}

	delete(value: T): boolean {
		let counter = this.map.get(value) || 0;

		if (counter === 0) {
			return false;
		}

		counter--;

		if (counter === 0) {
			this.map.delete(value);
		} else {
			this.map.set(value, counter);
		}

		return true;
	}

	has(value: T): boolean {
		return this.map.has(value);
	}
}

/**
 * A map that allows access both by keys and values.
 * **NOTE**: values need to be unique.
 */
export class BidirectionalMap<K, V> {

	private readonly _m1 = new Map<K, V>();
	private readonly _m2 = new Map<V, K>();

	constructor(entries?: readonly (readonly [K, V])[]) {
		if (entries) {
			for (const [key, value] of entries) {
				this.set(key, value);
			}
		}
	}

	clear(): void {
		this._m1.clear();
		this._m2.clear();
	}

	set(key: K, value: V): void {
		this._m1.set(key, value);
		this._m2.set(value, key);
	}

	get(key: K): V | undefined {
		return this._m1.get(key);
	}

	getKey(value: V): K | undefined {
		return this._m2.get(value);
	}

	delete(key: K): boolean {
		const value = this._m1.get(key);
		if (value === undefined) {
			return false;
		}
		this._m1.delete(key);
		this._m2.delete(value);
		return true;
	}

	forEach(callbackfn: (value: V, key: K, map: BidirectionalMap<K, V>) => void, thisArg?: any): void {
		this._m1.forEach((value, key) => {
			callbackfn.call(thisArg, value, key, this);
		});
	}

	keys(): IterableIterator<K> {
		return this._m1.keys();
	}

	values(): IterableIterator<V> {
		return this._m1.values();
	}
}

export class SetMap<K, V> {

	private map = new Map<K, Set<V>>();

	add(key: K, value: V): void {
		let values = this.map.get(key);

		if (!values) {
			values = new Set<V>();
			this.map.set(key, values);
		}

		values.add(value);
	}

	delete(key: K, value: V): void {
		const values = this.map.get(key);

		if (!values) {
			return;
		}

		values.delete(value);

		if (values.size === 0) {
			this.map.delete(key);
		}
	}

	forEach(key: K, fn: (value: V) => void): void {
		const values = this.map.get(key);

		if (!values) {
			return;
		}

		values.forEach(fn);
	}

	get(key: K): ReadonlySet<V> {
		const values = this.map.get(key);
		if (!values) {
			return new Set<V>();
		}
		return values;
	}
}

export function mapsStrictEqualIgnoreOrder(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean {
	if (a === b) {
		return true;
	}

	if (a.size !== b.size) {
		return false;
	}

	for (const [key, value] of a) {
		if (!b.has(key) || b.get(key) !== value) {
			return false;
		}
	}

	for (const [key] of b) {
		if (!a.has(key)) {
			return false;
		}
	}

	return true;
}

/**
 * A map that is addressable with an arbitrary number of keys. This is useful in high performance
 * scenarios where creating a composite key whenever the data is accessed is too expensive. For
 * example for a very hot function, constructing a string like `first-second-third` for every call
 * will cause a significant hit to performance.
 */
export class NKeyMap<TValue, TKeys extends (string | boolean | number)[]> {
	private _data: Map<any, any> = new Map();

	/**
	 * Sets a value on the map. Note that unlike a standard `Map`, the first argument is the value.
	 * This is because the spread operator is used for the keys and must be last..
	 * @param value The value to set.
	 * @param keys The keys for the value.
	 */
	public set(value: TValue, ...keys: [...TKeys]): void {
		let currentMap = this._data;
		for (let i = 0; i < keys.length - 1; i++) {
			if (!currentMap.has(keys[i])) {
				currentMap.set(keys[i], new Map());
			}
			currentMap = currentMap.get(keys[i]);
		}
		currentMap.set(keys[keys.length - 1], value);
	}

	public get(...keys: [...TKeys]): TValue | undefined {
		let currentMap = this._data;
		for (let i = 0; i < keys.length - 1; i++) {
			if (!currentMap.has(keys[i])) {
				return undefined;
			}
			currentMap = currentMap.get(keys[i]);
		}
		return currentMap.get(keys[keys.length - 1]);
	}

	public clear(): void {
		this._data.clear();
	}

	public *values(): IterableIterator<TValue> {
		function* iterate(map: Map<any, any>): IterableIterator<TValue> {
			for (const value of map.values()) {
				if (value instanceof Map) {
					yield* iterate(value);
				} else {
					yield value;
				}
			}
		}
		yield* iterate(this._data);
	}

	/**
	 * Get a textual representation of the map for debugging purposes.
	 */
	public toString(): string {
		const printMap = (map: Map<any, any>, depth: number): string => {
			let result = '';
			for (const [key, value] of map) {
				result += `${'  '.repeat(depth)}${key}: `;
				if (value instanceof Map) {
					result += '\n' + printMap(value, depth + 1);
				} else {
					result += `${value}\n`;
				}
			}
			return result;
		};

		return printMap(this._data, 0);
	}
}
