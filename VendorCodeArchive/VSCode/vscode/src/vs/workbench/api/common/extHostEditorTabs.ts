//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { diffSets } from '../../../base/common/collections.js';
import { Emitter } from '../../../base/common/event.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IEditorTabDto, IEditorTabGroupDto, IExtHostEditorTabsShape, MainContext, MainThreadEditorTabsShape, TabInputKind, TabModelOperationKind, TabOperation } from './extHost.protocol.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import * as typeConverters from './extHostTypeConverters.js';
import { ChatEditorTabInput, CustomEditorTabInput, InteractiveWindowInput, NotebookDiffEditorTabInput, NotebookEditorTabInput, TerminalEditorTabInput, TextDiffTabInput, TextMergeTabInput, TextTabInput, WebviewEditorTabInput, TextMultiDiffTabInput } from './extHostTypes.js';
import type * as vscode from 'vscode';

export interface IExtHostEditorTabs extends IExtHostEditorTabsShape {
	readonly _serviceBrand: undefined;
	tabGroups: vscode.TabGroups;
}

export const IExtHostEditorTabs = createDecorator<IExtHostEditorTabs>('IExtHostEditorTabs');

type AnyTabInput = TextTabInput | TextDiffTabInput | TextMultiDiffTabInput | CustomEditorTabInput | NotebookEditorTabInput | NotebookDiffEditorTabInput | WebviewEditorTabInput | TerminalEditorTabInput | InteractiveWindowInput | ChatEditorTabInput;

class ExtHostEditorTab {
	private _apiObject: vscode.Tab | undefined;
	private _dto!: IEditorTabDto;
	private _input: AnyTabInput | undefined;
	private _parentGroup: ExtHostEditorTabGroup;
	private readonly _activeTabIdGetter: () => string;

	constructor(dto: IEditorTabDto, parentGroup: ExtHostEditorTabGroup, activeTabIdGetter: () => string) {
		this._activeTabIdGetter = activeTabIdGetter;
		this._parentGroup = parentGroup;
		this.acceptDtoUpdate(dto);
	}

	get apiObject(): vscode.Tab {
		if (!this._apiObject) {
			// Don't want to lose reference to parent `this` in the getters
			const that = this;
			const obj: vscode.Tab = {
				get isActive() {
					// We use a getter function here to always ensure at most 1 active tab per group and prevent iteration for being required
					return that._dto.id === that._activeTabIdGetter();
				},
				get label() {
					return that._dto.label;
				},
				get input() {
					return that._input;
				},
				get isDirty() {
					return that._dto.isDirty;
				},
				get isPinned() {
					return that._dto.isPinned;
				},
				get isPreview() {
					return that._dto.isPreview;
				},
				get group() {
					return that._parentGroup.apiObject;
				}
			};
			this._apiObject = Object.freeze<vscode.Tab>(obj);
		}
		return this._apiObject;
	}

	get tabId(): string {
		return this._dto.id;
	}

	acceptDtoUpdate(dto: IEditorTabDto) {
		this._dto = dto;
		this._input = this._initInput();
	}

	private _initInput() {
		switch (this._dto.input.kind) {
			case TabInputKind.TextInput:
				return new TextTabInput(URI.revive(this._dto.input.uri));
			case TabInputKind.TextDiffInput:
				return new TextDiffTabInput(URI.revive(this._dto.input.original), URI.revive(this._dto.input.modified));
			case TabInputKind.TextMergeInput:
				return new TextMergeTabInput(URI.revive(this._dto.input.base), URI.revive(this._dto.input.input1), URI.revive(this._dto.input.input2), URI.revive(this._dto.input.result));
			case TabInputKind.CustomEditorInput:
				return new CustomEditorTabInput(URI.revive(this._dto.input.uri), this._dto.input.viewType);
			case TabInputKind.WebviewEditorInput:
				return new WebviewEditorTabInput(this._dto.input.viewType);
			case TabInputKind.NotebookInput:
				return new NotebookEditorTabInput(URI.revive(this._dto.input.uri), this._dto.input.notebookType);
			case TabInputKind.NotebookDiffInput:
				return new NotebookDiffEditorTabInput(URI.revive(this._dto.input.original), URI.revive(this._dto.input.modified), this._dto.input.notebookType);
			case TabInputKind.TerminalEditorInput:
				return new TerminalEditorTabInput();
			case TabInputKind.InteractiveEditorInput:
				return new InteractiveWindowInput(URI.revive(this._dto.input.uri), URI.revive(this._dto.input.inputBoxUri));
			case TabInputKind.ChatEditorInput:
				return new ChatEditorTabInput();
			case TabInputKind.MultiDiffEditorInput:
				return new TextMultiDiffTabInput(this._dto.input.diffEditors.map(diff => new TextDiffTabInput(URI.revive(diff.original), URI.revive(diff.modified))));
			default:
				return undefined;
		}
	}
}

class ExtHostEditorTabGroup {

	private _apiObject: vscode.TabGroup | undefined;
	private _dto: IEditorTabGroupDto;
	private _tabs: ExtHostEditorTab[] = [];
	private _activeTabId: string = '';
	private _activeGroupIdGetter: () => number | undefined;

	constructor(dto: IEditorTabGroupDto, activeGroupIdGetter: () => number | undefined) {
		this._dto = dto;
		this._activeGroupIdGetter = activeGroupIdGetter;
		// Construct all tabs from the given dto
		for (const tabDto of dto.tabs) {
			if (tabDto.isActive) {
				this._activeTabId = tabDto.id;
			}
			this._tabs.push(new ExtHostEditorTab(tabDto, this, () => this.activeTabId()));
		}
	}

	get apiObject(): vscode.TabGroup {
		if (!this._apiObject) {
			// Don't want to lose reference to parent `this` in the getters
			const that = this;
			const obj: vscode.TabGroup = {
				get isActive() {
					// We use a getter function here to always ensure at most 1 active group and prevent iteration for being required
					return that._dto.groupId === that._activeGroupIdGetter();
				},
				get viewColumn() {
					return typeConverters.ViewColumn.to(that._dto.viewColumn);
				},
				get activeTab() {
					return that._tabs.find(tab => tab.tabId === that._activeTabId)?.apiObject;
				},
				get tabs() {
					return Object.freeze(that._tabs.map(tab => tab.apiObject));
				}
			};
			this._apiObject = Object.freeze<vscode.TabGroup>(obj);
		}
		return this._apiObject;
	}

	get groupId(): number {
		return this._dto.groupId;
	}

	get tabs(): ExtHostEditorTab[] {
		return this._tabs;
	}

	acceptGroupDtoUpdate(dto: IEditorTabGroupDto) {
		this._dto = dto;
	}

	acceptTabOperation(operation: TabOperation): ExtHostEditorTab {
		// In the open case we add the tab to the group
		if (operation.kind === TabModelOperationKind.TAB_OPEN) {
			const tab = new ExtHostEditorTab(operation.tabDto, this, () => this.activeTabId());
			// Insert tab at editor index
			this._tabs.splice(operation.index, 0, tab);
			if (operation.tabDto.isActive) {
				this._activeTabId = tab.tabId;
			}
			return tab;
		} else if (operation.kind === TabModelOperationKind.TAB_CLOSE) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 180: Error message without production error code - breaks React bundle size optimization
//   2. Line 180: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
//   5. Line 193: Error message without production error code - breaks React bundle size optimization
//   6. Line 193: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			const tab = this._tabs.splice(operation.index, 1)[0];
			if (!tab) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 196: Error message without production error code - breaks React bundle size optimization
//   2. Line 196: Error message without production error code - breaks React bundle size optimization
//   3. Line 204: Error message without production error code - breaks React bundle size optimization
//   4. Line 204: Error message without production error code - breaks React bundle size optimization
//   5. Line 209: Error message without production error code - breaks React bundle size optimization
//   6. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 210: Error message without production error code - breaks React bundle size optimization
//   2. Line 210: Error message without production error code - breaks React bundle size optimization
//   3. Line 218: Error message without production error code - breaks React bundle size optimization
//   4. Line 218: Error message without production error code - breaks React bundle size optimization
//   5. Line 223: Error message without production error code - breaks React bundle size optimization
//   6. Line 223: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 224: Error message without production error code - breaks React bundle size optimization
//   2. Line 224: Error message without production error code - breaks React bundle size optimization
//   3. Line 232: Error message without production error code - breaks React bundle size optimization
//   4. Line 232: Error message without production error code - breaks React bundle size optimization
//   5. Line 237: Error message without production error code - breaks React bundle size optimization
//   6. Line 237: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 238: Error message without production error code - breaks React bundle size optimization
//   2. Line 238: Error message without production error code - breaks React bundle size optimization
//   3. Line 246: Error message without production error code - breaks React bundle size optimization
//   4. Line 246: Error message without production error code - breaks React bundle size optimization
//   5. Line 251: Error message without production error code - breaks React bundle size optimization
//   6. Line 251: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 252: Error message without production error code - breaks React bundle size optimization
//   2. Line 252: Error message without production error code - breaks React bundle size optimization
//   3. Line 260: Error message without production error code - breaks React bundle size optimization
//   4. Line 260: Error message without production error code - breaks React bundle size optimization
//   5. Line 265: Error message without production error code - breaks React bundle size optimization
//   6. Line 265: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 266: Error message without production error code - breaks React bundle size optimization
//   2. Line 266: Error message without production error code - breaks React bundle size optimization
//   3. Line 274: Error message without production error code - breaks React bundle size optimization
//   4. Line 274: Error message without production error code - breaks React bundle size optimization
//   5. Line 279: Error message without production error code - breaks React bundle size optimization
//   6. Line 279: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 280: Error message without production error code - breaks React bundle size optimization
//   2. Line 280: Error message without production error code - breaks React bundle size optimization
//   3. Line 288: Error message without production error code - breaks React bundle size optimization
//   4. Line 288: Error message without production error code - breaks React bundle size optimization
//   5. Line 293: Error message without production error code - breaks React bundle size optimization
//   6. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 294: Error message without production error code - breaks React bundle size optimization
//   2. Line 294: Error message without production error code - breaks React bundle size optimization
//   3. Line 302: Error message without production error code - breaks React bundle size optimization
//   4. Line 302: Error message without production error code - breaks React bundle size optimization
//   5. Line 307: Error message without production error code - breaks React bundle size optimization
//   6. Line 307: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 308: Error message without production error code - breaks React bundle size optimization
//   2. Line 308: Error message without production error code - breaks React bundle size optimization
//   3. Line 316: Error message without production error code - breaks React bundle size optimization
//   4. Line 316: Error message without production error code - breaks React bundle size optimization
//   5. Line 321: Error message without production error code - breaks React bundle size optimization
//   6. Line 321: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 322: Error message without production error code - breaks React bundle size optimization
//   2. Line 322: Error message without production error code - breaks React bundle size optimization
//   3. Line 330: Error message without production error code - breaks React bundle size optimization
//   4. Line 330: Error message without production error code - breaks React bundle size optimization
//   5. Line 335: Error message without production error code - breaks React bundle size optimization
//   6. Line 335: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 336: Error message without production error code - breaks React bundle size optimization
//   2. Line 336: Error message without production error code - breaks React bundle size optimization
//   3. Line 344: Error message without production error code - breaks React bundle size optimization
//   4. Line 344: Error message without production error code - breaks React bundle size optimization
//   5. Line 349: Error message without production error code - breaks React bundle size optimization
//   6. Line 349: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 350: Error message without production error code - breaks React bundle size optimization
//   2. Line 350: Error message without production error code - breaks React bundle size optimization
//   3. Line 358: Error message without production error code - breaks React bundle size optimization
//   4. Line 358: Error message without production error code - breaks React bundle size optimization
//   5. Line 363: Error message without production error code - breaks React bundle size optimization
//   6. Line 363: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 364: Error message without production error code - breaks React bundle size optimization
//   2. Line 364: Error message without production error code - breaks React bundle size optimization
//   3. Line 372: Error message without production error code - breaks React bundle size optimization
//   4. Line 372: Error message without production error code - breaks React bundle size optimization
//   5. Line 377: Error message without production error code - breaks React bundle size optimization
//   6. Line 377: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 378: Error message without production error code - breaks React bundle size optimization
//   2. Line 378: Error message without production error code - breaks React bundle size optimization
//   3. Line 386: Error message without production error code - breaks React bundle size optimization
//   4. Line 386: Error message without production error code - breaks React bundle size optimization
//   5. Line 391: Error message without production error code - breaks React bundle size optimization
//   6. Line 391: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 392: Error message without production error code - breaks React bundle size optimization
//   2. Line 392: Error message without production error code - breaks React bundle size optimization
//   3. Line 400: Error message without production error code - breaks React bundle size optimization
//   4. Line 400: Error message without production error code - breaks React bundle size optimization
//   5. Line 405: Error message without production error code - breaks React bundle size optimization
//   6. Line 405: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 406: Error message without production error code - breaks React bundle size optimization
//   2. Line 406: Error message without production error code - breaks React bundle size optimization
//   3. Line 414: Error message without production error code - breaks React bundle size optimization
//   4. Line 414: Error message without production error code - breaks React bundle size optimization
//   5. Line 419: Error message without production error code - breaks React bundle size optimization
//   6. Line 419: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error(`Tab close updated received for index ${operation.index} which does not exist`);
			}
			if (tab.tabId === this._activeTabId) {
				this._activeTabId = '';
			}
			return tab;
		} else if (operation.kind === TabModelOperationKind.TAB_MOVE) {
			if (operation.oldIndex === undefined) {
				throw new Error('Invalid old index on move IPC');
			}
			// Splice to remove at old index and insert at new index === moving the tab
			const tab = this._tabs.splice(operation.oldIndex, 1)[0];
			if (!tab) {
				throw new Error(`Tab move updated received for index ${operation.oldIndex} which does not exist`);
			}
			this._tabs.splice(operation.index, 0, tab);
			return tab;
		}
		const tab = this._tabs.find(extHostTab => extHostTab.tabId === operation.tabDto.id);
		if (!tab) {
			throw new Error('INVALID tab');
		}
		if (operation.tabDto.isActive) {
			this._activeTabId = operation.tabDto.id;
		} else if (this._activeTabId === operation.tabDto.id && !operation.tabDto.isActive) {
			// Events aren't guaranteed to be in order so if we receive a dto that matches the active tab id
			// but isn't active we mark the active tab id as empty. This prevent onDidActiveTabChange from
			// firing incorrectly
			this._activeTabId = '';
		}
		tab.acceptDtoUpdate(operation.tabDto);
		return tab;
	}

	// Not a getter since it must be a function to be used as a callback for the tabs
	activeTabId(): string {
		return this._activeTabId;
	}
}

export class ExtHostEditorTabs implements IExtHostEditorTabs {
	readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadEditorTabsShape;
	private readonly _onDidChangeTabs = new Emitter<vscode.TabChangeEvent>();
	private readonly _onDidChangeTabGroups = new Emitter<vscode.TabGroupChangeEvent>();

	// Have to use ! because this gets initialized via an RPC proxy
	private _activeGroupId!: number;

	private _extHostTabGroups: ExtHostEditorTabGroup[] = [];

	private _apiObject: vscode.TabGroups | undefined;

	constructor(@IExtHostRpcService extHostRpc: IExtHostRpcService) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadEditorTabs);
	}

	get tabGroups(): vscode.TabGroups {
		if (!this._apiObject) {
			const that = this;
			const obj: vscode.TabGroups = {
				// never changes -> simple value
				onDidChangeTabGroups: that._onDidChangeTabGroups.event,
				onDidChangeTabs: that._onDidChangeTabs.event,
				// dynamic -> getters
				get all() {
					return Object.freeze(that._extHostTabGroups.map(group => group.apiObject));
				},
				get activeTabGroup() {
					const activeTabGroupId = that._activeGroupId;
					const activeTabGroup = assertReturnsDefined(that._extHostTabGroups.find(candidate => candidate.groupId === activeTabGroupId)?.apiObject);
					return activeTabGroup;
				},
				close: async (tabOrTabGroup: vscode.Tab | readonly vscode.Tab[] | vscode.TabGroup | readonly vscode.TabGroup[], preserveFocus?: boolean) => {
					const tabsOrTabGroups = Array.isArray(tabOrTabGroup) ? tabOrTabGroup : [tabOrTabGroup];
					if (!tabsOrTabGroups.length) {
						return true;
					}
					// Check which type was passed in and call the appropriate close
					// Casting is needed as typescript doesn't seem to infer enough from this
					if (isTabGroup(tabsOrTabGroups[0])) {
						return this._closeGroups(tabsOrTabGroups as vscode.TabGroup[], preserveFocus);
					} else {
						return this._closeTabs(tabsOrTabGroups as vscode.Tab[], preserveFocus);
					}
				},
				// move: async (tab: vscode.Tab, viewColumn: ViewColumn, index: number, preserveFocus?: boolean) => {
				// 	const extHostTab = this._findExtHostTabFromApi(tab);
				// 	if (!extHostTab) {
				// 		throw new Error('Invalid tab');
				// 	}
				// 	this._proxy.$moveTab(extHostTab.tabId, index, typeConverters.ViewColumn.from(viewColumn), preserveFocus);
				// 	return;
				// }
			};
			this._apiObject = Object.freeze(obj);
		}
		return this._apiObject;
	}

	$acceptEditorTabModel(tabGroups: IEditorTabGroupDto[]): void {

		const groupIdsBefore = new Set(this._extHostTabGroups.map(group => group.groupId));
		const groupIdsAfter = new Set(tabGroups.map(dto => dto.groupId));
		const diff = diffSets(groupIdsBefore, groupIdsAfter);

		const closed: vscode.TabGroup[] = this._extHostTabGroups.filter(group => diff.removed.includes(group.groupId)).map(group => group.apiObject);
		const opened: vscode.TabGroup[] = [];
		const changed: vscode.TabGroup[] = [];


		this._extHostTabGroups = tabGroups.map(tabGroup => {
			const group = new ExtHostEditorTabGroup(tabGroup, () => this._activeGroupId);
			if (diff.added.includes(group.groupId)) {
				opened.push(group.apiObject);
			} else {
				changed.push(group.apiObject);
			}
			return group;
		});

		// Set the active tab group id
		const activeTabGroupId = assertReturnsDefined(tabGroups.find(group => group.isActive === true)?.groupId);
		if (activeTabGroupId !== undefined && this._activeGroupId !== activeTabGroupId) {
			this._activeGroupId = activeTabGroupId;
		}
		this._onDidChangeTabGroups.fire(Object.freeze({ opened, closed, changed }));
	}

	$acceptTabGroupUpdate(groupDto: IEditorTabGroupDto) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 313: Error message without production error code - breaks React bundle size optimization
//   2. Line 313: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const group = this._extHostTabGroups.find(group => group.groupId === groupDto.groupId);
		if (!group) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 339: Error message without production error code - breaks React bundle size optimization
//   2. Line 339: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Update Group IPC call received before group creation.');
		}
		group.acceptGroupDtoUpdate(groupDto);
		if (groupDto.isActive) {
			this._activeGroupId = groupDto.groupId;
		}
		this._onDidChangeTabGroups.fire(Object.freeze({ changed: [group.apiObject], opened: [], closed: [] }));
	}

	$acceptTabOperation(operation: TabOperation) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 325: Error message without production error code - breaks React bundle size optimization
//   2. Line 325: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const group = this._extHostTabGroups.find(group => group.groupId === operation.groupId);
		if (!group) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 361: Error message without production error code - breaks React bundle size optimization
//   2. Line 361: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Update Tabs IPC call received before group creation.');
		}
		const tab = group.acceptTabOperation(operation);

		// Construct the tab change event based on the operation
		switch (operation.kind) {
			case TabModelOperationKind.TAB_OPEN:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [tab.apiObject],
					closed: [],
					changed: []
				}));
				return;
			case TabModelOperationKind.TAB_CLOSE:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [],
					closed: [tab.apiObject],
					changed: []
				}));
				return;
			case TabModelOperationKind.TAB_MOVE:
			case TabModelOperationKind.TAB_UPDATE:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [],
					closed: [],
					changed: [tab.apiObject]
				}));
				return;
		}
	}

	private _findExtHostTabFromApi(apiTab: vscode.Tab): ExtHostEditorTab | undefined {
		for (const group of this._extHostTabGroups) {
			for (const tab of group.tabs) {
				if (tab.apiObject === apiTab) {
					return tab;
				}
			}
		}
		return;
	}

	private _findExtHostTabGroupFromApi(apiTabGroup: vscode.TabGroup): ExtHostEditorTabGroup | undefined {
		return this._extHostTabGroups.find(candidate => candidate.apiObject === apiTabGroup);
	}

	private async _closeTabs(tabs: vscode.Tab[], preserveFocus?: boolean): Promise<boolean> {
		const extHostTabIds: string[] = [];
		for (const tab of tabs) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 376: Error message without production error code - breaks React bundle size optimization
//   2. Line 376: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			const extHostTab = this._findExtHostTabFromApi(tab);
			if (!extHostTab) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 422: Error message without production error code - breaks React bundle size optimization
//   2. Line 422: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Tab close: Invalid tab not found!');
			}
			extHostTabIds.push(extHostTab.tabId);
		}
		return this._proxy.$closeTab(extHostTabIds, preserveFocus);
	}

	private async _closeGroups(groups: vscode.TabGroup[], preserverFoucs?: boolean): Promise<boolean> {
		const extHostGroupIds: number[] = [];
		for (const group of groups) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 388: Error message without production error code - breaks React bundle size optimization
//   2. Line 388: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			const extHostGroup = this._findExtHostTabGroupFromApi(group);
			if (!extHostGroup) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 444: Error message without production error code - breaks React bundle size optimization
//   2. Line 444: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('Group close: Invalid group not found!');
			}
			extHostGroupIds.push(extHostGroup.groupId);
		}
		return this._proxy.$closeGroup(extHostGroupIds, preserverFoucs);
	}
}

//#region Utils
function isTabGroup(obj: unknown): obj is vscode.TabGroup {
	const tabGroup = obj as vscode.TabGroup;
	if (tabGroup.tabs !== undefined) {
		return true;
	}
	return false;
}
//#endregion
