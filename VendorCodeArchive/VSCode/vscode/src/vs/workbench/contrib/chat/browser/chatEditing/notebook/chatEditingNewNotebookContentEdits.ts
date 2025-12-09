//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { TextEdit } from '../../../../../../editor/common/languages.js';
import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, ICellEditOperation } from '../../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../../notebook/common/notebookService.js';


/**
 * When asking LLM to generate a new notebook, LLM might end up generating the notebook
 * using the raw file format.
 * E.g. assume we ask LLM to generate a new Github Issues notebook, LLM might end up
 * genrating the notebook using the JSON format of github issues file.
 * Such a format is not known to copilot extension and those are sent over as regular
 * text edits for the Notebook URI.
 *
 * In such cases we should accumulate all of the edits, generate the content and deserialize the content
 * into a notebook, then generate notebooke edits to insert these cells.
 */
export class ChatEditingNewNotebookContentEdits {
	private readonly textEdits: TextEdit[] = [];
	constructor(
		private readonly notebook: NotebookTextModel,
		@INotebookService private readonly _notebookService: INotebookService,
	) {
	}

	acceptTextEdits(edits: TextEdit[]): void {
		if (edits.length) {
			this.textEdits.push(...edits);
		}
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 40: Error message without production error code - breaks React bundle size optimization
//   2. Line 40: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	async generateEdits(): Promise<ICellEditOperation[]> {
		if (this.notebook.cells.length) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 52: Error message without production error code - breaks React bundle size optimization
//   2. Line 52: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			console.error(`Notebook edits not generated as notebook already has cells`);
			return [];
		}
		const content = this.generateContent();
		if (!content) {
			return [];
		}

		const notebookEdits: ICellEditOperation[] = [];
		try {
			const { serializer } = await this._notebookService.withNotebookDataProvider(this.notebook.viewType);
			const data = await serializer.dataToNotebook(VSBuffer.fromString(content));
			for (let i = 0; i < data.cells.length; i++) {
				notebookEdits.push({
					editType: CellEditType.Replace,
					index: i,
					count: 0,
					cells: [data.cells[i]]
				});
			}
		} catch (ex) {
			console.error(`Failed to generate notebook edits from text edits ${content}`, ex);
			return [];
		}

		return notebookEdits;
	}

	private generateContent() {
		try {
			return applyTextEdits(this.textEdits);
		} catch (ex) {
			console.error('Failed to generate content from text edits', ex);
			return '';
		}
	}
}

function applyTextEdits(edits: TextEdit[]): string {
	let output = '';
	for (const edit of edits) {
		output = output.slice(0, edit.range.startColumn)
			+ edit.text
			+ output.slice(edit.range.endColumn);
	}
	return output;
}
