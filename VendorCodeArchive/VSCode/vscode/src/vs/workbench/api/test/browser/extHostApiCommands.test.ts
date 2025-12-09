//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../editor/contrib/codeAction/browser/codeAction.js';
import '../../../../editor/contrib/codelens/browser/codelens.js';
import '../../../../editor/contrib/colorPicker/browser/colorPickerContribution.js';
import '../../../../editor/contrib/format/browser/format.js';
import '../../../../editor/contrib/gotoSymbol/browser/goToCommands.js';
import '../../../../editor/contrib/documentSymbols/browser/documentSymbols.js';
import '../../../../editor/contrib/hover/browser/getHover.js';
import '../../../../editor/contrib/links/browser/getLinks.js';
import '../../../../editor/contrib/parameterHints/browser/provideSignatureHelp.js';
import '../../../../editor/contrib/smartSelect/browser/smartSelect.js';
import '../../../../editor/contrib/suggest/browser/suggest.js';
import '../../../../editor/contrib/rename/browser/rename.js';
import '../../../../editor/contrib/inlayHints/browser/inlayHintsController.js';

import assert from 'assert';
import { setUnexpectedErrorHandler, errorHandler } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import * as types from '../../common/extHostTypes.js';
import { createTextModel } from '../../../../editor/test/common/testTextModel.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { MarkerService } from '../../../../platform/markers/common/markerService.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ExtHostLanguageFeatures } from '../../common/extHostLanguageFeatures.js';
import { MainThreadLanguageFeatures } from '../../browser/mainThreadLanguageFeatures.js';
import { ExtHostApiCommands } from '../../common/extHostApiCommands.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { MainThreadCommands } from '../../browser/mainThreadCommands.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { MainContext, ExtHostContext } from '../../common/extHost.protocol.js';
import { ExtHostDiagnostics } from '../../common/extHostDiagnostics.js';
import type * as vscode from 'vscode';
import '../../../contrib/search/browser/search.contribution.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { nullExtensionDescription, IExtensionService } from '../../../services/extensions/common/extensions.js';
import { dispose, ImmortalReference } from '../../../../base/common/lifecycle.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { mock } from '../../../../base/test/common/mock.js';
import { NullApiDeprecationService } from '../../common/extHostApiDeprecationService.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';
import { IOutlineModelService, OutlineModelService } from '../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../../../editor/common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../editor/common/services/languageFeaturesService.js';
import { assertType } from '../../../../base/common/types.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { timeout } from '../../../../base/common/async.js';

function assertRejects(fn: () => Promise<any>, message: string = 'Expected rejection') {
	return fn().then(() => assert.ok(false, message), _err => assert.ok(true));
}

function isLocation(value: vscode.Location | vscode.LocationLink): value is vscode.Location {
	const candidate = value as vscode.Location;
	return candidate && candidate.uri instanceof URI && candidate.range instanceof types.Range;
}

suite('ExtHostLanguageFeatureCommands', function () {
	const defaultSelector = { scheme: 'far' };
	let model: ITextModel;

	let insta: TestInstantiationService;
	let rpcProtocol: TestRPCProtocol;
	let extHost: ExtHostLanguageFeatures;
	let mainThread: MainThreadLanguageFeatures;
	let commands: ExtHostCommands;
	let disposables: vscode.Disposable[] = [];

	let originalErrorHandler: (e: any) => any;

	suiteSetup(() => {
		model = createTextModel(
			[
				'This is the first line',
				'This is the second line',
				'This is the third line',
			].join('\n'),
			undefined,
			undefined,
			URI.parse('far://testing/file.b'));
		originalErrorHandler = errorHandler.getUnexpectedErrorHandler();
		setUnexpectedErrorHandler(() => { });

		// Use IInstantiationService to get typechecking when instantiating
		rpcProtocol = new TestRPCProtocol();
		const services = new ServiceCollection();
		services.set(IUriIdentityService, new class extends mock<IUriIdentityService>() {
			override asCanonicalUri(uri: URI): URI {
				return uri;
			}
		});
		services.set(ILanguageFeaturesService, new SyncDescriptor(LanguageFeaturesService));
		services.set(IExtensionService, new class extends mock<IExtensionService>() {
			override async activateByEvent() {

			}
			override activationEventIsDone(activationEvent: string): boolean {
				return true;
			}
		});
		services.set(ICommandService, new SyncDescriptor(class extends mock<ICommandService>() {

			override executeCommand(id: string, ...args: any): any {
				const command = CommandsRegistry.getCommands().get(id);
				if (!command) {
					return Promise.reject(new Error(id + ' NOT known'));
				}
				const { handler } = command;
				return Promise.resolve(insta.invokeFunction(handler, ...args));
			}
		}));
		services.set(IEnvironmentService, new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		});
		services.set(IMarkerService, new MarkerService());
		services.set(ILogService, new SyncDescriptor(NullLogService));
		services.set(ILanguageFeatureDebounceService, new SyncDescriptor(LanguageFeatureDebounceService));
		services.set(IModelService, new class extends mock<IModelService>() {
			override getModel() { return model; }
			override onModelRemoved = Event.None;
		});
		services.set(ITextModelService, new class extends mock<ITextModelService>() {
			override async createModelReference() {
				return new ImmortalReference<IResolvedTextEditorModel>(new class extends mock<IResolvedTextEditorModel>() {
					override textEditorModel = model;
				});
			}
		});
		services.set(IEditorWorkerService, new class extends mock<IEditorWorkerService>() {
			override async computeMoreMinimalEdits(_uri: any, edits: any) {
				return edits || undefined;
			}
		});
		services.set(ILanguageFeatureDebounceService, new SyncDescriptor(LanguageFeatureDebounceService));
		services.set(IOutlineModelService, new SyncDescriptor(OutlineModelService));
		services.set(IConfigurationService, new TestConfigurationService());

		insta = new TestInstantiationService(services);

		const extHostDocumentsAndEditors = new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService());
		extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				versionId: model.getVersionId(),
				languageId: model.getLanguageId(),
				uri: model.uri,
				lines: model.getValue().split(model.getEOL()),
				EOL: model.getEOL(),
				encoding: 'utf8'
			}]
		});
		const extHostDocuments = new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDocuments, extHostDocuments);

		commands = new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostCommands, commands);
		rpcProtocol.set(MainContext.MainThreadCommands, insta.createInstance(MainThreadCommands, rpcProtocol));
		ExtHostApiCommands.register(commands);

		const diagnostics = new ExtHostDiagnostics(rpcProtocol, new NullLogService(), new class extends mock<IExtHostFileSystemInfo>() { }, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDiagnostics, diagnostics);

		extHost = new ExtHostLanguageFeatures(rpcProtocol, new URITransformerService(null), extHostDocuments, commands, diagnostics, new NullLogService(), NullApiDeprecationService, new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostLanguageFeatures, extHost);

		mainThread = rpcProtocol.set(MainContext.MainThreadLanguageFeatures, insta.createInstance(MainThreadLanguageFeatures, rpcProtocol));

		// forcefully create the outline service so that `ensureNoDisposablesAreLeakedInTestSuite` doesn't bark
		insta.get(IOutlineModelService);

		return rpcProtocol.sync();
	});

	suiteTeardown(() => {
		setUnexpectedErrorHandler(originalErrorHandler);
		model.dispose();
		mainThread.dispose();

		(<OutlineModelService>insta.get(IOutlineModelService)).dispose();
		insta.dispose();
	});

	teardown(() => {
		disposables = dispose(disposables);
		return rpcProtocol.sync();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// --- workspace symbols

	function testApiCmd(name: string, fn: () => Promise<any>) {
		test(name, async function () {
			await runWithFakedTimers({}, async () => {
				await fn();
				await timeout(10000); 	// API commands for things that allow commands dispose their result delay. This is to be nice
				// because otherwise properties like command are disposed too early
			});
		});

	}

	test('WorkspaceSymbols, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', true))
		];
		return Promise.all(promises);
	});

	test('WorkspaceSymbols, back and forth', function () {

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, <vscode.WorkspaceSymbolProvider>{
			provideWorkspaceSymbols(query): any {
				return [
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/first')),
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/second'))
				];
			}
		}));

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, <vscode.WorkspaceSymbolProvider>{
			provideWorkspaceSymbols(query): any {
				return [
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/first'))
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', 'testing').then(value => {

				assert.strictEqual(value.length, 2); // de-duped
				for (const info of value) {
					assert.strictEqual(info instanceof types.SymbolInformation, true);
					assert.strictEqual(info.name, 'testing');
					assert.strictEqual(info.kind, types.SymbolKind.Array);
				}
			});
		});
	});

	test('executeWorkspaceSymbolProvider should accept empty string, #39522', async function () {

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, {
			provideWorkspaceSymbols(): vscode.SymbolInformation[] {
				return [new types.SymbolInformation('hello', types.SymbolKind.Array, new types.Range(0, 0, 0, 0), URI.parse('foo:bar')) as vscode.SymbolInformation];
			}
		}));

		await rpcProtocol.sync();
		let symbols = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', '');
		assert.strictEqual(symbols.length, 1);

		await rpcProtocol.sync();
		symbols = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', '*');
		assert.strictEqual(symbols.length, 1);
	});

	// --- formatting
	test('executeFormatDocumentProvider, back and forth', async function () {

		disposables.push(extHost.registerDocumentFormattingEditProvider(nullExtensionDescription, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits() {
				return [types.TextEdit.insert(new types.Position(0, 0), '42')];
			}
		}));

		await rpcProtocol.sync();
		const edits = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeFormatDocumentProvider', model.uri);
		assert.strictEqual(edits.length, 1);
	});


	// --- rename
	test('vscode.prepareRename', async function () {
		disposables.push(extHost.registerRenameProvider(nullExtensionDescription, defaultSelector, new class implements vscode.RenameProvider {

			prepareRename(document: vscode.TextDocument, position: vscode.Position) {
				return {
					range: new types.Range(0, 12, 0, 24),
					placeholder: 'foooPlaceholder'
				};
			}

			provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string) {
				const edit = new types.WorkspaceEdit();
				edit.insert(document.uri, <types.Position>position, newName);
				return edit;
			}
		}));

		await rpcProtocol.sync();

		const data = await commands.executeCommand<{ range: vscode.Range; placeholder: string }>('vscode.prepareRename', model.uri, new types.Position(0, 12));

		assert.ok(data);
		assert.strictEqual(data.placeholder, 'foooPlaceholder');
		assert.strictEqual(data.range.start.line, 0);
		assert.strictEqual(data.range.start.character, 12);
		assert.strictEqual(data.range.end.line, 0);
		assert.strictEqual(data.range.end.character, 24);

	});

	test('vscode.executeDocumentRenameProvider', async function () {
		disposables.push(extHost.registerRenameProvider(nullExtensionDescription, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string) {
				const edit = new types.WorkspaceEdit();
				edit.insert(document.uri, <types.Position>position, newName);
				return edit;
			}
		}));

		await rpcProtocol.sync();

		const edit = await commands.executeCommand<vscode.WorkspaceEdit>('vscode.executeDocumentRenameProvider', model.uri, new types.Position(0, 12), 'newNameOfThis');

		assert.ok(edit);
		assert.strictEqual(edit.has(model.uri), true);
		const textEdits = edit.get(model.uri);
		assert.strictEqual(textEdits.length, 1);
		assert.strictEqual(textEdits[0].newText, 'newNameOfThis');
	});

	// --- definition

	test('Definition, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Definition, back and forth', function () {

		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});


	test('Definition, back and forth (sorting & de-deduping)', function () {

		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return new types.Location(URI.parse('file:///b'), new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(URI.parse('file:///b'), new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return [
					new types.Location(URI.parse('file:///a'), new types.Range(2, 0, 0, 0)),
					new types.Location(URI.parse('file:///c'), new types.Range(3, 0, 0, 0)),
					new types.Location(URI.parse('file:///d'), new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);

				assert.strictEqual(values[0].uri.path, '/a');
				assert.strictEqual(values[1].uri.path, '/b');
				assert.strictEqual(values[2].uri.path, '/c');
				assert.strictEqual(values[3].uri.path, '/d');
			});
		});
	});

	test('Definition Link', () => {
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- declaration

	test('Declaration, back and forth', function () {

		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDeclarationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Declaration Link', () => {
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeDeclarationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- type definition

	test('Type Definition, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Type Definition, back and forth', function () {

		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeTypeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Type Definition Link', () => {
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeTypeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- implementation

	test('Implementation, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Implementation, back and forth', function () {

		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeImplementationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Implementation Definition Link', () => {
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeImplementationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- references

	test('reference search, back and forth', function () {

		disposables.push(extHost.registerReferenceProvider(nullExtensionDescription, defaultSelector, <vscode.ReferenceProvider>{
			provideReferences() {
				return [
					new types.Location(URI.parse('some:uri/path'), new types.Range(0, 1, 0, 5))
				];
			}
		}));

		return commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', model.uri, new types.Position(0, 0)).then(values => {
			assert.strictEqual(values.length, 1);
			const [first] = values;
			assert.strictEqual(first.uri.toString(), 'some:uri/path');
			assert.strictEqual(first.range.start.line, 0);
			assert.strictEqual(first.range.start.character, 1);
			assert.strictEqual(first.range.end.line, 0);
			assert.strictEqual(first.range.end.character, 5);
		});
	});

	// --- document highlights

	test('"vscode.executeDocumentHighlights" API has stopped returning DocumentHighlight[]#200056', async function () {


		disposables.push(extHost.registerDocumentHighlightProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentHighlightProvider>{
			provideDocumentHighlights() {
				return [
					new types.DocumentHighlight(new types.Range(0, 17, 0, 25), types.DocumentHighlightKind.Read)
				];
			}
		}));

		await rpcProtocol.sync();

		return commands.executeCommand<vscode.DocumentHighlight[]>('vscode.executeDocumentHighlights', model.uri, new types.Position(0, 0)).then(values => {
			assert.ok(Array.isArray(values));
			assert.strictEqual(values.length, 1);
			const [first] = values;
			assert.strictEqual(first.range.start.line, 0);
			assert.strictEqual(first.range.start.character, 17);
			assert.strictEqual(first.range.end.line, 0);
			assert.strictEqual(first.range.end.character, 25);
		});

	});

	// --- outline

	test('Outline, back and forth', function () {
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				return [
					new types.SymbolInformation('testing1', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0)),
					new types.SymbolInformation('testing2', types.SymbolKind.Enum, new types.Range(0, 1, 0, 3)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', model.uri).then(values => {
				assert.strictEqual(values.length, 2);
				const [first, second] = values;
				assert.strictEqual(first instanceof types.SymbolInformation, true);
				assert.strictEqual(second instanceof types.SymbolInformation, true);
				assert.strictEqual(first.name, 'testing2');
				assert.strictEqual(second.name, 'testing1');
			});
		});
	});

	test('vscode.executeDocumentSymbolProvider command only returns SymbolInformation[] rather than DocumentSymbol[] #57984', function () {
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				return [
					new types.SymbolInformation('SymbolInformation', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0))
				];
			}
		}));
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				const root = new types.DocumentSymbol('DocumentSymbol', 'DocumentSymbol#detail', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0), new types.Range(1, 0, 1, 0));
				root.children = [new types.DocumentSymbol('DocumentSymbol#child', 'DocumentSymbol#detail#child', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0), new types.Range(1, 0, 1, 0))];
				return [root];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.SymbolInformation & vscode.DocumentSymbol)[]>('vscode.executeDocumentSymbolProvider', model.uri).then(values => {
				assert.strictEqual(values.length, 2);
				const [first, second] = values;
				assert.strictEqual(first instanceof types.SymbolInformation, true);
				assert.strictEqual(first instanceof types.DocumentSymbol, false);
				assert.strictEqual(second instanceof types.SymbolInformation, true);
				assert.strictEqual(first.name, 'DocumentSymbol');
				assert.strictEqual(first.children.length, 1);
				assert.strictEqual(second.name, 'SymbolInformation');
			});
		});
	});

	// --- suggest

	testApiCmd('triggerCharacter is null when completion provider is called programmatically #159914', async function () {

		let actualContext: vscode.CompletionContext | undefined;

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(_doc, _pos, _tok, context): any {
				actualContext = context;
				return [];
			}
		}, []));

		await rpcProtocol.sync();

		await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));

		assert.ok(actualContext);
		assert.deepStrictEqual(actualContext, { triggerKind: types.CompletionTriggerKind.Invoke, triggerCharacter: undefined });

	});

	testApiCmd('Suggest, back and forth', async function () {

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.documentation = new types.MarkdownString('hello_md_string');
				const b = new types.CompletionItem('item2');
				b.textEdit = types.TextEdit.replace(new types.Range(0, 4, 0, 8), 'foo'); // overwite after
				const c = new types.CompletionItem('item3');
				c.textEdit = types.TextEdit.replace(new types.Range(0, 1, 0, 6), 'foobar'); // overwite before & after

				// snippet string!
				const d = new types.CompletionItem('item4');
				d.range = new types.Range(0, 1, 0, 4);// overwite before
				d.insertText = new types.SnippetString('foo$0bar');
				return [a, b, c, d];
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));
		assert.ok(list instanceof types.CompletionList);
		const values = list.items;
		assert.ok(Array.isArray(values));
		assert.strictEqual(values.length, 4);
		const [first, second, third, fourth] = values;
		assert.strictEqual(first.label, 'item1');
		assert.strictEqual(first.textEdit, undefined); // no text edit, default ranges
		assert.ok(!types.Range.isRange(first.range));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 840: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual((<types.MarkdownString>first.documentation).value, 'hello_md_string');
		assert.strictEqual(second.label, 'item2');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 868: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 878: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 880: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 900: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 903: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 917: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 918: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 921: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 922: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 923: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 924: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 938: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 940: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 941: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 942: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 952: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 959: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 960: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 971: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 972: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 976: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 977: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 978: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 986: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 988: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 992: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 995: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1010: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1011: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1012: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1022: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1023: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1024: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1025: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1026: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1040: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1041: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1046: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1047: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1048: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1049: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1058: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1059: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1060: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1065: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1068: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1076: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1084: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1095: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1096: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1097: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1098: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1100: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1101: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1115: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1116: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1118: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1120: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1122: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1131: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1132: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1133: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1134: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1138: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1139: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1140: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1148: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1155: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1166: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1167: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1168: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1172: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1173: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1174: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1175: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1176: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1202: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1203: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1204: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1205: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1206: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1211: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1212: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1221: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1223: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1224: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1226: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1227: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1228: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1229: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1244: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1247: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1248: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1257: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1260: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1262: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1264: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1265: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1275: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1276: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1280: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1281: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1282: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1296: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1298: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1299: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1300: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1301: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1310: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1313: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1314: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1317: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1318: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1329: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1330: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1331: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1334: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1335: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1349: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1350: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1352: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1353: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1355: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1364: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1365: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1368: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1370: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1371: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1372: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1373: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1374: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1385: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1386: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1389: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1390: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1391: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1392: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1400: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1401: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1402: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1403: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1404: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1406: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1407: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1408: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1409: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1410: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (10):
//   1. Line 1418: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1419: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1424: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1425: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1426: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1427: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(second.textEdit!.newText, 'foo');
		assert.strictEqual(second.textEdit!.range.start.line, 0);
		assert.strictEqual(second.textEdit!.range.start.character, 4);
		assert.strictEqual(second.textEdit!.range.end.line, 0);
		assert.strictEqual(second.textEdit!.range.end.character, 8);
		assert.strictEqual(third.label, 'item3');
		assert.strictEqual(third.textEdit!.newText, 'foobar');
		assert.strictEqual(third.textEdit!.range.start.line, 0);
		assert.strictEqual(third.textEdit!.range.start.character, 1);
		assert.strictEqual(third.textEdit!.range.end.line, 0);
		assert.strictEqual(third.textEdit!.range.end.character, 6);
		assert.strictEqual(fourth.label, 'item4');
		assert.strictEqual(fourth.textEdit, undefined);
		const range: any = fourth.range!;
		assert.ok(types.Range.isRange(range));
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.start.character, 1);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 4);
		assert.ok(fourth.insertText instanceof types.SnippetString);
		assert.strictEqual((<types.SnippetString>fourth.insertText).value, 'foo$0bar');

	});

	testApiCmd('Suggest, return CompletionList !array', async function () {

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				const b = new types.CompletionItem('item2');
				return new types.CompletionList(<any>[a, b], true);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.isIncomplete, true);
	});

	testApiCmd('Suggest, resolve completion items', async function () {


		let resolveCount = 0;

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				const b = new types.CompletionItem('item2');
				const c = new types.CompletionItem('item3');
				const d = new types.CompletionItem('item4');
				return new types.CompletionList([a, b, c, d], false);
			},
			resolveCompletionItem(item) {
				resolveCount += 1;
				return item;
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined,
			2 // maxItemsToResolve
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(resolveCount, 2);

	});

	testApiCmd('"vscode.executeCompletionItemProvider" doesnot return a preselect field #53749', async function () {



		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.preselect = true;
				const b = new types.CompletionItem('item2');
				const c = new types.CompletionItem('item3');
				c.preselect = true;
				const d = new types.CompletionItem('item4');
				return new types.CompletionList([a, b, c, d], false);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 4);

		const [a, b, c, d] = list.items;
		assert.strictEqual(a.preselect, true);
		assert.strictEqual(b.preselect, undefined);
		assert.strictEqual(c.preselect, true);
		assert.strictEqual(d.preselect, undefined);
	});

	testApiCmd('executeCompletionItemProvider doesn\'t capture commitCharacters #58228', async function () {
		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.commitCharacters = ['a', 'b'];
				const b = new types.CompletionItem('item2');
				return new types.CompletionList([a, b], false);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 2);

		const [a, b] = list.items;
		assert.deepStrictEqual(a.commitCharacters, ['a', 'b']);
		assert.strictEqual(b.commitCharacters, undefined);
	});

	testApiCmd('vscode.executeCompletionItemProvider returns the wrong CompletionItemKinds in insiders #95715', async function () {
		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				return [
					new types.CompletionItem('My Method', types.CompletionItemKind.Method),
					new types.CompletionItem('My Property', types.CompletionItemKind.Property),
				];
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 2);

		const [a, b] = list.items;
		assert.strictEqual(a.kind, types.CompletionItemKind.Method);
		assert.strictEqual(b.kind, types.CompletionItemKind.Property);
	});

	// --- signatureHelp

	test('Parameter Hints, back and forth', async () => {
		disposables.push(extHost.registerSignatureHelpProvider(nullExtensionDescription, defaultSelector, new class implements vscode.SignatureHelpProvider {
			provideSignatureHelp(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.SignatureHelp {
				return {
					activeSignature: 0,
					activeParameter: 1,
					signatures: [
						{
							label: 'abc',
							documentation: `${context.triggerKind === 1 /* vscode.SignatureHelpTriggerKind.Invoke */ ? 'invoked' : 'unknown'} ${context.triggerCharacter}`,
							parameters: []
						}
					]
				};
			}
		}, []));

		await rpcProtocol.sync();

		const firstValue = await commands.executeCommand<vscode.SignatureHelp>('vscode.executeSignatureHelpProvider', model.uri, new types.Position(0, 1), ',');
		assert.strictEqual(firstValue.activeSignature, 0);
		assert.strictEqual(firstValue.activeParameter, 1);
		assert.strictEqual(firstValue.signatures.length, 1);
		assert.strictEqual(firstValue.signatures[0].label, 'abc');
		assert.strictEqual(firstValue.signatures[0].documentation, 'invoked ,');
	});

	// --- quickfix

	testApiCmd('QuickFix, back and forth', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(): vscode.Command[] {
				return [{ command: 'testing', title: 'Title', arguments: [1, 2, true] }];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Command[]>('vscode.executeCodeActionProvider', model.uri, new types.Range(0, 0, 1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.strictEqual(first.title, 'Title');
				assert.strictEqual(first.command, 'testing');
				assert.deepStrictEqual(first.arguments, [1, 2, true]);
			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider results seem to be missing their `command` property #45124', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, range): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, range],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
				}];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, new types.Range(0, 0, 1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.ok(first.command);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(first.command.command, 'command');
				assert.strictEqual(first.command.title, 'command_title');
				assert.strictEqual(first.kind!.value, 'foo');
				assert.strictEqual(first.title, 'title');

			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider passes Range to provider although Selection is passed in #77997', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, rangeOrSelection],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
				}];
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.ok(first.command);
				assert.ok(first.command.arguments![1] instanceof types.Selection);
				assert.ok(first.command.arguments![1].isEqual(selection));
			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider results seem to be missing their `isPreferred` property #78098', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, rangeOrSelection],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
					isPreferred: true
				}];
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.strictEqual(first.isPreferred, true);
			});
		});
	});

	testApiCmd('resolving code action', async function () {

		let didCallResolve = 0;
		class MyAction extends types.CodeAction { }

		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [new MyAction('title', types.CodeActionKind.Empty.append('foo'))];
			},
			resolveCodeAction(action): vscode.CodeAction {
				assert.ok(action instanceof MyAction);

				didCallResolve += 1;
				action.title = 'resolved title';
				action.edit = new types.WorkspaceEdit();
				return action;
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection, undefined, 1000);
		assert.strictEqual(didCallResolve, 1);
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.title, 'title'); // does NOT change
		assert.ok(first.edit); // is set
	});

	// --- code lens

	testApiCmd('CodeLens, back and forth', function () {

		const complexArg = {
			foo() { },
			bar() { },
			big: extHost
		};

		disposables.push(extHost.registerCodeLensProvider(nullExtensionDescription, defaultSelector, <vscode.CodeLensProvider>{
			provideCodeLenses(): any {
				return [new types.CodeLens(new types.Range(0, 0, 1, 1), { title: 'Title', command: 'cmd', arguments: [1, true, complexArg] })];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1195: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				const [first] = value;

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1232: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1233: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1264: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1265: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1296: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1324: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1327: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1328: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1355: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1357: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1358: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1359: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1386: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1387: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1388: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1389: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1390: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1417: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1419: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1420: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1448: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1449: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1450: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1451: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1452: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1480: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1481: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1482: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1483: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1510: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1511: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1512: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1513: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1514: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1541: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1542: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1544: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1545: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1572: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1573: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1574: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1575: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1576: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1603: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1604: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1607: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1634: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1635: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1636: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1637: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1638: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1666: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1668: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1669: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1696: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1697: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1698: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1699: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1700: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1727: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1728: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1730: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1731: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1758: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1759: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1760: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1761: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1762: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1789: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1790: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1791: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1793: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1820: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1821: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1822: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1823: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1824: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1851: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1852: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1853: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1854: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1855: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1882: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1883: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1884: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1885: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1886: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1913: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1914: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1915: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1916: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1917: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1944: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1945: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1946: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1947: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1948: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1977: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1978: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1979: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2006: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2007: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2008: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2009: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2010: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2037: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2038: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2039: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2040: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2041: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2068: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2069: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2070: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2071: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2072: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2099: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2101: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2102: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2103: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2131: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2132: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2133: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2134: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2161: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2162: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2163: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2164: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2165: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 2192: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2194: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2195: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2196: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(first.command!.title, 'Title');
				assert.strictEqual(first.command!.command, 'cmd');
				assert.strictEqual(first.command!.arguments![0], 1);
				assert.strictEqual(first.command!.arguments![1], true);
				assert.strictEqual(first.command!.arguments![2], complexArg);
			});
		});
	});

	testApiCmd('CodeLens, resolve', async function () {

		let resolveCount = 0;

		disposables.push(extHost.registerCodeLensProvider(nullExtensionDescription, defaultSelector, <vscode.CodeLensProvider>{
			provideCodeLenses(): any {
				return [
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1), { title: 'Already resolved', command: 'fff' })
				];
			},
			resolveCodeLens(codeLens: types.CodeLens) {
				codeLens.command = { title: resolveCount.toString(), command: 'resolved' };
				resolveCount += 1;
				return codeLens;
			}
		}));

		await rpcProtocol.sync();

		let value = await commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri, 2);

		assert.strictEqual(value.length, 3); // the resolve argument defines the number of results being returned
		assert.strictEqual(resolveCount, 2);

		resolveCount = 0;
		value = await commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri);

		assert.strictEqual(value.length, 4);
		assert.strictEqual(resolveCount, 0);
	});

	testApiCmd('Links, back and forth', function () {

		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				return [new types.DocumentLink(new types.Range(0, 0, 0, 20), URI.parse('foo:bar'))];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.target + '', 'foo:bar');
				assert.strictEqual(first.range.start.line, 0);
				assert.strictEqual(first.range.start.character, 0);
				assert.strictEqual(first.range.end.line, 0);
				assert.strictEqual(first.range.end.character, 20);
			});
		});
	});

	testApiCmd('What\'s the condition for DocumentLink target to be undefined? #106308', async function () {
		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				return [new types.DocumentLink(new types.Range(0, 0, 0, 20), undefined)];
			},
			resolveDocumentLink(link) {
				link.target = URI.parse('foo:bar');
				return link;
			}
		}));

		await rpcProtocol.sync();

		const links1 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri);
		assert.strictEqual(links1.length, 1);
		assert.strictEqual(links1[0].target, undefined);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const links2 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri, 1000);
		assert.strictEqual(links2.length, 1);
		assert.strictEqual(links2[0].target!.toString(), URI.parse('foo:bar').toString());

	});

	testApiCmd('DocumentLink[] vscode.executeLinkProvider returns lack tooltip #213970', async function () {
		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				const link = new types.DocumentLink(new types.Range(0, 0, 0, 20), URI.parse('foo:bar'));
				link.tooltip = 'Link Tooltip';
				return [link];
			}
		}));

		await rpcProtocol.sync();

		const links1 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri);
		assert.strictEqual(links1.length, 1);
		assert.strictEqual(links1[0].tooltip, 'Link Tooltip');
	});


	test('Color provider', function () {

		disposables.push(extHost.registerColorProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentColorProvider>{
			provideDocumentColors(): vscode.ColorInformation[] {
				return [new types.ColorInformation(new types.Range(0, 0, 0, 20), new types.Color(0.1, 0.2, 0.3, 0.4))];
			},
			provideColorPresentations(): vscode.ColorPresentation[] {
				const cp = new types.ColorPresentation('#ABC');
				cp.textEdit = types.TextEdit.replace(new types.Range(1, 0, 1, 20), '#ABC');
				cp.additionalTextEdits = [types.TextEdit.insert(new types.Position(2, 20), '*')];
				return [cp];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.ColorInformation[]>('vscode.executeDocumentColorProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.color.red, 0.1);
				assert.strictEqual(first.color.green, 0.2);
				assert.strictEqual(first.color.blue, 0.3);
				assert.strictEqual(first.color.alpha, 0.4);
				assert.strictEqual(first.range.start.line, 0);
				assert.strictEqual(first.range.start.character, 0);
				assert.strictEqual(first.range.end.line, 0);
				assert.strictEqual(first.range.end.character, 20);
			});
		}).then(() => {
			const color = new types.Color(0.5, 0.6, 0.7, 0.8);
			const range = new types.Range(0, 0, 0, 20);
			return commands.executeCommand<vscode.ColorPresentation[]>('vscode.executeColorPresentationProvider', color, { uri: model.uri, range }).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1333: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1334: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1335: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


				assert.strictEqual(first.label, '#ABC');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1394: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1395: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1396: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1397: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1438: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1440: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1441: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1442: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1443: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1483: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1484: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1485: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1487: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1488: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1528: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1529: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1530: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1531: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1532: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1573: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1574: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1575: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1576: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1577: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1578: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1618: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1619: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1620: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1621: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1622: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1623: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1663: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1664: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1666: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1668: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1708: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1709: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1710: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1711: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1713: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1754: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1755: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1756: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1757: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1798: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1799: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1800: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1803: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1843: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1844: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1845: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1846: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1848: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1888: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1889: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1890: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1891: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1892: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1933: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1935: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1936: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1937: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1938: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1978: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1979: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1980: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1982: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1983: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2023: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2024: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2025: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2026: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2028: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2068: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2069: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2070: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2071: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2072: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2115: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2116: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2117: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2118: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2158: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2159: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2160: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2161: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2162: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2203: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2204: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2205: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2206: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2207: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2208: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2248: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2249: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2250: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2251: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2252: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2293: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2295: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2296: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2297: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2339: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2340: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2341: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2342: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2386: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2387: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2388: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2428: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2430: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2431: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2432: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2433: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2473: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2474: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2475: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2476: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2477: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2518: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2519: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2520: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2521: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2522: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2523: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2563: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2564: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2565: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2566: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2567: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2568: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2608: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2609: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2610: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2611: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2612: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2613: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2653: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2654: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2655: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2656: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2657: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2698: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2699: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2700: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2701: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2702: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2703: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2743: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2744: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2745: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2746: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2747: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2748: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2788: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2790: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2791: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2792: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2793: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				assert.strictEqual(first.textEdit!.newText, '#ABC');
				assert.strictEqual(first.textEdit!.range.start.line, 1);
				assert.strictEqual(first.textEdit!.range.start.character, 0);
				assert.strictEqual(first.textEdit!.range.end.line, 1);
				assert.strictEqual(first.textEdit!.range.end.character, 20);
				assert.strictEqual(first.additionalTextEdits!.length, 1);
				assert.strictEqual(first.additionalTextEdits![0].range.start.line, 2);
				assert.strictEqual(first.additionalTextEdits![0].range.start.character, 20);
				assert.strictEqual(first.additionalTextEdits![0].range.end.line, 2);
				assert.strictEqual(first.additionalTextEdits![0].range.end.character, 20);
			});
		});
	});

	test('"TypeError: e.onCancellationRequested is not a function" calling hover provider in Insiders #54174', function () {

		disposables.push(extHost.registerHoverProvider(nullExtensionDescription, defaultSelector, <vscode.HoverProvider>{
			provideHover(): any {
				return new types.Hover('fofofofo');
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Hover[]>('vscode.executeHoverProvider', model.uri, new types.Position(1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				assert.strictEqual(value[0].contents.length, 1);
			});
		});
	});

	// --- inline hints

	testApiCmd('Inlay Hints, back and forth', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				return [new types.InlayHint(new types.Position(0, 1), 'Foo')];
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
	});

	testApiCmd('Inline Hints, merge', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				const part = new types.InlayHintLabelPart('Bar');
				part.tooltip = 'part_tooltip';
				part.command = { command: 'cmd', title: 'part' };
				const hint = new types.InlayHint(new types.Position(10, 11), [part]);
				hint.tooltip = 'hint_tooltip';
				hint.paddingLeft = true;
				hint.paddingRight = false;
				return [hint];
			}
		}));

		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				const hint = new types.InlayHint(new types.Position(0, 1), 'Foo', types.InlayHintKind.Parameter);
				hint.textEdits = [types.TextEdit.insert(new types.Position(0, 0), 'Hello')];
				return [hint];
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 2);

		const [first, second] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
		assert.strictEqual(first.textEdits?.length, 1);
		assert.strictEqual(first.textEdits[0].newText, 'Hello');

		assert.strictEqual(second.position.line, 10);
		assert.strictEqual(second.position.character, 11);
		assert.strictEqual(second.paddingLeft, true);
		assert.strictEqual(second.paddingRight, false);
		assert.strictEqual(second.tooltip, 'hint_tooltip');

		const label = (<types.InlayHintLabelPart[]>second.label)[0];
		assertType(label instanceof types.InlayHintLabelPart);
		assert.strictEqual(label.value, 'Bar');
		assert.strictEqual(label.tooltip, 'part_tooltip');
		assert.strictEqual(label.command?.command, 'cmd');
		assert.strictEqual(label.command?.title, 'part');
	});

	testApiCmd('Inline Hints, bad provider', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				return [new types.InlayHint(new types.Position(0, 1), 'Foo')];
			}
		}));
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				throw new Error();
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
	});

	// --- selection ranges

	test('Selection Range, back and forth', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges() {
				return [
					new types.SelectionRange(new types.Range(0, 10, 0, 18), new types.SelectionRange(new types.Range(0, 2, 0, 20))),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>('vscode.executeSelectionRangeProvider', model.uri, [new types.Position(0, 10)]);
		assert.strictEqual(value.length, 1);
		assert.ok(value[0].parent);
	});

	// --- call hierarchy

	test('CallHierarchy, back and forth', async function () {

		disposables.push(extHost.registerCallHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.CallHierarchyProvider {

			prepareCallHierarchy(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.CallHierarchyItem> {
				return new types.CallHierarchyItem(types.SymbolKind.Constant, 'ROOT', 'ROOT', document.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0));
			}

			provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyIncomingCall[]> {

				return [new types.CallHierarchyIncomingCall(
					new types.CallHierarchyItem(types.SymbolKind.Constant, 'INCOMING', 'INCOMING', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0)),
					[new types.Range(0, 0, 0, 0)]
				)];
			}

			provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
				return [new types.CallHierarchyOutgoingCall(
					new types.CallHierarchyItem(types.SymbolKind.Constant, 'OUTGOING', 'OUTGOING', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0)),
					[new types.Range(0, 0, 0, 0)]
				)];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.CallHierarchyItem[]>('vscode.prepareCallHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 1);
		assert.strictEqual(root[0].name, 'ROOT');

		const incoming = await commands.executeCommand<vscode.CallHierarchyIncomingCall[]>('vscode.provideIncomingCalls', root[0]);
		assert.strictEqual(incoming.length, 1);
		assert.strictEqual(incoming[0].from.name, 'INCOMING');

		const outgoing = await commands.executeCommand<vscode.CallHierarchyOutgoingCall[]>('vscode.provideOutgoingCalls', root[0]);
		assert.strictEqual(outgoing.length, 1);
		assert.strictEqual(outgoing[0].to.name, 'OUTGOING');
	});

	test('prepareCallHierarchy throws TypeError if clangd returns empty result #137415', async function () {

		disposables.push(extHost.registerCallHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.CallHierarchyProvider {
			prepareCallHierarchy(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.CallHierarchyItem[]> {
				return [];
			}
			provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyIncomingCall[]> {
				return [];
			}
			provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
				return [];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.CallHierarchyItem[]>('vscode.prepareCallHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 0);
	});

	// --- type hierarchy

	test('TypeHierarchy, back and forth', async function () {


		disposables.push(extHost.registerTypeHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.TypeHierarchyProvider {
			prepareTypeHierarchy(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'ROOT', 'ROOT', document.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
			provideTypeHierarchySupertypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'SUPER', 'SUPER', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
			provideTypeHierarchySubtypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'SUB', 'SUB', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.prepareTypeHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 1);
		assert.strictEqual(root[0].name, 'ROOT');

		const incoming = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSupertypes', root[0]);
		assert.strictEqual(incoming.length, 1);
		assert.strictEqual(incoming[0].name, 'SUPER');

		const outgoing = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSubtypes', root[0]);
		assert.strictEqual(outgoing.length, 1);
		assert.strictEqual(outgoing[0].name, 'SUB');
	});

	test('selectionRangeProvider on inner array always returns outer array #91852', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges(_doc, positions) {
				const [first] = positions;
				return [
					new types.SelectionRange(new types.Range(first.line, first.character, first.line, first.character)),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>('vscode.executeSelectionRangeProvider', model.uri, [new types.Position(0, 10)]);
		assert.strictEqual(value.length, 1);
		assert.strictEqual(value[0].range.start.line, 0);
		assert.strictEqual(value[0].range.start.character, 10);
		assert.strictEqual(value[0].range.end.line, 0);
		assert.strictEqual(value[0].range.end.character, 10);
	});

	test('more element test of selectionRangeProvider on inner array always returns outer array #91852', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges(_doc, positions) {
				const [first, second] = positions;
				return [
					new types.SelectionRange(new types.Range(first.line, first.character, first.line, first.character)),
					new types.SelectionRange(new types.Range(second.line, second.character, second.line, second.character)),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>(
			'vscode.executeSelectionRangeProvider',
			model.uri,
			[new types.Position(0, 0), new types.Position(0, 10)]
		);
		assert.strictEqual(value.length, 2);
		assert.strictEqual(value[0].range.start.line, 0);
		assert.strictEqual(value[0].range.start.character, 0);
		assert.strictEqual(value[0].range.end.line, 0);
		assert.strictEqual(value[0].range.end.character, 0);
		assert.strictEqual(value[1].range.start.line, 0);
		assert.strictEqual(value[1].range.start.character, 10);
		assert.strictEqual(value[1].range.end.line, 0);
		assert.strictEqual(value[1].range.end.character, 10);
	});
});
