//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICellViewModel } from '../../browser/notebookBrowser.js';
import { NotebookCellLayoutManager } from '../../browser/notebookCellLayoutManager.js';

suite('NotebookCellLayoutManager', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const mockCellViewModel = () => {
		return { handle: 'cell1' } as unknown as ICellViewModel;
	};

	class MockList {
		private _height = new Map();
		getViewIndex(cell: ICellViewModel) { return this.cells.indexOf(cell) < 0 ? undefined : this.cells.indexOf(cell); }
		elementHeight(cell: ICellViewModel) { return this._height.get(cell) ?? 100; }
		inRenderingTransaction = false;
		updateElementHeight2(cell: ICellViewModel, height: number) { this._height.set(cell, height); }
		getViewIndexCalled = false;
		cells: ICellViewModel[] = [];
	}
	class MockLoggingService { debug() { } }
	class MockNotebookWidget {
		viewModel = { hasCell: (cell: ICellViewModel) => true, getCellIndex: () => 0 };
		hasEditorFocus() { return true; }
		getAbsoluteTopOfElement() { return 0; }
		getLength() { return 1; }
		visibleRanges = [{ start: 0 }];
		getDomNode(): HTMLElement {
			return {
				style: {
					height: '100px'
				}
			} as HTMLElement;
		}
	}

	test('should update cell height', async () => {
		const cell = mockCellViewModel();
		const cell2 = mockCellViewModel();
		const list = new MockList();
		list.cells.push(cell);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		list.cells.push(cell2);
		const widget = new MockNotebookWidget();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const mgr = store.add(new NotebookCellLayoutManager(widget as any, list as any, new MockLoggingService() as any));
		mgr.layoutNotebookCell(cell, 200);
		mgr.layoutNotebookCell(cell2, 200);
		assert.strictEqual(list.elementHeight(cell), 200);
		assert.strictEqual(list.elementHeight(cell2), 200);
	});

	test('should schedule updates if already in a rendering transaction', async () => {
		const cell = mockCellViewModel();
		const cell2 = mockCellViewModel();
		const list = new MockList();
		list.inRenderingTransaction = true;
		list.cells.push(cell);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 65: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		list.cells.push(cell2);
		const widget = new MockNotebookWidget();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 89: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const mgr = store.add(new NotebookCellLayoutManager(widget as any, list as any, new MockLoggingService() as any));

		const promise = mgr.layoutNotebookCell(cell, 200);
		mgr.layoutNotebookCell(cell2, 200);
		assert.strictEqual(list.elementHeight(cell), 100);
		assert.strictEqual(list.elementHeight(cell2), 100);
		list.inRenderingTransaction = false;

		await promise;

		assert.strictEqual(list.elementHeight(cell), 200);
		assert.strictEqual(list.elementHeight(cell2), 200);
	});

	test('should not update if cell is hidden', async () => {
		const cell = mockCellViewModel();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 83: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const list = new MockList();
		const widget = new MockNotebookWidget();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const mgr = store.add(new NotebookCellLayoutManager(widget as any, list as any, new MockLoggingService() as any));
		await mgr.layoutNotebookCell(cell, 200);
		assert.strictEqual(list.elementHeight(cell), 100);
	});

	test('should not update if height is unchanged', async () => {
		const cell = mockCellViewModel();
		const list = new MockList();
		list.cells.push(cell);
		const widget = new MockNotebookWidget();
		const mgr = store.add(new NotebookCellLayoutManager(widget as any, list as any, new MockLoggingService() as any));
		await mgr.layoutNotebookCell(cell, 100);
		assert.strictEqual(list.elementHeight(cell), 100);
	});
});
