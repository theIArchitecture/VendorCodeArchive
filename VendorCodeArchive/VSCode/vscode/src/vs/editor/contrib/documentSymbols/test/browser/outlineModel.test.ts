//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../common/core/range.js';
import { DocumentSymbol, SymbolKind } from '../../../../common/languages.js';
import { LanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { IModelService } from '../../../../common/services/model.js';
import { createModelServices, createTextModel } from '../../../../test/common/testTextModel.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IMarker, MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { OutlineElement, OutlineGroup, OutlineModel, OutlineModelService } from '../../browser/outlineModel.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('OutlineModel', function () {

	const disposables = new DisposableStore();
	const languageFeaturesService = new LanguageFeaturesService();

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('OutlineModel#create, cached', async function () {

		const insta = createModelServices(disposables);
		const modelService = insta.get(IModelService);
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		const service = new OutlineModelService(languageFeaturesService, new LanguageFeatureDebounceService(new NullLogService(), envService), modelService);

		const model = createTextModel('foo', undefined, undefined, URI.file('/fome/path.foo'));
		let count = 0;
		const reg = languageFeaturesService.documentSymbolProvider.register({ pattern: '**/path.foo' }, {
			provideDocumentSymbols() {
				count += 1;
				return [];
			}
		});

		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 1);

		// cached
		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 1);

		// new version
		model.applyEdits([{ text: 'XXX', range: new Range(1, 1, 1, 1) }]);
		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 2);

		reg.dispose();
		model.dispose();
		service.dispose();
	});

	test('OutlineModel#create, cached/cancel', async function () {

		const insta = createModelServices(disposables);
		const modelService = insta.get(IModelService);
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		const service = new OutlineModelService(languageFeaturesService, new LanguageFeatureDebounceService(new NullLogService(), envService), modelService);
		const model = createTextModel('foo', undefined, undefined, URI.file('/fome/path.foo'));
		let isCancelled = false;

		const reg = languageFeaturesService.documentSymbolProvider.register({ pattern: '**/path.foo' }, {
			provideDocumentSymbols(d, token) {
				return new Promise(resolve => {
					const l = token.onCancellationRequested(_ => {
						isCancelled = true;
						resolve(null);
						l.dispose();
					});
				});
			}
		});

		assert.strictEqual(isCancelled, false);
		const s1 = new CancellationTokenSource();
		service.getOrCreate(model, s1.token);
		const s2 = new CancellationTokenSource();
		service.getOrCreate(model, s2.token);

		s1.cancel();
		assert.strictEqual(isCancelled, false);

		s2.cancel();
		assert.strictEqual(isCancelled, true);

		reg.dispose();
		model.dispose();
		service.dispose();

	});

	function fakeSymbolInformation(range: Range, name: string = 'foo'): DocumentSymbol {
		return {
			name,
			detail: 'fake',
			kind: SymbolKind.Boolean,
			tags: [],
			selectionRange: range,
			range: range
		};
	}

	function fakeMarker(range: Range): IMarker {
		return { ...range, owner: 'ffff', message: 'test', severity: MarkerSeverity.Error, resource: null! };
	}

	test('OutlineElement - updateMarker', function () {

		const e0 = new OutlineElement('foo1', null!, fakeSymbolInformation(new Range(1, 1, 1, 10)));
		const e1 = new OutlineElement('foo2', null!, fakeSymbolInformation(new Range(2, 1, 5, 1)));
		const e2 = new OutlineElement('foo3', null!, fakeSymbolInformation(new Range(6, 1, 10, 10)));

		const group = new OutlineGroup('group', null!, null!, 1);
		group.children.set(e0.id, e0);
		group.children.set(e1.id, e1);
		group.children.set(e2.id, e2);

		const data = [fakeMarker(new Range(6, 1, 6, 7)), fakeMarker(new Range(1, 1, 1, 4)), fakeMarker(new Range(10, 2, 14, 1))];
		data.sort(Range.compareRangesUsingStarts); // model does this

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		group.updateMarker(data);
		assert.strictEqual(data.length, 0); // all 'stolen'
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(e0.marker!.count, 1);
		assert.strictEqual(e1.marker, undefined);
		assert.strictEqual(e2.marker!.count, 2);

		group.updateMarker([]);
		assert.strictEqual(e0.marker, undefined);
		assert.strictEqual(e1.marker, undefined);
		assert.strictEqual(e2.marker, undefined);
	});

	test('OutlineElement - updateMarker, 2', function () {

		const p = new OutlineElement('A', null!, fakeSymbolInformation(new Range(1, 1, 11, 1)));
		const c1 = new OutlineElement('A/B', null!, fakeSymbolInformation(new Range(2, 4, 5, 4)));
		const c2 = new OutlineElement('A/C', null!, fakeSymbolInformation(new Range(6, 4, 9, 4)));

		const group = new OutlineGroup('group', null!, null!, 1);
		group.children.set(p.id, p);
		p.children.set(c1.id, c1);
		p.children.set(c2.id, c2);

		let data = [
			fakeMarker(new Range(2, 4, 5, 4))
		];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		group.updateMarker(data);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(p.marker!.count, 0);
		assert.strictEqual(c1.marker!.count, 1);
		assert.strictEqual(c2.marker, undefined);

		data = [
			fakeMarker(new Range(2, 4, 5, 4)),
			fakeMarker(new Range(2, 6, 2, 8)),
			fakeMarker(new Range(7, 6, 7, 8)),
		];
		group.updateMarker(data);
		assert.strictEqual(p.marker!.count, 0);
		assert.strictEqual(c1.marker!.count, 2);
		assert.strictEqual(c2.marker!.count, 1);

		data = [
			fakeMarker(new Range(1, 4, 1, 11)),
			fakeMarker(new Range(7, 6, 7, 8)),
		];
		group.updateMarker(data);
		assert.strictEqual(p.marker!.count, 1);
		assert.strictEqual(c1.marker, undefined);
		assert.strictEqual(c2.marker!.count, 1);
	});

	test('OutlineElement - updateMarker/multiple groups', function () {

		const model = new class extends OutlineModel {
			constructor() {
				super(null!);
			}
			readyForTesting() {
				this._groups = this.children as any;
			}
		};
		model.children.set('g1', new OutlineGroup('g1', model, null!, 1));
		model.children.get('g1')!.children.set('c1', new OutlineElement('c1', model.children.get('g1')!, fakeSymbolInformation(new Range(1, 1, 11, 1))));

		model.children.set('g2', new OutlineGroup('g2', model, null!, 1));
		model.children.get('g2')!.children.set('c2', new OutlineElement('c2', model.children.get('g2')!, fakeSymbolInformation(new Range(1, 1, 7, 1))));
		model.children.get('g2')!.children.get('c2')!.children.set('c2.1', new OutlineElement('c2.1', model.children.get('g2')!.children.get('c2')!, fakeSymbolInformation(new Range(1, 3, 2, 19))));
		model.children.get('g2')!.children.get('c2')!.children.set('c2.2', new OutlineElement('c2.2', model.children.get('g2')!.children.get('c2')!, fakeSymbolInformation(new Range(4, 1, 6, 10))));

		model.readyForTesting();

		const data = [
			fakeMarker(new Range(1, 1, 2, 8)),
			fakeMarker(new Range(6, 1, 6, 98)),
		];

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		model.updateMarker(data);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 568: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 620: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 648: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 649: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 676: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(model.children.get('g1')!.children.get('c1')!.marker!.count, 2);
		assert.strictEqual(model.children.get('g2')!.children.get('c2')!.children.get('c2.1')!.marker!.count, 1);
		assert.strictEqual(model.children.get('g2')!.children.get('c2')!.children.get('c2.2')!.marker!.count, 1);
	});

});
