//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, IReader } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorPane } from '../../../common/editor.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';
import { IChatAgentResult } from './chatAgents.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 21: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ChatModel, IChatResponseModel } from './chatModel.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 124: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IChatEditingService = createDecorator<IChatEditingService>('chatEditingService');

export interface IChatEditingService {

	_serviceBrand: undefined;

	startOrContinueGlobalEditingSession(chatModel: ChatModel): Promise<IChatEditingSession>;

	getEditingSession(chatSessionId: string): IChatEditingSession | undefined;

	/**
	 * All editing sessions, sorted by recency, e.g the last created session comes first.
	 */
	readonly editingSessionsObs: IObservable<readonly IChatEditingSession[]>;

	/**
	 * Creates a new short lived editing session
	 */
	createEditingSession(chatModel: ChatModel): Promise<IChatEditingSession>;

	//#region related files

	hasRelatedFilesProviders(): boolean;
	registerRelatedFilesProvider(handle: number, provider: IChatRelatedFilesProvider): IDisposable;
	getRelatedFiles(chatSessionId: string, prompt: string, files: URI[], token: CancellationToken): Promise<{ group: string; files: IChatRelatedFile[] }[] | undefined>;

	//#endregion
}

export interface IChatRequestDraft {
	readonly prompt: string;
	readonly files: readonly URI[];
}

export interface IChatRelatedFileProviderMetadata {
	readonly description: string;
}

export interface IChatRelatedFile {
	readonly uri: URI;
	readonly description: string;
}

export interface IChatRelatedFilesProvider {
	readonly description: string;
	provideRelatedFiles(chatRequest: IChatRequestDraft, token: CancellationToken): Promise<IChatRelatedFile[] | undefined>;
}

export interface WorkingSetDisplayMetadata {
	state: ModifiedFileEntryState;
	description?: string;
}

export interface IStreamingEdits {
	pushText(edits: TextEdit[], isLastEdits: boolean): void;
	pushNotebookCellText(cell: URI, edits: TextEdit[], isLastEdits: boolean): void;
	pushNotebook(edits: ICellEditOperation[], isLastEdits: boolean): void;
	/** Marks edits as done, idempotent */
	complete(): void;
}

export interface IModifiedEntryTelemetryInfo {
	readonly agentId: string | undefined;
	readonly command: string | undefined;
	readonly sessionId: string;
	readonly requestId: string;
	readonly result: IChatAgentResult | undefined;
}

export interface ISnapshotEntry {
	readonly resource: URI;
	readonly languageId: string;
	readonly snapshotUri: URI;
	readonly original: string;
	readonly current: string;
	readonly state: ModifiedFileEntryState;
	telemetryInfo: IModifiedEntryTelemetryInfo;
}

export interface IChatEditingSession extends IDisposable {
	readonly isGlobalEditingSession: boolean;
	readonly chatSessionId: string;
	readonly onDidDispose: Event<void>;
	readonly state: IObservable<ChatEditingSessionState>;
	readonly entries: IObservable<readonly IModifiedFileEntry[]>;
	show(previousChanges?: boolean): Promise<void>;
	accept(...uris: URI[]): Promise<void>;
	reject(...uris: URI[]): Promise<void>;
	getEntry(uri: URI): IModifiedFileEntry | undefined;
	readEntry(uri: URI, reader?: IReader): IModifiedFileEntry | undefined;

	restoreSnapshot(requestId: string, stopId: string | undefined): Promise<void>;

	/**
	 * Gets the snapshot URI of a file at the request and _after_ changes made in the undo stop.
	 * @param uri File in the workspace
	 */
	getSnapshotUri(requestId: string, uri: URI, stopId: string | undefined): URI | undefined;

	getSnapshotModel(requestId: string, undoStop: string | undefined, snapshotUri: URI): Promise<ITextModel | null>;

	getSnapshot(requestId: string, undoStop: string | undefined, snapshotUri: URI): ISnapshotEntry | undefined;

	/**
	 * Will lead to this object getting disposed
	 */
	stop(clearState?: boolean): Promise<void>;

	/**
	 * Starts making edits to the resource.
	 * @param resource URI that's being edited
	 * @param responseModel The response model making the edits
	 * @param inUndoStop The undo stop the edits will be grouped in
	 */
	startStreamingEdits(resource: URI, responseModel: IChatResponseModel, inUndoStop: string | undefined): IStreamingEdits;

	/**
	 * Gets the document diff of a change made to a URI between one undo stop and
	 * the next one.
	 * @returns The observable or undefined if there is no diff between the stops.
	 */
	getEntryDiffBetweenStops(uri: URI, requestId: string | undefined, stopId: string | undefined): IObservable<IEditSessionEntryDiff | undefined> | undefined;

	/**
	 * Gets the document diff of a change made to a URI between one request to another one.
	 * @returns The observable or undefined if there is no diff between the requests.
	 */
	getEntryDiffBetweenRequests(uri: URI, startRequestIs: string, stopRequestId: string): IObservable<IEditSessionEntryDiff | undefined>;

	readonly canUndo: IObservable<boolean>;
	readonly canRedo: IObservable<boolean>;
	undoInteraction(): Promise<void>;
	redoInteraction(): Promise<void>;
}

export interface IEditSessionEntryDiff {
	/** LHS and RHS of a diff editor, if opened: */
	originalURI: URI;
	modifiedURI: URI;

	/** Diff state information: */
	quitEarly: boolean;
	identical: boolean;

	/** Added data (e.g. line numbers) to show in the UI */
	added: number;
	/** Removed data (e.g. line numbers) to show in the UI */
	removed: number;
}

export const enum ModifiedFileEntryState {
	Modified,
	Accepted,
	Rejected,
}

/**
 * Represents a part of a change
 */
export interface IModifiedFileEntryChangeHunk {
	accept(): Promise<boolean>;
	reject(): Promise<boolean>;
}

export interface IModifiedFileEntryEditorIntegration extends IDisposable {

	/**
	 * The index of a change
	 */
	currentIndex: IObservable<number>;

	/**
	 * Reveal the first (`true`) or last (`false`) change
	 */
	reveal(firstOrLast: boolean, preserveFocus?: boolean): void;

	/**
	 * Go to next change and increate `currentIndex`
	 * @param wrap When at the last, start over again or not
	 * @returns If it went next
	 */
	next(wrap: boolean): boolean;

	/**
	 * @see `next`
	 */
	previous(wrap: boolean): boolean;

	/**
	 * Enable the accessible diff viewer for this editor
	 */
	enableAccessibleDiffView(): void;

	/**
	 * Accept the change given or the nearest
	 * @param change An opaque change object
	 */
	acceptNearestChange(change?: IModifiedFileEntryChangeHunk): Promise<void>;

	/**
	 * @see `acceptNearestChange`
	 */
	rejectNearestChange(change?: IModifiedFileEntryChangeHunk): Promise<void>;

	/**
	 * Toggle between diff-editor and normal editor
	 * @param change An opaque change object
	 * @param show Optional boolean to control if the diff should show
	 */
	toggleDiff(change: IModifiedFileEntryChangeHunk | undefined, show?: boolean): Promise<void>;
}

export interface IModifiedFileEntry {
	readonly entryId: string;
	readonly originalURI: URI;
	readonly modifiedURI: URI;

	readonly lastModifyingRequestId: string;

	readonly state: IObservable<ModifiedFileEntryState>;
	readonly isCurrentlyBeingModifiedBy: IObservable<IChatResponseModel | undefined>;
	readonly lastModifyingResponse: IObservable<IChatResponseModel | undefined>;
	readonly rewriteRatio: IObservable<number>;

	readonly waitsForLastEdits: IObservable<boolean>;

	accept(): Promise<void>;
	reject(): Promise<void>;

	reviewMode: IObservable<boolean>;
	autoAcceptController: IObservable<{ total: number; remaining: number; cancel(): void } | undefined>;
	enableReviewModeUntilSettled(): void;

	/**
	 * Number of changes for this file
	 */
	readonly changesCount: IObservable<number>;

	getEditorIntegration(editor: IEditorPane): IModifiedFileEntryEditorIntegration;
}

export interface IChatEditingSessionStream {
	textEdits(resource: URI, textEdits: TextEdit[], isLastEdits: boolean, responseModel: IChatResponseModel): void;
	notebookEdits(resource: URI, edits: ICellEditOperation[], isLastEdits: boolean, responseModel: IChatResponseModel): void;
}

export const enum ChatEditingSessionState {
	Initial = 0,
	StreamingEdits = 1,
	Idle = 2,
	Disposed = 3
}

export const CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME = 'chat-editing-multi-diff-source';

export const chatEditingWidgetFileStateContextKey = new RawContextKey<ModifiedFileEntryState>('chatEditingWidgetFileState', undefined, localize('chatEditingWidgetFileState', "The current state of the file in the chat editing widget"));
export const chatEditingAgentSupportsReadonlyReferencesContextKey = new RawContextKey<boolean>('chatEditingAgentSupportsReadonlyReferences', undefined, localize('chatEditingAgentSupportsReadonlyReferences', "Whether the chat editing agent supports readonly references (temporary)"));
export const decidedChatEditingResourceContextKey = new RawContextKey<string[]>('decidedChatEditingResource', []);
export const chatEditingResourceContextKey = new RawContextKey<string | undefined>('chatEditingResource', undefined);
export const inChatEditingSessionContextKey = new RawContextKey<boolean | undefined>('inChatEditingSession', undefined);
export const hasUndecidedChatEditingResourceContextKey = new RawContextKey<boolean | undefined>('hasUndecidedChatEditingResource', false);
export const hasAppliedChatEditsContextKey = new RawContextKey<boolean | undefined>('hasAppliedChatEdits', false);
export const applyingChatEditsFailedContextKey = new RawContextKey<boolean | undefined>('applyingChatEditsFailed', false);

export const chatEditingMaxFileAssignmentName = 'chatEditingSessionFileLimit';
export const defaultChatEditingMaxFileLimit = 10;

export const enum ChatEditKind {
	Created,
	Modified,
}

export interface IChatEditingActionContext {
	// The chat session ID that this editing session is associated with
	sessionId: string;
}

export function isChatEditingActionContext(thing: unknown): thing is IChatEditingActionContext {
	return typeof thing === 'object' && !!thing && 'sessionId' in thing;
}

export function getMultiDiffSourceUri(session: IChatEditingSession, showPreviousChanges?: boolean): URI {
	return URI.from({
		scheme: CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME,
		authority: session.chatSessionId,
		query: showPreviousChanges ? 'previous' : undefined,
	});
}

export function parseChatMultiDiffUri(uri: URI): { chatSessionId: string; showPreviousChanges: boolean } {
	const chatSessionId = uri.authority;
	const showPreviousChanges = uri.query === 'previous';

	return { chatSessionId, showPreviousChanges };
}
