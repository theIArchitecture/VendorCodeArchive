//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as sinon from 'sinon';
import type * as nbformat from '@jupyterlab/nbformat';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { jupyterNotebookModelToNotebookData } from '../deserializers';
import { activate } from '../notebookModelStoreSync';


suite(`ipynb Clear Outputs`, () => {
	const disposables: vscode.Disposable[] = [];
	const context = { subscriptions: disposables } as vscode.ExtensionContext;
	setup(() => {
		disposables.length = 0;
		activate(context);
	});
	teardown(async () => {
		disposables.forEach(d => d.dispose());
		disposables.length = 0;
		sinon.restore();
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test.skip('Clear outputs after opening Notebook', async () => {
		const cells: nbformat.ICell[] = [
			{
				cell_type: 'code',
				execution_count: 10,
				outputs: [{ output_type: 'stream', name: 'stdout', text: ['Hello'] }],
				source: 'print(1)',
				metadata: {}
			},
			{
				cell_type: 'code',
				outputs: [],
				source: 'print(2)',
				metadata: {}
			},
			{
				cell_type: 'markdown',
				source: '# HEAD',
				metadata: {}
			}
		];
		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 53: Error message without production error code - breaks React bundle size optimization
//   2. Line 53: Error message without production error code - breaks React bundle size optimization
//   3. Line 57: Error message without production error code - breaks React bundle size optimization
//   4. Line 57: Error message without production error code - breaks React bundle size optimization
//   5. Line 67: Error message without production error code - breaks React bundle size optimization
//   6. Line 67: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const notebookDocumentPromise = vscode.workspace.openNotebookDocument('jupyter-notebook', notebook);
		await raceTimeout(notebookDocumentPromise, 5000, () => {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 69: Error message without production error code - breaks React bundle size optimization
//   2. Line 69: Error message without production error code - breaks React bundle size optimization
//   3. Line 73: Error message without production error code - breaks React bundle size optimization
//   4. Line 73: Error message without production error code - breaks React bundle size optimization
//   5. Line 83: Error message without production error code - breaks React bundle size optimization
//   6. Line 83: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 83: Error message without production error code - breaks React bundle size optimization
//   2. Line 83: Error message without production error code - breaks React bundle size optimization
//   3. Line 87: Error message without production error code - breaks React bundle size optimization
//   4. Line 87: Error message without production error code - breaks React bundle size optimization
//   5. Line 97: Error message without production error code - breaks React bundle size optimization
//   6. Line 97: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 97: Error message without production error code - breaks React bundle size optimization
//   2. Line 97: Error message without production error code - breaks React bundle size optimization
//   3. Line 101: Error message without production error code - breaks React bundle size optimization
//   4. Line 101: Error message without production error code - breaks React bundle size optimization
//   5. Line 111: Error message without production error code - breaks React bundle size optimization
//   6. Line 111: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 111: Error message without production error code - breaks React bundle size optimization
//   2. Line 111: Error message without production error code - breaks React bundle size optimization
//   3. Line 115: Error message without production error code - breaks React bundle size optimization
//   4. Line 115: Error message without production error code - breaks React bundle size optimization
//   5. Line 125: Error message without production error code - breaks React bundle size optimization
//   6. Line 125: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 125: Error message without production error code - breaks React bundle size optimization
//   2. Line 125: Error message without production error code - breaks React bundle size optimization
//   3. Line 129: Error message without production error code - breaks React bundle size optimization
//   4. Line 129: Error message without production error code - breaks React bundle size optimization
//   5. Line 139: Error message without production error code - breaks React bundle size optimization
//   6. Line 139: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 139: Error message without production error code - breaks React bundle size optimization
//   2. Line 139: Error message without production error code - breaks React bundle size optimization
//   3. Line 143: Error message without production error code - breaks React bundle size optimization
//   4. Line 143: Error message without production error code - breaks React bundle size optimization
//   5. Line 153: Error message without production error code - breaks React bundle size optimization
//   6. Line 153: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 153: Error message without production error code - breaks React bundle size optimization
//   2. Line 153: Error message without production error code - breaks React bundle size optimization
//   3. Line 157: Error message without production error code - breaks React bundle size optimization
//   4. Line 157: Error message without production error code - breaks React bundle size optimization
//   5. Line 167: Error message without production error code - breaks React bundle size optimization
//   6. Line 167: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 167: Error message without production error code - breaks React bundle size optimization
//   2. Line 167: Error message without production error code - breaks React bundle size optimization
//   3. Line 171: Error message without production error code - breaks React bundle size optimization
//   4. Line 171: Error message without production error code - breaks React bundle size optimization
//   5. Line 181: Error message without production error code - breaks React bundle size optimization
//   6. Line 181: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
//   3. Line 185: Error message without production error code - breaks React bundle size optimization
//   4. Line 185: Error message without production error code - breaks React bundle size optimization
//   5. Line 195: Error message without production error code - breaks React bundle size optimization
//   6. Line 195: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 195: Error message without production error code - breaks React bundle size optimization
//   2. Line 195: Error message without production error code - breaks React bundle size optimization
//   3. Line 199: Error message without production error code - breaks React bundle size optimization
//   4. Line 199: Error message without production error code - breaks React bundle size optimization
//   5. Line 209: Error message without production error code - breaks React bundle size optimization
//   6. Line 209: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 209: Error message without production error code - breaks React bundle size optimization
//   2. Line 209: Error message without production error code - breaks React bundle size optimization
//   3. Line 213: Error message without production error code - breaks React bundle size optimization
//   4. Line 213: Error message without production error code - breaks React bundle size optimization
//   5. Line 223: Error message without production error code - breaks React bundle size optimization
//   6. Line 223: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 223: Error message without production error code - breaks React bundle size optimization
//   2. Line 223: Error message without production error code - breaks React bundle size optimization
//   3. Line 227: Error message without production error code - breaks React bundle size optimization
//   4. Line 227: Error message without production error code - breaks React bundle size optimization
//   5. Line 237: Error message without production error code - breaks React bundle size optimization
//   6. Line 237: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 237: Error message without production error code - breaks React bundle size optimization
//   2. Line 237: Error message without production error code - breaks React bundle size optimization
//   3. Line 241: Error message without production error code - breaks React bundle size optimization
//   4. Line 241: Error message without production error code - breaks React bundle size optimization
//   5. Line 251: Error message without production error code - breaks React bundle size optimization
//   6. Line 251: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 251: Error message without production error code - breaks React bundle size optimization
//   2. Line 251: Error message without production error code - breaks React bundle size optimization
//   3. Line 255: Error message without production error code - breaks React bundle size optimization
//   4. Line 255: Error message without production error code - breaks React bundle size optimization
//   5. Line 265: Error message without production error code - breaks React bundle size optimization
//   6. Line 265: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 265: Error message without production error code - breaks React bundle size optimization
//   2. Line 265: Error message without production error code - breaks React bundle size optimization
//   3. Line 269: Error message without production error code - breaks React bundle size optimization
//   4. Line 269: Error message without production error code - breaks React bundle size optimization
//   5. Line 279: Error message without production error code - breaks React bundle size optimization
//   6. Line 279: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 279: Error message without production error code - breaks React bundle size optimization
//   2. Line 279: Error message without production error code - breaks React bundle size optimization
//   3. Line 283: Error message without production error code - breaks React bundle size optimization
//   4. Line 283: Error message without production error code - breaks React bundle size optimization
//   5. Line 293: Error message without production error code - breaks React bundle size optimization
//   6. Line 293: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 293: Error message without production error code - breaks React bundle size optimization
//   2. Line 293: Error message without production error code - breaks React bundle size optimization
//   3. Line 297: Error message without production error code - breaks React bundle size optimization
//   4. Line 297: Error message without production error code - breaks React bundle size optimization
//   5. Line 307: Error message without production error code - breaks React bundle size optimization
//   6. Line 307: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Timeout waiting for notebook to open');
		});
		const notebookDocument = await notebookDocumentPromise;
		await raceTimeout(vscode.window.showNotebookDocument(notebookDocument), 20000, () => {
			throw new Error('Timeout waiting for notebook to open');
		});

		assert.strictEqual(notebookDocument.cellCount, 3);
		assert.strictEqual(notebookDocument.cellAt(0).metadata.execution_count, 10);
		assert.strictEqual(notebookDocument.cellAt(1).metadata.execution_count, null);
		assert.strictEqual(notebookDocument.cellAt(2).metadata.execution_count, undefined);

		// Clear all outputs
		await raceTimeout(vscode.commands.executeCommand('notebook.clearAllCellsOutputs'), 5000, () => {
			throw new Error('Timeout waiting for notebook to clear outputs');
		});

		// Wait for all changes to be applied, could take a few ms.
		const verifyMetadataChanges = () => {
			assert.strictEqual(notebookDocument.cellAt(0).metadata.execution_count, null);
			assert.strictEqual(notebookDocument.cellAt(1).metadata.execution_count, null);
			assert.strictEqual(notebookDocument.cellAt(2).metadata.execution_count, undefined);
		};

		vscode.workspace.onDidChangeNotebookDocument(() => verifyMetadataChanges(), undefined, disposables);

		await new Promise<void>((resolve, reject) => {
			const interval = setInterval(() => {
				try {
					verifyMetadataChanges();
					clearInterval(interval);
					resolve();
				} catch {
					// Ignore
				}
			}, 50);
			disposables.push({ dispose: () => clearInterval(interval) });
			const timeout = setTimeout(() => {
				try {
					verifyMetadataChanges();
					resolve();
				} catch (ex) {
					reject(ex);
				}
			}, 1000);
			disposables.push({ dispose: () => clearTimeout(timeout) });
		});
	});


	// test('Serialize', async () => {
	// 	const markdownCell = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
	// 	markdownCell.metadata = {
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		},
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar'
	// 		}
	// 	};

	// 	const cellMetadata = getCellMetadata({ cell: markdownCell });
	// 	assert.deepStrictEqual(cellMetadata, {
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar',
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		}
	// 	});

	// 	const markdownCell2 = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
	// 	markdownCell2.metadata = {
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar'
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		}
	// 	};

	// 	const nbMarkdownCell = createMarkdownCellFromNotebookCell(markdownCell);
	// 	const nbMarkdownCell2 = createMarkdownCellFromNotebookCell(markdownCell2);
	// 	assert.deepStrictEqual(nbMarkdownCell, nbMarkdownCell2);

	// 	assert.deepStrictEqual(nbMarkdownCell, {
	// 		cell_type: 'markdown',
	// 		source: ['# header1'],
	// 		metadata: {
	// 			foo: 'bar',
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		},
	// 		id: '123'
	// 	});
	// });

	// suite('Outputs', () => {
	// 	function validateCellOutputTranslation(
	// 		outputs: nbformat.IOutput[],
	// 		expectedOutputs: vscode.NotebookCellOutput[],
	// 		propertiesToExcludeFromComparison: string[] = []
	// 	) {
	// 		const cells: nbformat.ICell[] = [
	// 			{
	// 				cell_type: 'code',
	// 				execution_count: 10,
	// 				outputs,
	// 				source: 'print(1)',
	// 				metadata: {}
	// 			}
	// 		];
	// 		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');

	// 		// OutputItems contain an `id` property generated by VSC.
	// 		// Exclude that property when comparing.
	// 		const propertiesToExclude = propertiesToExcludeFromComparison.concat(['id']);
	// 		const actualOuts = notebook.cells[0].outputs;
	// 		deepStripProperties(actualOuts, propertiesToExclude);
	// 		deepStripProperties(expectedOutputs, propertiesToExclude);
	// 		assert.deepStrictEqual(actualOuts, expectedOutputs);
	// 	}

	// 	test('Empty output', () => {
	// 		validateCellOutputTranslation([], []);
	// 	});

	// 	test('Stream output', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stderr',
	// 					text: 'Error'
	// 				},
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: 'NoError'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('Error')], {
	// 					outputType: 'stream'
	// 				}),
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('NoError')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});
	// 	test('Stream output and line endings', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: [
	// 						'Line1\n',
	// 						'\n',
	// 						'Line3\n',
	// 						'Line4'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Line1\n\nLine3\nLine4')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: [
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Hello\nHello\nHello\nHello\nHello\nHello\n')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});
	// 	test('Multi-line Stream output', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stdout',
	// 					output_type: 'stream',
	// 					text: [
	// 						'Epoch 1/5\n',
	// 						'...\n',
	// 						'Epoch 2/5\n',
	// 						'...\n',
	// 						'Epoch 3/5\n',
	// 						'...\n',
	// 						'Epoch 4/5\n',
	// 						'...\n',
	// 						'Epoch 5/5\n',
	// 						'...\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout(['Epoch 1/5\n',
	// 					'...\n',
	// 					'Epoch 2/5\n',
	// 					'...\n',
	// 					'Epoch 3/5\n',
	// 					'...\n',
	// 					'Epoch 4/5\n',
	// 					'...\n',
	// 					'Epoch 5/5\n',
	// 					'...\n'].join(''))], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Multi-line Stream output (last empty line should not be saved in ipynb)', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					output_type: 'stream',
	// 					text: [
	// 						'Epoch 1/5\n',
	// 						'...\n',
	// 						'Epoch 2/5\n',
	// 						'...\n',
	// 						'Epoch 3/5\n',
	// 						'...\n',
	// 						'Epoch 4/5\n',
	// 						'...\n',
	// 						'Epoch 5/5\n',
	// 						'...\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(['Epoch 1/5\n',
	// 					'...\n',
	// 					'Epoch 2/5\n',
	// 					'...\n',
	// 					'Epoch 3/5\n',
	// 					'...\n',
	// 					'Epoch 4/5\n',
	// 					'...\n',
	// 					'Epoch 5/5\n',
	// 					'...\n',
	// 					// This last empty line should not be saved in ipynb.
	// 					'\n'].join(''))], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with Ansi characters', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[vscode.NotebookCellOutputItem.stderr('\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
	// 					{
	// 						outputType: 'stream'
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with angle bracket characters', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '1 is < 2',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('1 is < 2')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with angle bracket characters and ansi chars', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[vscode.NotebookCellOutputItem.stderr('1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
	// 					{
	// 						outputType: 'stream'
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	test('Error', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					ename: 'Error Name',
	// 					evalue: 'Error Value',
	// 					traceback: ['stack1', 'stack2', 'stack3'],
	// 					output_type: 'error'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[
	// 						vscode.NotebookCellOutputItem.error({
	// 							name: 'Error Name',
	// 							message: 'Error Value',
	// 							stack: ['stack1', 'stack2', 'stack3'].join('\n')
	// 						})
	// 					],
	// 					{
	// 						outputType: 'error',
	// 						originalError: {
	// 							ename: 'Error Name',
	// 							evalue: 'Error Value',
	// 							traceback: ['stack1', 'stack2', 'stack3'],
	// 							output_type: 'error'
	// 						}
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	['display_data', 'execute_result'].forEach(output_type => {
	// 		suite(`Rich output for output_type = ${output_type}`, () => {
	// 			// Properties to exclude when comparing.
	// 			let propertiesToExcludeFromComparison: string[] = [];
	// 			setup(() => {
	// 				if (output_type === 'display_data') {
	// 					// With display_data the execution_count property will never exist in the output.
	// 					// We can ignore that (as it will never exist).
	// 					// But we leave it in the case of `output_type === 'execute_result'`
	// 					propertiesToExcludeFromComparison = ['execution_count', 'executionCount'];
	// 				}
	// 			});

	// 			test('Text mimeType output', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							data: {
	// 								'text/plain': 'Hello World!'
	// 							},
	// 							output_type,
	// 							metadata: {},
	// 							execution_count: 1
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from('Hello World!', 'utf8'), 'text/plain')],
	// 							{
	// 								outputType: output_type,
	// 								metadata: {}, // display_data & execute_result always have metadata.
	// 								executionCount: 1
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png,jpeg images', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage,
	// 								'image/jpeg': base64EncodedImage
	// 							},
	// 							metadata: {},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[
	// 								new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png'),
	// 								new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/jpeg')
	// 							],
	// 							{
	// 								executionCount: 1,
	// 								outputType: output_type,
	// 								metadata: {} // display_data & execute_result always have metadata.
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with a light background', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								needs_background: 'light'
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									needs_background: 'light'
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with a dark background', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								needs_background: 'dark'
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									needs_background: 'dark'
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with custom dimensions', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								'image/png': { height: '111px', width: '999px' }
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									'image/png': { height: '111px', width: '999px' }
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png allowed to scroll', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								unconfined: true,
	// 								'image/png': { width: '999px' }
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									unconfined: true,
	// 									'image/png': { width: '999px' }
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});
	// 		});
	// 	});
	// });

	// suite('Output Order', () => {
	// 	test('Verify order of outputs', async () => {
	// 		const dataAndExpectedOrder: { output: nbformat.IDisplayData; expectedMimeTypesOrder: string[] }[] = [
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': 'some json',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/vnd.vegalite.v4+json', 'text/html']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': 'some json',
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: [
	// 					'application/vnd.vegalite.v4+json',
	// 					'text/html',
	// 					'application/javascript',
	// 					'text/plain'
	// 				]
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': '', // Empty, should give preference to other mimetypes.
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: [
	// 					'text/html',
	// 					'application/javascript',
	// 					'text/plain',
	// 					'application/vnd.vegalite.v4+json'
	// 				]
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['text/html', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/javascript', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'image/svg+xml': 'some svg',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['image/svg+xml', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/latex': 'some latex',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['text/latex', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.jupyter.widget-view+json': 'some widget',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/vnd.jupyter.widget-view+json', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/plain': 'some text',
	// 						'image/svg+xml': 'some svg',
	// 						'image/png': 'some png'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['image/png', 'image/svg+xml', 'text/plain']
	// 			}
	// 		];

	// 		dataAndExpectedOrder.forEach(({ output, expectedMimeTypesOrder }) => {
	// 			const sortedOutputs = jupyterCellOutputToCellOutput(output);
	// 			const mimeTypes = sortedOutputs.items.map((item) => item.mime).join(',');
	// 			assert.equal(mimeTypes, expectedMimeTypesOrder.join(','));
	// 		});
	// 	});
	// });
});

function raceTimeout<T>(promise: Thenable<T>, timeout: number, onTimeout?: () => void): Promise<T | undefined> {
	let promiseResolve: ((value: T | undefined) => void) | undefined = undefined;

	const timer = setTimeout(() => {
		promiseResolve?.(undefined);
		onTimeout?.();
	}, timeout);

	return Promise.race([
		Promise.resolve(promise).then(
			result => {
				clearTimeout(timer);
				return result;
			},
			err => {
				clearTimeout(timer);
				throw err;
			}
		),
		new Promise<T | undefined>(resolve => promiseResolve = resolve)
	]);
}
