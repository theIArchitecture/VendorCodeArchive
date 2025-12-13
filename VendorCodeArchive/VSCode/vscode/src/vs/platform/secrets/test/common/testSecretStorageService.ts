/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { ISecretStorageService } from '../../common/secrets.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class TestSecretStorageService implements ISecretStorageService {
	declare readonly _serviceBrand: undefined;

	private readonly _storage = new Map<string, string>();
	private readonly _onDidChangeSecretEmitter = new Emitter<string>();
	readonly onDidChangeSecret = this._onDidChangeSecretEmitter.event;

	type = 'in-memory' as const;

	async get(key: string): Promise<string | undefined> {
		return this._storage.get(key);
	}

	async set(key: string, value: string): Promise<void> {
		this._storage.set(key, value);
		this._onDidChangeSecretEmitter.fire(key);
	}

	async delete(key: string): Promise<void> {
		this._storage.delete(key);
		this._onDidChangeSecretEmitter.fire(key);
	}

	async keys(): Promise<string[]> {
		return Array.from(this._storage.keys());
	}

	// Helper method for tests to clear all secrets
	clear(): void {
		this._storage.clear();
	}

	dispose(): void {
		this._onDidChangeSecretEmitter.dispose();
		this._storage.clear();
	}
}
