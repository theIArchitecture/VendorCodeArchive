//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { activate } from '..';
import { RendererApi } from 'vscode-notebook-renderer';
import { IDisposable, IRichRenderContext, OutputWithAppend, RenderOptions } from '../rendererTypes';
import { JSDOM } from "jsdom";
import { LinkDetector } from '../linkify';

const dom = new JSDOM();
global.document = dom.window.document;

suite('Notebook builtin output renderer', () => {

	const error = {
		name: "TypeError",
		message: "Expected type `str`, but received type `<class \'int\'>`",
		stack: "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m" +
			"\u001b[1;31mTypeError\u001b[0m                                 Traceback (most recent call last)" +
			"\u001b[1;32mc:\\src\\test\\ws1\\testing.py\u001b[0m in \u001b[0;36mline 2\n\u001b[0;32m      <a href='file:///c%3A/src/test/ws1/testing.py?line=34'>35</a>\u001b[0m \u001b[39m# %%\u001b[39;00m\n\u001b[1;32m----> <a href='file:///c%3A/src/test/ws1/testing.py?line=35'>36</a>\u001b[0m \u001b[39mraise\u001b[39;00m \u001b[39mTypeError\u001b[39;00m(\u001b[39m'\u001b[39m\u001b[39merror = f\u001b[39m\u001b[39m\"\u001b[39m\u001b[39mExpected type `str`, but received type `\u001b[39m\u001b[39m{\u001b[39m\u001b[39mtype(name)}`\u001b[39m\u001b[39m\"\u001b[39m\u001b[39m'\u001b[39m)\n" +
			"\u001b[1;31mTypeError\u001b[0m: Expected type `str`, but received type `<class \'int\'>`\""
	};

	const errorMimeType = 'application/vnd.code.notebook.error';

	const stdoutMimeType = 'application/vnd.code.notebook.stdout';
	const stderrMimeType = 'application/vnd.code.notebook.stderr';

	const textLikeMimeTypes = [
		stdoutMimeType,
		stderrMimeType,
		'text/plain'
	];

	type optionalRenderOptions = { [k in keyof RenderOptions]?: RenderOptions[k] };

	type handler = (e: RenderOptions) => any;

	const settingsChangedHandlers: handler[] = [];
	function fireSettingsChange(options: optionalRenderOptions) {
		settingsChangedHandlers.forEach((handler) => handler(options as RenderOptions));
	}

	function createContext(settings?: optionalRenderOptions): IRichRenderContext {
		settingsChangedHandlers.length = 0;
		return {
			setState(_value: void) { },
			getState() { return undefined; },
			async getRenderer(_id): Promise<RendererApi | undefined> { return undefined; },
			settings: {
				outputWordWrap: true,
				outputScrolling: true,
				lineLimit: 30,
				...settings
			} as RenderOptions,
			onDidChangeSettings(listener: handler, _thisArgs?: any, disposables?: IDisposable[]) {
				settingsChangedHandlers.push(listener);

				const dispose = () => {
					settingsChangedHandlers.splice(settingsChangedHandlers.indexOf(listener), 1);
				};

				disposables?.push({ dispose });
				return {
					dispose
				};
			},
			workspace: {
				isTrusted: true
			}
		};
	}

	function createElement(elementType: 'div' | 'span', classes: string[]) {
		const el = global.document.createElement(elementType);
		classes.forEach((c) => el.classList.add(c));
		return el;
	}

	// Helper to generate HTML similar to what is passed to the renderer
	// <div class="cell_container" >
	//   <div class="output_container" >
	//     <div class="output" >
	class OutputHtml {
		private readonly cell = createElement('div', ['cell_container']);
		private readonly firstOutput: HTMLElement;

		constructor() {
			const outputContainer = createElement('div', ['output_container']);
			const outputElement = createElement('div', ['output']);

			this.cell.appendChild(outputContainer);
			outputContainer.appendChild(outputElement);

			this.firstOutput = outputElement;
		}

		public get cellElement() {
			return this.cell;
		}

		public getFirstOuputElement() {
			return this.firstOutput;
		}

		public appendOutputElement() {
			const outputElement = createElement('div', ['output']);
			const outputContainer = createElement('div', ['output_container']);
			this.cell.appendChild(outputContainer);
			outputContainer.appendChild(outputElement);

			return outputElement;
		}
	}

	function createOutputItem(text: string, mime: string, id: string = '123', appendedText?: string): OutputWithAppend {
		return {
			id: id,
			mime: mime,
			appendedText() {
				return appendedText;
			},
			text() {
				return text;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			},
			blob() {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 148: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				return [] as any;
			},
			json() {
				return '{ }';
			},
			data() {
				return [] as any;
			},
			metadata: {}
		};
	}

	textLikeMimeTypes.forEach((mimeType) => {
		test(`Render with wordwrap and scrolling for mimetype ${mimeType}`, async () => {
			const context = createContext({ outputWordWrap: true, outputScrolling: true });
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
			await renderer!.renderOutputItem(outputItem, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
			assert.ok(outputElement.classList.contains('remove-padding'), `Padding should be removed for scrollable outputs ${outputElement.classList}`);
			if (mimeType === 'text/plain') {
				assert.ok(inserted.classList.contains('word-wrap'), `Word wrap should be enabled for text/plain ${outputElement.classList}`);
			} else {
				assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
					`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
			}
			assert.ok(inserted.innerHTML.indexOf('>content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

		test(`Render without wordwrap or scrolling for mimetype ${mimeType}`, async () => {
			const context = createContext({ outputWordWrap: false, outputScrolling: false });
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
			await renderer!.renderOutputItem(outputItem, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
			assert.ok(outputElement.classList.contains('remove-padding'), `Padding should be removed for non-scrollable outputs: ${outputElement.classList}`);
			assert.ok(!outputElement.classList.contains('word-wrap') && !inserted.classList.contains('scrollable'),
				`output content classList should not contain word-wrap and scrollable ${inserted.classList}`);
			assert.ok(inserted.innerHTML.indexOf('>content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

		test(`Replace content in element for mimetype ${mimeType}`, async () => {
			const context = createContext();
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			await renderer!.renderOutputItem(outputItem, outputElement);
			const outputItem2 = createOutputItem('replaced content', mimeType);
			await renderer!.renderOutputItem(outputItem2, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted.innerHTML.indexOf('>content</') === -1, `Old content was not removed to output element: ${outputElement.innerHTML}`);
			assert.ok(inserted.innerHTML.indexOf('>replaced content</') !== -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

	});

	test('Append streaming output', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('content', stdoutMimeType, '123', 'ignoredAppend');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem, outputElement);
		const outputItem2 = createOutputItem('content\nappended', stdoutMimeType, '123', '\nappended');
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('>content</') !== -1, `Previous content should still exist: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('ignoredAppend') === -1, `Append value should not be used on first render: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>appended</') !== -1, `Content was not appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>content</') === inserted.innerHTML.lastIndexOf('>content</'), `Original content should not be duplicated: ${outputElement.innerHTML}`);
	});

	test(`Appending multiple streaming outputs`, async () => {
		const context = createContext({ outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const firstOutputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem2 = createOutputItem(JSON.stringify(error), errorMimeType, '2');
		const outputItem3 = createOutputItem('second stream content', stdoutMimeType, '3');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 520: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, firstOutputElement);
		const secondOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutputElement);
		const thirdOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem3, thirdOutputElement);

		const appendedItem1 = createOutputItem('', stdoutMimeType, '1', ' appended1');
		await renderer!.renderOutputItem(appendedItem1, firstOutputElement);
		const appendedItem3 = createOutputItem('', stdoutMimeType, '3', ' appended3');
		await renderer!.renderOutputItem(appendedItem3, thirdOutputElement);

		assert.ok(firstOutputElement.innerHTML.indexOf('>first stream content') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(firstOutputElement.innerHTML.indexOf('appended1') > -1, `Content was not appended to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(secondOutputElement.innerHTML.indexOf('>TypeError</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('>second stream content') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('appended3') > -1, `Content was not appended to output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test('Append large streaming outputs', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const lotsOfLines = new Array(4998).fill('line').join('\n');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const firstOuput = lotsOfLines + 'expected1';
		const outputItem = createOutputItem(firstOuput, stdoutMimeType, '123');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem, outputElement);
		const appended = '\n' + lotsOfLines + 'expectedAppend';
		const outputItem2 = createOutputItem(firstOuput + appended, stdoutMimeType, '123', appended);
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('expected1') !== -1, `Last bit of previous content should still exist`);
		assert.ok(inserted.innerHTML.indexOf('expectedAppend') !== -1, `Content was not appended to output element`);
	});

	test('Streaming outputs larger than the line limit are truncated', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const lotsOfLines = new Array(11000).fill('line').join('\n');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const firstOuput = 'shouldBeTruncated' + lotsOfLines + 'expected1';
		const outputItem = createOutputItem(firstOuput, stdoutMimeType, '123');
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('expected1') !== -1, `Last bit of content should exist`);
		assert.ok(inserted.innerHTML.indexOf('shouldBeTruncated') === -1, `Beginning content should be truncated`);
	});

	test(`Render filepath links in text output when enabled`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true, linkifyFilePaths: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('./dir/file.txt', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('<a href="./dir/file.txt">') !== -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

	test(`No filepath links in text output when disabled`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true, linkifyFilePaths: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('./dir/file.txt', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('<a href="./dir/file.txt">') === -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

	test(`Render with wordwrap and scrolling for error output`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(error), errorMimeType);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 561: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 584: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 613: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 617: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 626: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 677: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 714: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 792: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 825: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 834: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 911: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 912: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 922: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.classList.contains('remove-padding'), 'Padding should be removed for scrollable outputs');
		assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
			`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
		assert.ok(inserted.innerHTML.indexOf('>Expected type `str`, but received type') > -1, `Content was not added to output element:\n ${outputElement.innerHTML}`);
		assert.ok(inserted.textContent!.indexOf('Expected type `str`, but received type `<class \'int\'>`') > -1, `Content was not added to output element:\n ${outputElement.textContent}`);
		assert.ok(inserted.textContent!.indexOf('<a href') === -1, 'HTML links should be rendered');
	});

	test(`Replace content in element for error output`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(error), errorMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);
		const error2: typeof error = { ...error, message: 'new message', stack: 'replaced content' };
		const outputItem2 = createOutputItem(JSON.stringify(error2), errorMimeType);
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('Expected type `str`, but received type') === -1, `Content was not removed from output element:\n ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') !== -1, `Content was not added to output element:\n ${outputElement.innerHTML}`);
	});

	test(`Multiple adjacent streaming outputs should be consolidated one element`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		const outputItem3 = createOutputItem('third stream content', stderrMimeType, '3');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 585: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 661: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 698: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 734: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 735: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 770: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 771: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 809: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 845: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 918: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1068: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, outputElement);
		await renderer!.renderOutputItem(outputItem2, outputHtml.appendOutputElement());
		await renderer!.renderOutputItem(outputItem3, outputHtml.appendOutputElement());


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>third stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
	});

	test(`Consolidated streaming outputs should replace matching outputs correctly`, async () => {
		const context = createContext({ outputScrolling: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 687: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 689: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 735: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 783: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 833: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 927: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 977: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 979: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1023: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1025: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1073: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1075: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1167: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1359: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1361: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, outputElement);
		const secondOutput = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutput);
		const newOutputItem1 = createOutputItem('replaced content', stdoutMimeType, '2');
		await renderer!.renderOutputItem(newOutputItem1, secondOutput);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') === -1, `Content was not replaced in output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Consolidated streaming outputs should append matching outputs correctly`, async () => {
		const context = createContext({ outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 636: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 699: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 872: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 874: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1049: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1108: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1167: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1226: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1228: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1285: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1287: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1344: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1403: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1405: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1462: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1521: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1580: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1582: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, outputElement);
		const secondOutput = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutput);
		const appendingOutput = createOutputItem('', stdoutMimeType, '2', ' appended');
		await renderer!.renderOutputItem(appendingOutput, secondOutput);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content') > -1, `Second content was not added to ouptut element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('appended') > -1, `Content was not appended to ouptut element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Streaming outputs interleaved with other mime types will produce separate outputs`, async () => {
		const context = createContext({ outputScrolling: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const firstOutputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem2 = createOutputItem(JSON.stringify(error), errorMimeType, '2');
		const outputItem3 = createOutputItem('second stream content', stdoutMimeType, '3');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 684: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1106: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1174: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1176: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1386: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1452: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1454: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1456: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1592: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1594: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1596: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1662: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1664: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1666: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1736: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1804: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1806: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, firstOutputElement);
		const secondOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutputElement);
		const thirdOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem3, thirdOutputElement);

		assert.ok(firstOutputElement.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(secondOutputElement.innerHTML.indexOf('>TypeError</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('>second stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Multiple adjacent streaming outputs, rerendering the first should erase the rest`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		const outputItem3 = createOutputItem('third stream content', stderrMimeType, '3');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 727: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 728: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 809: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 977: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1055: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1056: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1057: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1059: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1139: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1301: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1302: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1303: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1465: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1467: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1469: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1547: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1548: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1549: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1551: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1629: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1630: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1631: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1711: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1713: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1715: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1794: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1795: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1875: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1876: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1877: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1879: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1957: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1958: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1959: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1961: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2039: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2040: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2041: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2043: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(outputItem1, outputElement);
		await renderer!.renderOutputItem(outputItem2, outputHtml.appendOutputElement());
		await renderer!.renderOutputItem(outputItem3, outputHtml.appendOutputElement());
		const newOutputItem1 = createOutputItem('replaced content', stderrMimeType, '1');
		await renderer!.renderOutputItem(newOutputItem1, outputElement);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>third stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
	});

	test(`Rendered output will wrap on settings change event`, async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('content', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);
		fireSettingsChange({ outputWordWrap: true, outputScrolling: true });

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
			`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
	});

	test(`Settings event change listeners should not grow if output is re-rendered`, async () => {
		const context = createContext({ outputWordWrap: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const outputElement = new OutputHtml().getFirstOuputElement();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		await renderer!.renderOutputItem(createOutputItem('content', stdoutMimeType), outputElement);
		const handlerCount = settingsChangedHandlers.length;
		await renderer!.renderOutputItem(createOutputItem('content', stdoutMimeType), outputElement);

		assert.equal(settingsChangedHandlers.length, handlerCount);
	});

	const rawIPythonError = {
		name: "NameError",
		message: "name 'x' is not defined",
		stack: "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m" +
			"\u001b[1;31mNameError\u001b[0m                                 Traceback (most recent call last)" +
			"Cell \u001b[1;32mIn[2], line 1\u001b[0m\n\u001b[1;32m----> 1\u001b[0m \u001b[43mmyfunc\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n" +
			"Cell \u001b[1;32mIn[1], line 2\u001b[0m, in \u001b[0;36mmyfunc\u001b[1;34m()\u001b[0m\n\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mmyfunc\u001b[39m():\n\u001b[1;32m----> 2\u001b[0m     \u001b[38;5;28mprint\u001b[39m(\u001b[43mx\u001b[49m)\n" +
			"\u001b[1;31mNameError\u001b[0m: name 'x' is not defined"
	};

	test(`Should clean up raw IPython error stack traces`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(rawIPythonError), errorMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('class="code-background-colored"') === -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

});

