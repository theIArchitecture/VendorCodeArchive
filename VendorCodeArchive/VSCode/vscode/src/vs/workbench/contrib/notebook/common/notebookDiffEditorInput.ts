//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IResourceDiffEditorInput, IResourceSideBySideEditorInput, isResourceDiffEditorInput, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookDiffEditorModel, IResolvedNotebookEditorModel } from './notebookCommon.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { NotebookEditorInput } from './notebookEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

class NotebookDiffEditorModel extends EditorModel implements INotebookDiffEditorModel {
	constructor(
		readonly original: IResolvedNotebookEditorModel,
		readonly modified: IResolvedNotebookEditorModel,
	) {
		super();
	}
}

export class NotebookDiffEditorInput extends DiffEditorInput {
	static create(instantiationService: IInstantiationService, resource: URI, name: string | undefined, description: string | undefined, originalResource: URI, viewType: string) {
		const original = NotebookEditorInput.getOrCreate(instantiationService, originalResource, undefined, viewType);
		const modified = NotebookEditorInput.getOrCreate(instantiationService, resource, undefined, viewType);
		return instantiationService.createInstance(NotebookDiffEditorInput, name, description, original, modified, viewType);
	}

	static override readonly ID: string = 'workbench.input.diffNotebookInput';

	private _modifiedTextModel: IResolvedNotebookEditorModel | null = null;
	private _originalTextModel: IResolvedNotebookEditorModel | null = null;

	override get resource() {
		return this.modified.resource;
	}

	override get editorId() {
		return this.viewType;
	}

	private _cachedModel: NotebookDiffEditorModel | undefined = undefined;

	constructor(
		name: string | undefined,
		description: string | undefined,
		override readonly original: NotebookEditorInput,
		override readonly modified: NotebookEditorInput,
		public readonly viewType: string,
		@IEditorService editorService: IEditorService
	) {
		super(
			name,
			description,
			original,
			modified,
			undefined,
			editorService
		);
	}

	override get typeId(): string {
		return NotebookDiffEditorInput.ID;
	}

	override async resolve(): Promise<NotebookDiffEditorModel> {
		const [originalEditorModel, modifiedEditorModel] = await Promise.all([
			this.original.resolve(),
			this.modified.resolve(),
		]);

		this._cachedModel?.dispose();

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 79: Error message without production error code - breaks React bundle size optimization
//   2. Line 79: Error message without production error code - breaks React bundle size optimization
//   3. Line 83: Error message without production error code - breaks React bundle size optimization
//   4. Line 83: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		// TODO@rebornix check how we restore the editor in text diff editor
		if (!modifiedEditorModel) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
//   3. Line 97: Error message without production error code - breaks React bundle size optimization
//   4. Line 97: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 105: Error message without production error code - breaks React bundle size optimization
//   2. Line 105: Error message without production error code - breaks React bundle size optimization
//   3. Line 109: Error message without production error code - breaks React bundle size optimization
//   4. Line 109: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 117: Error message without production error code - breaks React bundle size optimization
//   2. Line 117: Error message without production error code - breaks React bundle size optimization
//   3. Line 121: Error message without production error code - breaks React bundle size optimization
//   4. Line 121: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 129: Error message without production error code - breaks React bundle size optimization
//   2. Line 129: Error message without production error code - breaks React bundle size optimization
//   3. Line 133: Error message without production error code - breaks React bundle size optimization
//   4. Line 133: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 145: Error message without production error code - breaks React bundle size optimization
//   4. Line 145: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Fail to resolve modified editor model for resource ${this.modified.resource} with notebookType ${this.viewType}`);
		}

		if (!originalEditorModel) {
			throw new Error(`Fail to resolve original editor model for resource ${this.original.resource} with notebookType ${this.viewType}`);
		}

		this._originalTextModel = originalEditorModel;
		this._modifiedTextModel = modifiedEditorModel;
		this._cachedModel = new NotebookDiffEditorModel(this._originalTextModel, this._modifiedTextModel);
		return this._cachedModel;
	}

	override toUntyped(): IResourceDiffEditorInput & IResourceSideBySideEditorInput {
		const original = { resource: this.original.resource };
		const modified = { resource: this.resource };
		return {
			original,
			modified,
			primary: modified,
			secondary: original,
			options: {
				override: this.viewType
			}
		};
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof NotebookDiffEditorInput) {
			return this.modified.matches(otherInput.modified)
				&& this.original.matches(otherInput.original)
				&& this.viewType === otherInput.viewType;
		}

		if (isResourceDiffEditorInput(otherInput)) {
			return this.modified.matches(otherInput.modified)
				&& this.original.matches(otherInput.original)
				&& this.editorId !== undefined
				&& (this.editorId === otherInput.options?.override || otherInput.options?.override === undefined);
		}

		return false;
	}

	override dispose() {
		super.dispose();
		this._cachedModel?.dispose();
		this._cachedModel = undefined;
		this.original.dispose();
		this.modified.dispose();
		this._originalTextModel = null;
		this._modifiedTextModel = null;
	}
}
