//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadMessageService } from '../../browser/mainThreadMessageService.js';
import { IDialogService, IPrompt, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { INotificationService, INotification, NoOpNotification, INotificationHandle, Severity, IPromptChoice, IPromptOptions, IStatusMessageOptions, INotificationSource, INotificationSourceFilter, NotificationsFilter, IStatusHandle } from '../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { mock } from '../../../../base/test/common/mock.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestExtensionService } from '../../../test/common/workbenchTestServices.js';

const emptyCommandService: ICommandService = {
	_serviceBrand: undefined,
	onWillExecuteCommand: () => Disposable.None,
	onDidExecuteCommand: () => Disposable.None,
	executeCommand: (commandId: string, ...args: any[]): Promise<any> => {
		return Promise.resolve(undefined);
	}
};

const emptyNotificationService = new class implements INotificationService {
	declare readonly _serviceBrand: undefined;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
//   3. Line 34: Error message without production error code - breaks React bundle size optimization
//   4. Line 34: Error message without production error code - breaks React bundle size optimization
//   5. Line 37: Error message without production error code - breaks React bundle size optimization
//   6. Line 37: Error message without production error code - breaks React bundle size optimization
//   7. Line 40: Error message without production error code - breaks React bundle size optimization
//   8. Line 40: Error message without production error code - breaks React bundle size optimization
//   9. Line 43: Error message without production error code - breaks React bundle size optimization
//   10. Line 43: Error message without production error code - breaks React bundle size optimization
//   11. Line 49: Error message without production error code - breaks React bundle size optimization
//   12. Line 49: Error message without production error code - breaks React bundle size optimization
//   13. Line 52: Error message without production error code - breaks React bundle size optimization
//   14. Line 52: Error message without production error code - breaks React bundle size optimization
//   15. Line 55: Error message without production error code - breaks React bundle size optimization
//   16. Line 55: Error message without production error code - breaks React bundle size optimization
//   17. Line 58: Error message without production error code - breaks React bundle size optimization
//   18. Line 58: Error message without production error code - breaks React bundle size optimization
//   19. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	onDidChangeFilter: Event<void> = Event.None;
	notify(...args: any[]): never {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 60: Error message without production error code - breaks React bundle size optimization
//   2. Line 60: Error message without production error code - breaks React bundle size optimization
//   3. Line 63: Error message without production error code - breaks React bundle size optimization
//   4. Line 63: Error message without production error code - breaks React bundle size optimization
//   5. Line 66: Error message without production error code - breaks React bundle size optimization
//   6. Line 66: Error message without production error code - breaks React bundle size optimization
//   7. Line 69: Error message without production error code - breaks React bundle size optimization
//   8. Line 69: Error message without production error code - breaks React bundle size optimization
//   9. Line 72: Error message without production error code - breaks React bundle size optimization
//   10. Line 72: Error message without production error code - breaks React bundle size optimization
//   11. Line 78: Error message without production error code - breaks React bundle size optimization
//   12. Line 78: Error message without production error code - breaks React bundle size optimization
//   13. Line 81: Error message without production error code - breaks React bundle size optimization
//   14. Line 81: Error message without production error code - breaks React bundle size optimization
//   15. Line 84: Error message without production error code - breaks React bundle size optimization
//   16. Line 84: Error message without production error code - breaks React bundle size optimization
//   17. Line 87: Error message without production error code - breaks React bundle size optimization
//   18. Line 87: Error message without production error code - breaks React bundle size optimization
//   19. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 87: Error message without production error code - breaks React bundle size optimization
//   2. Line 87: Error message without production error code - breaks React bundle size optimization
//   3. Line 90: Error message without production error code - breaks React bundle size optimization
//   4. Line 90: Error message without production error code - breaks React bundle size optimization
//   5. Line 93: Error message without production error code - breaks React bundle size optimization
//   6. Line 93: Error message without production error code - breaks React bundle size optimization
//   7. Line 96: Error message without production error code - breaks React bundle size optimization
//   8. Line 96: Error message without production error code - breaks React bundle size optimization
//   9. Line 99: Error message without production error code - breaks React bundle size optimization
//   10. Line 99: Error message without production error code - breaks React bundle size optimization
//   11. Line 105: Error message without production error code - breaks React bundle size optimization
//   12. Line 105: Error message without production error code - breaks React bundle size optimization
//   13. Line 108: Error message without production error code - breaks React bundle size optimization
//   14. Line 108: Error message without production error code - breaks React bundle size optimization
//   15. Line 111: Error message without production error code - breaks React bundle size optimization
//   16. Line 111: Error message without production error code - breaks React bundle size optimization
//   17. Line 114: Error message without production error code - breaks React bundle size optimization
//   18. Line 114: Error message without production error code - breaks React bundle size optimization
//   19. Line 118: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 114: Error message without production error code - breaks React bundle size optimization
//   2. Line 114: Error message without production error code - breaks React bundle size optimization
//   3. Line 117: Error message without production error code - breaks React bundle size optimization
//   4. Line 117: Error message without production error code - breaks React bundle size optimization
//   5. Line 120: Error message without production error code - breaks React bundle size optimization
//   6. Line 120: Error message without production error code - breaks React bundle size optimization
//   7. Line 123: Error message without production error code - breaks React bundle size optimization
//   8. Line 123: Error message without production error code - breaks React bundle size optimization
//   9. Line 126: Error message without production error code - breaks React bundle size optimization
//   10. Line 126: Error message without production error code - breaks React bundle size optimization
//   11. Line 132: Error message without production error code - breaks React bundle size optimization
//   12. Line 132: Error message without production error code - breaks React bundle size optimization
//   13. Line 135: Error message without production error code - breaks React bundle size optimization
//   14. Line 135: Error message without production error code - breaks React bundle size optimization
//   15. Line 138: Error message without production error code - breaks React bundle size optimization
//   16. Line 138: Error message without production error code - breaks React bundle size optimization
//   17. Line 141: Error message without production error code - breaks React bundle size optimization
//   18. Line 141: Error message without production error code - breaks React bundle size optimization
//   19. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 144: Error message without production error code - breaks React bundle size optimization
//   4. Line 144: Error message without production error code - breaks React bundle size optimization
//   5. Line 147: Error message without production error code - breaks React bundle size optimization
//   6. Line 147: Error message without production error code - breaks React bundle size optimization
//   7. Line 150: Error message without production error code - breaks React bundle size optimization
//   8. Line 150: Error message without production error code - breaks React bundle size optimization
//   9. Line 153: Error message without production error code - breaks React bundle size optimization
//   10. Line 153: Error message without production error code - breaks React bundle size optimization
//   11. Line 159: Error message without production error code - breaks React bundle size optimization
//   12. Line 159: Error message without production error code - breaks React bundle size optimization
//   13. Line 162: Error message without production error code - breaks React bundle size optimization
//   14. Line 162: Error message without production error code - breaks React bundle size optimization
//   15. Line 165: Error message without production error code - breaks React bundle size optimization
//   16. Line 165: Error message without production error code - breaks React bundle size optimization
//   17. Line 168: Error message without production error code - breaks React bundle size optimization
//   18. Line 168: Error message without production error code - breaks React bundle size optimization
//   19. Line 172: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 168: Error message without production error code - breaks React bundle size optimization
//   2. Line 168: Error message without production error code - breaks React bundle size optimization
//   3. Line 171: Error message without production error code - breaks React bundle size optimization
//   4. Line 171: Error message without production error code - breaks React bundle size optimization
//   5. Line 174: Error message without production error code - breaks React bundle size optimization
//   6. Line 174: Error message without production error code - breaks React bundle size optimization
//   7. Line 177: Error message without production error code - breaks React bundle size optimization
//   8. Line 177: Error message without production error code - breaks React bundle size optimization
//   9. Line 180: Error message without production error code - breaks React bundle size optimization
//   10. Line 180: Error message without production error code - breaks React bundle size optimization
//   11. Line 186: Error message without production error code - breaks React bundle size optimization
//   12. Line 186: Error message without production error code - breaks React bundle size optimization
//   13. Line 189: Error message without production error code - breaks React bundle size optimization
//   14. Line 189: Error message without production error code - breaks React bundle size optimization
//   15. Line 192: Error message without production error code - breaks React bundle size optimization
//   16. Line 192: Error message without production error code - breaks React bundle size optimization
//   17. Line 195: Error message without production error code - breaks React bundle size optimization
//   18. Line 195: Error message without production error code - breaks React bundle size optimization
//   19. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 195: Error message without production error code - breaks React bundle size optimization
//   2. Line 195: Error message without production error code - breaks React bundle size optimization
//   3. Line 198: Error message without production error code - breaks React bundle size optimization
//   4. Line 198: Error message without production error code - breaks React bundle size optimization
//   5. Line 201: Error message without production error code - breaks React bundle size optimization
//   6. Line 201: Error message without production error code - breaks React bundle size optimization
//   7. Line 204: Error message without production error code - breaks React bundle size optimization
//   8. Line 204: Error message without production error code - breaks React bundle size optimization
//   9. Line 207: Error message without production error code - breaks React bundle size optimization
//   10. Line 207: Error message without production error code - breaks React bundle size optimization
//   11. Line 213: Error message without production error code - breaks React bundle size optimization
//   12. Line 213: Error message without production error code - breaks React bundle size optimization
//   13. Line 216: Error message without production error code - breaks React bundle size optimization
//   14. Line 216: Error message without production error code - breaks React bundle size optimization
//   15. Line 219: Error message without production error code - breaks React bundle size optimization
//   16. Line 219: Error message without production error code - breaks React bundle size optimization
//   17. Line 222: Error message without production error code - breaks React bundle size optimization
//   18. Line 222: Error message without production error code - breaks React bundle size optimization
//   19. Line 226: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 222: Error message without production error code - breaks React bundle size optimization
//   2. Line 222: Error message without production error code - breaks React bundle size optimization
//   3. Line 225: Error message without production error code - breaks React bundle size optimization
//   4. Line 225: Error message without production error code - breaks React bundle size optimization
//   5. Line 228: Error message without production error code - breaks React bundle size optimization
//   6. Line 228: Error message without production error code - breaks React bundle size optimization
//   7. Line 231: Error message without production error code - breaks React bundle size optimization
//   8. Line 231: Error message without production error code - breaks React bundle size optimization
//   9. Line 234: Error message without production error code - breaks React bundle size optimization
//   10. Line 234: Error message without production error code - breaks React bundle size optimization
//   11. Line 240: Error message without production error code - breaks React bundle size optimization
//   12. Line 240: Error message without production error code - breaks React bundle size optimization
//   13. Line 243: Error message without production error code - breaks React bundle size optimization
//   14. Line 243: Error message without production error code - breaks React bundle size optimization
//   15. Line 246: Error message without production error code - breaks React bundle size optimization
//   16. Line 246: Error message without production error code - breaks React bundle size optimization
//   17. Line 249: Error message without production error code - breaks React bundle size optimization
//   18. Line 249: Error message without production error code - breaks React bundle size optimization
//   19. Line 253: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 249: Error message without production error code - breaks React bundle size optimization
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
//   3. Line 252: Error message without production error code - breaks React bundle size optimization
//   4. Line 252: Error message without production error code - breaks React bundle size optimization
//   5. Line 255: Error message without production error code - breaks React bundle size optimization
//   6. Line 255: Error message without production error code - breaks React bundle size optimization
//   7. Line 258: Error message without production error code - breaks React bundle size optimization
//   8. Line 258: Error message without production error code - breaks React bundle size optimization
//   9. Line 261: Error message without production error code - breaks React bundle size optimization
//   10. Line 261: Error message without production error code - breaks React bundle size optimization
//   11. Line 267: Error message without production error code - breaks React bundle size optimization
//   12. Line 267: Error message without production error code - breaks React bundle size optimization
//   13. Line 270: Error message without production error code - breaks React bundle size optimization
//   14. Line 270: Error message without production error code - breaks React bundle size optimization
//   15. Line 273: Error message without production error code - breaks React bundle size optimization
//   16. Line 273: Error message without production error code - breaks React bundle size optimization
//   17. Line 276: Error message without production error code - breaks React bundle size optimization
//   18. Line 276: Error message without production error code - breaks React bundle size optimization
//   19. Line 280: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 276: Error message without production error code - breaks React bundle size optimization
//   2. Line 276: Error message without production error code - breaks React bundle size optimization
//   3. Line 279: Error message without production error code - breaks React bundle size optimization
//   4. Line 279: Error message without production error code - breaks React bundle size optimization
//   5. Line 282: Error message without production error code - breaks React bundle size optimization
//   6. Line 282: Error message without production error code - breaks React bundle size optimization
//   7. Line 285: Error message without production error code - breaks React bundle size optimization
//   8. Line 285: Error message without production error code - breaks React bundle size optimization
//   9. Line 288: Error message without production error code - breaks React bundle size optimization
//   10. Line 288: Error message without production error code - breaks React bundle size optimization
//   11. Line 294: Error message without production error code - breaks React bundle size optimization
//   12. Line 294: Error message without production error code - breaks React bundle size optimization
//   13. Line 297: Error message without production error code - breaks React bundle size optimization
//   14. Line 297: Error message without production error code - breaks React bundle size optimization
//   15. Line 300: Error message without production error code - breaks React bundle size optimization
//   16. Line 300: Error message without production error code - breaks React bundle size optimization
//   17. Line 303: Error message without production error code - breaks React bundle size optimization
//   18. Line 303: Error message without production error code - breaks React bundle size optimization
//   19. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 303: Error message without production error code - breaks React bundle size optimization
//   2. Line 303: Error message without production error code - breaks React bundle size optimization
//   3. Line 306: Error message without production error code - breaks React bundle size optimization
//   4. Line 306: Error message without production error code - breaks React bundle size optimization
//   5. Line 309: Error message without production error code - breaks React bundle size optimization
//   6. Line 309: Error message without production error code - breaks React bundle size optimization
//   7. Line 312: Error message without production error code - breaks React bundle size optimization
//   8. Line 312: Error message without production error code - breaks React bundle size optimization
//   9. Line 315: Error message without production error code - breaks React bundle size optimization
//   10. Line 315: Error message without production error code - breaks React bundle size optimization
//   11. Line 321: Error message without production error code - breaks React bundle size optimization
//   12. Line 321: Error message without production error code - breaks React bundle size optimization
//   13. Line 324: Error message without production error code - breaks React bundle size optimization
//   14. Line 324: Error message without production error code - breaks React bundle size optimization
//   15. Line 327: Error message without production error code - breaks React bundle size optimization
//   16. Line 327: Error message without production error code - breaks React bundle size optimization
//   17. Line 330: Error message without production error code - breaks React bundle size optimization
//   18. Line 330: Error message without production error code - breaks React bundle size optimization
//   19. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 330: Error message without production error code - breaks React bundle size optimization
//   2. Line 330: Error message without production error code - breaks React bundle size optimization
//   3. Line 333: Error message without production error code - breaks React bundle size optimization
//   4. Line 333: Error message without production error code - breaks React bundle size optimization
//   5. Line 336: Error message without production error code - breaks React bundle size optimization
//   6. Line 336: Error message without production error code - breaks React bundle size optimization
//   7. Line 339: Error message without production error code - breaks React bundle size optimization
//   8. Line 339: Error message without production error code - breaks React bundle size optimization
//   9. Line 342: Error message without production error code - breaks React bundle size optimization
//   10. Line 342: Error message without production error code - breaks React bundle size optimization
//   11. Line 348: Error message without production error code - breaks React bundle size optimization
//   12. Line 348: Error message without production error code - breaks React bundle size optimization
//   13. Line 351: Error message without production error code - breaks React bundle size optimization
//   14. Line 351: Error message without production error code - breaks React bundle size optimization
//   15. Line 354: Error message without production error code - breaks React bundle size optimization
//   16. Line 354: Error message without production error code - breaks React bundle size optimization
//   17. Line 357: Error message without production error code - breaks React bundle size optimization
//   18. Line 357: Error message without production error code - breaks React bundle size optimization
//   19. Line 361: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 357: Error message without production error code - breaks React bundle size optimization
//   2. Line 357: Error message without production error code - breaks React bundle size optimization
//   3. Line 360: Error message without production error code - breaks React bundle size optimization
//   4. Line 360: Error message without production error code - breaks React bundle size optimization
//   5. Line 363: Error message without production error code - breaks React bundle size optimization
//   6. Line 363: Error message without production error code - breaks React bundle size optimization
//   7. Line 366: Error message without production error code - breaks React bundle size optimization
//   8. Line 366: Error message without production error code - breaks React bundle size optimization
//   9. Line 369: Error message without production error code - breaks React bundle size optimization
//   10. Line 369: Error message without production error code - breaks React bundle size optimization
//   11. Line 375: Error message without production error code - breaks React bundle size optimization
//   12. Line 375: Error message without production error code - breaks React bundle size optimization
//   13. Line 378: Error message without production error code - breaks React bundle size optimization
//   14. Line 378: Error message without production error code - breaks React bundle size optimization
//   15. Line 381: Error message without production error code - breaks React bundle size optimization
//   16. Line 381: Error message without production error code - breaks React bundle size optimization
//   17. Line 384: Error message without production error code - breaks React bundle size optimization
//   18. Line 384: Error message without production error code - breaks React bundle size optimization
//   19. Line 388: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('not implemented');
	}
	info(...args: any[]): never {
		throw new Error('not implemented');
	}
	warn(...args: any[]): never {
		throw new Error('not implemented');
	}
	error(...args: any[]): never {
		throw new Error('not implemented');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('not implemented');
	}
	status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('not implemented');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('not implemented');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('not implemented');
	}
	removeFilter(sourceId: string): void {
		throw new Error('not implemented');
	}
};

class EmptyNotificationService implements INotificationService {
	declare readonly _serviceBrand: undefined;
	filter: boolean = false;
	constructor(private withNotify: (notification: INotification) => void) {
	}

	onDidChangeFilter: Event<void> = Event.None;
	notify(notification: INotification): INotificationHandle {
		this.withNotify(notification);

		return new NoOpNotification();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 75: Error message without production error code - breaks React bundle size optimization
//   2. Line 75: Error message without production error code - breaks React bundle size optimization
//   3. Line 78: Error message without production error code - breaks React bundle size optimization
//   4. Line 78: Error message without production error code - breaks React bundle size optimization
//   5. Line 81: Error message without production error code - breaks React bundle size optimization
//   6. Line 81: Error message without production error code - breaks React bundle size optimization
//   7. Line 84: Error message without production error code - breaks React bundle size optimization
//   8. Line 84: Error message without production error code - breaks React bundle size optimization
//   9. Line 90: Error message without production error code - breaks React bundle size optimization
//   10. Line 90: Error message without production error code - breaks React bundle size optimization
//   11. Line 93: Error message without production error code - breaks React bundle size optimization
//   12. Line 93: Error message without production error code - breaks React bundle size optimization
//   13. Line 96: Error message without production error code - breaks React bundle size optimization
//   14. Line 96: Error message without production error code - breaks React bundle size optimization
//   15. Line 99: Error message without production error code - breaks React bundle size optimization
//   16. Line 99: Error message without production error code - breaks React bundle size optimization
//   17. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}
	info(message: any): void {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 131: Error message without production error code - breaks React bundle size optimization
//   2. Line 131: Error message without production error code - breaks React bundle size optimization
//   3. Line 134: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
//   5. Line 137: Error message without production error code - breaks React bundle size optimization
//   6. Line 137: Error message without production error code - breaks React bundle size optimization
//   7. Line 140: Error message without production error code - breaks React bundle size optimization
//   8. Line 140: Error message without production error code - breaks React bundle size optimization
//   9. Line 146: Error message without production error code - breaks React bundle size optimization
//   10. Line 146: Error message without production error code - breaks React bundle size optimization
//   11. Line 149: Error message without production error code - breaks React bundle size optimization
//   12. Line 149: Error message without production error code - breaks React bundle size optimization
//   13. Line 152: Error message without production error code - breaks React bundle size optimization
//   14. Line 152: Error message without production error code - breaks React bundle size optimization
//   15. Line 155: Error message without production error code - breaks React bundle size optimization
//   16. Line 155: Error message without production error code - breaks React bundle size optimization
//   17. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 185: Error message without production error code - breaks React bundle size optimization
//   2. Line 185: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
//   5. Line 191: Error message without production error code - breaks React bundle size optimization
//   6. Line 191: Error message without production error code - breaks React bundle size optimization
//   7. Line 194: Error message without production error code - breaks React bundle size optimization
//   8. Line 194: Error message without production error code - breaks React bundle size optimization
//   9. Line 200: Error message without production error code - breaks React bundle size optimization
//   10. Line 200: Error message without production error code - breaks React bundle size optimization
//   11. Line 203: Error message without production error code - breaks React bundle size optimization
//   12. Line 203: Error message without production error code - breaks React bundle size optimization
//   13. Line 206: Error message without production error code - breaks React bundle size optimization
//   14. Line 206: Error message without production error code - breaks React bundle size optimization
//   15. Line 209: Error message without production error code - breaks React bundle size optimization
//   16. Line 209: Error message without production error code - breaks React bundle size optimization
//   17. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 239: Error message without production error code - breaks React bundle size optimization
//   2. Line 239: Error message without production error code - breaks React bundle size optimization
//   3. Line 242: Error message without production error code - breaks React bundle size optimization
//   4. Line 242: Error message without production error code - breaks React bundle size optimization
//   5. Line 245: Error message without production error code - breaks React bundle size optimization
//   6. Line 245: Error message without production error code - breaks React bundle size optimization
//   7. Line 248: Error message without production error code - breaks React bundle size optimization
//   8. Line 248: Error message without production error code - breaks React bundle size optimization
//   9. Line 254: Error message without production error code - breaks React bundle size optimization
//   10. Line 254: Error message without production error code - breaks React bundle size optimization
//   11. Line 257: Error message without production error code - breaks React bundle size optimization
//   12. Line 257: Error message without production error code - breaks React bundle size optimization
//   13. Line 260: Error message without production error code - breaks React bundle size optimization
//   14. Line 260: Error message without production error code - breaks React bundle size optimization
//   15. Line 263: Error message without production error code - breaks React bundle size optimization
//   16. Line 263: Error message without production error code - breaks React bundle size optimization
//   17. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 293: Error message without production error code - breaks React bundle size optimization
//   2. Line 293: Error message without production error code - breaks React bundle size optimization
//   3. Line 296: Error message without production error code - breaks React bundle size optimization
//   4. Line 296: Error message without production error code - breaks React bundle size optimization
//   5. Line 299: Error message without production error code - breaks React bundle size optimization
//   6. Line 299: Error message without production error code - breaks React bundle size optimization
//   7. Line 302: Error message without production error code - breaks React bundle size optimization
//   8. Line 302: Error message without production error code - breaks React bundle size optimization
//   9. Line 308: Error message without production error code - breaks React bundle size optimization
//   10. Line 308: Error message without production error code - breaks React bundle size optimization
//   11. Line 311: Error message without production error code - breaks React bundle size optimization
//   12. Line 311: Error message without production error code - breaks React bundle size optimization
//   13. Line 314: Error message without production error code - breaks React bundle size optimization
//   14. Line 314: Error message without production error code - breaks React bundle size optimization
//   15. Line 317: Error message without production error code - breaks React bundle size optimization
//   16. Line 317: Error message without production error code - breaks React bundle size optimization
//   17. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 347: Error message without production error code - breaks React bundle size optimization
//   2. Line 347: Error message without production error code - breaks React bundle size optimization
//   3. Line 350: Error message without production error code - breaks React bundle size optimization
//   4. Line 350: Error message without production error code - breaks React bundle size optimization
//   5. Line 353: Error message without production error code - breaks React bundle size optimization
//   6. Line 353: Error message without production error code - breaks React bundle size optimization
//   7. Line 356: Error message without production error code - breaks React bundle size optimization
//   8. Line 356: Error message without production error code - breaks React bundle size optimization
//   9. Line 362: Error message without production error code - breaks React bundle size optimization
//   10. Line 362: Error message without production error code - breaks React bundle size optimization
//   11. Line 365: Error message without production error code - breaks React bundle size optimization
//   12. Line 365: Error message without production error code - breaks React bundle size optimization
//   13. Line 368: Error message without production error code - breaks React bundle size optimization
//   14. Line 368: Error message without production error code - breaks React bundle size optimization
//   15. Line 371: Error message without production error code - breaks React bundle size optimization
//   16. Line 371: Error message without production error code - breaks React bundle size optimization
//   17. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 401: Error message without production error code - breaks React bundle size optimization
//   2. Line 401: Error message without production error code - breaks React bundle size optimization
//   3. Line 404: Error message without production error code - breaks React bundle size optimization
//   4. Line 404: Error message without production error code - breaks React bundle size optimization
//   5. Line 407: Error message without production error code - breaks React bundle size optimization
//   6. Line 407: Error message without production error code - breaks React bundle size optimization
//   7. Line 410: Error message without production error code - breaks React bundle size optimization
//   8. Line 410: Error message without production error code - breaks React bundle size optimization
//   9. Line 416: Error message without production error code - breaks React bundle size optimization
//   10. Line 416: Error message without production error code - breaks React bundle size optimization
//   11. Line 419: Error message without production error code - breaks React bundle size optimization
//   12. Line 419: Error message without production error code - breaks React bundle size optimization
//   13. Line 422: Error message without production error code - breaks React bundle size optimization
//   14. Line 422: Error message without production error code - breaks React bundle size optimization
//   15. Line 425: Error message without production error code - breaks React bundle size optimization
//   16. Line 425: Error message without production error code - breaks React bundle size optimization
//   17. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 455: Error message without production error code - breaks React bundle size optimization
//   2. Line 455: Error message without production error code - breaks React bundle size optimization
//   3. Line 458: Error message without production error code - breaks React bundle size optimization
//   4. Line 458: Error message without production error code - breaks React bundle size optimization
//   5. Line 461: Error message without production error code - breaks React bundle size optimization
//   6. Line 461: Error message without production error code - breaks React bundle size optimization
//   7. Line 464: Error message without production error code - breaks React bundle size optimization
//   8. Line 464: Error message without production error code - breaks React bundle size optimization
//   9. Line 470: Error message without production error code - breaks React bundle size optimization
//   10. Line 470: Error message without production error code - breaks React bundle size optimization
//   11. Line 473: Error message without production error code - breaks React bundle size optimization
//   12. Line 473: Error message without production error code - breaks React bundle size optimization
//   13. Line 476: Error message without production error code - breaks React bundle size optimization
//   14. Line 476: Error message without production error code - breaks React bundle size optimization
//   15. Line 479: Error message without production error code - breaks React bundle size optimization
//   16. Line 479: Error message without production error code - breaks React bundle size optimization
//   17. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 509: Error message without production error code - breaks React bundle size optimization
//   2. Line 509: Error message without production error code - breaks React bundle size optimization
//   3. Line 512: Error message without production error code - breaks React bundle size optimization
//   4. Line 512: Error message without production error code - breaks React bundle size optimization
//   5. Line 515: Error message without production error code - breaks React bundle size optimization
//   6. Line 515: Error message without production error code - breaks React bundle size optimization
//   7. Line 518: Error message without production error code - breaks React bundle size optimization
//   8. Line 518: Error message without production error code - breaks React bundle size optimization
//   9. Line 524: Error message without production error code - breaks React bundle size optimization
//   10. Line 524: Error message without production error code - breaks React bundle size optimization
//   11. Line 527: Error message without production error code - breaks React bundle size optimization
//   12. Line 527: Error message without production error code - breaks React bundle size optimization
//   13. Line 530: Error message without production error code - breaks React bundle size optimization
//   14. Line 530: Error message without production error code - breaks React bundle size optimization
//   15. Line 533: Error message without production error code - breaks React bundle size optimization
//   16. Line 533: Error message without production error code - breaks React bundle size optimization
//   17. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 563: Error message without production error code - breaks React bundle size optimization
//   2. Line 563: Error message without production error code - breaks React bundle size optimization
//   3. Line 566: Error message without production error code - breaks React bundle size optimization
//   4. Line 566: Error message without production error code - breaks React bundle size optimization
//   5. Line 569: Error message without production error code - breaks React bundle size optimization
//   6. Line 569: Error message without production error code - breaks React bundle size optimization
//   7. Line 572: Error message without production error code - breaks React bundle size optimization
//   8. Line 572: Error message without production error code - breaks React bundle size optimization
//   9. Line 578: Error message without production error code - breaks React bundle size optimization
//   10. Line 578: Error message without production error code - breaks React bundle size optimization
//   11. Line 581: Error message without production error code - breaks React bundle size optimization
//   12. Line 581: Error message without production error code - breaks React bundle size optimization
//   13. Line 584: Error message without production error code - breaks React bundle size optimization
//   14. Line 584: Error message without production error code - breaks React bundle size optimization
//   15. Line 587: Error message without production error code - breaks React bundle size optimization
//   16. Line 587: Error message without production error code - breaks React bundle size optimization
//   17. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 617: Error message without production error code - breaks React bundle size optimization
//   2. Line 617: Error message without production error code - breaks React bundle size optimization
//   3. Line 620: Error message without production error code - breaks React bundle size optimization
//   4. Line 620: Error message without production error code - breaks React bundle size optimization
//   5. Line 623: Error message without production error code - breaks React bundle size optimization
//   6. Line 623: Error message without production error code - breaks React bundle size optimization
//   7. Line 626: Error message without production error code - breaks React bundle size optimization
//   8. Line 626: Error message without production error code - breaks React bundle size optimization
//   9. Line 632: Error message without production error code - breaks React bundle size optimization
//   10. Line 632: Error message without production error code - breaks React bundle size optimization
//   11. Line 635: Error message without production error code - breaks React bundle size optimization
//   12. Line 635: Error message without production error code - breaks React bundle size optimization
//   13. Line 638: Error message without production error code - breaks React bundle size optimization
//   14. Line 638: Error message without production error code - breaks React bundle size optimization
//   15. Line 641: Error message without production error code - breaks React bundle size optimization
//   16. Line 641: Error message without production error code - breaks React bundle size optimization
//   17. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 671: Error message without production error code - breaks React bundle size optimization
//   2. Line 671: Error message without production error code - breaks React bundle size optimization
//   3. Line 674: Error message without production error code - breaks React bundle size optimization
//   4. Line 674: Error message without production error code - breaks React bundle size optimization
//   5. Line 677: Error message without production error code - breaks React bundle size optimization
//   6. Line 677: Error message without production error code - breaks React bundle size optimization
//   7. Line 680: Error message without production error code - breaks React bundle size optimization
//   8. Line 680: Error message without production error code - breaks React bundle size optimization
//   9. Line 686: Error message without production error code - breaks React bundle size optimization
//   10. Line 686: Error message without production error code - breaks React bundle size optimization
//   11. Line 689: Error message without production error code - breaks React bundle size optimization
//   12. Line 689: Error message without production error code - breaks React bundle size optimization
//   13. Line 692: Error message without production error code - breaks React bundle size optimization
//   14. Line 692: Error message without production error code - breaks React bundle size optimization
//   15. Line 695: Error message without production error code - breaks React bundle size optimization
//   16. Line 695: Error message without production error code - breaks React bundle size optimization
//   17. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (19):
//   1. Line 725: Error message without production error code - breaks React bundle size optimization
//   2. Line 725: Error message without production error code - breaks React bundle size optimization
//   3. Line 728: Error message without production error code - breaks React bundle size optimization
//   4. Line 728: Error message without production error code - breaks React bundle size optimization
//   5. Line 731: Error message without production error code - breaks React bundle size optimization
//   6. Line 731: Error message without production error code - breaks React bundle size optimization
//   7. Line 734: Error message without production error code - breaks React bundle size optimization
//   8. Line 734: Error message without production error code - breaks React bundle size optimization
//   9. Line 740: Error message without production error code - breaks React bundle size optimization
//   10. Line 740: Error message without production error code - breaks React bundle size optimization
//   11. Line 743: Error message without production error code - breaks React bundle size optimization
//   12. Line 743: Error message without production error code - breaks React bundle size optimization
//   13. Line 746: Error message without production error code - breaks React bundle size optimization
//   14. Line 746: Error message without production error code - breaks React bundle size optimization
//   15. Line 749: Error message without production error code - breaks React bundle size optimization
//   16. Line 749: Error message without production error code - breaks React bundle size optimization
//   17. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Method not implemented.');
	}
	warn(message: any): void {
		throw new Error('Method not implemented.');
	}
	error(message: any): void {
		throw new Error('Method not implemented.');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('Method not implemented');
	}
	status(message: string, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('Method not implemented.');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('Method not implemented.');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('Method not implemented.');
	}
	removeFilter(sourceId: string): void {
		throw new Error('Method not implemented.');
	}
}

suite('ExtHostMessageService', function () {

	test('propagte handle on select', async function () {

		const service = new MainThreadMessageService(null!, new EmptyNotificationService(notification => {
			assert.strictEqual(notification.actions!.primary!.length, 1);
			queueMicrotask(() => notification.actions!.primary![0].run());
		}), emptyCommandService, new TestDialogService(), new TestExtensionService());

		const handle = await service.$showMessage(1, 'h', {}, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
		assert.strictEqual(handle, 42);

		service.dispose();
	});

	suite('modal', () => {
		test('calls dialog service', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(type, 1);
					assert.strictEqual(message, 'h');
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(buttons!.length, 1);
					assert.strictEqual((cancelButton as IPromptButton<unknown>)!.label, 'Cancel');
					return Promise.resolve({ result: buttons![0].run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});

		test('returns undefined when cancelled', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt(prompt: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					return Promise.resolve({ result: (prompt.cancelButton as IPromptButton<unknown>)!.run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, undefined);

			service.dispose();
		});

		test('hides Cancel button when not needed', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

					assert.strictEqual(buttons!.length, 0);
					assert.ok(cancelButton);
					return Promise.resolve({ result: (cancelButton as IPromptButton<unknown>).run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
