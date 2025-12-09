//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLast } from '../../../../base/common/arraysFind.js';
import { timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { revive } from '../../../../base/common/marshalling.js';
import { IObservable, observableValue } from '../../../../base/common/observable.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Command } from '../../../../editor/common/languages.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asJson, IRequestService } from '../../../../platform/request/common/request.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ChatContextKeys } from './chatContextKeys.js';
import { IChatAgentEditedFileEvent, IChatProgressHistoryResponseContent, IChatRequestVariableData, ISerializableChatAgentData } from './chatModel.js';
import { IRawChatCommandContribution } from './chatParticipantContribTypes.js';
import { IChatFollowup, IChatLocationData, IChatProgress, IChatResponseErrorDetails, IChatTaskDto } from './chatService.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from './constants.js';

//#region agent service, commands etc

export interface IChatAgentHistoryEntry {
	request: IChatAgentRequest;
	response: ReadonlyArray<IChatProgressHistoryResponseContent | IChatTaskDto>;
	result: IChatAgentResult;
}

export interface IChatAgentData {
	id: string;
	name: string;
	fullName?: string;
	description?: string;
	/** This is string, not ContextKeyExpression, because dealing with serializing/deserializing is hard and need a better pattern for this */
	when?: string;
	extensionId: ExtensionIdentifier;
	extensionPublisherId: string;
	/** This is the extension publisher id, or, in the case of a dynamically registered participant (remote agent), whatever publisher name we have for it */
	publisherDisplayName?: string;
	extensionDisplayName: string;
	/** The agent invoked when no agent is specified */
	isDefault?: boolean;
	/** This agent is not contributed in package.json, but is registered dynamically */
	isDynamic?: boolean;
	/** This agent is contributed from core and not from an extension */
	isCore?: boolean;
	isCodingAgent?: boolean;
	metadata: IChatAgentMetadata;
	slashCommands: IChatAgentCommand[];
	locations: ChatAgentLocation[];
	/** This is only relevant for isDefault agents. Others should have all modes available. */
	modes: ChatModeKind[];
	disambiguation: { category: string; description: string; examples: string[] }[];
}

export interface IChatWelcomeMessageContent {
	icon: ThemeIcon;
	title: string;
	message: IMarkdownString;
}

export interface IChatAgentImplementation {
	invoke(request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult>;
	setRequestTools?(requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void;
	setRequestPaused?(requestId: string, isPaused: boolean): void;
	provideFollowups?(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]>;
	provideChatTitle?: (history: IChatAgentHistoryEntry[], token: CancellationToken) => Promise<string | undefined>;
	provideChatSummary?: (history: IChatAgentHistoryEntry[], token: CancellationToken) => Promise<string | undefined>;
}

export interface IChatParticipantDetectionResult {
	participant: string;
	command?: string;
}

export interface IChatParticipantMetadata {
	participant: string;
	command?: string;
	disambiguation: { category: string; description: string; examples: string[] }[];
}

export interface IChatParticipantDetectionProvider {
	provideParticipantDetection(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation; participants: IChatParticipantMetadata[] }, token: CancellationToken): Promise<IChatParticipantDetectionResult | null | undefined>;
}

export type IChatAgent = IChatAgentData & IChatAgentImplementation;

export interface IChatAgentCommand extends IRawChatCommandContribution {
	followupPlaceholder?: string;
}

export interface IChatRequesterInformation {
	name: string;

	/**
	 * A full URI for the icon of the requester.
	 */
	icon?: URI;
}

export interface IChatAgentMetadata {
	helpTextPrefix?: string | IMarkdownString;
	helpTextPostfix?: string | IMarkdownString;
	icon?: URI;
	iconDark?: URI;
	themeIcon?: ThemeIcon;
	sampleRequest?: string;
	supportIssueReporting?: boolean;
	followupPlaceholder?: string;
	isSticky?: boolean;
	requester?: IChatRequesterInformation;
	additionalWelcomeMessage?: string | IMarkdownString;
}


export interface IChatAgentRequest {
	sessionId: string;
	requestId: string;
	agentId: string;
	command?: string;
	message: string;
	attempt?: number;
	enableCommandDetection?: boolean;
	isParticipantDetected?: boolean;
	variables: IChatRequestVariableData;
	location: ChatAgentLocation;
	locationData?: IChatLocationData;
	acceptedConfirmationData?: any[];
	rejectedConfirmationData?: any[];
	userSelectedModelId?: string;
	userSelectedTools?: Record<string, boolean>;
	modeInstructions?: string;
	editedFileEvents?: IChatAgentEditedFileEvent[];
}

export interface IChatQuestion {
	readonly prompt: string;
	readonly participant?: string;
	readonly command?: string;
}

export interface IChatAgentResultTimings {
	firstProgress?: number;
	totalElapsed: number;
}

export interface IChatAgentResult {
	errorDetails?: IChatResponseErrorDetails;
	timings?: IChatAgentResultTimings;
	/** Extra properties that the agent can use to identify a result */
	readonly metadata?: { readonly [key: string]: any };
	readonly details?: string;
	nextQuestion?: IChatQuestion;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export const IChatAgentService = createDecorator<IChatAgentService>('chatAgentService');

interface IChatAgentEntry {
	data: IChatAgentData;
	impl?: IChatAgentImplementation;
}

export interface IChatAgentCompletionItem {
	id: string;
	name?: string;
	fullName?: string;
	icon?: ThemeIcon;
	value: unknown;
	command?: Command;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 184: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 184: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface IChatAgentService {
	_serviceBrand: undefined;
	/**
	 * undefined when an agent was removed
	 */
	readonly onDidChangeAgents: Event<IChatAgent | undefined>;
	readonly hasToolsAgent: boolean;
	registerAgent(id: string, data: IChatAgentData): IDisposable;
	registerAgentImplementation(id: string, agent: IChatAgentImplementation): IDisposable;
	registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable;
	registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>): IDisposable;
	getAgentCompletionItems(id: string, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]>;
	registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider): IDisposable;
	detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined>;
	hasChatParticipantDetectionProviders(): boolean;
	invokeAgent(agent: string, request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult>;
	setRequestTools(agent: string, requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void;
	setRequestPaused(agent: string, requestId: string, isPaused: boolean): void;
	getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]>;
	getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined>;
	getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined>;
	getAgent(id: string, includeDisabled?: boolean): IChatAgentData | undefined;
	getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined;
	getAgents(): IChatAgentData[];
	getActivatedAgents(): Array<IChatAgent>;
	getAgentsByName(name: string): IChatAgentData[];
	agentHasDupeName(id: string): boolean;

	/**
	 * Get the default agent (only if activated)
	 */
	getDefaultAgent(location: ChatAgentLocation, mode?: ChatModeKind): IChatAgent | undefined;

	/**
	 * Get the default agent data that has been contributed (may not be activated yet)
	 */
	getContributedDefaultAgent(location: ChatAgentLocation): IChatAgentData | undefined;
	updateAgent(id: string, updateMetadata: IChatAgentMetadata): void;
}

export class ChatAgentService extends Disposable implements IChatAgentService {

	public static readonly AGENT_LEADER = '@';

	declare _serviceBrand: undefined;

	private _agents = new Map<string, IChatAgentEntry>();

	private readonly _onDidChangeAgents = new Emitter<IChatAgent | undefined>();
	readonly onDidChangeAgents: Event<IChatAgent | undefined> = this._onDidChangeAgents.event;

	private readonly _agentsContextKeys = new Set<string>();
	private readonly _hasDefaultAgent: IContextKey<boolean>;
	private readonly _extensionAgentRegistered: IContextKey<boolean>;
	private readonly _defaultAgentRegistered: IContextKey<boolean>;
	private _hasToolsAgent = false;

	private _chatParticipantDetectionProviders = new Map<number, IChatParticipantDetectionProvider>();

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._hasDefaultAgent = ChatContextKeys.enabled.bindTo(this.contextKeyService);
		this._extensionAgentRegistered = ChatContextKeys.extensionParticipantRegistered.bindTo(this.contextKeyService);
		this._defaultAgentRegistered = ChatContextKeys.panelParticipantRegistered.bindTo(this.contextKeyService);
		this._register(contextKeyService.onDidChangeContext((e) => {
			if (e.affectsSome(this._agentsContextKeys)) {
				this._updateContextKeys();
			}
		}));
	}

	registerAgent(id: string, data: IChatAgentData): IDisposable {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 261: Error message without production error code - breaks React bundle size optimization
//   2. Line 261: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const existingAgent = this.getAgent(id);
		if (existingAgent) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 290: Error message without production error code - breaks React bundle size optimization
//   2. Line 290: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Agent already registered: ${JSON.stringify(id)}`);
		}

		const that = this;
		const commands = data.slashCommands;
		data = {
			...data,
			get slashCommands() {
				return commands.filter(c => !c.when || that.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(c.when)));
			}
		};
		const entry = { data };
		this._agents.set(id, entry);
		this._updateAgentsContextKeys();
		this._updateContextKeys();
		this._onDidChangeAgents.fire(undefined);

		return toDisposable(() => {
			this._agents.delete(id);
			this._updateAgentsContextKeys();
			this._updateContextKeys();
			this._onDidChangeAgents.fire(undefined);
		});
	}

	private _updateAgentsContextKeys(): void {
		// Update the set of context keys used by all agents
		this._agentsContextKeys.clear();
		for (const agent of this._agents.values()) {
			if (agent.data.when) {
				const expr = ContextKeyExpr.deserialize(agent.data.when);
				for (const key of expr?.keys() || []) {
					this._agentsContextKeys.add(key);
				}
			}
		}
	}

	private _updateContextKeys(): void {
		let extensionAgentRegistered = false;
		let defaultAgentRegistered = false;
		let toolsAgentRegistered = false;
		for (const agent of this.getAgents()) {
			if (agent.isDefault) {
				if (!agent.isCore) {
					extensionAgentRegistered = true;
				}
				if (agent.id === 'chat.setup' || agent.id === 'github.copilot.editsAgent') {
					// TODO@roblourens firing the event below probably isn't necessary but leave it alone for now
					toolsAgentRegistered = true;
				} else {
					defaultAgentRegistered = true;
				}
			}
		}
		this._defaultAgentRegistered.set(defaultAgentRegistered);
		this._extensionAgentRegistered.set(extensionAgentRegistered);
		if (toolsAgentRegistered !== this._hasToolsAgent) {
			this._hasToolsAgent = toolsAgentRegistered;
			this._onDidChangeAgents.fire(this.getDefaultAgent(ChatAgentLocation.Panel, ChatModeKind.Agent));
		}
	}

	registerAgentImplementation(id: string, agentImpl: IChatAgentImplementation): IDisposable {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 327: Error message without production error code - breaks React bundle size optimization
//   2. Line 327: Error message without production error code - breaks React bundle size optimization
//   3. Line 331: Error message without production error code - breaks React bundle size optimization
//   4. Line 331: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const entry = this._agents.get(id);
		if (!entry) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 368: Error message without production error code - breaks React bundle size optimization
//   2. Line 368: Error message without production error code - breaks React bundle size optimization
//   3. Line 372: Error message without production error code - breaks React bundle size optimization
//   4. Line 372: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 400: Error message without production error code - breaks React bundle size optimization
//   2. Line 400: Error message without production error code - breaks React bundle size optimization
//   3. Line 404: Error message without production error code - breaks React bundle size optimization
//   4. Line 404: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 412: Error message without production error code - breaks React bundle size optimization
//   2. Line 412: Error message without production error code - breaks React bundle size optimization
//   3. Line 416: Error message without production error code - breaks React bundle size optimization
//   4. Line 416: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 424: Error message without production error code - breaks React bundle size optimization
//   2. Line 424: Error message without production error code - breaks React bundle size optimization
//   3. Line 428: Error message without production error code - breaks React bundle size optimization
//   4. Line 428: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 436: Error message without production error code - breaks React bundle size optimization
//   2. Line 436: Error message without production error code - breaks React bundle size optimization
//   3. Line 440: Error message without production error code - breaks React bundle size optimization
//   4. Line 440: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 448: Error message without production error code - breaks React bundle size optimization
//   2. Line 448: Error message without production error code - breaks React bundle size optimization
//   3. Line 452: Error message without production error code - breaks React bundle size optimization
//   4. Line 452: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 460: Error message without production error code - breaks React bundle size optimization
//   2. Line 460: Error message without production error code - breaks React bundle size optimization
//   3. Line 464: Error message without production error code - breaks React bundle size optimization
//   4. Line 464: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 472: Error message without production error code - breaks React bundle size optimization
//   2. Line 472: Error message without production error code - breaks React bundle size optimization
//   3. Line 476: Error message without production error code - breaks React bundle size optimization
//   4. Line 476: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 484: Error message without production error code - breaks React bundle size optimization
//   2. Line 484: Error message without production error code - breaks React bundle size optimization
//   3. Line 488: Error message without production error code - breaks React bundle size optimization
//   4. Line 488: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 496: Error message without production error code - breaks React bundle size optimization
//   2. Line 496: Error message without production error code - breaks React bundle size optimization
//   3. Line 500: Error message without production error code - breaks React bundle size optimization
//   4. Line 500: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 508: Error message without production error code - breaks React bundle size optimization
//   2. Line 508: Error message without production error code - breaks React bundle size optimization
//   3. Line 512: Error message without production error code - breaks React bundle size optimization
//   4. Line 512: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 520: Error message without production error code - breaks React bundle size optimization
//   2. Line 520: Error message without production error code - breaks React bundle size optimization
//   3. Line 524: Error message without production error code - breaks React bundle size optimization
//   4. Line 524: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 532: Error message without production error code - breaks React bundle size optimization
//   2. Line 532: Error message without production error code - breaks React bundle size optimization
//   3. Line 536: Error message without production error code - breaks React bundle size optimization
//   4. Line 536: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 544: Error message without production error code - breaks React bundle size optimization
//   2. Line 544: Error message without production error code - breaks React bundle size optimization
//   3. Line 548: Error message without production error code - breaks React bundle size optimization
//   4. Line 548: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 556: Error message without production error code - breaks React bundle size optimization
//   2. Line 556: Error message without production error code - breaks React bundle size optimization
//   3. Line 560: Error message without production error code - breaks React bundle size optimization
//   4. Line 560: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 568: Error message without production error code - breaks React bundle size optimization
//   2. Line 568: Error message without production error code - breaks React bundle size optimization
//   3. Line 572: Error message without production error code - breaks React bundle size optimization
//   4. Line 572: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 580: Error message without production error code - breaks React bundle size optimization
//   2. Line 580: Error message without production error code - breaks React bundle size optimization
//   3. Line 584: Error message without production error code - breaks React bundle size optimization
//   4. Line 584: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 592: Error message without production error code - breaks React bundle size optimization
//   2. Line 592: Error message without production error code - breaks React bundle size optimization
//   3. Line 596: Error message without production error code - breaks React bundle size optimization
//   4. Line 596: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 604: Error message without production error code - breaks React bundle size optimization
//   2. Line 604: Error message without production error code - breaks React bundle size optimization
//   3. Line 608: Error message without production error code - breaks React bundle size optimization
//   4. Line 608: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 616: Error message without production error code - breaks React bundle size optimization
//   2. Line 616: Error message without production error code - breaks React bundle size optimization
//   3. Line 620: Error message without production error code - breaks React bundle size optimization
//   4. Line 620: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 628: Error message without production error code - breaks React bundle size optimization
//   2. Line 628: Error message without production error code - breaks React bundle size optimization
//   3. Line 632: Error message without production error code - breaks React bundle size optimization
//   4. Line 632: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 640: Error message without production error code - breaks React bundle size optimization
//   2. Line 640: Error message without production error code - breaks React bundle size optimization
//   3. Line 644: Error message without production error code - breaks React bundle size optimization
//   4. Line 644: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 652: Error message without production error code - breaks React bundle size optimization
//   2. Line 652: Error message without production error code - breaks React bundle size optimization
//   3. Line 656: Error message without production error code - breaks React bundle size optimization
//   4. Line 656: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 664: Error message without production error code - breaks React bundle size optimization
//   2. Line 664: Error message without production error code - breaks React bundle size optimization
//   3. Line 668: Error message without production error code - breaks React bundle size optimization
//   4. Line 668: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 676: Error message without production error code - breaks React bundle size optimization
//   2. Line 676: Error message without production error code - breaks React bundle size optimization
//   3. Line 680: Error message without production error code - breaks React bundle size optimization
//   4. Line 680: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 688: Error message without production error code - breaks React bundle size optimization
//   2. Line 688: Error message without production error code - breaks React bundle size optimization
//   3. Line 692: Error message without production error code - breaks React bundle size optimization
//   4. Line 692: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 700: Error message without production error code - breaks React bundle size optimization
//   2. Line 700: Error message without production error code - breaks React bundle size optimization
//   3. Line 704: Error message without production error code - breaks React bundle size optimization
//   4. Line 704: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 712: Error message without production error code - breaks React bundle size optimization
//   2. Line 712: Error message without production error code - breaks React bundle size optimization
//   3. Line 716: Error message without production error code - breaks React bundle size optimization
//   4. Line 716: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 724: Error message without production error code - breaks React bundle size optimization
//   2. Line 724: Error message without production error code - breaks React bundle size optimization
//   3. Line 728: Error message without production error code - breaks React bundle size optimization
//   4. Line 728: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 736: Error message without production error code - breaks React bundle size optimization
//   2. Line 736: Error message without production error code - breaks React bundle size optimization
//   3. Line 740: Error message without production error code - breaks React bundle size optimization
//   4. Line 740: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unknown agent: ${JSON.stringify(id)}`);
		}

		if (entry.impl) {
			throw new Error(`Agent already has implementation: ${JSON.stringify(id)}`);
		}

		if (entry.data.isDefault) {
			this._hasDefaultAgent.set(true);
		}

		entry.impl = agentImpl;
		this._onDidChangeAgents.fire(new MergedChatAgent(entry.data, agentImpl));

		return toDisposable(() => {
			entry.impl = undefined;
			this._onDidChangeAgents.fire(undefined);

			if (entry.data.isDefault) {
				this._hasDefaultAgent.set(Iterable.some(this._agents.values(), agent => agent.data.isDefault));
			}
		});
	}

	registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable {
		data.isDynamic = true;
		const agent = { data, impl: agentImpl };
		this._agents.set(data.id, agent);
		this._onDidChangeAgents.fire(new MergedChatAgent(data, agentImpl));

		return toDisposable(() => {
			this._agents.delete(data.id);
			this._onDidChangeAgents.fire(undefined);
		});
	}

	private _agentCompletionProviders = new Map<string, (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>>();

	registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>) {
		this._agentCompletionProviders.set(id, provider);
		return {
			dispose: () => { this._agentCompletionProviders.delete(id); }
		};
	}

	async getAgentCompletionItems(id: string, query: string, token: CancellationToken) {
		return await this._agentCompletionProviders.get(id)?.(query, token) ?? [];
	}

	updateAgent(id: string, updateMetadata: IChatAgentMetadata): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 379: Error message without production error code - breaks React bundle size optimization
//   2. Line 379: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const agent = this._agents.get(id);
		if (!agent?.impl) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 430: Error message without production error code - breaks React bundle size optimization
//   2. Line 430: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`No activated agent with id ${JSON.stringify(id)} registered`);
		}
		agent.data.metadata = { ...agent.data.metadata, ...updateMetadata };
		this._onDidChangeAgents.fire(new MergedChatAgent(agent.data, agent.impl));
	}

	getDefaultAgent(location: ChatAgentLocation, mode: ChatModeKind = ChatModeKind.Ask): IChatAgent | undefined {
		return this._preferExtensionAgent(this.getActivatedAgents().filter(a => {
			if (mode && !a.modes.includes(mode)) {
				return false;
			}

			return !!a.isDefault && a.locations.includes(location);
		}));
	}

	public get hasToolsAgent(): boolean {
		// The chat participant enablement is just based on this setting. Don't wait for the extension to be loaded.
		return !!this.configurationService.getValue(ChatConfiguration.AgentEnabled);
	}

	getContributedDefaultAgent(location: ChatAgentLocation): IChatAgentData | undefined {
		return this._preferExtensionAgent(this.getAgents().filter(a => !!a.isDefault && a.locations.includes(location)));
	}

	private _preferExtensionAgent<T extends IChatAgentData>(agents: T[]): T | undefined {
		// We potentially have multiple agents on the same location,
		// contributed from core and from extensions.
		// This method will prefer the last extensions provided agent
		// falling back to the last core agent if no extension agent is found.
		return findLast(agents, agent => !agent.isCore) ?? agents.at(-1);
	}

	getAgent(id: string, includeDisabled = false): IChatAgentData | undefined {
		if (!this._agentIsEnabled(id) && !includeDisabled) {
			return;
		}

		return this._agents.get(id)?.data;
	}

	private _agentIsEnabled(idOrAgent: string | IChatAgentEntry): boolean {
		const entry = typeof idOrAgent === 'string' ? this._agents.get(idOrAgent) : idOrAgent;
		return !entry?.data.when || this.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(entry.data.when));
	}

	getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined {
		const agent = Iterable.find(this._agents.values(), a => getFullyQualifiedId(a.data) === id)?.data;
		if (agent && !this._agentIsEnabled(agent.id)) {
			return;
		}

		return agent;
	}

	/**
	 * Returns all agent datas that exist- static registered and dynamic ones.
	 */
	getAgents(): IChatAgentData[] {
		return Array.from(this._agents.values())
			.map(entry => entry.data)
			.filter(a => this._agentIsEnabled(a.id));
	}

	getActivatedAgents(): IChatAgent[] {
		return Array.from(this._agents.values())
			.filter(a => !!a.impl)
			.filter(a => this._agentIsEnabled(a.data.id))
			.map(a => new MergedChatAgent(a.data, a.impl!));
	}

	getAgentsByName(name: string): IChatAgentData[] {
		return this._preferExtensionAgents(this.getAgents().filter(a => a.name === name));
	}

	private _preferExtensionAgents<T extends IChatAgentData>(agents: T[]): T[] {
		// We potentially have multiple agents on the same location,
		// contributed from core and from extensions.
		// This method will prefer the extensions provided agents
		// falling back to the original agents array extension agent is found.
		const extensionAgents = agents.filter(a => !a.isCore);
		return extensionAgents.length > 0 ? extensionAgents : agents;
	}

	agentHasDupeName(id: string): boolean {
		const agent = this.getAgent(id);
		if (!agent) {
			return false;
		}

		return this.getAgentsByName(agent.name)
			.filter(a => a.extensionId.value !== agent.extensionId.value).length > 0;
	}

	async invokeAgent(id: string, request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> {
		const data = this._agents.get(id);
		if (!data?.impl) {
			throw new Error(`No activated agent with id "${id}"`);
		}

		return await data.impl.invoke(request, progress, history, token);
	}

	setRequestTools(id: string, requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void {
		const data = this._agents.get(id);
		if (!data?.impl) {
			throw new Error(`No activated agent with id "${id}"`);
		}

		data.impl.setRequestTools?.(requestId, tools);
	}

	setRequestPaused(id: string, requestId: string, isPaused: boolean) {
		const data = this._agents.get(id);
		if (!data?.impl) {
			throw new Error(`No activated agent with id "${id}"`);
		}

		data.impl.setRequestPaused?.(requestId, isPaused);
	}

	async getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideFollowups) {
			return [];
		}

		return data.impl.provideFollowups(request, result, history, token);
	}

	async getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideChatTitle) {
			return undefined;
		}

		return data.impl.provideChatTitle(history, token);
	}

	async getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideChatSummary) {
			return undefined;
		}

		return data.impl.provideChatSummary(history, token);
	}

	registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider) {
		this._chatParticipantDetectionProviders.set(handle, provider);
		return toDisposable(() => {
			this._chatParticipantDetectionProviders.delete(handle);
		});
	}

	hasChatParticipantDetectionProviders() {
		return this._chatParticipantDetectionProviders.size > 0;
	}

	async detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined> {
		// TODO@joyceerhl should we have a selector to be able to narrow down which provider to use
		const provider = Iterable.first(this._chatParticipantDetectionProviders.values());
		if (!provider) {
			return;
		}

		const participants = this.getAgents().reduce<IChatParticipantMetadata[]>((acc, a) => {
			if (a.locations.includes(options.location)) {
				acc.push({ participant: a.id, disambiguation: a.disambiguation ?? [] });
				for (const command of a.slashCommands) {
					acc.push({ participant: a.id, command: command.name, disambiguation: command.disambiguation ?? [] });
				}
			}
			return acc;
		}, []);

		const result = await provider.provideParticipantDetection(request, history, { ...options, participants }, token);
		if (!result) {
			return;
		}

		const agent = this.getAgent(result.participant);
		if (!agent) {
			// Couldn't find a participant matching the participant detection result
			return;
		}

		if (!result.command) {
			return { agent };
		}

		const command = agent?.slashCommands.find(c => c.name === result.command);
		if (!command) {
			// Couldn't find a slash command matching the participant detection result
			return;
		}

		return { agent, command };
	}
}

export class MergedChatAgent implements IChatAgent {
	constructor(
		private readonly data: IChatAgentData,
		private readonly impl: IChatAgentImplementation
	) { }
	when?: string | undefined;
	publisherDisplayName?: string | undefined;
	isDynamic?: boolean | undefined;

	get id(): string { return this.data.id; }
	get name(): string { return this.data.name ?? ''; }
	get fullName(): string { return this.data.fullName ?? ''; }
	get description(): string { return this.data.description ?? ''; }
	get extensionId(): ExtensionIdentifier { return this.data.extensionId; }
	get extensionPublisherId(): string { return this.data.extensionPublisherId; }
	get extensionPublisherDisplayName() { return this.data.publisherDisplayName; }
	get extensionDisplayName(): string { return this.data.extensionDisplayName; }
	get isDefault(): boolean | undefined { return this.data.isDefault; }
	get isCore(): boolean | undefined { return this.data.isCore; }
	get metadata(): IChatAgentMetadata { return this.data.metadata; }
	get slashCommands(): IChatAgentCommand[] { return this.data.slashCommands; }
	get locations(): ChatAgentLocation[] { return this.data.locations; }
	get modes(): ChatModeKind[] { return this.data.modes; }
	get disambiguation(): { category: string; description: string; examples: string[] }[] { return this.data.disambiguation; }

	async invoke(request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> {
		return this.impl.invoke(request, progress, history, token);
	}

	setRequestTools(requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void {
		this.impl.setRequestTools?.(requestId, tools);
	}

	setRequestPaused(requestId: string, isPaused: boolean): void {
		this.impl.setRequestPaused?.(requestId, isPaused);
	}

	async provideFollowups(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
		if (this.impl.provideFollowups) {
			return this.impl.provideFollowups(request, result, history, token);
		}

		return [];
	}

	toJSON(): IChatAgentData {
		return this.data;
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 630: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 639: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 639: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 644: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 693: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 702: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 702: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 707: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 747: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 756: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 756: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 761: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 771: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 780: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 780: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 785: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 795: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 804: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 804: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 809: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 819: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 828: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 828: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 833: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 843: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 852: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 852: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 857: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 867: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 876: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 876: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 881: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 891: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 900: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 900: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 905: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 915: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 924: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 924: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 929: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 939: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 948: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 948: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 953: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 963: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 972: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 972: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 977: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 987: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 996: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 996: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1001: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1011: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1020: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1020: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1025: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1035: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1044: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1044: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1049: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1059: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1068: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1068: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1073: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1083: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1092: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1092: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1097: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1107: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1116: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1116: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1121: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1131: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1140: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1140: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1145: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1155: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1164: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1164: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1169: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1179: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1188: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1188: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1193: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1203: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1212: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1212: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1217: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1227: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1236: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1236: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1241: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1251: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1260: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1260: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1265: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1275: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1284: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1284: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1289: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1299: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1308: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1308: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1313: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1323: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1332: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1332: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1337: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1347: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1356: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1356: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1361: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1371: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1380: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1380: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1385: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1395: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1404: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1404: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1409: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1419: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1428: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1428: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1433: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IChatAgentNameService = createDecorator<IChatAgentNameService>('chatAgentNameService');

type IChatParticipantRegistry = { [name: string]: string[] };

interface IChatParticipantRegistryResponse {
	readonly version: number;
	readonly restrictedChatParticipants: IChatParticipantRegistry;
}

export interface IChatAgentNameService {
	_serviceBrand: undefined;
	getAgentNameRestriction(chatAgentData: IChatAgentData): boolean;
}

export class ChatAgentNameService implements IChatAgentNameService {

	private static readonly StorageKey = 'chat.participantNameRegistry';

	declare _serviceBrand: undefined;

	private readonly url!: string;
	private registry = observableValue<IChatParticipantRegistry>(this, Object.create(null));
	private disposed = false;

	constructor(
		@IProductService productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService
	) {
		if (!productService.chatParticipantRegistry) {
			return;
		}

		this.url = productService.chatParticipantRegistry;

		const raw = storageService.get(ChatAgentNameService.StorageKey, StorageScope.APPLICATION);

		try {
			this.registry.set(JSON.parse(raw ?? '{}'), undefined);
		} catch (err) {
			storageService.remove(ChatAgentNameService.StorageKey, StorageScope.APPLICATION);
		}

		this.refresh();
	}

	private refresh(): void {
		if (this.disposed) {
			return;
		}

		this.update()
			.catch(err => this.logService.warn('Failed to fetch chat participant registry', err))
			.then(() => timeout(5 * 60 * 1000)) // every 5 minutes
			.then(() => this.refresh());
	}

	private async update(): Promise<void> {
		const context = await this.requestService.request({ type: 'GET', url: this.url }, CancellationToken.None);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 692: Error message without production error code - breaks React bundle size optimization
//   2. Line 692: Error message without production error code - breaks React bundle size optimization
//   3. Line 698: Error message without production error code - breaks React bundle size optimization
//   4. Line 698: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (context.res.statusCode !== 200) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 767: Error message without production error code - breaks React bundle size optimization
//   2. Line 767: Error message without production error code - breaks React bundle size optimization
//   3. Line 773: Error message without production error code - breaks React bundle size optimization
//   4. Line 773: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 833: Error message without production error code - breaks React bundle size optimization
//   2. Line 833: Error message without production error code - breaks React bundle size optimization
//   3. Line 839: Error message without production error code - breaks React bundle size optimization
//   4. Line 839: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 869: Error message without production error code - breaks React bundle size optimization
//   2. Line 869: Error message without production error code - breaks React bundle size optimization
//   3. Line 875: Error message without production error code - breaks React bundle size optimization
//   4. Line 875: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 905: Error message without production error code - breaks React bundle size optimization
//   2. Line 905: Error message without production error code - breaks React bundle size optimization
//   3. Line 911: Error message without production error code - breaks React bundle size optimization
//   4. Line 911: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 941: Error message without production error code - breaks React bundle size optimization
//   2. Line 941: Error message without production error code - breaks React bundle size optimization
//   3. Line 947: Error message without production error code - breaks React bundle size optimization
//   4. Line 947: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 977: Error message without production error code - breaks React bundle size optimization
//   2. Line 977: Error message without production error code - breaks React bundle size optimization
//   3. Line 983: Error message without production error code - breaks React bundle size optimization
//   4. Line 983: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1013: Error message without production error code - breaks React bundle size optimization
//   2. Line 1013: Error message without production error code - breaks React bundle size optimization
//   3. Line 1019: Error message without production error code - breaks React bundle size optimization
//   4. Line 1019: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1049: Error message without production error code - breaks React bundle size optimization
//   2. Line 1049: Error message without production error code - breaks React bundle size optimization
//   3. Line 1055: Error message without production error code - breaks React bundle size optimization
//   4. Line 1055: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1085: Error message without production error code - breaks React bundle size optimization
//   2. Line 1085: Error message without production error code - breaks React bundle size optimization
//   3. Line 1091: Error message without production error code - breaks React bundle size optimization
//   4. Line 1091: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1121: Error message without production error code - breaks React bundle size optimization
//   2. Line 1121: Error message without production error code - breaks React bundle size optimization
//   3. Line 1127: Error message without production error code - breaks React bundle size optimization
//   4. Line 1127: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1157: Error message without production error code - breaks React bundle size optimization
//   2. Line 1157: Error message without production error code - breaks React bundle size optimization
//   3. Line 1163: Error message without production error code - breaks React bundle size optimization
//   4. Line 1163: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1193: Error message without production error code - breaks React bundle size optimization
//   2. Line 1193: Error message without production error code - breaks React bundle size optimization
//   3. Line 1199: Error message without production error code - breaks React bundle size optimization
//   4. Line 1199: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1229: Error message without production error code - breaks React bundle size optimization
//   2. Line 1229: Error message without production error code - breaks React bundle size optimization
//   3. Line 1235: Error message without production error code - breaks React bundle size optimization
//   4. Line 1235: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1265: Error message without production error code - breaks React bundle size optimization
//   2. Line 1265: Error message without production error code - breaks React bundle size optimization
//   3. Line 1271: Error message without production error code - breaks React bundle size optimization
//   4. Line 1271: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1301: Error message without production error code - breaks React bundle size optimization
//   2. Line 1301: Error message without production error code - breaks React bundle size optimization
//   3. Line 1307: Error message without production error code - breaks React bundle size optimization
//   4. Line 1307: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1337: Error message without production error code - breaks React bundle size optimization
//   2. Line 1337: Error message without production error code - breaks React bundle size optimization
//   3. Line 1343: Error message without production error code - breaks React bundle size optimization
//   4. Line 1343: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1373: Error message without production error code - breaks React bundle size optimization
//   2. Line 1373: Error message without production error code - breaks React bundle size optimization
//   3. Line 1379: Error message without production error code - breaks React bundle size optimization
//   4. Line 1379: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1409: Error message without production error code - breaks React bundle size optimization
//   2. Line 1409: Error message without production error code - breaks React bundle size optimization
//   3. Line 1415: Error message without production error code - breaks React bundle size optimization
//   4. Line 1415: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1445: Error message without production error code - breaks React bundle size optimization
//   2. Line 1445: Error message without production error code - breaks React bundle size optimization
//   3. Line 1451: Error message without production error code - breaks React bundle size optimization
//   4. Line 1451: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1481: Error message without production error code - breaks React bundle size optimization
//   2. Line 1481: Error message without production error code - breaks React bundle size optimization
//   3. Line 1487: Error message without production error code - breaks React bundle size optimization
//   4. Line 1487: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1517: Error message without production error code - breaks React bundle size optimization
//   2. Line 1517: Error message without production error code - breaks React bundle size optimization
//   3. Line 1523: Error message without production error code - breaks React bundle size optimization
//   4. Line 1523: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1553: Error message without production error code - breaks React bundle size optimization
//   2. Line 1553: Error message without production error code - breaks React bundle size optimization
//   3. Line 1559: Error message without production error code - breaks React bundle size optimization
//   4. Line 1559: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1589: Error message without production error code - breaks React bundle size optimization
//   2. Line 1589: Error message without production error code - breaks React bundle size optimization
//   3. Line 1595: Error message without production error code - breaks React bundle size optimization
//   4. Line 1595: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1625: Error message without production error code - breaks React bundle size optimization
//   2. Line 1625: Error message without production error code - breaks React bundle size optimization
//   3. Line 1631: Error message without production error code - breaks React bundle size optimization
//   4. Line 1631: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1661: Error message without production error code - breaks React bundle size optimization
//   2. Line 1661: Error message without production error code - breaks React bundle size optimization
//   3. Line 1667: Error message without production error code - breaks React bundle size optimization
//   4. Line 1667: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1697: Error message without production error code - breaks React bundle size optimization
//   2. Line 1697: Error message without production error code - breaks React bundle size optimization
//   3. Line 1703: Error message without production error code - breaks React bundle size optimization
//   4. Line 1703: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1733: Error message without production error code - breaks React bundle size optimization
//   2. Line 1733: Error message without production error code - breaks React bundle size optimization
//   3. Line 1739: Error message without production error code - breaks React bundle size optimization
//   4. Line 1739: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1769: Error message without production error code - breaks React bundle size optimization
//   2. Line 1769: Error message without production error code - breaks React bundle size optimization
//   3. Line 1775: Error message without production error code - breaks React bundle size optimization
//   4. Line 1775: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1805: Error message without production error code - breaks React bundle size optimization
//   2. Line 1805: Error message without production error code - breaks React bundle size optimization
//   3. Line 1811: Error message without production error code - breaks React bundle size optimization
//   4. Line 1811: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1841: Error message without production error code - breaks React bundle size optimization
//   2. Line 1841: Error message without production error code - breaks React bundle size optimization
//   3. Line 1847: Error message without production error code - breaks React bundle size optimization
//   4. Line 1847: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Could not get extensions report.');
		}

		const result = await asJson<IChatParticipantRegistryResponse>(context);

		if (!result || result.version !== 1) {
			throw new Error('Unexpected chat participant registry response.');
		}

		const registry = result.restrictedChatParticipants;
		this.registry.set(registry, undefined);
		this.storageService.store(ChatAgentNameService.StorageKey, JSON.stringify(registry), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	/**
	 * Returns true if the agent is allowed to use this name
	 */
	getAgentNameRestriction(chatAgentData: IChatAgentData): boolean {
		if (chatAgentData.isCore) {
			return true; // core agents are always allowed to use any name
		}

		// TODO would like to use observables here but nothing uses it downstream and I'm not sure how to combine these two
		const nameAllowed = this.checkAgentNameRestriction(chatAgentData.name, chatAgentData).get();
		const fullNameAllowed = !chatAgentData.fullName || this.checkAgentNameRestriction(chatAgentData.fullName.replace(/\s/g, ''), chatAgentData).get();
		return nameAllowed && fullNameAllowed;
	}

	private checkAgentNameRestriction(name: string, chatAgentData: IChatAgentData): IObservable<boolean> {
		// Registry is a map of name to an array of extension publisher IDs or extension IDs that are allowed to use it.
		// Look up the list of extensions that are allowed to use this name
		const allowList = this.registry.map<string[] | undefined>(registry => registry[name.toLowerCase()]);
		return allowList.map(allowList => {
			if (!allowList) {
				return true;
			}

			return allowList.some(id => equalsIgnoreCase(id, id.includes('.') ? chatAgentData.extensionId.value : chatAgentData.extensionPublisherId));
		});
	}

	dispose() {
		this.disposed = true;
	}
}

export function getFullyQualifiedId(chatAgentData: IChatAgentData): string {
	return `${chatAgentData.extensionId.value}.${chatAgentData.id}`;
}

export function reviveSerializedAgent(raw: ISerializableChatAgentData): IChatAgentData {
	const agent = 'name' in raw ?
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 746: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		raw :
		{
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			...(raw as any),
			name: (raw as any).id,
		};

	// Fill in required fields that may be missing from old data
	if (!('extensionPublisherId' in agent)) {
		agent.extensionPublisherId = agent.extensionPublisher ?? '';
	}

	if (!('extensionDisplayName' in agent)) {
		agent.extensionDisplayName = '';
	}

	if (!('extensionId' in agent)) {
		agent.extensionId = new ExtensionIdentifier('');
	}

	return revive(agent);
}
