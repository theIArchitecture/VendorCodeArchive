/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { ChatModel, IChatModel, IChatRequestModel, IChatRequestVariableData, ISerializableChatData } from '../../common/chatModel.js';
import { IParsedChatRequest } from '../../common/chatParserTypes.js';
import { IChatCompleteResponse, IChatDetail, IChatProviderInfo, IChatSendRequestData, IChatSendRequestOptions, IChatService, IChatTransferredSessionData, IChatUserActionEvent } from '../../common/chatService.js';
import { ChatAgentLocation } from '../../common/constants.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (51):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 25: Error message without production error code - breaks React bundle size optimization
//   3. Line 25: Error message without production error code - breaks React bundle size optimization
//   4. Line 28: Error message without production error code - breaks React bundle size optimization
//   5. Line 28: Error message without production error code - breaks React bundle size optimization
//   6. Line 31: Error message without production error code - breaks React bundle size optimization
//   7. Line 31: Error message without production error code - breaks React bundle size optimization
//   8. Line 34: Error message without production error code - breaks React bundle size optimization
//   9. Line 34: Error message without production error code - breaks React bundle size optimization
//   10. Line 44: Error message without production error code - breaks React bundle size optimization
//   11. Line 44: Error message without production error code - breaks React bundle size optimization
//   12. Line 47: Error message without production error code - breaks React bundle size optimization
//   13. Line 47: Error message without production error code - breaks React bundle size optimization
//   14. Line 50: Error message without production error code - breaks React bundle size optimization
//   15. Line 50: Error message without production error code - breaks React bundle size optimization
//   16. Line 56: Error message without production error code - breaks React bundle size optimization
//   17. Line 56: Error message without production error code - breaks React bundle size optimization
//   18. Line 59: Error message without production error code - breaks React bundle size optimization
//   19. Line 59: Error message without production error code - breaks React bundle size optimization
//   20. Line 62: Error message without production error code - breaks React bundle size optimization
//   21. Line 62: Error message without production error code - breaks React bundle size optimization
//   22. Line 65: Error message without production error code - breaks React bundle size optimization
//   23. Line 65: Error message without production error code - breaks React bundle size optimization
//   24. Line 68: Error message without production error code - breaks React bundle size optimization
//   25. Line 68: Error message without production error code - breaks React bundle size optimization
//   26. Line 71: Error message without production error code - breaks React bundle size optimization
//   27. Line 71: Error message without production error code - breaks React bundle size optimization
//   28. Line 74: Error message without production error code - breaks React bundle size optimization
//   29. Line 74: Error message without production error code - breaks React bundle size optimization
//   30. Line 77: Error message without production error code - breaks React bundle size optimization
//   31. Line 77: Error message without production error code - breaks React bundle size optimization
//   32. Line 80: Error message without production error code - breaks React bundle size optimization
//   33. Line 80: Error message without production error code - breaks React bundle size optimization
//   34. Line 83: Error message without production error code - breaks React bundle size optimization
//   35. Line 83: Error message without production error code - breaks React bundle size optimization
//   36. Line 88: Error message without production error code - breaks React bundle size optimization
//   37. Line 88: Error message without production error code - breaks React bundle size optimization
//   38. Line 93: Error message without production error code - breaks React bundle size optimization
//   39. Line 93: Error message without production error code - breaks React bundle size optimization
//   40. Line 97: Error message without production error code - breaks React bundle size optimization
//   41. Line 97: Error message without production error code - breaks React bundle size optimization
//   42. Line 101: Error message without production error code - breaks React bundle size optimization
//   43. Line 101: Error message without production error code - breaks React bundle size optimization
//   44. Line 105: Error message without production error code - breaks React bundle size optimization
//   45. Line 105: Error message without production error code - breaks React bundle size optimization
//   46. Line 109: Error message without production error code - breaks React bundle size optimization
//   47. Line 109: Error message without production error code - breaks React bundle size optimization
//   48. Line 113: Error message without production error code - breaks React bundle size optimization
//   49. Line 113: Error message without production error code - breaks React bundle size optimization
//   50. Line 117: Error message without production error code - breaks React bundle size optimization
//   51. Line 117: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class MockChatService implements IChatService {
	requestInProgressObs = observableValue('name', false);
	edits2Enabled: boolean = false;
	_serviceBrand: undefined;
	transferredSessionData: IChatTransferredSessionData | undefined;
	onDidSubmitRequest: Event<{ chatSessionId: string }> = Event.None;

	private sessions = new Map<string, IChatModel>();

	isEnabled(location: ChatAgentLocation): boolean {
		throw new Error('Method not implemented.');
	}
	hasSessions(): boolean {
		throw new Error('Method not implemented.');
	}
	getProviderInfos(): IChatProviderInfo[] {
		throw new Error('Method not implemented.');
	}
	startSession(location: ChatAgentLocation, token: CancellationToken): ChatModel {
		throw new Error('Method not implemented.');
	}
	addSession(session: IChatModel): void {
		this.sessions.set(session.sessionId, session);
	}
	getSession(sessionId: string): IChatModel | undefined {
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return this.sessions.get(sessionId) ?? {} as IChatModel;
	}
	async getOrRestoreSession(sessionId: string): Promise<IChatModel | undefined> {
		throw new Error('Method not implemented.');
	}
	loadSessionFromContent(data: ISerializableChatData): IChatModel | undefined {
		throw new Error('Method not implemented.');
	}
	loadSessionForResource(resource: URI, position: ChatAgentLocation, token: CancellationToken): Promise<IChatModel | undefined> {
		throw new Error('Method not implemented.');
	}
	/**
	 * Returns whether the request was accepted.
	 */
	sendRequest(sessionId: string, message: string): Promise<IChatSendRequestData | undefined> {
		throw new Error('Method not implemented.');
	}
	resendRequest(request: IChatRequestModel, options?: IChatSendRequestOptions | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}
	adoptRequest(sessionId: string, request: IChatRequestModel): Promise<void> {
		throw new Error('Method not implemented.');
	}
	removeRequest(sessionid: string, requestId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	cancelCurrentRequestForSession(sessionId: string): void {
		throw new Error('Method not implemented.');
	}
	clearSession(sessionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	addCompleteRequest(sessionId: string, message: IParsedChatRequest | string, variableData: IChatRequestVariableData | undefined, attempt: number | undefined, response: IChatCompleteResponse): void {
		throw new Error('Method not implemented.');
	}
	async getHistory(): Promise<IChatDetail[]> {
		throw new Error('Method not implemented.');
	}
	async clearAllHistoryEntries() {
		throw new Error('Method not implemented.');
	}
	async removeHistoryEntry(sessionId: string) {
		throw new Error('Method not implemented.');
	}

	onDidPerformUserAction: Event<IChatUserActionEvent> = undefined!;
	notifyUserAction(event: IChatUserActionEvent): void {
		throw new Error('Method not implemented.');
	}
	onDidDisposeSession: Event<{ sessionId: string; reason: 'cleared' }> = undefined!;

	transferChatSession(transferredSessionData: IChatTransferredSessionData, toWorkspace: URI): void {
		throw new Error('Method not implemented.');
	}

	setChatSessionTitle(sessionId: string, title: string): void {
		throw new Error('Method not implemented.');
	}

	isEditingLocation(location: ChatAgentLocation): boolean {
		throw new Error('Method not implemented.');
	}

	getChatStorageFolder(): URI {
		throw new Error('Method not implemented.');
	}

	logChatIndex(): void {
		throw new Error('Method not implemented.');
	}

	isPersistedSessionEmpty(sessionId: string): boolean {
		throw new Error('Method not implemented.');
	}

	activateDefaultAgent(location: ChatAgentLocation): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
