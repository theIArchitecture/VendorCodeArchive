//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 23: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 37: Error message without production error code - breaks React bundle size optimization
//   9. Line 37: Error message without production error code - breaks React bundle size optimization
//   10. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 44: Error message without production error code - breaks React bundle size optimization
//   12. Line 44: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 45: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 59: Error message without production error code - breaks React bundle size optimization
//   9. Line 59: Error message without production error code - breaks React bundle size optimization
//   10. Line 63: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 66: Error message without production error code - breaks React bundle size optimization
//   12. Line 66: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 53: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 54: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 65: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 75: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 79: Error message without production error code - breaks React bundle size optimization
//   9. Line 79: Error message without production error code - breaks React bundle size optimization
//   10. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 86: Error message without production error code - breaks React bundle size optimization
//   12. Line 86: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 73: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 85: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 85: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 95: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 99: Error message without production error code - breaks React bundle size optimization
//   9. Line 99: Error message without production error code - breaks React bundle size optimization
//   10. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 106: Error message without production error code - breaks React bundle size optimization
//   12. Line 106: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 93: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 115: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 119: Error message without production error code - breaks React bundle size optimization
//   9. Line 119: Error message without production error code - breaks React bundle size optimization
//   10. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 126: Error message without production error code - breaks React bundle size optimization
//   12. Line 126: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 113: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 117: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 117: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 135: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 139: Error message without production error code - breaks React bundle size optimization
//   9. Line 139: Error message without production error code - breaks React bundle size optimization
//   10. Line 143: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 146: Error message without production error code - breaks React bundle size optimization
//   12. Line 146: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 137: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 137: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 159: Error message without production error code - breaks React bundle size optimization
//   9. Line 159: Error message without production error code - breaks React bundle size optimization
//   10. Line 163: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 166: Error message without production error code - breaks React bundle size optimization
//   12. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 153: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 154: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 157: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 165: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 165: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 179: Error message without production error code - breaks React bundle size optimization
//   9. Line 179: Error message without production error code - breaks React bundle size optimization
//   10. Line 183: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 186: Error message without production error code - breaks React bundle size optimization
//   12. Line 186: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 173: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 174: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 177: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 185: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 195: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 199: Error message without production error code - breaks React bundle size optimization
//   9. Line 199: Error message without production error code - breaks React bundle size optimization
//   10. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 206: Error message without production error code - breaks React bundle size optimization
//   12. Line 206: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 193: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 194: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 205: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 205: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 215: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 219: Error message without production error code - breaks React bundle size optimization
//   9. Line 219: Error message without production error code - breaks React bundle size optimization
//   10. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 226: Error message without production error code - breaks React bundle size optimization
//   12. Line 226: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 213: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 214: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 217: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 217: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 225: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 225: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 239: Error message without production error code - breaks React bundle size optimization
//   9. Line 239: Error message without production error code - breaks React bundle size optimization
//   10. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 246: Error message without production error code - breaks React bundle size optimization
//   12. Line 246: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 237: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 237: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 255: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 259: Error message without production error code - breaks React bundle size optimization
//   9. Line 259: Error message without production error code - breaks React bundle size optimization
//   10. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 266: Error message without production error code - breaks React bundle size optimization
//   12. Line 266: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 253: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 275: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 279: Error message without production error code - breaks React bundle size optimization
//   9. Line 279: Error message without production error code - breaks React bundle size optimization
//   10. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 286: Error message without production error code - breaks React bundle size optimization
//   12. Line 286: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 277: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 277: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 295: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 299: Error message without production error code - breaks React bundle size optimization
//   9. Line 299: Error message without production error code - breaks React bundle size optimization
//   10. Line 303: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 306: Error message without production error code - breaks React bundle size optimization
//   12. Line 306: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 294: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 297: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 297: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 315: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 319: Error message without production error code - breaks React bundle size optimization
//   9. Line 319: Error message without production error code - breaks React bundle size optimization
//   10. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 326: Error message without production error code - breaks React bundle size optimization
//   12. Line 326: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 313: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 314: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 317: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 325: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 325: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 335: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 339: Error message without production error code - breaks React bundle size optimization
//   9. Line 339: Error message without production error code - breaks React bundle size optimization
//   10. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 346: Error message without production error code - breaks React bundle size optimization
//   12. Line 346: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 333: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 337: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 337: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 345: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 345: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 355: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 359: Error message without production error code - breaks React bundle size optimization
//   9. Line 359: Error message without production error code - breaks React bundle size optimization
//   10. Line 363: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 366: Error message without production error code - breaks React bundle size optimization
//   12. Line 366: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 353: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 354: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 365: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 365: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 375: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 379: Error message without production error code - breaks React bundle size optimization
//   9. Line 379: Error message without production error code - breaks React bundle size optimization
//   10. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 386: Error message without production error code - breaks React bundle size optimization
//   12. Line 386: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 373: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 385: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 385: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 395: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 399: Error message without production error code - breaks React bundle size optimization
//   9. Line 399: Error message without production error code - breaks React bundle size optimization
//   10. Line 403: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 406: Error message without production error code - breaks React bundle size optimization
//   12. Line 406: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 393: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 394: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 397: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 397: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 415: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 419: Error message without production error code - breaks React bundle size optimization
//   9. Line 419: Error message without production error code - breaks React bundle size optimization
//   10. Line 423: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 426: Error message without production error code - breaks React bundle size optimization
//   12. Line 426: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 417: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 417: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 425: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 425: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 435: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 439: Error message without production error code - breaks React bundle size optimization
//   9. Line 439: Error message without production error code - breaks React bundle size optimization
//   10. Line 443: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 446: Error message without production error code - breaks React bundle size optimization
//   12. Line 446: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 433: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 434: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 445: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 445: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 455: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 459: Error message without production error code - breaks React bundle size optimization
//   9. Line 459: Error message without production error code - breaks React bundle size optimization
//   10. Line 463: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 466: Error message without production error code - breaks React bundle size optimization
//   12. Line 466: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 453: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 454: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 457: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 457: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 465: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 465: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 475: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 479: Error message without production error code - breaks React bundle size optimization
//   9. Line 479: Error message without production error code - breaks React bundle size optimization
//   10. Line 483: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 486: Error message without production error code - breaks React bundle size optimization
//   12. Line 486: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 473: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 474: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 477: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 477: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 485: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 485: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 495: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 499: Error message without production error code - breaks React bundle size optimization
//   9. Line 499: Error message without production error code - breaks React bundle size optimization
//   10. Line 503: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 506: Error message without production error code - breaks React bundle size optimization
//   12. Line 506: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 493: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 494: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 497: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 497: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 505: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 505: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 515: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 519: Error message without production error code - breaks React bundle size optimization
//   9. Line 519: Error message without production error code - breaks React bundle size optimization
//   10. Line 523: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 526: Error message without production error code - breaks React bundle size optimization
//   12. Line 526: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 513: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 514: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 517: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 517: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 525: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 525: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 535: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 539: Error message without production error code - breaks React bundle size optimization
//   9. Line 539: Error message without production error code - breaks React bundle size optimization
//   10. Line 543: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 546: Error message without production error code - breaks React bundle size optimization
//   12. Line 546: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 533: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 534: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 537: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 537: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 545: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 545: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 555: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 559: Error message without production error code - breaks React bundle size optimization
//   9. Line 559: Error message without production error code - breaks React bundle size optimization
//   10. Line 563: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 566: Error message without production error code - breaks React bundle size optimization
//   12. Line 566: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 553: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 554: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 557: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 557: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 565: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 565: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 575: Missing service brand declaration - breaks VSCode's DI system type safety
//   8. Line 579: Error message without production error code - breaks React bundle size optimization
//   9. Line 579: Error message without production error code - breaks React bundle size optimization
//   10. Line 583: Missing service brand declaration - breaks VSCode's DI system type safety
//   11. Line 586: Error message without production error code - breaks React bundle size optimization
//   12. Line 586: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWebContentExtractorService = createDecorator<IWebContentExtractorService>('IWebContentExtractorService');
export const ISharedWebContentExtractorService = createDecorator<ISharedWebContentExtractorService>('ISharedWebContentExtractorService');


export interface IWebContentExtractorService {
	_serviceBrand: undefined;
	extract(uri: URI[]): Promise<string[]>;
}

/*
 * A service that extracts image content from a given arbitrary URI. This is done in the shared process to avoid running non trusted application code in the main process.
 */
export interface ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(uri: URI, token: CancellationToken): Promise<VSBuffer | undefined>;
}

/**
 * A service that extracts web content from a given URI.
 * This is a placeholder implementation that does not perform any actual extraction.
 * It's intended to be used on platforms where web content extraction is not supported such as in the browser.
 */
export class NullWebContentExtractorService implements IWebContentExtractorService {
	_serviceBrand: undefined;

	extract(_uri: URI[]): Promise<string[]> {
		throw new Error('Not implemented');
	}
}

export class NullSharedWebContentExtractorService implements ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(_uri: URI, _token: CancellationToken): Promise<VSBuffer | undefined> {
		throw new Error('Not implemented');
	}
}
