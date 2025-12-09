//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IObservable, ISettableObservable, observableValue, transaction } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IChatAgentService } from './chatAgents.js';
import { ChatContextKeys } from './chatContextKeys.js';
import { ChatModeKind } from './constants.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ICustomChatMode, IPromptsService } from './promptSyntax/service/promptsService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 68: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 68: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 101: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 101: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 112: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 112: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 222: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 222: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 255: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 255: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IChatModeService = createDecorator<IChatModeService>('chatModeService');
export interface IChatModeService {
	readonly _serviceBrand: undefined;

	// TODO expose an observable list of modes
	onDidChangeChatModes: Event<void>;
	getModes(): { builtin: readonly IChatMode[]; custom: readonly IChatMode[] };
	findModeById(id: string): IChatMode | undefined;
	findModeByName(name: string): IChatMode | undefined;
}

export class ChatModeService extends Disposable implements IChatModeService {
	declare readonly _serviceBrand: undefined;

	private static readonly CUSTOM_MODES_STORAGE_KEY = 'chat.customModes';

	private readonly hasCustomModes: IContextKey<boolean>;
	private readonly _customModeInstances = new Map<string, CustomChatMode>();

	private readonly _onDidChangeChatModes = new Emitter<void>();
	public readonly onDidChangeChatModes = this._onDidChangeChatModes.event;

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.hasCustomModes = ChatContextKeys.Modes.hasCustomChatModes.bindTo(contextKeyService);

		// Load cached modes from storage first
		this.loadCachedModes();

		void this.refreshCustomPromptModes(true);
		this._register(this.promptsService.onDidChangeCustomChatModes(() => {
			void this.refreshCustomPromptModes(true);
		}));
		this._register(this.storageService.onWillSaveState(() => this.saveCachedModes()));

		// Ideally we can get rid of the setting to disable agent mode?
		let didHaveToolsAgent = this.chatAgentService.hasToolsAgent;
		this._register(this.chatAgentService.onDidChangeAgents(() => {
			if (didHaveToolsAgent !== this.chatAgentService.hasToolsAgent) {
				didHaveToolsAgent = this.chatAgentService.hasToolsAgent;
				this._onDidChangeChatModes.fire();
			}
		}));
	}

	private loadCachedModes(): void {
		try {
			const cachedCustomModes = this.storageService.getObject(ChatModeService.CUSTOM_MODES_STORAGE_KEY, StorageScope.WORKSPACE);
			if (cachedCustomModes) {
				this.deserializeCachedModes(cachedCustomModes);
			}
		} catch (error) {
			this.logService.error(error, 'Failed to load cached custom chat modes');
		}
	}

	private deserializeCachedModes(cachedCustomModes: any): void {
		if (!Array.isArray(cachedCustomModes)) {
			this.logService.error('Invalid cached custom modes data: expected array');
			return;
		}

		for (const cachedMode of cachedCustomModes) {
			if (isCachedChatModeData(cachedMode) && cachedMode.uri) {
				try {
					const uri = URI.revive(cachedMode.uri);
					const customChatMode: ICustomChatMode = {
						uri,
						name: cachedMode.name,
						description: cachedMode.description,
						tools: cachedMode.customTools,
						model: cachedMode.model,
						body: cachedMode.body || ''
					};
					const instance = new CustomChatMode(customChatMode);
					this._customModeInstances.set(uri.toString(), instance);
				} catch (error) {
					this.logService.error(error, 'Failed to create custom chat mode instance from cached data');
				}
			}
		}

		this.hasCustomModes.set(this._customModeInstances.size > 0);
	}

	private saveCachedModes(): void {
		try {
			const modesToCache = Array.from(this._customModeInstances.values());
			this.storageService.store(ChatModeService.CUSTOM_MODES_STORAGE_KEY, modesToCache, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} catch (error) {
			this.logService.warn('Failed to save cached custom chat modes', error);
		}
	}

	private async refreshCustomPromptModes(fireChangeEvent?: boolean): Promise<void> {
		try {
			const customModes = await this.promptsService.getCustomChatModes(CancellationToken.None);

			// Create a new set of mode instances, reusing existing ones where possible
			const seenUris = new Set<string>();

			for (const customMode of customModes) {
				const uriString = customMode.uri.toString();
				seenUris.add(uriString);

				let modeInstance = this._customModeInstances.get(uriString);
				if (modeInstance) {
					// Update existing instance with new data
					modeInstance.updateData(customMode);
				} else {
					// Create new instance
					modeInstance = new CustomChatMode(customMode);
					this._customModeInstances.set(uriString, modeInstance);
				}
			}

			// Clean up instances for modes that no longer exist
			for (const [uriString] of this._customModeInstances.entries()) {
				if (!seenUris.has(uriString)) {
					this._customModeInstances.delete(uriString);
				}
			}

			this.hasCustomModes.set(this._customModeInstances.size > 0);
		} catch (error) {
			this.logService.error(error, 'Failed to load custom chat modes');
			this._customModeInstances.clear();
			this.hasCustomModes.set(false);
		}
		if (fireChangeEvent) {
			this._onDidChangeChatModes.fire();
		}
	}

	getModes(): { builtin: readonly IChatMode[]; custom: readonly IChatMode[] } {
		return {
			builtin: this.getBuiltinModes(),
			custom: this.chatAgentService.hasToolsAgent ?
				Array.from(this._customModeInstances.values()) :
				[]
		};
	}

	private getFlatModes(): IChatMode[] {
		const allModes = this.getModes();
		return [...allModes.builtin, ...allModes.custom];
	}

	findModeById(id: string | ChatModeKind): IChatMode | undefined {
		const allModes = this.getFlatModes();
		return allModes.find(mode => mode.id === id);
	}

	findModeByName(name: string): IChatMode | undefined {
		const allModes = this.getFlatModes();
		return allModes.find(mode => mode.name === name);
	}

	private getBuiltinModes(): IChatMode[] {
		const builtinModes: IChatMode[] = [
			ChatMode.Ask,
		];

		if (this.chatAgentService.hasToolsAgent) {
			builtinModes.unshift(ChatMode.Agent);
		}
		builtinModes.push(ChatMode.Edit);
		return builtinModes;
	}
}

export interface IChatModeData {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly kind: ChatModeKind;
	readonly customTools?: readonly string[];
	readonly model?: string;
	readonly body?: string;
	readonly uri?: URI;
}

export interface IChatMode {
	readonly id: string;
	readonly name: string;
	readonly description: IObservable<string | undefined>;
	readonly kind: ChatModeKind;
	readonly customTools?: IObservable<readonly string[] | undefined>;
	readonly model?: IObservable<string | undefined>;
	readonly body?: IObservable<string>;
	readonly uri?: IObservable<URI>;

}

function isCachedChatModeData(data: unknown): data is IChatModeData {
	if (typeof data !== 'object' || data === null) {
		return false;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	}

	const mode = data as any;
	return typeof mode.id === 'string' &&
		typeof mode.name === 'string' &&
		typeof mode.kind === 'string' &&
		(mode.description === undefined || typeof mode.description === 'string') &&
		(mode.customTools === undefined || Array.isArray(mode.customTools)) &&
		(mode.body === undefined || typeof mode.body === 'string') &&
		(mode.model === undefined || typeof mode.model === 'string') &&
		(mode.uri === undefined || (typeof mode.uri === 'object' && mode.uri !== null));
}

export class CustomChatMode implements IChatMode {
	private readonly _descriptionObservable: ISettableObservable<string | undefined>;
	private readonly _customToolsObservable: ISettableObservable<readonly string[] | undefined>;
	private readonly _bodyObservable: ISettableObservable<string>;
	private readonly _uriObservable: ISettableObservable<URI>;
	private readonly _modelObservable: ISettableObservable<string | undefined>;

	public readonly id: string;
	public readonly name: string;

	get description(): IObservable<string | undefined> {
		return this._descriptionObservable;
	}

	get customTools(): IObservable<readonly string[] | undefined> {
		return this._customToolsObservable;
	}

	get model(): IObservable<string | undefined> {
		return this._modelObservable;
	}

	get body(): IObservable<string> {
		return this._bodyObservable;
	}

	get uri(): IObservable<URI> {
		return this._uriObservable;
	}

	public readonly kind = ChatModeKind.Agent;

	constructor(
		customChatMode: ICustomChatMode
	) {
		this.id = customChatMode.uri.toString();
		this.name = customChatMode.name;
		this._descriptionObservable = observableValue('description', customChatMode.description);
		this._customToolsObservable = observableValue('customTools', customChatMode.tools);
		this._modelObservable = observableValue('model', customChatMode.model);
		this._bodyObservable = observableValue('body', customChatMode.body);
		this._uriObservable = observableValue('uri', customChatMode.uri);
	}

	/**
	 * Updates the underlying data and triggers observable changes
	 */
	updateData(newData: ICustomChatMode): void {
		transaction(tx => {
			// Note- name is derived from ID, it can't change
			this._descriptionObservable.set(newData.description, tx);
			this._customToolsObservable.set(newData.tools, tx);
			this._modelObservable.set(newData.model, tx);
			this._bodyObservable.set(newData.body, tx);
			this._uriObservable.set(newData.uri, tx);
		});
	}

	toJSON(): IChatModeData {
		return {
			id: this.id,
			name: this.name,
			description: this.description.get(),
			kind: this.kind,
			customTools: this.customTools.get(),
			model: this.model.get(),
			body: this.body.get(),
			uri: this.uri.get()
		};
	}
}

export class BuiltinChatMode implements IChatMode {
	public readonly description: IObservable<string>;

	constructor(
		public readonly kind: ChatModeKind,
		public readonly name: string,
		description: string
	) {
		this.description = observableValue('description', description);
	}

	get id(): string {
		// Need a differentiator?
		return this.kind;
	}

	/**
	 * Getters are not json-stringified
	 */
	toJSON(): IChatModeData {
		return {
			id: this.id,
			name: this.name,
			description: this.description.get(),
			kind: this.kind
		};
	}
}

export namespace ChatMode {
	export const Ask = new BuiltinChatMode(ChatModeKind.Ask, 'Ask', localize('chatDescription', "Ask a question."));
	export const Edit = new BuiltinChatMode(ChatModeKind.Edit, 'Edit', localize('editsDescription', "Edit files."));
	export const Agent = new BuiltinChatMode(ChatModeKind.Agent, 'Agent', localize('agentDescription', "Provide instructions."));
}

export function isBuiltinChatMode(mode: IChatMode): boolean {
	return mode.id === ChatMode.Ask.id ||
		mode.id === ChatMode.Edit.id ||
		mode.id === ChatMode.Agent.id;
}
