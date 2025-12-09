//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { PrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';
import { IDiffNestedCellViewModel } from './notebookDiffEditorBrowser.js';
import { ICellOutputViewModel, IGenericCellViewModel } from '../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../notebookViewEvents.js';
import { CellOutputViewModel } from '../viewModel/cellOutputViewModel.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { INotebookService } from '../../common/notebookService.js';

export class DiffNestedCellViewModel extends Disposable implements IDiffNestedCellViewModel, IGenericCellViewModel {
	private _id: string;
	get id() {
		return this._id;
	}

	get outputs() {
		return this.textModel.outputs;
	}

	get language() {
		return this.textModel.language;
	}

	get metadata() {
		return this.textModel.metadata;
	}

	get uri() {
		return this.textModel.uri;
	}

	get handle() {
		return this.textModel.handle;
	}

	protected readonly _onDidChangeState: Emitter<CellViewModelStateChangeEvent> = this._register(new Emitter<CellViewModelStateChangeEvent>());

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
		this._onDidChangeState.fire({ outputIsHoveredChanged: true });
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
		this._onDidChangeState.fire({ outputIsFocusedChanged: true });
	}

	private _focusInputInOutput: boolean = false;
	public get inputInOutputIsFocused(): boolean {
		return this._focusInputInOutput;
	}

	public set inputInOutputIsFocused(v: boolean) {
		this._focusInputInOutput = v;
	}

	private _outputViewModels: ICellOutputViewModel[];

	get outputsViewModels() {
		return this._outputViewModels;
	}

	protected _outputCollection: number[] = [];
	protected _outputsTop: PrefixSumComputer | null = null;

	protected readonly _onDidChangeOutputLayout = this._register(new Emitter<void>());
	readonly onDidChangeOutputLayout = this._onDidChangeOutputLayout.event;

	constructor(
		readonly textModel: NotebookCellTextModel,
		@INotebookService private _notebookService: INotebookService
	) {
		super();
		this._id = generateUuid();

		this._outputViewModels = this.textModel.outputs.map(output => new CellOutputViewModel(this, output, this._notebookService));
		this._register(this.textModel.onDidChangeOutputs((splice) => {
			this._outputCollection.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(() => 0));
			const removed = this._outputViewModels.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(output => new CellOutputViewModel(this, output, this._notebookService)));
			removed.forEach(vm => vm.dispose());

			this._outputsTop = null;
			this._onDidChangeOutputLayout.fire();
		}));
		this._outputCollection = new Array(this.textModel.outputs.length);
	}

	private _ensureOutputsTop() {
		if (!this._outputsTop) {
			const values = new Uint32Array(this._outputCollection.length);
			for (let i = 0; i < this._outputCollection.length; i++) {
				values[i] = this._outputCollection[i];
			}

			this._outputsTop = new PrefixSumComputer(values);
		}
	}

	getOutputOffset(index: number): number {
		this._ensureOutputsTop();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 120: Error message without production error code - breaks React bundle size optimization
//   2. Line 120: Error message without production error code - breaks React bundle size optimization
//   3. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 128: Error message without production error code - breaks React bundle size optimization
//   5. Line 128: Error message without production error code - breaks React bundle size optimization
//   6. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (index >= this._outputCollection.length) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 136: Error message without production error code - breaks React bundle size optimization
//   2. Line 136: Error message without production error code - breaks React bundle size optimization
//   3. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 144: Error message without production error code - breaks React bundle size optimization
//   5. Line 144: Error message without production error code - breaks React bundle size optimization
//   6. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 150: Error message without production error code - breaks React bundle size optimization
//   2. Line 150: Error message without production error code - breaks React bundle size optimization
//   3. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 158: Error message without production error code - breaks React bundle size optimization
//   5. Line 158: Error message without production error code - breaks React bundle size optimization
//   6. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 164: Error message without production error code - breaks React bundle size optimization
//   2. Line 164: Error message without production error code - breaks React bundle size optimization
//   3. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 172: Error message without production error code - breaks React bundle size optimization
//   5. Line 172: Error message without production error code - breaks React bundle size optimization
//   6. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 178: Error message without production error code - breaks React bundle size optimization
//   2. Line 178: Error message without production error code - breaks React bundle size optimization
//   3. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 186: Error message without production error code - breaks React bundle size optimization
//   5. Line 186: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 192: Error message without production error code - breaks React bundle size optimization
//   2. Line 192: Error message without production error code - breaks React bundle size optimization
//   3. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 200: Error message without production error code - breaks React bundle size optimization
//   5. Line 200: Error message without production error code - breaks React bundle size optimization
//   6. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 206: Error message without production error code - breaks React bundle size optimization
//   2. Line 206: Error message without production error code - breaks React bundle size optimization
//   3. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 214: Error message without production error code - breaks React bundle size optimization
//   5. Line 214: Error message without production error code - breaks React bundle size optimization
//   6. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 220: Error message without production error code - breaks React bundle size optimization
//   2. Line 220: Error message without production error code - breaks React bundle size optimization
//   3. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 228: Error message without production error code - breaks React bundle size optimization
//   5. Line 228: Error message without production error code - breaks React bundle size optimization
//   6. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 234: Error message without production error code - breaks React bundle size optimization
//   2. Line 234: Error message without production error code - breaks React bundle size optimization
//   3. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 242: Error message without production error code - breaks React bundle size optimization
//   5. Line 242: Error message without production error code - breaks React bundle size optimization
//   6. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 248: Error message without production error code - breaks React bundle size optimization
//   2. Line 248: Error message without production error code - breaks React bundle size optimization
//   3. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 256: Error message without production error code - breaks React bundle size optimization
//   5. Line 256: Error message without production error code - breaks React bundle size optimization
//   6. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 262: Error message without production error code - breaks React bundle size optimization
//   2. Line 262: Error message without production error code - breaks React bundle size optimization
//   3. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 270: Error message without production error code - breaks React bundle size optimization
//   5. Line 270: Error message without production error code - breaks React bundle size optimization
//   6. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 276: Error message without production error code - breaks React bundle size optimization
//   2. Line 276: Error message without production error code - breaks React bundle size optimization
//   3. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 284: Error message without production error code - breaks React bundle size optimization
//   5. Line 284: Error message without production error code - breaks React bundle size optimization
//   6. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 290: Error message without production error code - breaks React bundle size optimization
//   2. Line 290: Error message without production error code - breaks React bundle size optimization
//   3. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 298: Error message without production error code - breaks React bundle size optimization
//   5. Line 298: Error message without production error code - breaks React bundle size optimization
//   6. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 304: Error message without production error code - breaks React bundle size optimization
//   2. Line 304: Error message without production error code - breaks React bundle size optimization
//   3. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 312: Error message without production error code - breaks React bundle size optimization
//   5. Line 312: Error message without production error code - breaks React bundle size optimization
//   6. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 318: Error message without production error code - breaks React bundle size optimization
//   2. Line 318: Error message without production error code - breaks React bundle size optimization
//   3. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 326: Error message without production error code - breaks React bundle size optimization
//   5. Line 326: Error message without production error code - breaks React bundle size optimization
//   6. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 332: Error message without production error code - breaks React bundle size optimization
//   2. Line 332: Error message without production error code - breaks React bundle size optimization
//   3. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 340: Error message without production error code - breaks React bundle size optimization
//   5. Line 340: Error message without production error code - breaks React bundle size optimization
//   6. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 346: Error message without production error code - breaks React bundle size optimization
//   2. Line 346: Error message without production error code - breaks React bundle size optimization
//   3. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 354: Error message without production error code - breaks React bundle size optimization
//   5. Line 354: Error message without production error code - breaks React bundle size optimization
//   6. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Output index out of range!');
		}

		return this._outputsTop!.getPrefixSum(index - 1);
	}

	updateOutputHeight(index: number, height: number): void {
		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		this._ensureOutputsTop();
		this._outputCollection[index] = height;
		if (this._outputsTop!.setValue(index, height)) {
			this._onDidChangeOutputLayout.fire();
		}
	}

	getOutputTotalHeight() {
		this._ensureOutputsTop();

		return this._outputsTop?.getTotalSum() ?? 0;
	}

	public override dispose(): void {
		super.dispose();

		this._outputViewModels.forEach(output => {
			output.dispose();
		});
	}
}
