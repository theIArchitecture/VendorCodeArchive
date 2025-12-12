/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface ISearchHistoryService {
	readonly _serviceBrand: undefined;
	onDidClearHistory: Event<void>;
	clearHistory(): void;
	load(): ISearchHistoryValues;
	save(history: ISearchHistoryValues): void;
}

export const ISearchHistoryService = createDecorator<ISearchHistoryService>('searchHistoryService');

export interface ISearchHistoryValues {
	search?: string[];
	replace?: string[];
	include?: string[];
	exclude?: string[];
}

export class SearchHistoryService implements ISearchHistoryService {
	declare readonly _serviceBrand: undefined;

	public static readonly SEARCH_HISTORY_KEY = 'workbench.search.history';

	private readonly _onDidClearHistory = new Emitter<void>();
	readonly onDidClearHistory: Event<void> = this._onDidClearHistory.event;

	constructor(
		@IStorageService private readonly storageService: IStorageService
	) { }

	clearHistory(): void {
		this.storageService.remove(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);
		this._onDidClearHistory.fire();
	}

	load(): ISearchHistoryValues {
		let result: ISearchHistoryValues | undefined;
		const raw = this.storageService.get(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);

		if (raw) {
			try {
				result = JSON.parse(raw);
			} catch (e) {
				// Invalid data
			}
		}

		return result || {};
	}

	save(history: ISearchHistoryValues): void {
		if (isEmptyObject(history)) {
			this.storageService.remove(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);
		} else {
			this.storageService.store(SearchHistoryService.SEARCH_HISTORY_KEY, JSON.stringify(history), StorageScope.WORKSPACE, StorageTarget.USER);
		}
	}
}
