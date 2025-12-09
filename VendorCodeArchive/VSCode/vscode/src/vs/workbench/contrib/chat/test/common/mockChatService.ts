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

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 322: Error message without production error code - breaks React bundle size optimization
//   3. Line 322: Error message without production error code - breaks React bundle size optimization
//   4. Line 325: Error message without production error code - breaks React bundle size optimization
//   5. Line 325: Error message without production error code - breaks React bundle size optimization
//   6. Line 328: Error message without production error code - breaks React bundle size optimization
//   7. Line 328: Error message without production error code - breaks React bundle size optimization
//   8. Line 331: Error message without production error code - breaks React bundle size optimization
//   9. Line 331: Error message without production error code - breaks React bundle size optimization
//   10. Line 341: Error message without production error code - breaks React bundle size optimization
//   11. Line 341: Error message without production error code - breaks React bundle size optimization
//   12. Line 344: Error message without production error code - breaks React bundle size optimization
//   13. Line 344: Error message without production error code - breaks React bundle size optimization
//   14. Line 347: Error message without production error code - breaks React bundle size optimization
//   15. Line 347: Error message without production error code - breaks React bundle size optimization
//   16. Line 353: Error message without production error code - breaks React bundle size optimization
//   17. Line 353: Error message without production error code - breaks React bundle size optimization
//   18. Line 356: Error message without production error code - breaks React bundle size optimization
//   19. Line 356: Error message without production error code - breaks React bundle size optimization
//   20. Line 359: Error message without production error code - breaks React bundle size optimization
//   21. Line 359: Error message without production error code - breaks React bundle size optimization
//   22. Line 362: Error message without production error code - breaks React bundle size optimization
//   23. Line 362: Error message without production error code - breaks React bundle size optimization
//   24. Line 365: Error message without production error code - breaks React bundle size optimization
//   25. Line 365: Error message without production error code - breaks React bundle size optimization
//   26. Line 368: Error message without production error code - breaks React bundle size optimization
//   27. Line 368: Error message without production error code - breaks React bundle size optimization
//   28. Line 371: Error message without production error code - breaks React bundle size optimization
//   29. Line 371: Error message without production error code - breaks React bundle size optimization
//   30. Line 374: Error message without production error code - breaks React bundle size optimization
//   31. Line 374: Error message without production error code - breaks React bundle size optimization
//   32. Line 377: Error message without production error code - breaks React bundle size optimization
//   33. Line 377: Error message without production error code - breaks React bundle size optimization
//   34. Line 380: Error message without production error code - breaks React bundle size optimization
//   35. Line 380: Error message without production error code - breaks React bundle size optimization
//   36. Line 385: Error message without production error code - breaks React bundle size optimization
//   37. Line 385: Error message without production error code - breaks React bundle size optimization
//   38. Line 390: Error message without production error code - breaks React bundle size optimization
//   39. Line 390: Error message without production error code - breaks React bundle size optimization
//   40. Line 394: Error message without production error code - breaks React bundle size optimization
//   41. Line 394: Error message without production error code - breaks React bundle size optimization
//   42. Line 398: Error message without production error code - breaks React bundle size optimization
//   43. Line 398: Error message without production error code - breaks React bundle size optimization
//   44. Line 402: Error message without production error code - breaks React bundle size optimization
//   45. Line 402: Error message without production error code - breaks React bundle size optimization
//   46. Line 406: Error message without production error code - breaks React bundle size optimization
//   47. Line 406: Error message without production error code - breaks React bundle size optimization
//   48. Line 410: Error message without production error code - breaks React bundle size optimization
//   49. Line 410: Error message without production error code - breaks React bundle size optimization
//   50. Line 414: Error message without production error code - breaks React bundle size optimization
//   51. Line 414: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 381: Error message without production error code - breaks React bundle size optimization
//   3. Line 381: Error message without production error code - breaks React bundle size optimization
//   4. Line 384: Error message without production error code - breaks React bundle size optimization
//   5. Line 384: Error message without production error code - breaks React bundle size optimization
//   6. Line 387: Error message without production error code - breaks React bundle size optimization
//   7. Line 387: Error message without production error code - breaks React bundle size optimization
//   8. Line 390: Error message without production error code - breaks React bundle size optimization
//   9. Line 390: Error message without production error code - breaks React bundle size optimization
//   10. Line 400: Error message without production error code - breaks React bundle size optimization
//   11. Line 400: Error message without production error code - breaks React bundle size optimization
//   12. Line 403: Error message without production error code - breaks React bundle size optimization
//   13. Line 403: Error message without production error code - breaks React bundle size optimization
//   14. Line 406: Error message without production error code - breaks React bundle size optimization
//   15. Line 406: Error message without production error code - breaks React bundle size optimization
//   16. Line 412: Error message without production error code - breaks React bundle size optimization
//   17. Line 412: Error message without production error code - breaks React bundle size optimization
//   18. Line 415: Error message without production error code - breaks React bundle size optimization
//   19. Line 415: Error message without production error code - breaks React bundle size optimization
//   20. Line 418: Error message without production error code - breaks React bundle size optimization
//   21. Line 418: Error message without production error code - breaks React bundle size optimization
//   22. Line 421: Error message without production error code - breaks React bundle size optimization
//   23. Line 421: Error message without production error code - breaks React bundle size optimization
//   24. Line 424: Error message without production error code - breaks React bundle size optimization
//   25. Line 424: Error message without production error code - breaks React bundle size optimization
//   26. Line 427: Error message without production error code - breaks React bundle size optimization
//   27. Line 427: Error message without production error code - breaks React bundle size optimization
//   28. Line 430: Error message without production error code - breaks React bundle size optimization
//   29. Line 430: Error message without production error code - breaks React bundle size optimization
//   30. Line 433: Error message without production error code - breaks React bundle size optimization
//   31. Line 433: Error message without production error code - breaks React bundle size optimization
//   32. Line 436: Error message without production error code - breaks React bundle size optimization
//   33. Line 436: Error message without production error code - breaks React bundle size optimization
//   34. Line 439: Error message without production error code - breaks React bundle size optimization
//   35. Line 439: Error message without production error code - breaks React bundle size optimization
//   36. Line 444: Error message without production error code - breaks React bundle size optimization
//   37. Line 444: Error message without production error code - breaks React bundle size optimization
//   38. Line 449: Error message without production error code - breaks React bundle size optimization
//   39. Line 449: Error message without production error code - breaks React bundle size optimization
//   40. Line 453: Error message without production error code - breaks React bundle size optimization
//   41. Line 453: Error message without production error code - breaks React bundle size optimization
//   42. Line 457: Error message without production error code - breaks React bundle size optimization
//   43. Line 457: Error message without production error code - breaks React bundle size optimization
//   44. Line 461: Error message without production error code - breaks React bundle size optimization
//   45. Line 461: Error message without production error code - breaks React bundle size optimization
//   46. Line 465: Error message without production error code - breaks React bundle size optimization
//   47. Line 465: Error message without production error code - breaks React bundle size optimization
//   48. Line 469: Error message without production error code - breaks React bundle size optimization
//   49. Line 469: Error message without production error code - breaks React bundle size optimization
//   50. Line 473: Error message without production error code - breaks React bundle size optimization
//   51. Line 473: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 430: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 440: Error message without production error code - breaks React bundle size optimization
//   3. Line 440: Error message without production error code - breaks React bundle size optimization
//   4. Line 443: Error message without production error code - breaks React bundle size optimization
//   5. Line 443: Error message without production error code - breaks React bundle size optimization
//   6. Line 446: Error message without production error code - breaks React bundle size optimization
//   7. Line 446: Error message without production error code - breaks React bundle size optimization
//   8. Line 449: Error message without production error code - breaks React bundle size optimization
//   9. Line 449: Error message without production error code - breaks React bundle size optimization
//   10. Line 459: Error message without production error code - breaks React bundle size optimization
//   11. Line 459: Error message without production error code - breaks React bundle size optimization
//   12. Line 462: Error message without production error code - breaks React bundle size optimization
//   13. Line 462: Error message without production error code - breaks React bundle size optimization
//   14. Line 465: Error message without production error code - breaks React bundle size optimization
//   15. Line 465: Error message without production error code - breaks React bundle size optimization
//   16. Line 471: Error message without production error code - breaks React bundle size optimization
//   17. Line 471: Error message without production error code - breaks React bundle size optimization
//   18. Line 474: Error message without production error code - breaks React bundle size optimization
//   19. Line 474: Error message without production error code - breaks React bundle size optimization
//   20. Line 477: Error message without production error code - breaks React bundle size optimization
//   21. Line 477: Error message without production error code - breaks React bundle size optimization
//   22. Line 480: Error message without production error code - breaks React bundle size optimization
//   23. Line 480: Error message without production error code - breaks React bundle size optimization
//   24. Line 483: Error message without production error code - breaks React bundle size optimization
//   25. Line 483: Error message without production error code - breaks React bundle size optimization
//   26. Line 486: Error message without production error code - breaks React bundle size optimization
//   27. Line 486: Error message without production error code - breaks React bundle size optimization
//   28. Line 489: Error message without production error code - breaks React bundle size optimization
//   29. Line 489: Error message without production error code - breaks React bundle size optimization
//   30. Line 492: Error message without production error code - breaks React bundle size optimization
//   31. Line 492: Error message without production error code - breaks React bundle size optimization
//   32. Line 495: Error message without production error code - breaks React bundle size optimization
//   33. Line 495: Error message without production error code - breaks React bundle size optimization
//   34. Line 498: Error message without production error code - breaks React bundle size optimization
//   35. Line 498: Error message without production error code - breaks React bundle size optimization
//   36. Line 503: Error message without production error code - breaks React bundle size optimization
//   37. Line 503: Error message without production error code - breaks React bundle size optimization
//   38. Line 508: Error message without production error code - breaks React bundle size optimization
//   39. Line 508: Error message without production error code - breaks React bundle size optimization
//   40. Line 512: Error message without production error code - breaks React bundle size optimization
//   41. Line 512: Error message without production error code - breaks React bundle size optimization
//   42. Line 516: Error message without production error code - breaks React bundle size optimization
//   43. Line 516: Error message without production error code - breaks React bundle size optimization
//   44. Line 520: Error message without production error code - breaks React bundle size optimization
//   45. Line 520: Error message without production error code - breaks React bundle size optimization
//   46. Line 524: Error message without production error code - breaks React bundle size optimization
//   47. Line 524: Error message without production error code - breaks React bundle size optimization
//   48. Line 528: Error message without production error code - breaks React bundle size optimization
//   49. Line 528: Error message without production error code - breaks React bundle size optimization
//   50. Line 532: Error message without production error code - breaks React bundle size optimization
//   51. Line 532: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 489: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 499: Error message without production error code - breaks React bundle size optimization
//   3. Line 499: Error message without production error code - breaks React bundle size optimization
//   4. Line 502: Error message without production error code - breaks React bundle size optimization
//   5. Line 502: Error message without production error code - breaks React bundle size optimization
//   6. Line 505: Error message without production error code - breaks React bundle size optimization
//   7. Line 505: Error message without production error code - breaks React bundle size optimization
//   8. Line 508: Error message without production error code - breaks React bundle size optimization
//   9. Line 508: Error message without production error code - breaks React bundle size optimization
//   10. Line 518: Error message without production error code - breaks React bundle size optimization
//   11. Line 518: Error message without production error code - breaks React bundle size optimization
//   12. Line 521: Error message without production error code - breaks React bundle size optimization
//   13. Line 521: Error message without production error code - breaks React bundle size optimization
//   14. Line 524: Error message without production error code - breaks React bundle size optimization
//   15. Line 524: Error message without production error code - breaks React bundle size optimization
//   16. Line 530: Error message without production error code - breaks React bundle size optimization
//   17. Line 530: Error message without production error code - breaks React bundle size optimization
//   18. Line 533: Error message without production error code - breaks React bundle size optimization
//   19. Line 533: Error message without production error code - breaks React bundle size optimization
//   20. Line 536: Error message without production error code - breaks React bundle size optimization
//   21. Line 536: Error message without production error code - breaks React bundle size optimization
//   22. Line 539: Error message without production error code - breaks React bundle size optimization
//   23. Line 539: Error message without production error code - breaks React bundle size optimization
//   24. Line 542: Error message without production error code - breaks React bundle size optimization
//   25. Line 542: Error message without production error code - breaks React bundle size optimization
//   26. Line 545: Error message without production error code - breaks React bundle size optimization
//   27. Line 545: Error message without production error code - breaks React bundle size optimization
//   28. Line 548: Error message without production error code - breaks React bundle size optimization
//   29. Line 548: Error message without production error code - breaks React bundle size optimization
//   30. Line 551: Error message without production error code - breaks React bundle size optimization
//   31. Line 551: Error message without production error code - breaks React bundle size optimization
//   32. Line 554: Error message without production error code - breaks React bundle size optimization
//   33. Line 554: Error message without production error code - breaks React bundle size optimization
//   34. Line 557: Error message without production error code - breaks React bundle size optimization
//   35. Line 557: Error message without production error code - breaks React bundle size optimization
//   36. Line 562: Error message without production error code - breaks React bundle size optimization
//   37. Line 562: Error message without production error code - breaks React bundle size optimization
//   38. Line 567: Error message without production error code - breaks React bundle size optimization
//   39. Line 567: Error message without production error code - breaks React bundle size optimization
//   40. Line 571: Error message without production error code - breaks React bundle size optimization
//   41. Line 571: Error message without production error code - breaks React bundle size optimization
//   42. Line 575: Error message without production error code - breaks React bundle size optimization
//   43. Line 575: Error message without production error code - breaks React bundle size optimization
//   44. Line 579: Error message without production error code - breaks React bundle size optimization
//   45. Line 579: Error message without production error code - breaks React bundle size optimization
//   46. Line 583: Error message without production error code - breaks React bundle size optimization
//   47. Line 583: Error message without production error code - breaks React bundle size optimization
//   48. Line 587: Error message without production error code - breaks React bundle size optimization
//   49. Line 587: Error message without production error code - breaks React bundle size optimization
//   50. Line 591: Error message without production error code - breaks React bundle size optimization
//   51. Line 591: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 548: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 558: Error message without production error code - breaks React bundle size optimization
//   3. Line 558: Error message without production error code - breaks React bundle size optimization
//   4. Line 561: Error message without production error code - breaks React bundle size optimization
//   5. Line 561: Error message without production error code - breaks React bundle size optimization
//   6. Line 564: Error message without production error code - breaks React bundle size optimization
//   7. Line 564: Error message without production error code - breaks React bundle size optimization
//   8. Line 567: Error message without production error code - breaks React bundle size optimization
//   9. Line 567: Error message without production error code - breaks React bundle size optimization
//   10. Line 577: Error message without production error code - breaks React bundle size optimization
//   11. Line 577: Error message without production error code - breaks React bundle size optimization
//   12. Line 580: Error message without production error code - breaks React bundle size optimization
//   13. Line 580: Error message without production error code - breaks React bundle size optimization
//   14. Line 583: Error message without production error code - breaks React bundle size optimization
//   15. Line 583: Error message without production error code - breaks React bundle size optimization
//   16. Line 589: Error message without production error code - breaks React bundle size optimization
//   17. Line 589: Error message without production error code - breaks React bundle size optimization
//   18. Line 592: Error message without production error code - breaks React bundle size optimization
//   19. Line 592: Error message without production error code - breaks React bundle size optimization
//   20. Line 595: Error message without production error code - breaks React bundle size optimization
//   21. Line 595: Error message without production error code - breaks React bundle size optimization
//   22. Line 598: Error message without production error code - breaks React bundle size optimization
//   23. Line 598: Error message without production error code - breaks React bundle size optimization
//   24. Line 601: Error message without production error code - breaks React bundle size optimization
//   25. Line 601: Error message without production error code - breaks React bundle size optimization
//   26. Line 604: Error message without production error code - breaks React bundle size optimization
//   27. Line 604: Error message without production error code - breaks React bundle size optimization
//   28. Line 607: Error message without production error code - breaks React bundle size optimization
//   29. Line 607: Error message without production error code - breaks React bundle size optimization
//   30. Line 610: Error message without production error code - breaks React bundle size optimization
//   31. Line 610: Error message without production error code - breaks React bundle size optimization
//   32. Line 613: Error message without production error code - breaks React bundle size optimization
//   33. Line 613: Error message without production error code - breaks React bundle size optimization
//   34. Line 616: Error message without production error code - breaks React bundle size optimization
//   35. Line 616: Error message without production error code - breaks React bundle size optimization
//   36. Line 621: Error message without production error code - breaks React bundle size optimization
//   37. Line 621: Error message without production error code - breaks React bundle size optimization
//   38. Line 626: Error message without production error code - breaks React bundle size optimization
//   39. Line 626: Error message without production error code - breaks React bundle size optimization
//   40. Line 630: Error message without production error code - breaks React bundle size optimization
//   41. Line 630: Error message without production error code - breaks React bundle size optimization
//   42. Line 634: Error message without production error code - breaks React bundle size optimization
//   43. Line 634: Error message without production error code - breaks React bundle size optimization
//   44. Line 638: Error message without production error code - breaks React bundle size optimization
//   45. Line 638: Error message without production error code - breaks React bundle size optimization
//   46. Line 642: Error message without production error code - breaks React bundle size optimization
//   47. Line 642: Error message without production error code - breaks React bundle size optimization
//   48. Line 646: Error message without production error code - breaks React bundle size optimization
//   49. Line 646: Error message without production error code - breaks React bundle size optimization
//   50. Line 650: Error message without production error code - breaks React bundle size optimization
//   51. Line 650: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 607: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 617: Error message without production error code - breaks React bundle size optimization
//   3. Line 617: Error message without production error code - breaks React bundle size optimization
//   4. Line 620: Error message without production error code - breaks React bundle size optimization
//   5. Line 620: Error message without production error code - breaks React bundle size optimization
//   6. Line 623: Error message without production error code - breaks React bundle size optimization
//   7. Line 623: Error message without production error code - breaks React bundle size optimization
//   8. Line 626: Error message without production error code - breaks React bundle size optimization
//   9. Line 626: Error message without production error code - breaks React bundle size optimization
//   10. Line 636: Error message without production error code - breaks React bundle size optimization
//   11. Line 636: Error message without production error code - breaks React bundle size optimization
//   12. Line 639: Error message without production error code - breaks React bundle size optimization
//   13. Line 639: Error message without production error code - breaks React bundle size optimization
//   14. Line 642: Error message without production error code - breaks React bundle size optimization
//   15. Line 642: Error message without production error code - breaks React bundle size optimization
//   16. Line 648: Error message without production error code - breaks React bundle size optimization
//   17. Line 648: Error message without production error code - breaks React bundle size optimization
//   18. Line 651: Error message without production error code - breaks React bundle size optimization
//   19. Line 651: Error message without production error code - breaks React bundle size optimization
//   20. Line 654: Error message without production error code - breaks React bundle size optimization
//   21. Line 654: Error message without production error code - breaks React bundle size optimization
//   22. Line 657: Error message without production error code - breaks React bundle size optimization
//   23. Line 657: Error message without production error code - breaks React bundle size optimization
//   24. Line 660: Error message without production error code - breaks React bundle size optimization
//   25. Line 660: Error message without production error code - breaks React bundle size optimization
//   26. Line 663: Error message without production error code - breaks React bundle size optimization
//   27. Line 663: Error message without production error code - breaks React bundle size optimization
//   28. Line 666: Error message without production error code - breaks React bundle size optimization
//   29. Line 666: Error message without production error code - breaks React bundle size optimization
//   30. Line 669: Error message without production error code - breaks React bundle size optimization
//   31. Line 669: Error message without production error code - breaks React bundle size optimization
//   32. Line 672: Error message without production error code - breaks React bundle size optimization
//   33. Line 672: Error message without production error code - breaks React bundle size optimization
//   34. Line 675: Error message without production error code - breaks React bundle size optimization
//   35. Line 675: Error message without production error code - breaks React bundle size optimization
//   36. Line 680: Error message without production error code - breaks React bundle size optimization
//   37. Line 680: Error message without production error code - breaks React bundle size optimization
//   38. Line 685: Error message without production error code - breaks React bundle size optimization
//   39. Line 685: Error message without production error code - breaks React bundle size optimization
//   40. Line 689: Error message without production error code - breaks React bundle size optimization
//   41. Line 689: Error message without production error code - breaks React bundle size optimization
//   42. Line 693: Error message without production error code - breaks React bundle size optimization
//   43. Line 693: Error message without production error code - breaks React bundle size optimization
//   44. Line 697: Error message without production error code - breaks React bundle size optimization
//   45. Line 697: Error message without production error code - breaks React bundle size optimization
//   46. Line 701: Error message without production error code - breaks React bundle size optimization
//   47. Line 701: Error message without production error code - breaks React bundle size optimization
//   48. Line 705: Error message without production error code - breaks React bundle size optimization
//   49. Line 705: Error message without production error code - breaks React bundle size optimization
//   50. Line 709: Error message without production error code - breaks React bundle size optimization
//   51. Line 709: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 666: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 676: Error message without production error code - breaks React bundle size optimization
//   3. Line 676: Error message without production error code - breaks React bundle size optimization
//   4. Line 679: Error message without production error code - breaks React bundle size optimization
//   5. Line 679: Error message without production error code - breaks React bundle size optimization
//   6. Line 682: Error message without production error code - breaks React bundle size optimization
//   7. Line 682: Error message without production error code - breaks React bundle size optimization
//   8. Line 685: Error message without production error code - breaks React bundle size optimization
//   9. Line 685: Error message without production error code - breaks React bundle size optimization
//   10. Line 695: Error message without production error code - breaks React bundle size optimization
//   11. Line 695: Error message without production error code - breaks React bundle size optimization
//   12. Line 698: Error message without production error code - breaks React bundle size optimization
//   13. Line 698: Error message without production error code - breaks React bundle size optimization
//   14. Line 701: Error message without production error code - breaks React bundle size optimization
//   15. Line 701: Error message without production error code - breaks React bundle size optimization
//   16. Line 707: Error message without production error code - breaks React bundle size optimization
//   17. Line 707: Error message without production error code - breaks React bundle size optimization
//   18. Line 710: Error message without production error code - breaks React bundle size optimization
//   19. Line 710: Error message without production error code - breaks React bundle size optimization
//   20. Line 713: Error message without production error code - breaks React bundle size optimization
//   21. Line 713: Error message without production error code - breaks React bundle size optimization
//   22. Line 716: Error message without production error code - breaks React bundle size optimization
//   23. Line 716: Error message without production error code - breaks React bundle size optimization
//   24. Line 719: Error message without production error code - breaks React bundle size optimization
//   25. Line 719: Error message without production error code - breaks React bundle size optimization
//   26. Line 722: Error message without production error code - breaks React bundle size optimization
//   27. Line 722: Error message without production error code - breaks React bundle size optimization
//   28. Line 725: Error message without production error code - breaks React bundle size optimization
//   29. Line 725: Error message without production error code - breaks React bundle size optimization
//   30. Line 728: Error message without production error code - breaks React bundle size optimization
//   31. Line 728: Error message without production error code - breaks React bundle size optimization
//   32. Line 731: Error message without production error code - breaks React bundle size optimization
//   33. Line 731: Error message without production error code - breaks React bundle size optimization
//   34. Line 734: Error message without production error code - breaks React bundle size optimization
//   35. Line 734: Error message without production error code - breaks React bundle size optimization
//   36. Line 739: Error message without production error code - breaks React bundle size optimization
//   37. Line 739: Error message without production error code - breaks React bundle size optimization
//   38. Line 744: Error message without production error code - breaks React bundle size optimization
//   39. Line 744: Error message without production error code - breaks React bundle size optimization
//   40. Line 748: Error message without production error code - breaks React bundle size optimization
//   41. Line 748: Error message without production error code - breaks React bundle size optimization
//   42. Line 752: Error message without production error code - breaks React bundle size optimization
//   43. Line 752: Error message without production error code - breaks React bundle size optimization
//   44. Line 756: Error message without production error code - breaks React bundle size optimization
//   45. Line 756: Error message without production error code - breaks React bundle size optimization
//   46. Line 760: Error message without production error code - breaks React bundle size optimization
//   47. Line 760: Error message without production error code - breaks React bundle size optimization
//   48. Line 764: Error message without production error code - breaks React bundle size optimization
//   49. Line 764: Error message without production error code - breaks React bundle size optimization
//   50. Line 768: Error message without production error code - breaks React bundle size optimization
//   51. Line 768: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 725: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 735: Error message without production error code - breaks React bundle size optimization
//   3. Line 735: Error message without production error code - breaks React bundle size optimization
//   4. Line 738: Error message without production error code - breaks React bundle size optimization
//   5. Line 738: Error message without production error code - breaks React bundle size optimization
//   6. Line 741: Error message without production error code - breaks React bundle size optimization
//   7. Line 741: Error message without production error code - breaks React bundle size optimization
//   8. Line 744: Error message without production error code - breaks React bundle size optimization
//   9. Line 744: Error message without production error code - breaks React bundle size optimization
//   10. Line 754: Error message without production error code - breaks React bundle size optimization
//   11. Line 754: Error message without production error code - breaks React bundle size optimization
//   12. Line 757: Error message without production error code - breaks React bundle size optimization
//   13. Line 757: Error message without production error code - breaks React bundle size optimization
//   14. Line 760: Error message without production error code - breaks React bundle size optimization
//   15. Line 760: Error message without production error code - breaks React bundle size optimization
//   16. Line 766: Error message without production error code - breaks React bundle size optimization
//   17. Line 766: Error message without production error code - breaks React bundle size optimization
//   18. Line 769: Error message without production error code - breaks React bundle size optimization
//   19. Line 769: Error message without production error code - breaks React bundle size optimization
//   20. Line 772: Error message without production error code - breaks React bundle size optimization
//   21. Line 772: Error message without production error code - breaks React bundle size optimization
//   22. Line 775: Error message without production error code - breaks React bundle size optimization
//   23. Line 775: Error message without production error code - breaks React bundle size optimization
//   24. Line 778: Error message without production error code - breaks React bundle size optimization
//   25. Line 778: Error message without production error code - breaks React bundle size optimization
//   26. Line 781: Error message without production error code - breaks React bundle size optimization
//   27. Line 781: Error message without production error code - breaks React bundle size optimization
//   28. Line 784: Error message without production error code - breaks React bundle size optimization
//   29. Line 784: Error message without production error code - breaks React bundle size optimization
//   30. Line 787: Error message without production error code - breaks React bundle size optimization
//   31. Line 787: Error message without production error code - breaks React bundle size optimization
//   32. Line 790: Error message without production error code - breaks React bundle size optimization
//   33. Line 790: Error message without production error code - breaks React bundle size optimization
//   34. Line 793: Error message without production error code - breaks React bundle size optimization
//   35. Line 793: Error message without production error code - breaks React bundle size optimization
//   36. Line 798: Error message without production error code - breaks React bundle size optimization
//   37. Line 798: Error message without production error code - breaks React bundle size optimization
//   38. Line 803: Error message without production error code - breaks React bundle size optimization
//   39. Line 803: Error message without production error code - breaks React bundle size optimization
//   40. Line 807: Error message without production error code - breaks React bundle size optimization
//   41. Line 807: Error message without production error code - breaks React bundle size optimization
//   42. Line 811: Error message without production error code - breaks React bundle size optimization
//   43. Line 811: Error message without production error code - breaks React bundle size optimization
//   44. Line 815: Error message without production error code - breaks React bundle size optimization
//   45. Line 815: Error message without production error code - breaks React bundle size optimization
//   46. Line 819: Error message without production error code - breaks React bundle size optimization
//   47. Line 819: Error message without production error code - breaks React bundle size optimization
//   48. Line 823: Error message without production error code - breaks React bundle size optimization
//   49. Line 823: Error message without production error code - breaks React bundle size optimization
//   50. Line 827: Error message without production error code - breaks React bundle size optimization
//   51. Line 827: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (51):
//   1. Line 784: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 794: Error message without production error code - breaks React bundle size optimization
//   3. Line 794: Error message without production error code - breaks React bundle size optimization
//   4. Line 797: Error message without production error code - breaks React bundle size optimization
//   5. Line 797: Error message without production error code - breaks React bundle size optimization
//   6. Line 800: Error message without production error code - breaks React bundle size optimization
//   7. Line 800: Error message without production error code - breaks React bundle size optimization
//   8. Line 803: Error message without production error code - breaks React bundle size optimization
//   9. Line 803: Error message without production error code - breaks React bundle size optimization
//   10. Line 813: Error message without production error code - breaks React bundle size optimization
//   11. Line 813: Error message without production error code - breaks React bundle size optimization
//   12. Line 816: Error message without production error code - breaks React bundle size optimization
//   13. Line 816: Error message without production error code - breaks React bundle size optimization
//   14. Line 819: Error message without production error code - breaks React bundle size optimization
//   15. Line 819: Error message without production error code - breaks React bundle size optimization
//   16. Line 825: Error message without production error code - breaks React bundle size optimization
//   17. Line 825: Error message without production error code - breaks React bundle size optimization
//   18. Line 828: Error message without production error code - breaks React bundle size optimization
//   19. Line 828: Error message without production error code - breaks React bundle size optimization
//   20. Line 831: Error message without production error code - breaks React bundle size optimization
//   21. Line 831: Error message without production error code - breaks React bundle size optimization
//   22. Line 834: Error message without production error code - breaks React bundle size optimization
//   23. Line 834: Error message without production error code - breaks React bundle size optimization
//   24. Line 837: Error message without production error code - breaks React bundle size optimization
//   25. Line 837: Error message without production error code - breaks React bundle size optimization
//   26. Line 840: Error message without production error code - breaks React bundle size optimization
//   27. Line 840: Error message without production error code - breaks React bundle size optimization
//   28. Line 843: Error message without production error code - breaks React bundle size optimization
//   29. Line 843: Error message without production error code - breaks React bundle size optimization
//   30. Line 846: Error message without production error code - breaks React bundle size optimization
//   31. Line 846: Error message without production error code - breaks React bundle size optimization
//   32. Line 849: Error message without production error code - breaks React bundle size optimization
//   33. Line 849: Error message without production error code - breaks React bundle size optimization
//   34. Line 852: Error message without production error code - breaks React bundle size optimization
//   35. Line 852: Error message without production error code - breaks React bundle size optimization
//   36. Line 857: Error message without production error code - breaks React bundle size optimization
//   37. Line 857: Error message without production error code - breaks React bundle size optimization
//   38. Line 862: Error message without production error code - breaks React bundle size optimization
//   39. Line 862: Error message without production error code - breaks React bundle size optimization
//   40. Line 866: Error message without production error code - breaks React bundle size optimization
//   41. Line 866: Error message without production error code - breaks React bundle size optimization
//   42. Line 870: Error message without production error code - breaks React bundle size optimization
//   43. Line 870: Error message without production error code - breaks React bundle size optimization
//   44. Line 874: Error message without production error code - breaks React bundle size optimization
//   45. Line 874: Error message without production error code - breaks React bundle size optimization
//   46. Line 878: Error message without production error code - breaks React bundle size optimization
//   47. Line 878: Error message without production error code - breaks React bundle size optimization
//   48. Line 882: Error message without production error code - breaks React bundle size optimization
//   49. Line 882: Error message without production error code - breaks React bundle size optimization
//   50. Line 886: Error message without production error code - breaks React bundle size optimization
//   51. Line 886: Error message without production error code - breaks React bundle size optimization
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
