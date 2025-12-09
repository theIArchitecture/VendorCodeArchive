//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { JSONPath, parse } from '../../../../base/common/json.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { isWorkspace, IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IJSONEditingService, IJSONValue } from '../../configuration/common/jsonEditing.js';
import { ResourceMap } from '../../../../base/common/map.js';

export const EXTENSIONS_CONFIG = '.vscode/extensions.json';

export interface IExtensionsConfigContent {
	recommendations?: string[];
	unwantedRecommendations?: string[];
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 43: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 87: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 109: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 120: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 131: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 153: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 186: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 208: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 219: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 241: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWorkspaceExtensionsConfigService = createDecorator<IWorkspaceExtensionsConfigService>('IWorkspaceExtensionsConfigService');

export interface IWorkspaceExtensionsConfigService {
	readonly _serviceBrand: undefined;

	onDidChangeExtensionsConfigs: Event<void>;
	getExtensionsConfigs(): Promise<IExtensionsConfigContent[]>;
	getRecommendations(): Promise<string[]>;
	getUnwantedRecommendations(): Promise<string[]>;

	toggleRecommendation(extensionId: string): Promise<void>;
	toggleUnwantedRecommendation(extensionId: string): Promise<void>;
}

export class WorkspaceExtensionsConfigService extends Disposable implements IWorkspaceExtensionsConfigService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeExtensionsConfigs = this._register(new Emitter<void>());
	readonly onDidChangeExtensionsConfigs = this._onDidChangeExtensionsConfigs.event;

	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
	) {
		super();
		this._register(workspaceContextService.onDidChangeWorkspaceFolders(e => this._onDidChangeExtensionsConfigs.fire()));
		this._register(fileService.onDidFilesChange(e => {
			const workspace = workspaceContextService.getWorkspace();
			if ((workspace.configuration && e.affects(workspace.configuration))
				|| workspace.folders.some(folder => e.affects(folder.toResource(EXTENSIONS_CONFIG)))
			) {
				this._onDidChangeExtensionsConfigs.fire();
			}
		}));
	}

	async getExtensionsConfigs(): Promise<IExtensionsConfigContent[]> {
		const workspace = this.workspaceContextService.getWorkspace();
		const result: IExtensionsConfigContent[] = [];
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		if (workspaceExtensionsConfigContent) {
			result.push(workspaceExtensionsConfigContent);
		}
		result.push(...await Promise.all(workspace.folders.map(workspaceFolder => this.resolveWorkspaceFolderExtensionConfig(workspaceFolder))));
		return result;
	}

	async getRecommendations(): Promise<string[]> {
		const configs = await this.getExtensionsConfigs();
		return distinct(configs.flatMap(c => c.recommendations ? c.recommendations.map(c => c.toLowerCase()) : []));
	}

	async getUnwantedRecommendations(): Promise<string[]> {
		const configs = await this.getExtensionsConfigs();
		return distinct(configs.flatMap(c => c.unwantedRecommendations ? c.unwantedRecommendations.map(c => c.toLowerCase()) : []));
	}

	async toggleRecommendation(extensionId: string): Promise<void> {
		extensionId = extensionId.toLowerCase();
		const workspace = this.workspaceContextService.getWorkspace();
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		const workspaceFolderExtensionsConfigContents = new ResourceMap<IExtensionsConfigContent>();
		await Promise.all(workspace.folders.map(async workspaceFolder => {
			const extensionsConfigContent = await this.resolveWorkspaceFolderExtensionConfig(workspaceFolder);
			workspaceFolderExtensionsConfigContents.set(workspaceFolder.uri, extensionsConfigContent);
		}));

		const isWorkspaceRecommended = workspaceExtensionsConfigContent && workspaceExtensionsConfigContent.recommendations?.some(r => r.toLowerCase() === extensionId);
		const recommendedWorksapceFolders = workspace.folders.filter(workspaceFolder => workspaceFolderExtensionsConfigContents.get(workspaceFolder.uri)?.recommendations?.some(r => r.toLowerCase() === extensionId));
		const isRecommended = isWorkspaceRecommended || recommendedWorksapceFolders.length > 0;

		const workspaceOrFolders = isRecommended
			? await this.pickWorkspaceOrFolders(recommendedWorksapceFolders, isWorkspaceRecommended ? workspace : undefined, localize('select for remove', "Remove extension recommendation from"))
			: await this.pickWorkspaceOrFolders(workspace.folders, workspace.configuration ? workspace : undefined, localize('select for add', "Add extension recommendation to"));

		for (const workspaceOrWorkspaceFolder of workspaceOrFolders) {
			if (isWorkspace(workspaceOrWorkspaceFolder)) {
				await this.addOrRemoveWorkspaceRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceExtensionsConfigContent, !isRecommended);
			} else {
				await this.addOrRemoveWorkspaceFolderRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceFolderExtensionsConfigContents.get(workspaceOrWorkspaceFolder.uri)!, !isRecommended);
			}
		}
	}

	async toggleUnwantedRecommendation(extensionId: string): Promise<void> {
		const workspace = this.workspaceContextService.getWorkspace();
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		const workspaceFolderExtensionsConfigContents = new ResourceMap<IExtensionsConfigContent>();
		await Promise.all(workspace.folders.map(async workspaceFolder => {
			const extensionsConfigContent = await this.resolveWorkspaceFolderExtensionConfig(workspaceFolder);
			workspaceFolderExtensionsConfigContents.set(workspaceFolder.uri, extensionsConfigContent);
		}));

		const isWorkspaceUnwanted = workspaceExtensionsConfigContent && workspaceExtensionsConfigContent.unwantedRecommendations?.some(r => r === extensionId);
		const unWantedWorksapceFolders = workspace.folders.filter(workspaceFolder => workspaceFolderExtensionsConfigContents.get(workspaceFolder.uri)?.unwantedRecommendations?.some(r => r === extensionId));
		const isUnwanted = isWorkspaceUnwanted || unWantedWorksapceFolders.length > 0;

		const workspaceOrFolders = isUnwanted
			? await this.pickWorkspaceOrFolders(unWantedWorksapceFolders, isWorkspaceUnwanted ? workspace : undefined, localize('select for remove', "Remove extension recommendation from"))
			: await this.pickWorkspaceOrFolders(workspace.folders, workspace.configuration ? workspace : undefined, localize('select for add', "Add extension recommendation to"));

		for (const workspaceOrWorkspaceFolder of workspaceOrFolders) {
			if (isWorkspace(workspaceOrWorkspaceFolder)) {
				await this.addOrRemoveWorkspaceUnwantedRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceExtensionsConfigContent, !isUnwanted);
			} else {
				await this.addOrRemoveWorkspaceFolderUnwantedRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceFolderExtensionsConfigContents.get(workspaceOrWorkspaceFolder.uri)!, !isUnwanted);
			}
		}
	}

	private async addOrRemoveWorkspaceFolderRecommendation(extensionId: string, workspaceFolder: IWorkspaceFolder, extensionsConfigContent: IExtensionsConfigContent, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (add) {
			if (Array.isArray(extensionsConfigContent.recommendations)) {
				values.push({ path: ['recommendations', -1], value: extensionId });
			} else {
				values.push({ path: ['recommendations'], value: [extensionId] });
			}
			const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
			if (unwantedRecommendationEdit) {
				values.push(unwantedRecommendationEdit);
			}
		} else if (extensionsConfigContent.recommendations) {
			const recommendationEdit = this.getEditToRemoveValueFromArray(['recommendations'], extensionsConfigContent.recommendations, extensionId);
			if (recommendationEdit) {
				values.push(recommendationEdit);
			}
		}

		if (values.length) {
			return this.jsonEditingService.write(workspaceFolder.toResource(EXTENSIONS_CONFIG), values, true);
		}
	}

	private async addOrRemoveWorkspaceRecommendation(extensionId: string, workspace: IWorkspace, extensionsConfigContent: IExtensionsConfigContent | undefined, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (extensionsConfigContent) {
			if (add) {
				const path: JSONPath = ['extensions', 'recommendations'];
				if (Array.isArray(extensionsConfigContent.recommendations)) {
					values.push({ path: [...path, -1], value: extensionId });
				} else {
					values.push({ path, value: [extensionId] });
				}
				const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
				if (unwantedRecommendationEdit) {
					values.push(unwantedRecommendationEdit);
				}
			} else if (extensionsConfigContent.recommendations) {
				const recommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'recommendations'], extensionsConfigContent.recommendations, extensionId);
				if (recommendationEdit) {
					values.push(recommendationEdit);
				}
			}
		} else if (add) {
			values.push({ path: ['extensions'], value: { recommendations: [extensionId] } });
		}

		if (values.length) {
			return this.jsonEditingService.write(workspace.configuration!, values, true);
		}
	}

	private async addOrRemoveWorkspaceFolderUnwantedRecommendation(extensionId: string, workspaceFolder: IWorkspaceFolder, extensionsConfigContent: IExtensionsConfigContent, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (add) {
			const path: JSONPath = ['unwantedRecommendations'];
			if (Array.isArray(extensionsConfigContent.unwantedRecommendations)) {
				values.push({ path: [...path, -1], value: extensionId });
			} else {
				values.push({ path, value: [extensionId] });
			}
			const recommendationEdit = this.getEditToRemoveValueFromArray(['recommendations'], extensionsConfigContent.recommendations, extensionId);
			if (recommendationEdit) {
				values.push(recommendationEdit);
			}
		} else if (extensionsConfigContent.unwantedRecommendations) {
			const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
			if (unwantedRecommendationEdit) {
				values.push(unwantedRecommendationEdit);
			}
		}
		if (values.length) {
			return this.jsonEditingService.write(workspaceFolder.toResource(EXTENSIONS_CONFIG), values, true);
		}
	}

	private async addOrRemoveWorkspaceUnwantedRecommendation(extensionId: string, workspace: IWorkspace, extensionsConfigContent: IExtensionsConfigContent | undefined, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (extensionsConfigContent) {
			if (add) {
				const path: JSONPath = ['extensions', 'unwantedRecommendations'];
				if (Array.isArray(extensionsConfigContent.recommendations)) {
					values.push({ path: [...path, -1], value: extensionId });
				} else {
					values.push({ path, value: [extensionId] });
				}
				const recommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'recommendations'], extensionsConfigContent.recommendations, extensionId);
				if (recommendationEdit) {
					values.push(recommendationEdit);
				}
			} else if (extensionsConfigContent.unwantedRecommendations) {
				const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
				if (unwantedRecommendationEdit) {
					values.push(unwantedRecommendationEdit);
				}
			}
		} else if (add) {
			values.push({ path: ['extensions'], value: { unwantedRecommendations: [extensionId] } });
		}

		if (values.length) {
			return this.jsonEditingService.write(workspace.configuration!, values, true);
		}
	}

	private async pickWorkspaceOrFolders(workspaceFolders: IWorkspaceFolder[], workspace: IWorkspace | undefined, placeHolder: string): Promise<(IWorkspace | IWorkspaceFolder)[]> {
		const workspaceOrFolders = workspace ? [...workspaceFolders, workspace] : [...workspaceFolders];
		if (workspaceOrFolders.length === 1) {
			return workspaceOrFolders;
		}

		const folderPicks: (IQuickPickItem & { workspaceOrFolder: IWorkspace | IWorkspaceFolder } | IQuickPickSeparator)[] = workspaceFolders.map(workspaceFolder => {
			return {
				label: workspaceFolder.name,
				description: localize('workspace folder', "Workspace Folder"),
				workspaceOrFolder: workspaceFolder,
				iconClasses: getIconClasses(this.modelService, this.languageService, workspaceFolder.uri, FileKind.ROOT_FOLDER)
			};
		});

		if (workspace) {
			folderPicks.push({ type: 'separator' });
			folderPicks.push({
				label: localize('workspace', "Workspace"),
				workspaceOrFolder: workspace,
			});
		}

		const result = await this.quickInputService.pick(folderPicks, { placeHolder, canPickMany: true }) || [];
		return result.map(r => r.workspaceOrFolder);
	}

	private async resolveWorkspaceExtensionConfig(workspaceConfigurationResource: URI): Promise<IExtensionsConfigContent | undefined> {
		try {
			const content = await this.fileService.readFile(workspaceConfigurationResource);
			const extensionsConfigContent = <IExtensionsConfigContent | undefined>parse(content.value.toString())['extensions'];
			return extensionsConfigContent ? this.parseExtensionConfig(extensionsConfigContent) : undefined;
		} catch (e) { /* Ignore */ }
		return undefined;
	}

	private async resolveWorkspaceFolderExtensionConfig(workspaceFolder: IWorkspaceFolder): Promise<IExtensionsConfigContent> {
		try {
			const content = await this.fileService.readFile(workspaceFolder.toResource(EXTENSIONS_CONFIG));
			const extensionsConfigContent = <IExtensionsConfigContent>parse(content.value.toString());
			return this.parseExtensionConfig(extensionsConfigContent);
		} catch (e) { /* ignore */ }
		return {};
	}

	private parseExtensionConfig(extensionsConfigContent: IExtensionsConfigContent): IExtensionsConfigContent {
		return {
			recommendations: distinct((extensionsConfigContent.recommendations || []).map(e => e.toLowerCase())),
			unwantedRecommendations: distinct((extensionsConfigContent.unwantedRecommendations || []).map(e => e.toLowerCase()))
		};
	}

	private getEditToRemoveValueFromArray(path: JSONPath, array: string[] | undefined, value: string): IJSONValue | undefined {
		const index = array?.indexOf(value);
		if (index !== undefined && index !== -1) {
			return { path: [...path, index], value: undefined };
		}
		return undefined;
	}

}

registerSingleton(IWorkspaceExtensionsConfigService, WorkspaceExtensionsConfigService, InstantiationType.Delayed);
