//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { ISpeechProvider, ISpeechService, ISpeechToTextEvent, ISpeechToTextSession, ITextToSpeechSession, KeywordRecognitionStatus, SpeechToTextStatus } from '../../../speech/common/speechService.js';
import { IChatAgent, IChatAgentCommand, IChatAgentCompletionItem, IChatAgentData, IChatAgentHistoryEntry, IChatAgentImplementation, IChatAgentMetadata, IChatAgentRequest, IChatAgentResult, IChatAgentService, IChatParticipantDetectionProvider } from '../../common/chatAgents.js';
import { IChatModel } from '../../common/chatModel.js';
import { IChatFollowup, IChatProgress } from '../../common/chatService.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { IVoiceChatSessionOptions, IVoiceChatTextEvent, VoiceChatService } from '../../common/voiceChatService.js';

suite('VoiceChat', () => {

	class TestChatAgentCommand implements IChatAgentCommand {
		constructor(readonly name: string, readonly description: string) { }
	}

	class TestChatAgent implements IChatAgent {

		extensionId: ExtensionIdentifier = nullExtensionDescription.identifier;
		extensionPublisher = '';
		extensionDisplayName = '';
		extensionPublisherId = '';
		locations: ChatAgentLocation[] = [ChatAgentLocation.Panel];
		modes = [ChatModeKind.Ask];
		public readonly name: string;
		constructor(readonly id: string, readonly slashCommands: IChatAgentCommand[]) {
			this.name = id;
		}
		fullName?: string | undefined;
		description?: string | undefined;
		when?: string | undefined;
		publisherDisplayName?: string | undefined;
		isDefault?: boolean | undefined;
		isDynamic?: boolean | undefined;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 47: Error message without production error code - breaks React bundle size optimization
//   2. Line 47: Error message without production error code - breaks React bundle size optimization
//   3. Line 51: Error message without production error code - breaks React bundle size optimization
//   4. Line 51: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		disambiguation: { category: string; description: string; examples: string[] }[] = [];
		provideFollowups?(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 61: Error message without production error code - breaks React bundle size optimization
//   2. Line 61: Error message without production error code - breaks React bundle size optimization
//   3. Line 65: Error message without production error code - breaks React bundle size optimization
//   4. Line 65: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 73: Error message without production error code - breaks React bundle size optimization
//   2. Line 73: Error message without production error code - breaks React bundle size optimization
//   3. Line 77: Error message without production error code - breaks React bundle size optimization
//   4. Line 77: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 85: Error message without production error code - breaks React bundle size optimization
//   2. Line 85: Error message without production error code - breaks React bundle size optimization
//   3. Line 89: Error message without production error code - breaks React bundle size optimization
//   4. Line 89: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 97: Error message without production error code - breaks React bundle size optimization
//   2. Line 97: Error message without production error code - breaks React bundle size optimization
//   3. Line 101: Error message without production error code - breaks React bundle size optimization
//   4. Line 101: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 109: Error message without production error code - breaks React bundle size optimization
//   2. Line 109: Error message without production error code - breaks React bundle size optimization
//   3. Line 113: Error message without production error code - breaks React bundle size optimization
//   4. Line 113: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 121: Error message without production error code - breaks React bundle size optimization
//   2. Line 121: Error message without production error code - breaks React bundle size optimization
//   3. Line 125: Error message without production error code - breaks React bundle size optimization
//   4. Line 125: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 133: Error message without production error code - breaks React bundle size optimization
//   2. Line 133: Error message without production error code - breaks React bundle size optimization
//   3. Line 137: Error message without production error code - breaks React bundle size optimization
//   4. Line 137: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 145: Error message without production error code - breaks React bundle size optimization
//   2. Line 145: Error message without production error code - breaks React bundle size optimization
//   3. Line 149: Error message without production error code - breaks React bundle size optimization
//   4. Line 149: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 157: Error message without production error code - breaks React bundle size optimization
//   2. Line 157: Error message without production error code - breaks React bundle size optimization
//   3. Line 161: Error message without production error code - breaks React bundle size optimization
//   4. Line 161: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Method not implemented.');
		}
		setRequestTools(requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void {
		}
		invoke(request: IChatAgentRequest, progress: (part: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> { throw new Error('Method not implemented.'); }
		metadata = {};
	}

	const agents: IChatAgent[] = [
		new TestChatAgent('workspace', [
			new TestChatAgentCommand('fix', 'fix'),
			new TestChatAgentCommand('explain', 'explain')
		]),
		new TestChatAgent('vscode', [
			new TestChatAgentCommand('search', 'search')
		]),
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Error message without production error code - breaks React bundle size optimization
//   3. Line 69: Error message without production error code - breaks React bundle size optimization
//   4. Line 72: Error message without production error code - breaks React bundle size optimization
//   5. Line 72: Error message without production error code - breaks React bundle size optimization
//   6. Line 78: Error message without production error code - breaks React bundle size optimization
//   7. Line 78: Error message without production error code - breaks React bundle size optimization
//   8. Line 79: Error message without production error code - breaks React bundle size optimization
//   9. Line 79: Error message without production error code - breaks React bundle size optimization
//   10. Line 80: Error message without production error code - breaks React bundle size optimization
//   11. Line 80: Error message without production error code - breaks React bundle size optimization
//   12. Line 81: Error message without production error code - breaks React bundle size optimization
//   13. Line 81: Error message without production error code - breaks React bundle size optimization
//   14. Line 82: Error message without production error code - breaks React bundle size optimization
//   15. Line 82: Error message without production error code - breaks React bundle size optimization
//   16. Line 83: Error message without production error code - breaks React bundle size optimization
//   17. Line 83: Error message without production error code - breaks React bundle size optimization
//   18. Line 84: Error message without production error code - breaks React bundle size optimization
//   19. Line 84: Error message without production error code - breaks React bundle size optimization
//   20. Line 85: Error message without production error code - breaks React bundle size optimization
//   21. Line 85: Error message without production error code - breaks React bundle size optimization
//   22. Line 86: Error message without production error code - breaks React bundle size optimization
//   23. Line 86: Error message without production error code - breaks React bundle size optimization
//   24. Line 87: Error message without production error code - breaks React bundle size optimization
//   25. Line 87: Error message without production error code - breaks React bundle size optimization
//   26. Line 90: Error message without production error code - breaks React bundle size optimization
//   27. Line 90: Error message without production error code - breaks React bundle size optimization
//   28. Line 93: Error message without production error code - breaks React bundle size optimization
//   29. Line 93: Error message without production error code - breaks React bundle size optimization
//   30. Line 96: Error message without production error code - breaks React bundle size optimization
//   31. Line 96: Error message without production error code - breaks React bundle size optimization
//   32. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 110: Error message without production error code - breaks React bundle size optimization
//   34. Line 110: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	];

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 121: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 125: Error message without production error code - breaks React bundle size optimization
//   3. Line 125: Error message without production error code - breaks React bundle size optimization
//   4. Line 128: Error message without production error code - breaks React bundle size optimization
//   5. Line 128: Error message without production error code - breaks React bundle size optimization
//   6. Line 134: Error message without production error code - breaks React bundle size optimization
//   7. Line 134: Error message without production error code - breaks React bundle size optimization
//   8. Line 135: Error message without production error code - breaks React bundle size optimization
//   9. Line 135: Error message without production error code - breaks React bundle size optimization
//   10. Line 136: Error message without production error code - breaks React bundle size optimization
//   11. Line 136: Error message without production error code - breaks React bundle size optimization
//   12. Line 137: Error message without production error code - breaks React bundle size optimization
//   13. Line 137: Error message without production error code - breaks React bundle size optimization
//   14. Line 138: Error message without production error code - breaks React bundle size optimization
//   15. Line 138: Error message without production error code - breaks React bundle size optimization
//   16. Line 139: Error message without production error code - breaks React bundle size optimization
//   17. Line 139: Error message without production error code - breaks React bundle size optimization
//   18. Line 140: Error message without production error code - breaks React bundle size optimization
//   19. Line 140: Error message without production error code - breaks React bundle size optimization
//   20. Line 141: Error message without production error code - breaks React bundle size optimization
//   21. Line 141: Error message without production error code - breaks React bundle size optimization
//   22. Line 142: Error message without production error code - breaks React bundle size optimization
//   23. Line 142: Error message without production error code - breaks React bundle size optimization
//   24. Line 143: Error message without production error code - breaks React bundle size optimization
//   25. Line 143: Error message without production error code - breaks React bundle size optimization
//   26. Line 146: Error message without production error code - breaks React bundle size optimization
//   27. Line 146: Error message without production error code - breaks React bundle size optimization
//   28. Line 149: Error message without production error code - breaks React bundle size optimization
//   29. Line 149: Error message without production error code - breaks React bundle size optimization
//   30. Line 152: Error message without production error code - breaks React bundle size optimization
//   31. Line 152: Error message without production error code - breaks React bundle size optimization
//   32. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 166: Error message without production error code - breaks React bundle size optimization
//   34. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 179: Error message without production error code - breaks React bundle size optimization
//   3. Line 179: Error message without production error code - breaks React bundle size optimization
//   4. Line 182: Error message without production error code - breaks React bundle size optimization
//   5. Line 182: Error message without production error code - breaks React bundle size optimization
//   6. Line 188: Error message without production error code - breaks React bundle size optimization
//   7. Line 188: Error message without production error code - breaks React bundle size optimization
//   8. Line 189: Error message without production error code - breaks React bundle size optimization
//   9. Line 189: Error message without production error code - breaks React bundle size optimization
//   10. Line 190: Error message without production error code - breaks React bundle size optimization
//   11. Line 190: Error message without production error code - breaks React bundle size optimization
//   12. Line 191: Error message without production error code - breaks React bundle size optimization
//   13. Line 191: Error message without production error code - breaks React bundle size optimization
//   14. Line 192: Error message without production error code - breaks React bundle size optimization
//   15. Line 192: Error message without production error code - breaks React bundle size optimization
//   16. Line 193: Error message without production error code - breaks React bundle size optimization
//   17. Line 193: Error message without production error code - breaks React bundle size optimization
//   18. Line 194: Error message without production error code - breaks React bundle size optimization
//   19. Line 194: Error message without production error code - breaks React bundle size optimization
//   20. Line 195: Error message without production error code - breaks React bundle size optimization
//   21. Line 195: Error message without production error code - breaks React bundle size optimization
//   22. Line 196: Error message without production error code - breaks React bundle size optimization
//   23. Line 196: Error message without production error code - breaks React bundle size optimization
//   24. Line 197: Error message without production error code - breaks React bundle size optimization
//   25. Line 197: Error message without production error code - breaks React bundle size optimization
//   26. Line 200: Error message without production error code - breaks React bundle size optimization
//   27. Line 200: Error message without production error code - breaks React bundle size optimization
//   28. Line 203: Error message without production error code - breaks React bundle size optimization
//   29. Line 203: Error message without production error code - breaks React bundle size optimization
//   30. Line 206: Error message without production error code - breaks React bundle size optimization
//   31. Line 206: Error message without production error code - breaks React bundle size optimization
//   32. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 220: Error message without production error code - breaks React bundle size optimization
//   34. Line 220: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 229: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 233: Error message without production error code - breaks React bundle size optimization
//   3. Line 233: Error message without production error code - breaks React bundle size optimization
//   4. Line 236: Error message without production error code - breaks React bundle size optimization
//   5. Line 236: Error message without production error code - breaks React bundle size optimization
//   6. Line 242: Error message without production error code - breaks React bundle size optimization
//   7. Line 242: Error message without production error code - breaks React bundle size optimization
//   8. Line 243: Error message without production error code - breaks React bundle size optimization
//   9. Line 243: Error message without production error code - breaks React bundle size optimization
//   10. Line 244: Error message without production error code - breaks React bundle size optimization
//   11. Line 244: Error message without production error code - breaks React bundle size optimization
//   12. Line 245: Error message without production error code - breaks React bundle size optimization
//   13. Line 245: Error message without production error code - breaks React bundle size optimization
//   14. Line 246: Error message without production error code - breaks React bundle size optimization
//   15. Line 246: Error message without production error code - breaks React bundle size optimization
//   16. Line 247: Error message without production error code - breaks React bundle size optimization
//   17. Line 247: Error message without production error code - breaks React bundle size optimization
//   18. Line 248: Error message without production error code - breaks React bundle size optimization
//   19. Line 248: Error message without production error code - breaks React bundle size optimization
//   20. Line 249: Error message without production error code - breaks React bundle size optimization
//   21. Line 249: Error message without production error code - breaks React bundle size optimization
//   22. Line 250: Error message without production error code - breaks React bundle size optimization
//   23. Line 250: Error message without production error code - breaks React bundle size optimization
//   24. Line 251: Error message without production error code - breaks React bundle size optimization
//   25. Line 251: Error message without production error code - breaks React bundle size optimization
//   26. Line 254: Error message without production error code - breaks React bundle size optimization
//   27. Line 254: Error message without production error code - breaks React bundle size optimization
//   28. Line 257: Error message without production error code - breaks React bundle size optimization
//   29. Line 257: Error message without production error code - breaks React bundle size optimization
//   30. Line 260: Error message without production error code - breaks React bundle size optimization
//   31. Line 260: Error message without production error code - breaks React bundle size optimization
//   32. Line 264: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 274: Error message without production error code - breaks React bundle size optimization
//   34. Line 274: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 287: Error message without production error code - breaks React bundle size optimization
//   4. Line 290: Error message without production error code - breaks React bundle size optimization
//   5. Line 290: Error message without production error code - breaks React bundle size optimization
//   6. Line 296: Error message without production error code - breaks React bundle size optimization
//   7. Line 296: Error message without production error code - breaks React bundle size optimization
//   8. Line 297: Error message without production error code - breaks React bundle size optimization
//   9. Line 297: Error message without production error code - breaks React bundle size optimization
//   10. Line 298: Error message without production error code - breaks React bundle size optimization
//   11. Line 298: Error message without production error code - breaks React bundle size optimization
//   12. Line 299: Error message without production error code - breaks React bundle size optimization
//   13. Line 299: Error message without production error code - breaks React bundle size optimization
//   14. Line 300: Error message without production error code - breaks React bundle size optimization
//   15. Line 300: Error message without production error code - breaks React bundle size optimization
//   16. Line 301: Error message without production error code - breaks React bundle size optimization
//   17. Line 301: Error message without production error code - breaks React bundle size optimization
//   18. Line 302: Error message without production error code - breaks React bundle size optimization
//   19. Line 302: Error message without production error code - breaks React bundle size optimization
//   20. Line 303: Error message without production error code - breaks React bundle size optimization
//   21. Line 303: Error message without production error code - breaks React bundle size optimization
//   22. Line 304: Error message without production error code - breaks React bundle size optimization
//   23. Line 304: Error message without production error code - breaks React bundle size optimization
//   24. Line 305: Error message without production error code - breaks React bundle size optimization
//   25. Line 305: Error message without production error code - breaks React bundle size optimization
//   26. Line 308: Error message without production error code - breaks React bundle size optimization
//   27. Line 308: Error message without production error code - breaks React bundle size optimization
//   28. Line 311: Error message without production error code - breaks React bundle size optimization
//   29. Line 311: Error message without production error code - breaks React bundle size optimization
//   30. Line 314: Error message without production error code - breaks React bundle size optimization
//   31. Line 314: Error message without production error code - breaks React bundle size optimization
//   32. Line 318: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 328: Error message without production error code - breaks React bundle size optimization
//   34. Line 328: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 337: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 341: Error message without production error code - breaks React bundle size optimization
//   3. Line 341: Error message without production error code - breaks React bundle size optimization
//   4. Line 344: Error message without production error code - breaks React bundle size optimization
//   5. Line 344: Error message without production error code - breaks React bundle size optimization
//   6. Line 350: Error message without production error code - breaks React bundle size optimization
//   7. Line 350: Error message without production error code - breaks React bundle size optimization
//   8. Line 351: Error message without production error code - breaks React bundle size optimization
//   9. Line 351: Error message without production error code - breaks React bundle size optimization
//   10. Line 352: Error message without production error code - breaks React bundle size optimization
//   11. Line 352: Error message without production error code - breaks React bundle size optimization
//   12. Line 353: Error message without production error code - breaks React bundle size optimization
//   13. Line 353: Error message without production error code - breaks React bundle size optimization
//   14. Line 354: Error message without production error code - breaks React bundle size optimization
//   15. Line 354: Error message without production error code - breaks React bundle size optimization
//   16. Line 355: Error message without production error code - breaks React bundle size optimization
//   17. Line 355: Error message without production error code - breaks React bundle size optimization
//   18. Line 356: Error message without production error code - breaks React bundle size optimization
//   19. Line 356: Error message without production error code - breaks React bundle size optimization
//   20. Line 357: Error message without production error code - breaks React bundle size optimization
//   21. Line 357: Error message without production error code - breaks React bundle size optimization
//   22. Line 358: Error message without production error code - breaks React bundle size optimization
//   23. Line 358: Error message without production error code - breaks React bundle size optimization
//   24. Line 359: Error message without production error code - breaks React bundle size optimization
//   25. Line 359: Error message without production error code - breaks React bundle size optimization
//   26. Line 362: Error message without production error code - breaks React bundle size optimization
//   27. Line 362: Error message without production error code - breaks React bundle size optimization
//   28. Line 365: Error message without production error code - breaks React bundle size optimization
//   29. Line 365: Error message without production error code - breaks React bundle size optimization
//   30. Line 368: Error message without production error code - breaks React bundle size optimization
//   31. Line 368: Error message without production error code - breaks React bundle size optimization
//   32. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 382: Error message without production error code - breaks React bundle size optimization
//   34. Line 382: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 391: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 395: Error message without production error code - breaks React bundle size optimization
//   3. Line 395: Error message without production error code - breaks React bundle size optimization
//   4. Line 398: Error message without production error code - breaks React bundle size optimization
//   5. Line 398: Error message without production error code - breaks React bundle size optimization
//   6. Line 404: Error message without production error code - breaks React bundle size optimization
//   7. Line 404: Error message without production error code - breaks React bundle size optimization
//   8. Line 405: Error message without production error code - breaks React bundle size optimization
//   9. Line 405: Error message without production error code - breaks React bundle size optimization
//   10. Line 406: Error message without production error code - breaks React bundle size optimization
//   11. Line 406: Error message without production error code - breaks React bundle size optimization
//   12. Line 407: Error message without production error code - breaks React bundle size optimization
//   13. Line 407: Error message without production error code - breaks React bundle size optimization
//   14. Line 408: Error message without production error code - breaks React bundle size optimization
//   15. Line 408: Error message without production error code - breaks React bundle size optimization
//   16. Line 409: Error message without production error code - breaks React bundle size optimization
//   17. Line 409: Error message without production error code - breaks React bundle size optimization
//   18. Line 410: Error message without production error code - breaks React bundle size optimization
//   19. Line 410: Error message without production error code - breaks React bundle size optimization
//   20. Line 411: Error message without production error code - breaks React bundle size optimization
//   21. Line 411: Error message without production error code - breaks React bundle size optimization
//   22. Line 412: Error message without production error code - breaks React bundle size optimization
//   23. Line 412: Error message without production error code - breaks React bundle size optimization
//   24. Line 413: Error message without production error code - breaks React bundle size optimization
//   25. Line 413: Error message without production error code - breaks React bundle size optimization
//   26. Line 416: Error message without production error code - breaks React bundle size optimization
//   27. Line 416: Error message without production error code - breaks React bundle size optimization
//   28. Line 419: Error message without production error code - breaks React bundle size optimization
//   29. Line 419: Error message without production error code - breaks React bundle size optimization
//   30. Line 422: Error message without production error code - breaks React bundle size optimization
//   31. Line 422: Error message without production error code - breaks React bundle size optimization
//   32. Line 426: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 436: Error message without production error code - breaks React bundle size optimization
//   34. Line 436: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 445: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 449: Error message without production error code - breaks React bundle size optimization
//   3. Line 449: Error message without production error code - breaks React bundle size optimization
//   4. Line 452: Error message without production error code - breaks React bundle size optimization
//   5. Line 452: Error message without production error code - breaks React bundle size optimization
//   6. Line 458: Error message without production error code - breaks React bundle size optimization
//   7. Line 458: Error message without production error code - breaks React bundle size optimization
//   8. Line 459: Error message without production error code - breaks React bundle size optimization
//   9. Line 459: Error message without production error code - breaks React bundle size optimization
//   10. Line 460: Error message without production error code - breaks React bundle size optimization
//   11. Line 460: Error message without production error code - breaks React bundle size optimization
//   12. Line 461: Error message without production error code - breaks React bundle size optimization
//   13. Line 461: Error message without production error code - breaks React bundle size optimization
//   14. Line 462: Error message without production error code - breaks React bundle size optimization
//   15. Line 462: Error message without production error code - breaks React bundle size optimization
//   16. Line 463: Error message without production error code - breaks React bundle size optimization
//   17. Line 463: Error message without production error code - breaks React bundle size optimization
//   18. Line 464: Error message without production error code - breaks React bundle size optimization
//   19. Line 464: Error message without production error code - breaks React bundle size optimization
//   20. Line 465: Error message without production error code - breaks React bundle size optimization
//   21. Line 465: Error message without production error code - breaks React bundle size optimization
//   22. Line 466: Error message without production error code - breaks React bundle size optimization
//   23. Line 466: Error message without production error code - breaks React bundle size optimization
//   24. Line 467: Error message without production error code - breaks React bundle size optimization
//   25. Line 467: Error message without production error code - breaks React bundle size optimization
//   26. Line 470: Error message without production error code - breaks React bundle size optimization
//   27. Line 470: Error message without production error code - breaks React bundle size optimization
//   28. Line 473: Error message without production error code - breaks React bundle size optimization
//   29. Line 473: Error message without production error code - breaks React bundle size optimization
//   30. Line 476: Error message without production error code - breaks React bundle size optimization
//   31. Line 476: Error message without production error code - breaks React bundle size optimization
//   32. Line 480: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 490: Error message without production error code - breaks React bundle size optimization
//   34. Line 490: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 499: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 503: Error message without production error code - breaks React bundle size optimization
//   3. Line 503: Error message without production error code - breaks React bundle size optimization
//   4. Line 506: Error message without production error code - breaks React bundle size optimization
//   5. Line 506: Error message without production error code - breaks React bundle size optimization
//   6. Line 512: Error message without production error code - breaks React bundle size optimization
//   7. Line 512: Error message without production error code - breaks React bundle size optimization
//   8. Line 513: Error message without production error code - breaks React bundle size optimization
//   9. Line 513: Error message without production error code - breaks React bundle size optimization
//   10. Line 514: Error message without production error code - breaks React bundle size optimization
//   11. Line 514: Error message without production error code - breaks React bundle size optimization
//   12. Line 515: Error message without production error code - breaks React bundle size optimization
//   13. Line 515: Error message without production error code - breaks React bundle size optimization
//   14. Line 516: Error message without production error code - breaks React bundle size optimization
//   15. Line 516: Error message without production error code - breaks React bundle size optimization
//   16. Line 517: Error message without production error code - breaks React bundle size optimization
//   17. Line 517: Error message without production error code - breaks React bundle size optimization
//   18. Line 518: Error message without production error code - breaks React bundle size optimization
//   19. Line 518: Error message without production error code - breaks React bundle size optimization
//   20. Line 519: Error message without production error code - breaks React bundle size optimization
//   21. Line 519: Error message without production error code - breaks React bundle size optimization
//   22. Line 520: Error message without production error code - breaks React bundle size optimization
//   23. Line 520: Error message without production error code - breaks React bundle size optimization
//   24. Line 521: Error message without production error code - breaks React bundle size optimization
//   25. Line 521: Error message without production error code - breaks React bundle size optimization
//   26. Line 524: Error message without production error code - breaks React bundle size optimization
//   27. Line 524: Error message without production error code - breaks React bundle size optimization
//   28. Line 527: Error message without production error code - breaks React bundle size optimization
//   29. Line 527: Error message without production error code - breaks React bundle size optimization
//   30. Line 530: Error message without production error code - breaks React bundle size optimization
//   31. Line 530: Error message without production error code - breaks React bundle size optimization
//   32. Line 534: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 544: Error message without production error code - breaks React bundle size optimization
//   34. Line 544: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (34):
//   1. Line 553: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 557: Error message without production error code - breaks React bundle size optimization
//   3. Line 557: Error message without production error code - breaks React bundle size optimization
//   4. Line 560: Error message without production error code - breaks React bundle size optimization
//   5. Line 560: Error message without production error code - breaks React bundle size optimization
//   6. Line 566: Error message without production error code - breaks React bundle size optimization
//   7. Line 566: Error message without production error code - breaks React bundle size optimization
//   8. Line 567: Error message without production error code - breaks React bundle size optimization
//   9. Line 567: Error message without production error code - breaks React bundle size optimization
//   10. Line 568: Error message without production error code - breaks React bundle size optimization
//   11. Line 568: Error message without production error code - breaks React bundle size optimization
//   12. Line 569: Error message without production error code - breaks React bundle size optimization
//   13. Line 569: Error message without production error code - breaks React bundle size optimization
//   14. Line 570: Error message without production error code - breaks React bundle size optimization
//   15. Line 570: Error message without production error code - breaks React bundle size optimization
//   16. Line 571: Error message without production error code - breaks React bundle size optimization
//   17. Line 571: Error message without production error code - breaks React bundle size optimization
//   18. Line 572: Error message without production error code - breaks React bundle size optimization
//   19. Line 572: Error message without production error code - breaks React bundle size optimization
//   20. Line 573: Error message without production error code - breaks React bundle size optimization
//   21. Line 573: Error message without production error code - breaks React bundle size optimization
//   22. Line 574: Error message without production error code - breaks React bundle size optimization
//   23. Line 574: Error message without production error code - breaks React bundle size optimization
//   24. Line 575: Error message without production error code - breaks React bundle size optimization
//   25. Line 575: Error message without production error code - breaks React bundle size optimization
//   26. Line 578: Error message without production error code - breaks React bundle size optimization
//   27. Line 578: Error message without production error code - breaks React bundle size optimization
//   28. Line 581: Error message without production error code - breaks React bundle size optimization
//   29. Line 581: Error message without production error code - breaks React bundle size optimization
//   30. Line 584: Error message without production error code - breaks React bundle size optimization
//   31. Line 584: Error message without production error code - breaks React bundle size optimization
//   32. Line 588: Missing service brand declaration - breaks VSCode's DI system type safety
//   33. Line 598: Error message without production error code - breaks React bundle size optimization
//   34. Line 598: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	class TestChatAgentService implements IChatAgentService {
		_serviceBrand: undefined;
		readonly onDidChangeAgents = Event.None;
		registerAgentImplementation(id: string, agent: IChatAgentImplementation): IDisposable { throw new Error(); }
		registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable { throw new Error('Method not implemented.'); }
		invokeAgent(id: string, request: IChatAgentRequest, progress: (part: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> { throw new Error(); }
		setRequestTools(agent: string, requestId: string, tools: Pick<IChatAgentRequest, 'userSelectedTools'>): void { }
		setRequestPaused(agent: string, requestId: string, isPaused: boolean): void { throw new Error('not implemented'); }
		getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> { throw new Error(); }
		getActivatedAgents(): IChatAgent[] { return agents; }
		getAgents(): IChatAgent[] { return agents; }
		getDefaultAgent(): IChatAgent | undefined { throw new Error(); }
		getContributedDefaultAgent(): IChatAgentData | undefined { throw new Error(); }
		registerAgent(id: string, data: IChatAgentData): IDisposable { throw new Error('Method not implemented.'); }
		getAgent(id: string): IChatAgentData | undefined { throw new Error('Method not implemented.'); }
		getAgentsByName(name: string): IChatAgentData[] { throw new Error('Method not implemented.'); }
		updateAgent(id: string, updateMetadata: IChatAgentMetadata): void { throw new Error('Method not implemented.'); }
		getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined { throw new Error('Method not implemented.'); }
		registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>): IDisposable { throw new Error('Method not implemented.'); }
		getAgentCompletionItems(id: string, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]> { throw new Error('Method not implemented.'); }
		agentHasDupeName(id: string): boolean { throw new Error('Method not implemented.'); }
		getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { throw new Error('Method not implemented.'); }
		getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { throw new Error('Method not implemented.'); }
		hasToolsAgent: boolean = false;
		hasChatParticipantDetectionProviders(): boolean {
			throw new Error('Method not implemented.');
		}
		registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider): IDisposable {
			throw new Error('Method not implemented.');
		}
		detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined> {
			throw new Error('Method not implemented.');
		}
	}

	class TestSpeechService implements ISpeechService {
		_serviceBrand: undefined;

		onDidChangeHasSpeechProvider = Event.None;

		readonly hasSpeechProvider = true;
		readonly hasActiveSpeechToTextSession = false;
		readonly hasActiveTextToSpeechSession = false;
		readonly hasActiveKeywordRecognition = false;

		registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable { throw new Error('Method not implemented.'); }
		onDidStartSpeechToTextSession = Event.None;
		onDidEndSpeechToTextSession = Event.None;

		async createSpeechToTextSession(token: CancellationToken): Promise<ISpeechToTextSession> {
			return {
				onDidChange: emitter.event
			};
		}

		onDidStartTextToSpeechSession = Event.None;
		onDidEndTextToSpeechSession = Event.None;

		async createTextToSpeechSession(token: CancellationToken): Promise<ITextToSpeechSession> {
			return {
				onDidChange: Event.None,
				synthesize: async () => { }
			};
		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 132: Error message without production error code - breaks React bundle size optimization
//   2. Line 132: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		onDidStartKeywordRecognition = Event.None;
		onDidEndKeywordRecognition = Event.None;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 198: Error message without production error code - breaks React bundle size optimization
//   2. Line 198: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus> { throw new Error('Method not implemented.'); }
	}

	const disposables = new DisposableStore();
	let emitter: Emitter<ISpeechToTextEvent>;

	let service: VoiceChatService;
	let event: IVoiceChatTextEvent | undefined;

	async function createSession(options: IVoiceChatSessionOptions) {
		const cts = new CancellationTokenSource();
		disposables.add(toDisposable(() => cts.dispose(true)));
		const session = await service.createVoiceChatSession(cts.token, options);
		disposables.add(session.onDidChange(e => {
			event = e;
		}));
	}

	setup(() => {
		emitter = disposables.add(new Emitter<ISpeechToTextEvent>());
		service = disposables.add(new VoiceChatService(new TestSpeechService(), new TestChatAgentService(), new MockContextKeyService()));
	});

	teardown(() => {
		disposables.clear();
	});

	test('Agent and slash command detection (useAgents: false)', async () => {
		await testAgentsAndSlashCommandsDetection({ usesAgents: false, model: {} as IChatModel });
	});

	test('Agent and slash command detection (useAgents: true)', async () => {
		await testAgentsAndSlashCommandsDetection({ usesAgents: true, model: {} as IChatModel });
	});

	async function testAgentsAndSlashCommandsDetection(options: IVoiceChatSessionOptions) {

		// Nothing to detect
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Started });
		assert.strictEqual(event?.status, SpeechToTextStatus.Started);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Hello' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'Hello');
		assert.strictEqual(event?.waitingForInput, undefined);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Hello World' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'Hello World');
		assert.strictEqual(event?.waitingForInput, undefined);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'Hello World' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, 'Hello World');
		assert.strictEqual(event?.waitingForInput, undefined);

		// Agent
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'At');

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace' : 'At workspace');
		assert.strictEqual(event?.waitingForInput, options.usesAgents);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace' : 'at workspace');
		assert.strictEqual(event?.waitingForInput, options.usesAgents);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent with punctuation
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace, help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace, help');
		assert.strictEqual(event?.waitingForInput, false);

		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At Workspace. help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At Workspace. help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At Workspace. help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At Workspace. help');
		assert.strictEqual(event?.waitingForInput, false);

		// Slash Command
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Slash fix' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace /fix' : '/fix');
		assert.strictEqual(event?.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'Slash fix' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace /fix' : '/fix');
		assert.strictEqual(event?.waitingForInput, true);

		// Agent + Slash Command
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code slash search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code slash search help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code slash search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code slash search help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent + Slash Command with punctuation
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code, slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code, slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code, slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code, slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code. slash, search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code. slash, search help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code. slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code. slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent not detected twice
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace, for at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace for at workspace' : 'At workspace, for at workspace');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace, for at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace for at workspace' : 'At workspace, for at workspace');
		assert.strictEqual(event?.waitingForInput, false);

		// Slash command detected after agent recognized
		if (options.usesAgents) {
			await createSession(options);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '@workspace');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'slash' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
			assert.strictEqual(event?.text, 'slash');
			assert.strictEqual(event?.waitingForInput, false);

			emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);

			await createSession(options);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '@workspace');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);
		}
	}

	test('waiting for input', async () => {

		// Agent
		await createSession({ usesAgents: true, model: {} as IChatModel });

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, '@workspace');
		assert.strictEqual(event.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, '@workspace');
		assert.strictEqual(event.waitingForInput, true);

		// Slash Command
		await createSession({ usesAgents: true, model: {} as IChatModel });

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace slash explain' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, '@workspace /explain');
		assert.strictEqual(event.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace slash explain' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, '@workspace /explain');
		assert.strictEqual(event.waitingForInput, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
