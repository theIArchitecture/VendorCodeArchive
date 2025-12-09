//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { CommentsPanel } from '../../browser/commentsView.js';
import { CommentService, ICommentController, ICommentInfo, ICommentService, INotebookCommentInfo } from '../../browser/commentService.js';
import { Comment, CommentInput, CommentReaction, CommentThread, CommentThreadCollapsibleState, CommentThreadState } from '../../../../../editor/common/languages.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IViewContainerModel, IViewDescriptor, IViewDescriptorService, ViewContainer, ViewContainerLocation } from '../../../../common/views.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';

class TestCommentThread implements CommentThread<IRange> {
	isDocumentCommentThread(): this is CommentThread<IRange> {
		return true;
	}
	constructor(public readonly commentThreadHandle: number,
		public readonly controllerHandle: number,
		public readonly threadId: string,
		public readonly resource: string,
		public readonly range: IRange,
		public readonly comments: Comment[]) { }

	onDidChangeComments: Event<readonly Comment[] | undefined> = new Emitter<readonly Comment[] | undefined>().event;
	onDidChangeInitialCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	canReply: boolean = false;
	onDidChangeInput: Event<CommentInput | undefined> = new Emitter<CommentInput | undefined>().event;
	onDidChangeRange: Event<IRange> = new Emitter<IRange>().event;
	onDidChangeLabel: Event<string | undefined> = new Emitter<string | undefined>().event;
	onDidChangeCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	onDidChangeState: Event<CommentThreadState | undefined> = new Emitter<CommentThreadState | undefined>().event;
	onDidChangeCanReply: Event<boolean> = new Emitter<boolean>().event;
	isDisposed: boolean = false;
	isTemplate: boolean = false;
	label: string | undefined = undefined;
	contextValue: string | undefined = undefined;
}

class TestCommentController implements ICommentController {
	activeComment: { thread: CommentThread; comment?: Comment } | undefined;
	id: string = 'test';
	label: string = 'Test Comments';
	owner: string = 'test';
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 58: Error message without production error code - breaks React bundle size optimization
//   2. Line 58: Error message without production error code - breaks React bundle size optimization
//   3. Line 61: Error message without production error code - breaks React bundle size optimization
//   4. Line 61: Error message without production error code - breaks React bundle size optimization
//   5. Line 64: Error message without production error code - breaks React bundle size optimization
//   6. Line 64: Error message without production error code - breaks React bundle size optimization
//   7. Line 67: Error message without production error code - breaks React bundle size optimization
//   8. Line 67: Error message without production error code - breaks React bundle size optimization
//   9. Line 70: Error message without production error code - breaks React bundle size optimization
//   10. Line 70: Error message without production error code - breaks React bundle size optimization
//   11. Line 73: Error message without production error code - breaks React bundle size optimization
//   12. Line 73: Error message without production error code - breaks React bundle size optimization
//   13. Line 76: Error message without production error code - breaks React bundle size optimization
//   14. Line 76: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	features = {};
	createCommentThreadTemplate(resource: UriComponents, range: IRange | undefined): Promise<void> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 82: Error message without production error code - breaks React bundle size optimization
//   2. Line 82: Error message without production error code - breaks React bundle size optimization
//   3. Line 85: Error message without production error code - breaks React bundle size optimization
//   4. Line 85: Error message without production error code - breaks React bundle size optimization
//   5. Line 88: Error message without production error code - breaks React bundle size optimization
//   6. Line 88: Error message without production error code - breaks React bundle size optimization
//   7. Line 91: Error message without production error code - breaks React bundle size optimization
//   8. Line 91: Error message without production error code - breaks React bundle size optimization
//   9. Line 94: Error message without production error code - breaks React bundle size optimization
//   10. Line 94: Error message without production error code - breaks React bundle size optimization
//   11. Line 97: Error message without production error code - breaks React bundle size optimization
//   12. Line 97: Error message without production error code - breaks React bundle size optimization
//   13. Line 100: Error message without production error code - breaks React bundle size optimization
//   14. Line 100: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 104: Error message without production error code - breaks React bundle size optimization
//   2. Line 104: Error message without production error code - breaks React bundle size optimization
//   3. Line 107: Error message without production error code - breaks React bundle size optimization
//   4. Line 107: Error message without production error code - breaks React bundle size optimization
//   5. Line 110: Error message without production error code - breaks React bundle size optimization
//   6. Line 110: Error message without production error code - breaks React bundle size optimization
//   7. Line 113: Error message without production error code - breaks React bundle size optimization
//   8. Line 113: Error message without production error code - breaks React bundle size optimization
//   9. Line 116: Error message without production error code - breaks React bundle size optimization
//   10. Line 116: Error message without production error code - breaks React bundle size optimization
//   11. Line 119: Error message without production error code - breaks React bundle size optimization
//   12. Line 119: Error message without production error code - breaks React bundle size optimization
//   13. Line 122: Error message without production error code - breaks React bundle size optimization
//   14. Line 122: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 126: Error message without production error code - breaks React bundle size optimization
//   2. Line 126: Error message without production error code - breaks React bundle size optimization
//   3. Line 129: Error message without production error code - breaks React bundle size optimization
//   4. Line 129: Error message without production error code - breaks React bundle size optimization
//   5. Line 132: Error message without production error code - breaks React bundle size optimization
//   6. Line 132: Error message without production error code - breaks React bundle size optimization
//   7. Line 135: Error message without production error code - breaks React bundle size optimization
//   8. Line 135: Error message without production error code - breaks React bundle size optimization
//   9. Line 138: Error message without production error code - breaks React bundle size optimization
//   10. Line 138: Error message without production error code - breaks React bundle size optimization
//   11. Line 141: Error message without production error code - breaks React bundle size optimization
//   12. Line 141: Error message without production error code - breaks React bundle size optimization
//   13. Line 144: Error message without production error code - breaks React bundle size optimization
//   14. Line 144: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 148: Error message without production error code - breaks React bundle size optimization
//   2. Line 148: Error message without production error code - breaks React bundle size optimization
//   3. Line 151: Error message without production error code - breaks React bundle size optimization
//   4. Line 151: Error message without production error code - breaks React bundle size optimization
//   5. Line 154: Error message without production error code - breaks React bundle size optimization
//   6. Line 154: Error message without production error code - breaks React bundle size optimization
//   7. Line 157: Error message without production error code - breaks React bundle size optimization
//   8. Line 157: Error message without production error code - breaks React bundle size optimization
//   9. Line 160: Error message without production error code - breaks React bundle size optimization
//   10. Line 160: Error message without production error code - breaks React bundle size optimization
//   11. Line 163: Error message without production error code - breaks React bundle size optimization
//   12. Line 163: Error message without production error code - breaks React bundle size optimization
//   13. Line 166: Error message without production error code - breaks React bundle size optimization
//   14. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 170: Error message without production error code - breaks React bundle size optimization
//   2. Line 170: Error message without production error code - breaks React bundle size optimization
//   3. Line 173: Error message without production error code - breaks React bundle size optimization
//   4. Line 173: Error message without production error code - breaks React bundle size optimization
//   5. Line 176: Error message without production error code - breaks React bundle size optimization
//   6. Line 176: Error message without production error code - breaks React bundle size optimization
//   7. Line 179: Error message without production error code - breaks React bundle size optimization
//   8. Line 179: Error message without production error code - breaks React bundle size optimization
//   9. Line 182: Error message without production error code - breaks React bundle size optimization
//   10. Line 182: Error message without production error code - breaks React bundle size optimization
//   11. Line 185: Error message without production error code - breaks React bundle size optimization
//   12. Line 185: Error message without production error code - breaks React bundle size optimization
//   13. Line 188: Error message without production error code - breaks React bundle size optimization
//   14. Line 188: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 192: Error message without production error code - breaks React bundle size optimization
//   2. Line 192: Error message without production error code - breaks React bundle size optimization
//   3. Line 195: Error message without production error code - breaks React bundle size optimization
//   4. Line 195: Error message without production error code - breaks React bundle size optimization
//   5. Line 198: Error message without production error code - breaks React bundle size optimization
//   6. Line 198: Error message without production error code - breaks React bundle size optimization
//   7. Line 201: Error message without production error code - breaks React bundle size optimization
//   8. Line 201: Error message without production error code - breaks React bundle size optimization
//   9. Line 204: Error message without production error code - breaks React bundle size optimization
//   10. Line 204: Error message without production error code - breaks React bundle size optimization
//   11. Line 207: Error message without production error code - breaks React bundle size optimization
//   12. Line 207: Error message without production error code - breaks React bundle size optimization
//   13. Line 210: Error message without production error code - breaks React bundle size optimization
//   14. Line 210: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 214: Error message without production error code - breaks React bundle size optimization
//   2. Line 214: Error message without production error code - breaks React bundle size optimization
//   3. Line 217: Error message without production error code - breaks React bundle size optimization
//   4. Line 217: Error message without production error code - breaks React bundle size optimization
//   5. Line 220: Error message without production error code - breaks React bundle size optimization
//   6. Line 220: Error message without production error code - breaks React bundle size optimization
//   7. Line 223: Error message without production error code - breaks React bundle size optimization
//   8. Line 223: Error message without production error code - breaks React bundle size optimization
//   9. Line 226: Error message without production error code - breaks React bundle size optimization
//   10. Line 226: Error message without production error code - breaks React bundle size optimization
//   11. Line 229: Error message without production error code - breaks React bundle size optimization
//   12. Line 229: Error message without production error code - breaks React bundle size optimization
//   13. Line 232: Error message without production error code - breaks React bundle size optimization
//   14. Line 232: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 236: Error message without production error code - breaks React bundle size optimization
//   2. Line 236: Error message without production error code - breaks React bundle size optimization
//   3. Line 239: Error message without production error code - breaks React bundle size optimization
//   4. Line 239: Error message without production error code - breaks React bundle size optimization
//   5. Line 242: Error message without production error code - breaks React bundle size optimization
//   6. Line 242: Error message without production error code - breaks React bundle size optimization
//   7. Line 245: Error message without production error code - breaks React bundle size optimization
//   8. Line 245: Error message without production error code - breaks React bundle size optimization
//   9. Line 248: Error message without production error code - breaks React bundle size optimization
//   10. Line 248: Error message without production error code - breaks React bundle size optimization
//   11. Line 251: Error message without production error code - breaks React bundle size optimization
//   12. Line 251: Error message without production error code - breaks React bundle size optimization
//   13. Line 254: Error message without production error code - breaks React bundle size optimization
//   14. Line 254: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 258: Error message without production error code - breaks React bundle size optimization
//   2. Line 258: Error message without production error code - breaks React bundle size optimization
//   3. Line 261: Error message without production error code - breaks React bundle size optimization
//   4. Line 261: Error message without production error code - breaks React bundle size optimization
//   5. Line 264: Error message without production error code - breaks React bundle size optimization
//   6. Line 264: Error message without production error code - breaks React bundle size optimization
//   7. Line 267: Error message without production error code - breaks React bundle size optimization
//   8. Line 267: Error message without production error code - breaks React bundle size optimization
//   9. Line 270: Error message without production error code - breaks React bundle size optimization
//   10. Line 270: Error message without production error code - breaks React bundle size optimization
//   11. Line 273: Error message without production error code - breaks React bundle size optimization
//   12. Line 273: Error message without production error code - breaks React bundle size optimization
//   13. Line 276: Error message without production error code - breaks React bundle size optimization
//   14. Line 276: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 280: Error message without production error code - breaks React bundle size optimization
//   2. Line 280: Error message without production error code - breaks React bundle size optimization
//   3. Line 283: Error message without production error code - breaks React bundle size optimization
//   4. Line 283: Error message without production error code - breaks React bundle size optimization
//   5. Line 286: Error message without production error code - breaks React bundle size optimization
//   6. Line 286: Error message without production error code - breaks React bundle size optimization
//   7. Line 289: Error message without production error code - breaks React bundle size optimization
//   8. Line 289: Error message without production error code - breaks React bundle size optimization
//   9. Line 292: Error message without production error code - breaks React bundle size optimization
//   10. Line 292: Error message without production error code - breaks React bundle size optimization
//   11. Line 295: Error message without production error code - breaks React bundle size optimization
//   12. Line 295: Error message without production error code - breaks React bundle size optimization
//   13. Line 298: Error message without production error code - breaks React bundle size optimization
//   14. Line 298: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 302: Error message without production error code - breaks React bundle size optimization
//   2. Line 302: Error message without production error code - breaks React bundle size optimization
//   3. Line 305: Error message without production error code - breaks React bundle size optimization
//   4. Line 305: Error message without production error code - breaks React bundle size optimization
//   5. Line 308: Error message without production error code - breaks React bundle size optimization
//   6. Line 308: Error message without production error code - breaks React bundle size optimization
//   7. Line 311: Error message without production error code - breaks React bundle size optimization
//   8. Line 311: Error message without production error code - breaks React bundle size optimization
//   9. Line 314: Error message without production error code - breaks React bundle size optimization
//   10. Line 314: Error message without production error code - breaks React bundle size optimization
//   11. Line 317: Error message without production error code - breaks React bundle size optimization
//   12. Line 317: Error message without production error code - breaks React bundle size optimization
//   13. Line 320: Error message without production error code - breaks React bundle size optimization
//   14. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 324: Error message without production error code - breaks React bundle size optimization
//   2. Line 324: Error message without production error code - breaks React bundle size optimization
//   3. Line 327: Error message without production error code - breaks React bundle size optimization
//   4. Line 327: Error message without production error code - breaks React bundle size optimization
//   5. Line 330: Error message without production error code - breaks React bundle size optimization
//   6. Line 330: Error message without production error code - breaks React bundle size optimization
//   7. Line 333: Error message without production error code - breaks React bundle size optimization
//   8. Line 333: Error message without production error code - breaks React bundle size optimization
//   9. Line 336: Error message without production error code - breaks React bundle size optimization
//   10. Line 336: Error message without production error code - breaks React bundle size optimization
//   11. Line 339: Error message without production error code - breaks React bundle size optimization
//   12. Line 339: Error message without production error code - breaks React bundle size optimization
//   13. Line 342: Error message without production error code - breaks React bundle size optimization
//   14. Line 342: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 346: Error message without production error code - breaks React bundle size optimization
//   2. Line 346: Error message without production error code - breaks React bundle size optimization
//   3. Line 349: Error message without production error code - breaks React bundle size optimization
//   4. Line 349: Error message without production error code - breaks React bundle size optimization
//   5. Line 352: Error message without production error code - breaks React bundle size optimization
//   6. Line 352: Error message without production error code - breaks React bundle size optimization
//   7. Line 355: Error message without production error code - breaks React bundle size optimization
//   8. Line 355: Error message without production error code - breaks React bundle size optimization
//   9. Line 358: Error message without production error code - breaks React bundle size optimization
//   10. Line 358: Error message without production error code - breaks React bundle size optimization
//   11. Line 361: Error message without production error code - breaks React bundle size optimization
//   12. Line 361: Error message without production error code - breaks React bundle size optimization
//   13. Line 364: Error message without production error code - breaks React bundle size optimization
//   14. Line 364: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 368: Error message without production error code - breaks React bundle size optimization
//   2. Line 368: Error message without production error code - breaks React bundle size optimization
//   3. Line 371: Error message without production error code - breaks React bundle size optimization
//   4. Line 371: Error message without production error code - breaks React bundle size optimization
//   5. Line 374: Error message without production error code - breaks React bundle size optimization
//   6. Line 374: Error message without production error code - breaks React bundle size optimization
//   7. Line 377: Error message without production error code - breaks React bundle size optimization
//   8. Line 377: Error message without production error code - breaks React bundle size optimization
//   9. Line 380: Error message without production error code - breaks React bundle size optimization
//   10. Line 380: Error message without production error code - breaks React bundle size optimization
//   11. Line 383: Error message without production error code - breaks React bundle size optimization
//   12. Line 383: Error message without production error code - breaks React bundle size optimization
//   13. Line 386: Error message without production error code - breaks React bundle size optimization
//   14. Line 386: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 390: Error message without production error code - breaks React bundle size optimization
//   2. Line 390: Error message without production error code - breaks React bundle size optimization
//   3. Line 393: Error message without production error code - breaks React bundle size optimization
//   4. Line 393: Error message without production error code - breaks React bundle size optimization
//   5. Line 396: Error message without production error code - breaks React bundle size optimization
//   6. Line 396: Error message without production error code - breaks React bundle size optimization
//   7. Line 399: Error message without production error code - breaks React bundle size optimization
//   8. Line 399: Error message without production error code - breaks React bundle size optimization
//   9. Line 402: Error message without production error code - breaks React bundle size optimization
//   10. Line 402: Error message without production error code - breaks React bundle size optimization
//   11. Line 405: Error message without production error code - breaks React bundle size optimization
//   12. Line 405: Error message without production error code - breaks React bundle size optimization
//   13. Line 408: Error message without production error code - breaks React bundle size optimization
//   14. Line 408: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 412: Error message without production error code - breaks React bundle size optimization
//   2. Line 412: Error message without production error code - breaks React bundle size optimization
//   3. Line 415: Error message without production error code - breaks React bundle size optimization
//   4. Line 415: Error message without production error code - breaks React bundle size optimization
//   5. Line 418: Error message without production error code - breaks React bundle size optimization
//   6. Line 418: Error message without production error code - breaks React bundle size optimization
//   7. Line 421: Error message without production error code - breaks React bundle size optimization
//   8. Line 421: Error message without production error code - breaks React bundle size optimization
//   9. Line 424: Error message without production error code - breaks React bundle size optimization
//   10. Line 424: Error message without production error code - breaks React bundle size optimization
//   11. Line 427: Error message without production error code - breaks React bundle size optimization
//   12. Line 427: Error message without production error code - breaks React bundle size optimization
//   13. Line 430: Error message without production error code - breaks React bundle size optimization
//   14. Line 430: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 434: Error message without production error code - breaks React bundle size optimization
//   2. Line 434: Error message without production error code - breaks React bundle size optimization
//   3. Line 437: Error message without production error code - breaks React bundle size optimization
//   4. Line 437: Error message without production error code - breaks React bundle size optimization
//   5. Line 440: Error message without production error code - breaks React bundle size optimization
//   6. Line 440: Error message without production error code - breaks React bundle size optimization
//   7. Line 443: Error message without production error code - breaks React bundle size optimization
//   8. Line 443: Error message without production error code - breaks React bundle size optimization
//   9. Line 446: Error message without production error code - breaks React bundle size optimization
//   10. Line 446: Error message without production error code - breaks React bundle size optimization
//   11. Line 449: Error message without production error code - breaks React bundle size optimization
//   12. Line 449: Error message without production error code - breaks React bundle size optimization
//   13. Line 452: Error message without production error code - breaks React bundle size optimization
//   14. Line 452: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 456: Error message without production error code - breaks React bundle size optimization
//   2. Line 456: Error message without production error code - breaks React bundle size optimization
//   3. Line 459: Error message without production error code - breaks React bundle size optimization
//   4. Line 459: Error message without production error code - breaks React bundle size optimization
//   5. Line 462: Error message without production error code - breaks React bundle size optimization
//   6. Line 462: Error message without production error code - breaks React bundle size optimization
//   7. Line 465: Error message without production error code - breaks React bundle size optimization
//   8. Line 465: Error message without production error code - breaks React bundle size optimization
//   9. Line 468: Error message without production error code - breaks React bundle size optimization
//   10. Line 468: Error message without production error code - breaks React bundle size optimization
//   11. Line 471: Error message without production error code - breaks React bundle size optimization
//   12. Line 471: Error message without production error code - breaks React bundle size optimization
//   13. Line 474: Error message without production error code - breaks React bundle size optimization
//   14. Line 474: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 478: Error message without production error code - breaks React bundle size optimization
//   2. Line 478: Error message without production error code - breaks React bundle size optimization
//   3. Line 481: Error message without production error code - breaks React bundle size optimization
//   4. Line 481: Error message without production error code - breaks React bundle size optimization
//   5. Line 484: Error message without production error code - breaks React bundle size optimization
//   6. Line 484: Error message without production error code - breaks React bundle size optimization
//   7. Line 487: Error message without production error code - breaks React bundle size optimization
//   8. Line 487: Error message without production error code - breaks React bundle size optimization
//   9. Line 490: Error message without production error code - breaks React bundle size optimization
//   10. Line 490: Error message without production error code - breaks React bundle size optimization
//   11. Line 493: Error message without production error code - breaks React bundle size optimization
//   12. Line 493: Error message without production error code - breaks React bundle size optimization
//   13. Line 496: Error message without production error code - breaks React bundle size optimization
//   14. Line 496: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 500: Error message without production error code - breaks React bundle size optimization
//   2. Line 500: Error message without production error code - breaks React bundle size optimization
//   3. Line 503: Error message without production error code - breaks React bundle size optimization
//   4. Line 503: Error message without production error code - breaks React bundle size optimization
//   5. Line 506: Error message without production error code - breaks React bundle size optimization
//   6. Line 506: Error message without production error code - breaks React bundle size optimization
//   7. Line 509: Error message without production error code - breaks React bundle size optimization
//   8. Line 509: Error message without production error code - breaks React bundle size optimization
//   9. Line 512: Error message without production error code - breaks React bundle size optimization
//   10. Line 512: Error message without production error code - breaks React bundle size optimization
//   11. Line 515: Error message without production error code - breaks React bundle size optimization
//   12. Line 515: Error message without production error code - breaks React bundle size optimization
//   13. Line 518: Error message without production error code - breaks React bundle size optimization
//   14. Line 518: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 522: Error message without production error code - breaks React bundle size optimization
//   2. Line 522: Error message without production error code - breaks React bundle size optimization
//   3. Line 525: Error message without production error code - breaks React bundle size optimization
//   4. Line 525: Error message without production error code - breaks React bundle size optimization
//   5. Line 528: Error message without production error code - breaks React bundle size optimization
//   6. Line 528: Error message without production error code - breaks React bundle size optimization
//   7. Line 531: Error message without production error code - breaks React bundle size optimization
//   8. Line 531: Error message without production error code - breaks React bundle size optimization
//   9. Line 534: Error message without production error code - breaks React bundle size optimization
//   10. Line 534: Error message without production error code - breaks React bundle size optimization
//   11. Line 537: Error message without production error code - breaks React bundle size optimization
//   12. Line 537: Error message without production error code - breaks React bundle size optimization
//   13. Line 540: Error message without production error code - breaks React bundle size optimization
//   14. Line 540: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 544: Error message without production error code - breaks React bundle size optimization
//   2. Line 544: Error message without production error code - breaks React bundle size optimization
//   3. Line 547: Error message without production error code - breaks React bundle size optimization
//   4. Line 547: Error message without production error code - breaks React bundle size optimization
//   5. Line 550: Error message without production error code - breaks React bundle size optimization
//   6. Line 550: Error message without production error code - breaks React bundle size optimization
//   7. Line 553: Error message without production error code - breaks React bundle size optimization
//   8. Line 553: Error message without production error code - breaks React bundle size optimization
//   9. Line 556: Error message without production error code - breaks React bundle size optimization
//   10. Line 556: Error message without production error code - breaks React bundle size optimization
//   11. Line 559: Error message without production error code - breaks React bundle size optimization
//   12. Line 559: Error message without production error code - breaks React bundle size optimization
//   13. Line 562: Error message without production error code - breaks React bundle size optimization
//   14. Line 562: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 566: Error message without production error code - breaks React bundle size optimization
//   2. Line 566: Error message without production error code - breaks React bundle size optimization
//   3. Line 569: Error message without production error code - breaks React bundle size optimization
//   4. Line 569: Error message without production error code - breaks React bundle size optimization
//   5. Line 572: Error message without production error code - breaks React bundle size optimization
//   6. Line 572: Error message without production error code - breaks React bundle size optimization
//   7. Line 575: Error message without production error code - breaks React bundle size optimization
//   8. Line 575: Error message without production error code - breaks React bundle size optimization
//   9. Line 578: Error message without production error code - breaks React bundle size optimization
//   10. Line 578: Error message without production error code - breaks React bundle size optimization
//   11. Line 581: Error message without production error code - breaks React bundle size optimization
//   12. Line 581: Error message without production error code - breaks React bundle size optimization
//   13. Line 584: Error message without production error code - breaks React bundle size optimization
//   14. Line 584: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 588: Error message without production error code - breaks React bundle size optimization
//   2. Line 588: Error message without production error code - breaks React bundle size optimization
//   3. Line 591: Error message without production error code - breaks React bundle size optimization
//   4. Line 591: Error message without production error code - breaks React bundle size optimization
//   5. Line 594: Error message without production error code - breaks React bundle size optimization
//   6. Line 594: Error message without production error code - breaks React bundle size optimization
//   7. Line 597: Error message without production error code - breaks React bundle size optimization
//   8. Line 597: Error message without production error code - breaks React bundle size optimization
//   9. Line 600: Error message without production error code - breaks React bundle size optimization
//   10. Line 600: Error message without production error code - breaks React bundle size optimization
//   11. Line 603: Error message without production error code - breaks React bundle size optimization
//   12. Line 603: Error message without production error code - breaks React bundle size optimization
//   13. Line 606: Error message without production error code - breaks React bundle size optimization
//   14. Line 606: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
	updateCommentThreadTemplate(threadHandle: number, range: IRange): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteCommentThreadMain(commentThreadId: string): void {
		throw new Error('Method not implemented.');
	}
	toggleReaction(uri: URI, thread: CommentThread<IRange>, comment: Comment, reaction: CommentReaction, token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getDocumentComments(resource: URI, token: CancellationToken): Promise<ICommentInfo> {
		throw new Error('Method not implemented.');
	}
	getNotebookComments(resource: URI, token: CancellationToken): Promise<INotebookCommentInfo> {
		throw new Error('Method not implemented.');
	}
	setActiveCommentAndThread(commentInfo: { thread: CommentThread; comment: Comment } | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

}

export class TestViewDescriptorService implements Partial<IViewDescriptorService> {
	getViewLocationById(id: string): ViewContainerLocation | null {
		return ViewContainerLocation.Panel;
	}
	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }> = new Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>().event;
	getViewDescriptorById(id: string): IViewDescriptor | null {
		return null;
	}
	getViewContainerByViewId(id: string): ViewContainer | null {
		return {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			id: 'comments',
			title: { value: 'Comments', original: 'Comments' },
			ctorDescriptor: {} as any
		};
	}
	getViewContainerModel(viewContainer: ViewContainer): IViewContainerModel {
		const partialViewContainerModel: Partial<IViewContainerModel> = {
			onDidChangeContainerInfo: new Emitter<{ title?: boolean; icon?: boolean; keybindingId?: boolean }>().event
		};
		return partialViewContainerModel as IViewContainerModel;
	}
	getDefaultContainerById(id: string): ViewContainer | null {
		return null;
	}
}

suite('Comments View', function () {
	teardown(() => {
		instantiationService.dispose();
		commentService.dispose();
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let commentService: CommentService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService({}, disposables);
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IHoverService, NullHoverService);
		instantiationService.stub(IContextViewService, {});
		instantiationService.stub(IViewDescriptorService, new TestViewDescriptorService());
		commentService = instantiationService.createInstance(CommentService);
		instantiationService.stub(ICommentService, commentService);
		commentService.registerCommentController('test', new TestCommentController());
	});



	test('collapse all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.dispose();
	});

	test('expand all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.expandAll();
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.dispose();
	});

	test('filter by text', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.setVisible(true);
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'This comment is a cat.', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'This comment is a dog.', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.getFilterWidget().setFilterText('cat');
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = false;

		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 1);
		view.clearFilterText();
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = true;
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.dispose();
	});
});
