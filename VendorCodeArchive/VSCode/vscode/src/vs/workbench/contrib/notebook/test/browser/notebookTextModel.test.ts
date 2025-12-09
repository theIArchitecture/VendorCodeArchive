//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellEditType, CellKind, ICellEditOperation, MOVE_CURSOR_1_LINE_COMMAND, NotebookTextModelChangedEvent, NotebookTextModelWillAddRemoveEvent, SelectionStateType } from '../../common/notebookCommon.js';
import { setupInstantiationService, TestCell, valueBytesFromString, withTestNotebook } from './testNotebookEditor.js';

suite('NotebookTextModel', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;

	ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		languageService = instantiationService.get(ILanguageService);
		instantiationService.spy(IUndoRedoService, 'pushElement');
	});

	suiteTeardown(() => disposables.dispose());

	test('insert', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
					{ editType: CellEditType.Replace, index: 3, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 6, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 6);

				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[4].getValue(), 'var f = 6;');
			}
		);
	});

	test('multiple inserts at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 6, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 6);

				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var f = 6;');
			}
		);
	});

	test('delete', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 3, count: 1, cells: [] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var c = 3;');
			}
		);
	});

	test('delete + insert', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 3, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(textModel.cells.length, 4);

				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var e = 5;');
			}
		);
	});

	test('delete + insert at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');
			}
		);
	});

	test('(replace) delete + insert at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');
			}
		);
	});

	test('output', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// invalid index 1
				assert.throws(() => {
					textModel.applyEdits([{
						index: Number.MAX_VALUE,
						editType: CellEditType.Output,
						outputs: []
					}], true, undefined, () => undefined, undefined, true);
				});

				// invalid index 2
				assert.throws(() => {
					textModel.applyEdits([{
						index: -1,
						editType: CellEditType.Output,
						outputs: []
					}], true, undefined, () => undefined, undefined, true);
				});

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello_') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1);

				// append
				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					append: true,
					outputs: [{
						outputId: 'someId2',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello2_') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 2);
				let [first, second] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'someId');
				assert.strictEqual(second.outputId, 'someId2');

				// replace all
				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					outputs: [{
						outputId: 'someId3',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('Last, replaced output') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1);
				[first] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'someId3');
			}
		);
	});

	test('multiple append output in one position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// append
				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 1') }]
						}]
					},
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append2',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 2') }]
						}]
					}
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 2);
				const [first, second] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'append1');
				assert.strictEqual(second.outputId, 'append2');
			}
		);
	});

	test('append to output created in same batch', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 1') }]
						}]
					},
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: Mimes.markdown, data: valueBytesFromString('append 2')
						}]
					}
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1, 'has 1 output');
				const [first] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'append1');
				assert.strictEqual(first.outputs.length, 2, 'has 2 items');
			}
		);
	});

	const stdOutMime = 'application/vnd.code.notebook.stdout';
	const stdErrMime = 'application/vnd.code.notebook.stderr';

	test('appending streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: stdOutMime, data: valueBytesFromString('append 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('append 2') },
							{ mime: stdOutMime, data: valueBytesFromString('append 3') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('append 4') },
							{ mime: stdOutMime, data: valueBytesFromString('append 5') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 2, 'version should bump per append');

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1, 'has 1 output');
				assert.strictEqual(output.outputId, 'append1');
				assert.strictEqual(output.outputs.length, 1, 'outputs are compressed');
				assert.strictEqual(output.outputs[0].data.toString(), 'append 1append 2append 3append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime)?.toString(), 'append 2append 3append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(1, stdOutMime)?.toString(), 'append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(2, stdOutMime), undefined);
				assert.strictEqual(output.appendedSinceVersion(2, stdErrMime), undefined);
			}
		);
	});

	test('replacing streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: stdOutMime, data: valueBytesFromString('append 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('append 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: false,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('replace 3')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 2, 'version should bump per replace');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('append 4')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 3, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'replace 3append 4');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'replacing output should clear out previous versioned output buffers');
				assert.strictEqual(output.appendedSinceVersion(1, stdOutMime), undefined,
					'replacing output should clear out previous versioned output buffers');
				assert.strictEqual(output.appendedSinceVersion(2, stdOutMime)?.toString(), 'append 4');
			}
		);
	});

	test('appending streaming outputs with move cursor compression', async function () {

		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('append 1') },
								{ mime: stdOutMime, data: valueBytesFromString('\nappend 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString(MOVE_CURSOR_1_LINE_COMMAND + '\nappend 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'append 1\nappend 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'compressing outputs should clear out previous versioned output buffers');
			}
		);
	});

	test('appending streaming outputs with carraige return compression', async function () {

		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('append 1') },
								{ mime: stdOutMime, data: valueBytesFromString('\nappend 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('\rappend 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'append 1\nappend 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'compressing outputs should clear out previous versioned output buffers');
			}
		);
	});

	test('appending multiple different mime streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('stdout 1') },
								{ mime: stdErrMime, data: valueBytesFromString('stderr 1') }
							]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('stdout 2') },
							{ mime: stdErrMime, data: valueBytesFromString('stderr 2') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per replace');

				assert.strictEqual(output.appendedSinceVersion(0, stdErrMime)?.toString(), 'stderr 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime)?.toString(), 'stdout 2');
			}
		);
	});

	test('metadata', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// invalid index 1
				assert.throws(() => {
					textModel.applyEdits([{
						index: Number.MAX_VALUE,
						editType: CellEditType.Metadata,
						metadata: {}
					}], true, undefined, () => undefined, undefined, true);
				});

				// invalid index 2
				assert.throws(() => {
					textModel.applyEdits([{
						index: -1,
						editType: CellEditType.Metadata,
						metadata: {}
					}], true, undefined, () => undefined, undefined, true);
				});

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: { customProperty: 15 },
				}], true, undefined, () => undefined, undefined, true);

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: {},
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].metadata.customProperty, undefined);
			}
		);
	});

	test('partial metadata', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.PartialMetadata,
					metadata: { customProperty: 15 },
				}], true, undefined, () => undefined, undefined, true);

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.PartialMetadata,
					metadata: {},
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].metadata.customProperty, 15);
			}
		);
	});

	test('multiple inserts in one edit', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				let changeEvent: NotebookTextModelChangedEvent | undefined = undefined;
				const eventListener = textModel.onDidChangeContent(e => {
					changeEvent = e;
				});
				const willChangeEvents: NotebookTextModelWillAddRemoveEvent[] = [];
				const willChangeListener = textModel.onWillAddRemoveCells(e => {
					willChangeEvents.push(e);
				});
				const version = textModel.versionId;

				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => ({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }), undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


				assert.notStrictEqual(changeEvent, undefined);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 683: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(changeEvent!.rawEvents.length, 2);
				assert.deepStrictEqual(changeEvent!.endSelectionState?.selections, [{ start: 0, end: 1 }]);
				assert.strictEqual(willChangeEvents.length, 2);
				assert.strictEqual(textModel.versionId, version + 1);
				eventListener.dispose();
				willChangeListener.dispose();
			}
		);
	});

	test('insert and metadata change in one edit', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor) => {
				const textModel = editor.textModel;
				let changeEvent: NotebookTextModelChangedEvent | undefined = undefined;
				const eventListener = textModel.onDidChangeContent(e => {
					changeEvent = e;
				});
				const willChangeEvents: NotebookTextModelWillAddRemoveEvent[] = [];
				const willChangeListener = textModel.onWillAddRemoveCells(e => {
					willChangeEvents.push(e);
				});

				const version = textModel.versionId;

				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{
						index: 0,
						editType: CellEditType.Metadata,
						metadata: {},
					}
				], true, undefined, () => ({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }), undefined, true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 712: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


				assert.notStrictEqual(changeEvent, undefined);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 734: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(changeEvent!.rawEvents.length, 2);
				assert.deepStrictEqual(changeEvent!.endSelectionState?.selections, [{ start: 0, end: 1 }]);
				assert.strictEqual(willChangeEvents.length, 1);
				assert.strictEqual(textModel.versionId, version + 1);
				eventListener.dispose();
				willChangeListener.dispose();
			}
		);
	});


	test('Updating appending/updating output in Notebooks does not work as expected #117273', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;

			assert.strictEqual(model.cells.length, 1);
			assert.strictEqual(model.cells[0].outputs.length, 0);

			const success1 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success1);
			assert.strictEqual(model.cells[0].outputs.length, 1);

			const success2 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out2', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
					],
					append: true
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success2);
			assert.strictEqual(model.cells[0].outputs.length, 2);
		});
	});

	test('Clearing output of an empty notebook makes it dirty #119608', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], (editor, _, ds) => {
			const model = editor.textModel;

			let event: NotebookTextModelChangedEvent | undefined;

			ds.add(model.onDidChangeContent(e => { event = e; }));

			{
				// 1: add ouput -> event
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output, index: 0, outputs: [
							{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
						],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);

				assert.ok(success);
				assert.strictEqual(model.cells[0].outputs.length, 1);
				assert.ok(event);
			}

			{
				// 2: clear all output w/ output -> event
				event = undefined;
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output,
						index: 0,
						outputs: [],
						append: false
					}, {
						editType: CellEditType.Output,
						index: 1,
						outputs: [],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);
				assert.ok(success);
				assert.ok(event);
			}

			{
				// 2: clear all output wo/ output -> NO event
				event = undefined;
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output,
						index: 0,
						outputs: [],
						append: false
					}, {
						editType: CellEditType.Output,
						index: 1,
						outputs: [],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);

				assert.ok(success);
				assert.ok(event === undefined);
			}
		});
	});

	test('Cell metadata/output change should update version id and alternative id #121807', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel) => {
			assert.strictEqual(editor.textModel.versionId, 0);
			const firstAltVersion = '0_0,1;1,1';
			assert.strictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			editor.textModel.applyEdits([
				{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: {
						inputCollapsed: true
					}
				}
			], true, undefined, () => undefined, undefined, true);
			assert.strictEqual(editor.textModel.versionId, 1);
			assert.notStrictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			const secondAltVersion = '1_0,1;1,1';
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

			await viewModel.undo();
			assert.strictEqual(editor.textModel.versionId, 2);
			assert.strictEqual(editor.textModel.alternativeVersionId, firstAltVersion);

			await viewModel.redo();
			assert.strictEqual(editor.textModel.versionId, 3);
			assert.notStrictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

			editor.textModel.applyEdits([
				{
					index: 1,
					editType: CellEditType.Metadata,
					metadata: {
						inputCollapsed: true
					}
				}
			], true, undefined, () => undefined, undefined, true);
			assert.strictEqual(editor.textModel.versionId, 4);
			assert.strictEqual(editor.textModel.alternativeVersionId, '4_0,1;1,1');

			await viewModel.undo();
			assert.strictEqual(editor.textModel.versionId, 5);
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

		});
	});

	test('metadata changes on newly added cells should combine their undo operations', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel, ds) => {
			const textModel = editor.textModel;
			editor.textModel.applyEdits([
				{
					editType: CellEditType.Replace, index: 1, count: 0, cells: [
						ds.add(new TestCell(textModel.viewType, 1, 'var e = 5;', 'javascript', CellKind.Code, [], languageService)),
						ds.add(new TestCell(textModel.viewType, 2, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))
					]
				},
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells.length, 3);

			editor.textModel.applyEdits([
				{ editType: CellEditType.Metadata, index: 1, metadata: { id: '123' } },
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells[1].metadata.id, '123');

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 1);

			await viewModel.redo();

			assert.strictEqual(textModel.cells.length, 3);
		});
	});

	test('changes with non-metadata edit should not combine their undo operations', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel, ds) => {
			const textModel = editor.textModel;
			editor.textModel.applyEdits([
				{
					editType: CellEditType.Replace, index: 1, count: 0, cells: [
						ds.add(new TestCell(textModel.viewType, 1, 'var e = 5;', 'javascript', CellKind.Code, [], languageService)),
						ds.add(new TestCell(textModel.viewType, 2, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))
					]
				},
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells.length, 3);

			editor.textModel.applyEdits([
				{ editType: CellEditType.Metadata, index: 1, metadata: { id: '123' } },
				{
					editType: CellEditType.Output, handle: 0, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells[1].metadata.id, '123');

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 3);

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 1);
		});
	});

	test('Destructive sorting in _doApplyEdits #121994', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {

			const notebook = editor.textModel;

			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[0].outputs[0].outputs.length, 1);
			assert.deepStrictEqual(notebook.cells[0].outputs[0].outputs[0].data, valueBytesFromString('test'));

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, handle: 0, outputs: []
				},
				{
					editType: CellEditType.Output, handle: 0, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[0].outputs[0].outputs.length, 2);
		});
	});

	test('Destructive sorting in _doApplyEdits #121994. cell splice between output changes', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var b = 2;', 'javascript', CellKind.Code, [{ outputId: 'i43', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var c = 3;', 'javascript', CellKind.Code, [{ outputId: 'i44', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {
			const notebook = editor.textModel;

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, index: 0, outputs: []
				},
				{
					editType: CellEditType.Replace, index: 1, count: 1, cells: []
				},
				{
					editType: CellEditType.Output, index: 2, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells.length, 2);
			assert.strictEqual(notebook.cells[0].outputs.length, 0);
			assert.strictEqual(notebook.cells[1].outputs.length, 2);
			assert.strictEqual(notebook.cells[1].outputs[0].outputId, 'i44');
			assert.strictEqual(notebook.cells[1].outputs[1].outputId, 'newOutput');
		});
	});

	test('Destructive sorting in _doApplyEdits #121994. cell splice between output changes 2', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var b = 2;', 'javascript', CellKind.Code, [{ outputId: 'i43', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var c = 3;', 'javascript', CellKind.Code, [{ outputId: 'i44', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {
			const notebook = editor.textModel;

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, index: 1, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				},
				{
					editType: CellEditType.Replace, index: 1, count: 1, cells: []
				},
				{
					editType: CellEditType.Output, index: 1, append: true, outputs: [{
						outputId: 'newOutput2',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells.length, 2);
			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[1].outputs.length, 1);
			assert.strictEqual(notebook.cells[1].outputs[0].outputId, 'i44');
		});
	});

	test('Output edits splice', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;

			assert.strictEqual(model.cells.length, 1);
			assert.strictEqual(model.cells[0].outputs.length, 0);

			const success1 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('1') }] },
						{ outputId: 'out2', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('2') }] },
						{ outputId: 'out3', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('3') }] },
						{ outputId: 'out4', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('4') }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success1);
			assert.strictEqual(model.cells[0].outputs.length, 4);

			const success2 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('1') }] },
						{ outputId: 'out5', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('5') }] },
						{ outputId: 'out3', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('3') }] },
						{ outputId: 'out6', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('6') }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success2);
			assert.strictEqual(model.cells[0].outputs.length, 4);
			assert.strictEqual(model.cells[0].outputs[0].outputId, 'out1');
			assert.strictEqual(model.cells[0].outputs[1].outputId, 'out5');
			assert.strictEqual(model.cells[0].outputs[2].outputId, 'out3');
			assert.strictEqual(model.cells[0].outputs[3].outputId, 'out6');
		});
	});

	test('computeEdits no insert', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits = NotebookTextModel.computeEdits(model, [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} }
			]);
		});
	});

	test('computeEdits cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells },
			]);
		});
	});

	test('computeEdits last cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) },
			]);
		});
	});
	test('computeEdits first cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits middle cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}],
			['var c = 1;', 'javascript', CellKind.Code, [], {}],
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var c = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1, 2) },
				{ editType: CellEditType.Metadata, index: 2, metadata: {} },
			]);
		});
	});

	test('computeEdits cell metadata changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'foo' } },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: { name: 'foo' } },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell language changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'typescript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell kind changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Markup, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) },
			]);
		});
	});

	test('computeEdits cell metadata & content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'foo' } },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: { name: 'foo' } },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) }
			]);
		});
	});

	test('computeEdits cell content changed while executing', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} }
			];
			const edits = NotebookTextModel.computeEdits(model, cells, [model.cells[1].handle]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) }
			]);
		});
	});

	test('computeEdits cell internal metadata changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, internalMetadata: { executionOrder: 1 } },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell internal metadata changed while executing', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {}, internalMetadata: { executionOrder: 1 } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells, [model.cells[1].handle]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell insertion', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, },
				{ source: 'var c = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 0, cells: cells.slice(1, 2) },
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 3);
			assert.equal(model.cells[1].getValue(), 'var c = 1;');
			assert.equal(model.cells[2].getValue(), 'var b = 1;');
			assert.deepStrictEqual(model.cells[2].metadata, { foo: 'bar' });
		});
	});

	test('computeEdits output changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{
					source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], metadata: undefined,
				},
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{
					editType: CellEditType.Output, index: 0, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], append: false
				},
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 2);
			assert.strictEqual(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputId, 'someId');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), '_World_');
		});
	});

	test('computeEdits output items changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: 'someId',
				outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello_') }]
			}], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{
					source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], metadata: undefined,
				},
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.OutputItems, outputId: 'someId', items: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }], append: false },
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 2);
			assert.strictEqual(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputId, 'someId');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), '_World_');
		});
	});
	test('Append multiple text/plain output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'text/plain', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'text/plain', data: VSBuffer.fromString('bar') }, { mime: 'text/plain', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 3);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foo');
			assert.equal(model.cells[0].outputs[0].outputs[1].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[1].data.toString(), 'bar');
			assert.equal(model.cells[0].outputs[0].outputs[2].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[2].data.toString(), 'baz');
		});
	});
	test('Append multiple stdout stream output items to an output with another mime', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'text/plain', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 3);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foo');
			assert.equal(model.cells[0].outputs[0].outputs[1].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[1].data.toString(), 'bar');
			assert.equal(model.cells[0].outputs[0].outputs[2].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[2].data.toString(), 'baz');
		});
	});
	test('Compress multiple stdout stream output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'application/vnd.code.notebook.stdout', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foobarbaz');
		});

	});
	test('Compress multiple stderr stream output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'application/vnd.code.notebook.stderr', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stderr', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stderr', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'application/vnd.code.notebook.stderr');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foobarbaz');
		});

	});

	test('findNextMatch', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const notebookModel = viewModel.notebookDocument;

				// Test case 1: Find 'var' starting from the first cell
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1530: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1531: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1536: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1542: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1548: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1549: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				let findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1568: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1569: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1574: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1575: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1580: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1581: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1587: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1604: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1610: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1611: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1622: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1623: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1620: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1621: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1626: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1627: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1632: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1638: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1639: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1636: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1637: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1642: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1643: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1648: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1649: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1654: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1655: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1652: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1653: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1658: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1659: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1664: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1670: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1671: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1668: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1669: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1674: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1675: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1680: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1686: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1687: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1684: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1685: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1690: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1691: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1696: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1697: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1702: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1703: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1700: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1701: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1707: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1713: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1718: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1719: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1716: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1717: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1722: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1723: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1728: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1735: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1739: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1744: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1745: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1750: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1751: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1748: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1749: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1754: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1755: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1760: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1761: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1766: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1767: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1764: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1765: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1770: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1771: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1776: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1777: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1782: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1783: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1780: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1781: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1786: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1798: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1799: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1796: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1803: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1808: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1809: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1814: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1815: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1813: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1818: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1824: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1825: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1830: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1828: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1829: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1834: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1835: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1840: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1841: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1846: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1844: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1845: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1850: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1851: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1856: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1857: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1862: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1860: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1861: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1866: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1867: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1872: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1873: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1878: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1879: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1876: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1877: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1882: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1883: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1888: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1889: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1894: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1895: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1892: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1898: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1899: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1904: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1905: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1910: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1911: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1908: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1909: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1914: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1915: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1920: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1921: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1926: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1927: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1924: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1925: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1930: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1931: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1936: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1937: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1942: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1943: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 1940: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1941: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1946: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1947: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1952: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1953: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1958: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1959: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				// Test case 2: Find 'b' starting from the second cell
				findMatch = notebookModel.findNextMatch('b', { cellIndex: 1, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 3: Find 'c' starting from the third cell
				findMatch = notebookModel.findNextMatch('c', { cellIndex: 2, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 4: Find 'd' starting from the fourth cell
				findMatch = notebookModel.findNextMatch('d', { cellIndex: 3, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 5: No match found
				findMatch = notebookModel.findNextMatch('e', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.strictEqual(findMatch, null);
			}
		);
	});

	test('findNextMatch 2', async function () {
		await withTestNotebook(
			[
				['var a = 1; var a = 2;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const notebookModel = viewModel.notebookDocument;

				// Test case 1: Find 'var' starting from the first cell
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1572: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1573: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1578: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1579: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1585: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1590: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1591: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1600: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1601: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1611: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1612: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1618: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				let findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1634: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1635: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1640: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1641: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1646: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1647: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1652: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1653: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1662: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1663: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1668: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1673: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1674: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1694: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1695: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1700: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1701: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1707: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1713: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1722: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1723: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1727: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1728: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1739: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1735: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1740: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1741: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1746: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1747: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1752: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1762: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1763: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1767: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1768: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1773: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1774: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1780: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1774: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1775: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1780: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1781: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1786: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1803: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1807: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1808: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1813: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1814: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1820: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1814: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1815: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1820: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1821: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1826: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1827: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1832: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1833: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1842: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1843: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1848: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1853: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1854: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1859: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1860: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1854: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1855: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1860: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1861: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1866: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1867: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1872: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1873: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1882: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1883: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1887: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1888: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1894: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1899: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1900: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1894: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1895: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1900: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1901: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1907: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1912: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1913: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1922: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1923: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1927: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1928: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1933: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1939: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1940: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1940: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1941: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1946: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1947: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1952: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1953: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1962: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1963: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1967: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1968: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1973: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1979: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1980: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1980: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1986: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1987: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1992: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1993: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2002: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2003: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2007: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2008: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2013: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2014: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2019: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2020: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2014: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2015: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2020: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2021: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2026: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2032: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2033: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2042: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2043: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2047: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2048: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2053: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2054: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2059: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2060: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2054: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2055: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2060: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2061: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2066: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2067: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2072: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2082: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2083: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2087: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2088: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2093: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2094: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2099: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2100: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2094: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2095: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2100: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2101: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2106: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2107: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2112: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2113: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2122: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2123: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2127: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2128: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2133: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2134: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2139: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2140: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2134: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2135: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2140: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2141: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2146: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2147: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2152: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2153: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2162: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2163: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2168: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2173: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2179: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2180: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2175: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2180: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2181: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2186: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2187: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2192: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2193: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2202: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2203: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2207: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2208: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2213: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2214: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2219: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2220: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2215: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2220: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2221: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2226: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2227: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2232: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2233: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2242: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2243: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2247: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2248: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2259: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2260: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2261: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2266: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2267: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2272: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2273: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2282: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2283: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2287: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2288: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2293: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2294: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2299: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2300: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2294: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2295: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2300: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2301: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2306: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2307: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2312: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2313: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2322: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2323: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2327: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2328: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2333: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2334: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2339: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2340: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2334: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2335: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2340: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2341: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2346: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2347: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2352: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2353: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2362: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2363: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2367: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2368: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2373: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2374: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2379: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2380: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2374: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2375: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2380: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2381: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2386: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2387: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2392: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2393: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2402: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2403: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2407: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2408: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2413: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2414: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2419: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2420: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2414: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2415: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2421: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2426: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2427: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2432: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2433: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2442: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2443: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2447: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2448: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2453: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2454: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2459: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2460: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2461: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2466: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2467: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2472: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2473: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2482: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2483: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2487: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2488: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2493: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2494: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2499: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2500: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2494: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2495: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2500: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2501: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2506: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2507: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2512: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2513: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2522: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2523: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2527: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2528: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2533: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2534: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2539: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2540: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (16):
//   1. Line 2534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2535: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2540: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2541: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2546: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2547: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 2552: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 2553: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 2562: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 2563: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 2567: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 2568: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 2573: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 2574: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 2579: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 2580: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				// Test case 2: Find 'b' starting from the second cell
				findMatch = notebookModel.findNextMatch('b', { cellIndex: 1, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 3: Find 'c' starting from the third cell
				findMatch = notebookModel.findNextMatch('c', { cellIndex: 2, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 4: Find 'd' starting from the fourth cell
				findMatch = notebookModel.findNextMatch('d', { cellIndex: 3, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 5: No match found
				findMatch = notebookModel.findNextMatch('e', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.strictEqual(findMatch, null);

				// Test case 6: Same keywords in the same cell
				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 5) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 12);

				// Test case 7: Search from the middle of a cell with keyword before and after
				findMatch = notebookModel.findNextMatch('a', { cellIndex: 0, position: new Position(1, 10) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 13);

				// Test case 8: Search from a cell and next match is in another cell below
				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 20) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);
				// assert.strictEqual(match!.cellIndex, 1);
			}
		);
	});
});
