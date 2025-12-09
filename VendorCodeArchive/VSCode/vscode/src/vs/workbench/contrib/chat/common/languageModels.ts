//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { ChatContextKeys } from './chatContextKeys.js';

export const enum ChatMessageRole {
	System,
	User,
	Assistant,
}

export enum LanguageModelPartAudience {
	Assistant = 0,
	User = 1,
	Extension = 2,
}

export interface IChatMessageTextPart {
	type: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
}

export interface IChatMessageImagePart {
	type: 'image_url';
	value: IChatImageURLPart;
}

export interface IChatMessageDataPart {
	type: 'data';
	mimeType: string;
	data: VSBuffer;
	audience?: LanguageModelPartAudience[];
}

export interface IChatImageURLPart {
	/**
	 * The image's MIME type (e.g., "image/png", "image/jpeg").
	 */
	mimeType: ChatImageMimeType;

	/**
	 * The raw binary data of the image, encoded as a Uint8Array. Note: do not use base64 encoding. Maximum image size is 5MB.
	 */
	data: VSBuffer;
}

/**
 * Enum for supported image MIME types.
 */
export enum ChatImageMimeType {
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	GIF = 'image/gif',
	WEBP = 'image/webp',
	BMP = 'image/bmp',
}

/**
 * Specifies the detail level of the image.
 */
export enum ImageDetailLevel {
	Low = 'low',
	High = 'high'
}


export interface IChatMessageToolResultPart {
	type: 'tool_result';
	toolCallId: string;
	value: (IChatResponseTextPart | IChatResponsePromptTsxPart | IChatResponseDataPart)[];
	isError?: boolean;
}

export type IChatMessagePart = IChatMessageTextPart | IChatMessageToolResultPart | IChatResponseToolUsePart | IChatMessageImagePart | IChatMessageDataPart;

export interface IChatMessage {
	readonly name?: string | undefined;
	readonly role: ChatMessageRole;
	readonly content: IChatMessagePart[];
}

export interface IChatResponseTextPart {
	type: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
}

export interface IChatResponsePromptTsxPart {
	type: 'prompt_tsx';
	value: unknown;
}

export interface IChatResponseDataPart {
	type: 'data';
	mimeType: string;
	data: VSBuffer;
	audience?: LanguageModelPartAudience[];
}

export interface IChatResponseToolUsePart {
	type: 'tool_use';
	name: string;
	toolCallId: string;
	parameters: any;
}

export interface IChatResponseThinkingPart {
	type: 'thinking';
	value: string;
	id?: string;
	metadata?: string;
}

export interface IChatResponsePullRequestPart {
	type: 'pullRequest';
	uri: URI;
	title: string;
	description: string;
	author: string;
	linkTag: string;
}

export type IChatResponsePart = IChatResponseTextPart | IChatResponseToolUsePart | IChatResponseDataPart | IChatResponseThinkingPart;

export type IExtendedChatResponsePart = IChatResponsePullRequestPart;

export interface IChatResponseFragment {
	index: number;
	part: IChatResponsePart;
}

export interface ILanguageModelChatMetadata {
	readonly extension: ExtensionIdentifier;

	readonly name: string;
	readonly id: string;
	readonly vendor: string;
	readonly version: string;
	readonly description?: string;
	readonly cost?: string;
	readonly family: string;
	readonly maxInputTokens: number;
	readonly maxOutputTokens: number;

	readonly isDefault?: boolean;
	readonly isUserSelectable?: boolean;
	readonly modelPickerCategory: { label: string; order: number } | undefined;
	readonly auth?: {
		readonly providerLabel: string;
		readonly accountLabel?: string;
	};
	readonly capabilities?: {
		readonly vision?: boolean;
		readonly toolCalling?: boolean;
		readonly agentMode?: boolean;
	};
}

export namespace ILanguageModelChatMetadata {
	export function suitableForAgentMode(metadata: ILanguageModelChatMetadata): boolean {
		const supportsToolsAgent = typeof metadata.capabilities?.agentMode === 'undefined' || metadata.capabilities.agentMode;
		return supportsToolsAgent && !!metadata.capabilities?.toolCalling;
	}

	export function asQualifiedName(metadata: ILanguageModelChatMetadata): string {
		if (metadata.modelPickerCategory === undefined) {
			// in the others category
			return `${metadata.name} (${metadata.family})`;
		}
		return metadata.name;
	}
}

export interface ILanguageModelChatResponse {
	stream: AsyncIterable<IChatResponseFragment | IChatResponseFragment[]>;
	result: Promise<any>;
}

export interface ILanguageModelChatProvider {
	onDidChange: Event<void>;
	prepareLanguageModelChat(options: { silent: boolean }, token: CancellationToken): Promise<ILanguageModelChatMetadataAndIdentifier[]>;
	sendChatRequest(modelId: string, messages: IChatMessage[], from: ExtensionIdentifier, options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;
	provideTokenCount(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

export interface ILanguageModelChat {
	metadata: ILanguageModelChatMetadata;
	sendChatRequest(messages: IChatMessage[], from: ExtensionIdentifier, options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;
	provideTokenCount(message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

export interface ILanguageModelChatSelector {
	readonly name?: string;
	readonly id?: string;
	readonly vendor?: string;
	readonly version?: string;
	readonly family?: string;
	readonly tokens?: number;
	readonly extension?: ExtensionIdentifier;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 228: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 228: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 241: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 241: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 252: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 252: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 256: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 267: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 289: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 300: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 318: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 318: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 333: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 340: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 340: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 351: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 351: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 355: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 362: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 362: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 366: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 373: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 373: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILanguageModelsService = createDecorator<ILanguageModelsService>('ILanguageModelsService');

export interface ILanguageModelChatMetadataAndIdentifier {
	metadata: ILanguageModelChatMetadata;
	identifier: string;
}

export interface ILanguageModelsService {

	readonly _serviceBrand: undefined;

	// TODO @lramos15 - Make this a richer event in the future. Right now it just indicates some change happened, but not what
	onDidChangeLanguageModels: Event<void>;

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void;

	getLanguageModelIds(): string[];

	getVendors(): IUserFriendlyLanguageModel[];

	lookupLanguageModel(modelId: string): ILanguageModelChatMetadata | undefined;

	/**
	 * Given a selector, returns a list of model identifiers
	 * @param selector The selector to lookup for language models. If the selector is empty, all language models are returned.
	 * @param allowPromptingUser If true the user may be prompted for things like API keys for us to select the model.
	 */
	selectLanguageModels(selector: ILanguageModelChatSelector, allowPromptingUser?: boolean): Promise<string[]>;

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable;

	sendChatRequest(modelId: string, from: ExtensionIdentifier, messages: IChatMessage[], options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;

	computeTokenLength(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

const languageModelType: IJSONSchema = {
	type: 'object',
	properties: {
		vendor: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.vendor', "A globally unique vendor of language models.")
		},
		displayName: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.displayName', "The display name of the language model vendor.")
		},
		managementCommand: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.managementCommand', "A command to manage the language model vendor, e.g. 'Manage Copilot models'. This is used in the chat model picker. If not provided, a gear icon is not rendered during vendor selection.")
		}
	}
};

export interface IUserFriendlyLanguageModel {
	vendor: string;
	displayName: string;
	managementCommand?: string;
}

export const languageModelExtensionPoint = ExtensionsRegistry.registerExtensionPoint<IUserFriendlyLanguageModel | IUserFriendlyLanguageModel[]>({
	extensionPoint: 'languageModels',
	jsonSchema: {
		description: localize('vscode.extension.contributes.languageModels', "Contribute language models of a specific vendor."),
		oneOf: [
			languageModelType,
			{
				type: 'array',
				items: languageModelType
			}
		]
	},
	activationEventsGenerator: (contribs: IUserFriendlyLanguageModel[], result: { push(item: string): void }) => {
		for (const contrib of contribs) {
			result.push(`onLanguageModelChat:${contrib.vendor}`);
		}
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

});

export class LanguageModelsService implements ILanguageModelsService {

	readonly _serviceBrand: undefined;

	private readonly _store = new DisposableStore();

	private readonly _providers = new Map<string, ILanguageModelChatProvider>();
	private readonly _modelCache = new Map<string, ILanguageModelChatMetadata>();
	private readonly _vendors = new Map<string, IUserFriendlyLanguageModel>();
	private readonly _modelPickerUserPreferences: Record<string, boolean> = {}; // We use a record instead of a map for better serialization when storing

	private readonly _hasUserSelectableModels: IContextKey<boolean>;
	private readonly _onLanguageModelChange = this._store.add(new Emitter<void>());
	readonly onDidChangeLanguageModels: Event<void> = this._onLanguageModelChange.event;

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService _contextKeyService: IContextKeyService
	) {
		this._hasUserSelectableModels = ChatContextKeys.languageModelsAreUserSelectable.bindTo(_contextKeyService);
		this._modelPickerUserPreferences = this._storageService.getObject<Record<string, boolean>>('chatModelPickerPreferences', StorageScope.PROFILE, this._modelPickerUserPreferences);

		this._store.add(this.onDidChangeLanguageModels(() => {
			this._hasUserSelectableModels.set(this._modelCache.size > 0 && Array.from(this._modelCache.values()).some(model => model.isUserSelectable));
		}));

		this._store.add(languageModelExtensionPoint.setHandler((extensions) => {

			this._vendors.clear();

			for (const extension of extensions) {

				if (!isProposedApiEnabled(extension.description, 'chatProvider')) {
					extension.collector.error(localize('vscode.extension.contributes.languageModels.chatProviderRequired', "This contribution point requires the 'chatProvider' proposal."));
					continue;
				}

				for (const item of Iterable.wrap(extension.value)) {
					if (this._vendors.has(item.vendor)) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.vendorAlreadyRegistered', "The vendor '{0}' is already registered and cannot be registered twice", item.vendor));
						continue;
					}
					if (isFalsyOrWhitespace(item.vendor)) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.emptyVendor', "The vendor field cannot be empty."));
						continue;
					}
					if (item.vendor.trim() !== item.vendor) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.whitespaceVendor', "The vendor field cannot start or end with whitespace."));
						continue;
					}
					this._vendors.set(item.vendor, item);
				}
			}
			for (const [vendor, _] of this._providers) {
				if (!this._vendors.has(vendor)) {
					this._providers.delete(vendor);
				}
			}
		}));
	}

	dispose() {
		this._store.dispose();
		this._providers.clear();
	}

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void {
		const model = this._modelCache.get(modelIdentifier);
		if (!model) {
			this._logService.warn(`[LM] Cannot update model picker preference for unknown model ${modelIdentifier}`);
			return;
		}

		this._modelPickerUserPreferences[modelIdentifier] = showInModelPicker;
		if (showInModelPicker === model.isUserSelectable) {
			delete this._modelPickerUserPreferences[modelIdentifier];
			this._storageService.store('chatModelPickerPreferences', this._modelPickerUserPreferences, StorageScope.PROFILE, StorageTarget.USER);
		} else if (model.isUserSelectable !== showInModelPicker) {
			this._storageService.store('chatModelPickerPreferences', this._modelPickerUserPreferences, StorageScope.PROFILE, StorageTarget.USER);
		}
		this._onLanguageModelChange.fire();
		this._logService.trace(`[LM] Updated model picker preference for ${modelIdentifier} to ${showInModelPicker}`);
	}

	getVendors(): IUserFriendlyLanguageModel[] {
		return Array.from(this._vendors.values());
	}

	getLanguageModelIds(): string[] {
		return Array.from(this._modelCache.keys());
	}

	lookupLanguageModel(modelIdentifier: string): ILanguageModelChatMetadata | undefined {
		const model = this._modelCache.get(modelIdentifier);
		if (model && this._modelPickerUserPreferences[modelIdentifier] !== undefined) {
			return { ...model, isUserSelectable: this._modelPickerUserPreferences[modelIdentifier] };
		}
		return model;
	}

	private _clearModelCache(vendors: string | string[]): void {
		if (typeof vendors === 'string') {
			vendors = [vendors];
		}
		for (const vendor of vendors) {
			for (const [id, model] of this._modelCache.entries()) {
				if (model.vendor === vendor) {
					this._modelCache.delete(id);
				}
			}
		}
	}

	async resolveLanguageModels(vendors: string | string[], silent: boolean): Promise<void> {
		if (typeof vendors === 'string') {
			vendors = [vendors];
		}
		// Activate extensions before requesting to resolve the models
		const all = vendors.map(vendor => this._extensionService.activateByEvent(`onLanguageModelChat:${vendor}`));
		await Promise.all(all);
		this._clearModelCache(vendors);
		for (const vendor of vendors) {
			const provider = this._providers.get(vendor);
			if (!provider) {
				this._logService.warn(`[LM] No provider registered for vendor ${vendor}`);
				continue;
			}
			try {
				const modelsAndIdentifiers = await provider.prepareLanguageModelChat({ silent }, CancellationToken.None);
				for (const modelAndIdentifier of modelsAndIdentifiers) {
					if (this._modelCache.has(modelAndIdentifier.identifier)) {
						this._logService.warn(`[LM] Model ${modelAndIdentifier.identifier} is already registered. Skipping.`);
						continue;
					}
					this._modelCache.set(modelAndIdentifier.identifier, modelAndIdentifier.metadata);
				}
				this._logService.trace(`[LM] Resolved language models for vendor ${vendor}`, modelsAndIdentifiers);
			} catch (error) {
				this._logService.error(`[LM] Error resolving language models for vendor ${vendor}:`, error);
			}
		}
		this._onLanguageModelChange.fire();
	}

	async selectLanguageModels(selector: ILanguageModelChatSelector, allowPromptingUser?: boolean): Promise<string[]> {

		if (selector.vendor) {
			await this.resolveLanguageModels([selector.vendor], !allowPromptingUser);
		} else {
			const allVendors = Array.from(this._vendors.keys());
			await this.resolveLanguageModels(allVendors, !allowPromptingUser);
		}

		const result: string[] = [];

		for (const [internalModelIdentifier, model] of this._modelCache) {
			if ((selector.vendor === undefined || model.vendor === selector.vendor)
				&& (selector.family === undefined || model.family === selector.family)
				&& (selector.version === undefined || model.version === selector.version)
				&& (selector.id === undefined || model.id === selector.id)) {
				result.push(internalModelIdentifier);
			}
		}

		this._logService.trace('[LM] selected language models', selector, result);

		return result;
	}

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable {
		this._logService.trace('[LM] registering language model provider', vendor, provider);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 475: Error message without production error code - breaks React bundle size optimization
//   2. Line 475: Error message without production error code - breaks React bundle size optimization
//   3. Line 478: Error message without production error code - breaks React bundle size optimization
//   4. Line 478: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!this._vendors.has(vendor)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 507: Error message without production error code - breaks React bundle size optimization
//   2. Line 507: Error message without production error code - breaks React bundle size optimization
//   3. Line 510: Error message without production error code - breaks React bundle size optimization
//   4. Line 510: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 530: Error message without production error code - breaks React bundle size optimization
//   2. Line 530: Error message without production error code - breaks React bundle size optimization
//   3. Line 533: Error message without production error code - breaks React bundle size optimization
//   4. Line 533: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 553: Error message without production error code - breaks React bundle size optimization
//   2. Line 553: Error message without production error code - breaks React bundle size optimization
//   3. Line 556: Error message without production error code - breaks React bundle size optimization
//   4. Line 556: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 576: Error message without production error code - breaks React bundle size optimization
//   2. Line 576: Error message without production error code - breaks React bundle size optimization
//   3. Line 579: Error message without production error code - breaks React bundle size optimization
//   4. Line 579: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 599: Error message without production error code - breaks React bundle size optimization
//   2. Line 599: Error message without production error code - breaks React bundle size optimization
//   3. Line 602: Error message without production error code - breaks React bundle size optimization
//   4. Line 602: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 622: Error message without production error code - breaks React bundle size optimization
//   2. Line 622: Error message without production error code - breaks React bundle size optimization
//   3. Line 625: Error message without production error code - breaks React bundle size optimization
//   4. Line 625: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 645: Error message without production error code - breaks React bundle size optimization
//   2. Line 645: Error message without production error code - breaks React bundle size optimization
//   3. Line 648: Error message without production error code - breaks React bundle size optimization
//   4. Line 648: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 668: Error message without production error code - breaks React bundle size optimization
//   2. Line 668: Error message without production error code - breaks React bundle size optimization
//   3. Line 671: Error message without production error code - breaks React bundle size optimization
//   4. Line 671: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 691: Error message without production error code - breaks React bundle size optimization
//   2. Line 691: Error message without production error code - breaks React bundle size optimization
//   3. Line 694: Error message without production error code - breaks React bundle size optimization
//   4. Line 694: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 714: Error message without production error code - breaks React bundle size optimization
//   2. Line 714: Error message without production error code - breaks React bundle size optimization
//   3. Line 717: Error message without production error code - breaks React bundle size optimization
//   4. Line 717: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 737: Error message without production error code - breaks React bundle size optimization
//   2. Line 737: Error message without production error code - breaks React bundle size optimization
//   3. Line 740: Error message without production error code - breaks React bundle size optimization
//   4. Line 740: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 760: Error message without production error code - breaks React bundle size optimization
//   2. Line 760: Error message without production error code - breaks React bundle size optimization
//   3. Line 763: Error message without production error code - breaks React bundle size optimization
//   4. Line 763: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 783: Error message without production error code - breaks React bundle size optimization
//   2. Line 783: Error message without production error code - breaks React bundle size optimization
//   3. Line 786: Error message without production error code - breaks React bundle size optimization
//   4. Line 786: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Chat model provider uses UNKNOWN vendor ${vendor}.`);
		}
		if (this._providers.has(vendor)) {
			throw new Error(`Chat model provider for vendor ${vendor} is already registered.`);
		}

		this._providers.set(vendor, provider);

		// TODO @lramos15 - Smarter restore logic. Don't resolve models for all providers, but only those which were known to need restoring
		this.resolveLanguageModels(vendor, true).then(() => {
			this._onLanguageModelChange.fire();
		});

		return toDisposable(() => {
			this._logService.trace('[LM] UNregistered language model provider', vendor);
			this._clearModelCache(vendor);
			this._providers.delete(vendor);
		});
	}

	async sendChatRequest(modelId: string, from: ExtensionIdentifier, messages: IChatMessage[], options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 498: Error message without production error code - breaks React bundle size optimization
//   2. Line 498: Error message without production error code - breaks React bundle size optimization
//   3. Line 506: Error message without production error code - breaks React bundle size optimization
//   4. Line 506: Error message without production error code - breaks React bundle size optimization
//   5. Line 510: Error message without production error code - breaks React bundle size optimization
//   6. Line 510: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const provider = this._providers.get(this._modelCache.get(modelId)?.vendor || '');
		if (!provider) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 544: Error message without production error code - breaks React bundle size optimization
//   2. Line 544: Error message without production error code - breaks React bundle size optimization
//   3. Line 552: Error message without production error code - breaks React bundle size optimization
//   4. Line 552: Error message without production error code - breaks React bundle size optimization
//   5. Line 556: Error message without production error code - breaks React bundle size optimization
//   6. Line 556: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 581: Error message without production error code - breaks React bundle size optimization
//   2. Line 581: Error message without production error code - breaks React bundle size optimization
//   3. Line 589: Error message without production error code - breaks React bundle size optimization
//   4. Line 589: Error message without production error code - breaks React bundle size optimization
//   5. Line 593: Error message without production error code - breaks React bundle size optimization
//   6. Line 593: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 618: Error message without production error code - breaks React bundle size optimization
//   2. Line 618: Error message without production error code - breaks React bundle size optimization
//   3. Line 626: Error message without production error code - breaks React bundle size optimization
//   4. Line 626: Error message without production error code - breaks React bundle size optimization
//   5. Line 630: Error message without production error code - breaks React bundle size optimization
//   6. Line 630: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 655: Error message without production error code - breaks React bundle size optimization
//   2. Line 655: Error message without production error code - breaks React bundle size optimization
//   3. Line 663: Error message without production error code - breaks React bundle size optimization
//   4. Line 663: Error message without production error code - breaks React bundle size optimization
//   5. Line 667: Error message without production error code - breaks React bundle size optimization
//   6. Line 667: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 692: Error message without production error code - breaks React bundle size optimization
//   2. Line 692: Error message without production error code - breaks React bundle size optimization
//   3. Line 700: Error message without production error code - breaks React bundle size optimization
//   4. Line 700: Error message without production error code - breaks React bundle size optimization
//   5. Line 704: Error message without production error code - breaks React bundle size optimization
//   6. Line 704: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 729: Error message without production error code - breaks React bundle size optimization
//   2. Line 729: Error message without production error code - breaks React bundle size optimization
//   3. Line 737: Error message without production error code - breaks React bundle size optimization
//   4. Line 737: Error message without production error code - breaks React bundle size optimization
//   5. Line 741: Error message without production error code - breaks React bundle size optimization
//   6. Line 741: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 766: Error message without production error code - breaks React bundle size optimization
//   2. Line 766: Error message without production error code - breaks React bundle size optimization
//   3. Line 774: Error message without production error code - breaks React bundle size optimization
//   4. Line 774: Error message without production error code - breaks React bundle size optimization
//   5. Line 778: Error message without production error code - breaks React bundle size optimization
//   6. Line 778: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 803: Error message without production error code - breaks React bundle size optimization
//   2. Line 803: Error message without production error code - breaks React bundle size optimization
//   3. Line 811: Error message without production error code - breaks React bundle size optimization
//   4. Line 811: Error message without production error code - breaks React bundle size optimization
//   5. Line 815: Error message without production error code - breaks React bundle size optimization
//   6. Line 815: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 840: Error message without production error code - breaks React bundle size optimization
//   2. Line 840: Error message without production error code - breaks React bundle size optimization
//   3. Line 848: Error message without production error code - breaks React bundle size optimization
//   4. Line 848: Error message without production error code - breaks React bundle size optimization
//   5. Line 852: Error message without production error code - breaks React bundle size optimization
//   6. Line 852: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 877: Error message without production error code - breaks React bundle size optimization
//   2. Line 877: Error message without production error code - breaks React bundle size optimization
//   3. Line 885: Error message without production error code - breaks React bundle size optimization
//   4. Line 885: Error message without production error code - breaks React bundle size optimization
//   5. Line 889: Error message without production error code - breaks React bundle size optimization
//   6. Line 889: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 914: Error message without production error code - breaks React bundle size optimization
//   2. Line 914: Error message without production error code - breaks React bundle size optimization
//   3. Line 922: Error message without production error code - breaks React bundle size optimization
//   4. Line 922: Error message without production error code - breaks React bundle size optimization
//   5. Line 926: Error message without production error code - breaks React bundle size optimization
//   6. Line 926: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 951: Error message without production error code - breaks React bundle size optimization
//   2. Line 951: Error message without production error code - breaks React bundle size optimization
//   3. Line 959: Error message without production error code - breaks React bundle size optimization
//   4. Line 959: Error message without production error code - breaks React bundle size optimization
//   5. Line 963: Error message without production error code - breaks React bundle size optimization
//   6. Line 963: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 988: Error message without production error code - breaks React bundle size optimization
//   2. Line 988: Error message without production error code - breaks React bundle size optimization
//   3. Line 996: Error message without production error code - breaks React bundle size optimization
//   4. Line 996: Error message without production error code - breaks React bundle size optimization
//   5. Line 1000: Error message without production error code - breaks React bundle size optimization
//   6. Line 1000: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Chat provider for model ${modelId} is not registered.`);
		}
		return provider.sendChatRequest(modelId, messages, from, options, token);
	}

	computeTokenLength(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number> {
		const model = this._modelCache.get(modelId);
		if (!model) {
			throw new Error(`Chat model ${modelId} could not be found.`);
		}
		const provider = this._providers.get(model.vendor);
		if (!provider) {
			throw new Error(`Chat provider for model ${modelId} is not registered.`);
		}
		return provider.provideTokenCount(modelId, message, token);
	}
}
