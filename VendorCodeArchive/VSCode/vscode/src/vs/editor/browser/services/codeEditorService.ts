//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { ICodeEditor, IDiffEditor } from '../editorBrowser.js';
import { IDecorationRenderOptions } from '../../common/editorCommon.js';
import { IModelDecorationOptions, ITextModel } from '../../common/model.js';
import { ITextResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IDisposable } from '../../../base/common/lifecycle.js';

export const ICodeEditorService = createDecorator<ICodeEditorService>('codeEditorService');

export interface ICodeEditorService {
	readonly _serviceBrand: undefined;

	readonly onWillCreateCodeEditor: Event<void>;
	readonly onCodeEditorAdd: Event<ICodeEditor>;
	readonly onCodeEditorRemove: Event<ICodeEditor>;

	readonly onWillCreateDiffEditor: Event<void>;
	readonly onDiffEditorAdd: Event<IDiffEditor>;
	readonly onDiffEditorRemove: Event<IDiffEditor>;

	readonly onDidChangeTransientModelProperty: Event<ITextModel>;
	readonly onDecorationTypeRegistered: Event<string>;

	willCreateCodeEditor(): void;
	addCodeEditor(editor: ICodeEditor): void;
	removeCodeEditor(editor: ICodeEditor): void;
	listCodeEditors(): readonly ICodeEditor[];

	willCreateDiffEditor(): void;
	addDiffEditor(editor: IDiffEditor): void;
	removeDiffEditor(editor: IDiffEditor): void;
	listDiffEditors(): readonly IDiffEditor[];

	/**
	 * Returns the current focused code editor (if the focus is in the editor or in an editor widget) or null.
	 */
	getFocusedCodeEditor(): ICodeEditor | null;

	registerDecorationType(description: string, key: string, options: IDecorationRenderOptions, parentTypeKey?: string, editor?: ICodeEditor): void;
	listDecorationTypes(): string[];
	removeDecorationType(key: string): void;
	resolveDecorationOptions(typeKey: string, writable: boolean): IModelDecorationOptions;
	resolveDecorationCSSRules(decorationTypeKey: string): CSSRuleList | null;

	setModelProperty(resource: URI, key: string, value: any): void;
	getModelProperty(resource: URI, key: string): any;

	setTransientModelProperty(model: ITextModel, key: string, value: any): void;
	getTransientModelProperty(model: ITextModel, key: string): any;
	getTransientModelProperties(model: ITextModel): [string, any][] | undefined;

	getActiveCodeEditor(): ICodeEditor | null;
	openCodeEditor(input: ITextResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null>;
	registerCodeEditorOpenHandler(handler: ICodeEditorOpenHandler): IDisposable;
}

export interface ICodeEditorOpenHandler {
	(input: ITextResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null>;
}
