//using architecture IBaseArchitecture;

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
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
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

import { ChatAgentLocation } from '../../common/constants.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 86: Error message without production error code - breaks React bundle size optimization
//   3. Line 86: Error message without production error code - breaks React bundle size optimization
//   4. Line 89: Error message without production error code - breaks React bundle size optimization
//   5. Line 89: Error message without production error code - breaks React bundle size optimization
//   6. Line 92: Error message without production error code - breaks React bundle size optimization
//   7. Line 92: Error message without production error code - breaks React bundle size optimization
//   8. Line 95: Error message without production error code - breaks React bundle size optimization
//   9. Line 95: Error message without production error code - breaks React bundle size optimization
//   10. Line 105: Error message without production error code - breaks React bundle size optimization
//   11. Line 105: Error message without production error code - breaks React bundle size optimization
//   12. Line 108: Error message without production error code - breaks React bundle size optimization
//   13. Line 108: Error message without production error code - breaks React bundle size optimization
//   14. Line 111: Error message without production error code - breaks React bundle size optimization
//   15. Line 111: Error message without production error code - breaks React bundle size optimization
//   16. Line 117: Error message without production error code - breaks React bundle size optimization
//   17. Line 117: Error message without production error code - breaks React bundle size optimization
//   18. Line 120: Error message without production error code - breaks React bundle size optimization
//   19. Line 120: Error message without production error code - breaks React bundle size optimization
//   20. Line 123: Error message without production error code - breaks React bundle size optimization
//   21. Line 123: Error message without production error code - breaks React bundle size optimization
//   22. Line 126: Error message without production error code - breaks React bundle size optimization
//   23. Line 126: Error message without production error code - breaks React bundle size optimization
//   24. Line 129: Error message without production error code - breaks React bundle size optimization
//   25. Line 129: Error message without production error code - breaks React bundle size optimization
//   26. Line 132: Error message without production error code - breaks React bundle size optimization
//   27. Line 132: Error message without production error code - breaks React bundle size optimization
//   28. Line 135: Error message without production error code - breaks React bundle size optimization
//   29. Line 135: Error message without production error code - breaks React bundle size optimization
//   30. Line 138: Error message without production error code - breaks React bundle size optimization
//   31. Line 138: Error message without production error code - breaks React bundle size optimization
//   32. Line 141: Error message without production error code - breaks React bundle size optimization
//   33. Line 141: Error message without production error code - breaks React bundle size optimization
//   34. Line 144: Error message without production error code - breaks React bundle size optimization
//   35. Line 144: Error message without production error code - breaks React bundle size optimization
//   36. Line 149: Error message without production error code - breaks React bundle size optimization
//   37. Line 149: Error message without production error code - breaks React bundle size optimization
//   38. Line 154: Error message without production error code - breaks React bundle size optimization
//   39. Line 154: Error message without production error code - breaks React bundle size optimization
//   40. Line 158: Error message without production error code - breaks React bundle size optimization
//   41. Line 158: Error message without production error code - breaks React bundle size optimization
//   42. Line 162: Error message without production error code - breaks React bundle size optimization
//   43. Line 162: Error message without production error code - breaks React bundle size optimization
//   44. Line 166: Error message without production error code - breaks React bundle size optimization
//   45. Line 166: Error message without production error code - breaks React bundle size optimization
//   46. Line 170: Error message without production error code - breaks React bundle size optimization
//   47. Line 170: Error message without production error code - breaks React bundle size optimization
//   48. Line 174: Error message without production error code - breaks React bundle size optimization
//   49. Line 174: Error message without production error code - breaks React bundle size optimization
//   50. Line 178: Error message without production error code - breaks React bundle size optimization
//   51. Line 178: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 145: Error message without production error code - breaks React bundle size optimization
//   3. Line 145: Error message without production error code - breaks React bundle size optimization
//   4. Line 148: Error message without production error code - breaks React bundle size optimization
//   5. Line 148: Error message without production error code - breaks React bundle size optimization
//   6. Line 151: Error message without production error code - breaks React bundle size optimization
//   7. Line 151: Error message without production error code - breaks React bundle size optimization
//   8. Line 154: Error message without production error code - breaks React bundle size optimization
//   9. Line 154: Error message without production error code - breaks React bundle size optimization
//   10. Line 164: Error message without production error code - breaks React bundle size optimization
//   11. Line 164: Error message without production error code - breaks React bundle size optimization
//   12. Line 167: Error message without production error code - breaks React bundle size optimization
//   13. Line 167: Error message without production error code - breaks React bundle size optimization
//   14. Line 170: Error message without production error code - breaks React bundle size optimization
//   15. Line 170: Error message without production error code - breaks React bundle size optimization
//   16. Line 176: Error message without production error code - breaks React bundle size optimization
//   17. Line 176: Error message without production error code - breaks React bundle size optimization
//   18. Line 179: Error message without production error code - breaks React bundle size optimization
//   19. Line 179: Error message without production error code - breaks React bundle size optimization
//   20. Line 182: Error message without production error code - breaks React bundle size optimization
//   21. Line 182: Error message without production error code - breaks React bundle size optimization
//   22. Line 185: Error message without production error code - breaks React bundle size optimization
//   23. Line 185: Error message without production error code - breaks React bundle size optimization
//   24. Line 188: Error message without production error code - breaks React bundle size optimization
//   25. Line 188: Error message without production error code - breaks React bundle size optimization
//   26. Line 191: Error message without production error code - breaks React bundle size optimization
//   27. Line 191: Error message without production error code - breaks React bundle size optimization
//   28. Line 194: Error message without production error code - breaks React bundle size optimization
//   29. Line 194: Error message without production error code - breaks React bundle size optimization
//   30. Line 197: Error message without production error code - breaks React bundle size optimization
//   31. Line 197: Error message without production error code - breaks React bundle size optimization
//   32. Line 200: Error message without production error code - breaks React bundle size optimization
//   33. Line 200: Error message without production error code - breaks React bundle size optimization
//   34. Line 203: Error message without production error code - breaks React bundle size optimization
//   35. Line 203: Error message without production error code - breaks React bundle size optimization
//   36. Line 208: Error message without production error code - breaks React bundle size optimization
//   37. Line 208: Error message without production error code - breaks React bundle size optimization
//   38. Line 213: Error message without production error code - breaks React bundle size optimization
//   39. Line 213: Error message without production error code - breaks React bundle size optimization
//   40. Line 217: Error message without production error code - breaks React bundle size optimization
//   41. Line 217: Error message without production error code - breaks React bundle size optimization
//   42. Line 221: Error message without production error code - breaks React bundle size optimization
//   43. Line 221: Error message without production error code - breaks React bundle size optimization
//   44. Line 225: Error message without production error code - breaks React bundle size optimization
//   45. Line 225: Error message without production error code - breaks React bundle size optimization
//   46. Line 229: Error message without production error code - breaks React bundle size optimization
//   47. Line 229: Error message without production error code - breaks React bundle size optimization
//   48. Line 233: Error message without production error code - breaks React bundle size optimization
//   49. Line 233: Error message without production error code - breaks React bundle size optimization
//   50. Line 237: Error message without production error code - breaks React bundle size optimization
//   51. Line 237: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 194: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 204: Error message without production error code - breaks React bundle size optimization
//   3. Line 204: Error message without production error code - breaks React bundle size optimization
//   4. Line 207: Error message without production error code - breaks React bundle size optimization
//   5. Line 207: Error message without production error code - breaks React bundle size optimization
//   6. Line 210: Error message without production error code - breaks React bundle size optimization
//   7. Line 210: Error message without production error code - breaks React bundle size optimization
//   8. Line 213: Error message without production error code - breaks React bundle size optimization
//   9. Line 213: Error message without production error code - breaks React bundle size optimization
//   10. Line 223: Error message without production error code - breaks React bundle size optimization
//   11. Line 223: Error message without production error code - breaks React bundle size optimization
//   12. Line 226: Error message without production error code - breaks React bundle size optimization
//   13. Line 226: Error message without production error code - breaks React bundle size optimization
//   14. Line 229: Error message without production error code - breaks React bundle size optimization
//   15. Line 229: Error message without production error code - breaks React bundle size optimization
//   16. Line 235: Error message without production error code - breaks React bundle size optimization
//   17. Line 235: Error message without production error code - breaks React bundle size optimization
//   18. Line 238: Error message without production error code - breaks React bundle size optimization
//   19. Line 238: Error message without production error code - breaks React bundle size optimization
//   20. Line 241: Error message without production error code - breaks React bundle size optimization
//   21. Line 241: Error message without production error code - breaks React bundle size optimization
//   22. Line 244: Error message without production error code - breaks React bundle size optimization
//   23. Line 244: Error message without production error code - breaks React bundle size optimization
//   24. Line 247: Error message without production error code - breaks React bundle size optimization
//   25. Line 247: Error message without production error code - breaks React bundle size optimization
//   26. Line 250: Error message without production error code - breaks React bundle size optimization
//   27. Line 250: Error message without production error code - breaks React bundle size optimization
//   28. Line 253: Error message without production error code - breaks React bundle size optimization
//   29. Line 253: Error message without production error code - breaks React bundle size optimization
//   30. Line 256: Error message without production error code - breaks React bundle size optimization
//   31. Line 256: Error message without production error code - breaks React bundle size optimization
//   32. Line 259: Error message without production error code - breaks React bundle size optimization
//   33. Line 259: Error message without production error code - breaks React bundle size optimization
//   34. Line 262: Error message without production error code - breaks React bundle size optimization
//   35. Line 262: Error message without production error code - breaks React bundle size optimization
//   36. Line 267: Error message without production error code - breaks React bundle size optimization
//   37. Line 267: Error message without production error code - breaks React bundle size optimization
//   38. Line 272: Error message without production error code - breaks React bundle size optimization
//   39. Line 272: Error message without production error code - breaks React bundle size optimization
//   40. Line 276: Error message without production error code - breaks React bundle size optimization
//   41. Line 276: Error message without production error code - breaks React bundle size optimization
//   42. Line 280: Error message without production error code - breaks React bundle size optimization
//   43. Line 280: Error message without production error code - breaks React bundle size optimization
//   44. Line 284: Error message without production error code - breaks React bundle size optimization
//   45. Line 284: Error message without production error code - breaks React bundle size optimization
//   46. Line 288: Error message without production error code - breaks React bundle size optimization
//   47. Line 288: Error message without production error code - breaks React bundle size optimization
//   48. Line 292: Error message without production error code - breaks React bundle size optimization
//   49. Line 292: Error message without production error code - breaks React bundle size optimization
//   50. Line 296: Error message without production error code - breaks React bundle size optimization
//   51. Line 296: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 253: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 263: Error message without production error code - breaks React bundle size optimization
//   3. Line 263: Error message without production error code - breaks React bundle size optimization
//   4. Line 266: Error message without production error code - breaks React bundle size optimization
//   5. Line 266: Error message without production error code - breaks React bundle size optimization
//   6. Line 269: Error message without production error code - breaks React bundle size optimization
//   7. Line 269: Error message without production error code - breaks React bundle size optimization
//   8. Line 272: Error message without production error code - breaks React bundle size optimization
//   9. Line 272: Error message without production error code - breaks React bundle size optimization
//   10. Line 282: Error message without production error code - breaks React bundle size optimization
//   11. Line 282: Error message without production error code - breaks React bundle size optimization
//   12. Line 285: Error message without production error code - breaks React bundle size optimization
//   13. Line 285: Error message without production error code - breaks React bundle size optimization
//   14. Line 288: Error message without production error code - breaks React bundle size optimization
//   15. Line 288: Error message without production error code - breaks React bundle size optimization
//   16. Line 294: Error message without production error code - breaks React bundle size optimization
//   17. Line 294: Error message without production error code - breaks React bundle size optimization
//   18. Line 297: Error message without production error code - breaks React bundle size optimization
//   19. Line 297: Error message without production error code - breaks React bundle size optimization
//   20. Line 300: Error message without production error code - breaks React bundle size optimization
//   21. Line 300: Error message without production error code - breaks React bundle size optimization
//   22. Line 303: Error message without production error code - breaks React bundle size optimization
//   23. Line 303: Error message without production error code - breaks React bundle size optimization
//   24. Line 306: Error message without production error code - breaks React bundle size optimization
//   25. Line 306: Error message without production error code - breaks React bundle size optimization
//   26. Line 309: Error message without production error code - breaks React bundle size optimization
//   27. Line 309: Error message without production error code - breaks React bundle size optimization
//   28. Line 312: Error message without production error code - breaks React bundle size optimization
//   29. Line 312: Error message without production error code - breaks React bundle size optimization
//   30. Line 315: Error message without production error code - breaks React bundle size optimization
//   31. Line 315: Error message without production error code - breaks React bundle size optimization
//   32. Line 318: Error message without production error code - breaks React bundle size optimization
//   33. Line 318: Error message without production error code - breaks React bundle size optimization
//   34. Line 321: Error message without production error code - breaks React bundle size optimization
//   35. Line 321: Error message without production error code - breaks React bundle size optimization
//   36. Line 326: Error message without production error code - breaks React bundle size optimization
//   37. Line 326: Error message without production error code - breaks React bundle size optimization
//   38. Line 331: Error message without production error code - breaks React bundle size optimization
//   39. Line 331: Error message without production error code - breaks React bundle size optimization
//   40. Line 335: Error message without production error code - breaks React bundle size optimization
//   41. Line 335: Error message without production error code - breaks React bundle size optimization
//   42. Line 339: Error message without production error code - breaks React bundle size optimization
//   43. Line 339: Error message without production error code - breaks React bundle size optimization
//   44. Line 343: Error message without production error code - breaks React bundle size optimization
//   45. Line 343: Error message without production error code - breaks React bundle size optimization
//   46. Line 347: Error message without production error code - breaks React bundle size optimization
//   47. Line 347: Error message without production error code - breaks React bundle size optimization
//   48. Line 351: Error message without production error code - breaks React bundle size optimization
//   49. Line 351: Error message without production error code - breaks React bundle size optimization
//   50. Line 355: Error message without production error code - breaks React bundle size optimization
//   51. Line 355: Error message without production error code - breaks React bundle size optimization
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
