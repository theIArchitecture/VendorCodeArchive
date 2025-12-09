//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 9: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 11: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 19: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ILanguagePackItem } from '../../../../platform/languagePacks/common/languagePacks.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 25: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 27: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 33: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 41: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 47: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 49: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 53: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 55: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 63: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 63: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 67: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 69: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 75: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 89: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 91: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 95: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 109: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 111: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 117: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 119: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 119: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 131: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 133: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 137: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 139: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 147: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 147: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 151: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 153: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 153: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 159: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 161: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 161: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 165: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 173: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 175: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 179: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 181: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 181: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 187: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 193: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 195: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 195: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 201: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 203: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 207: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 209: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 215: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 217: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 217: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 221: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 229: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 231: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 231: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 237: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 237: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 245: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 249: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 251: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 259: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 259: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 263: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 265: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 271: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 277: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 279: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 279: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 285: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 291: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 293: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 305: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 313: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 315: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 315: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 319: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 321: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 321: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 327: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 333: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 335: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 335: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 341: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 347: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 355: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 361: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 363: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 363: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 369: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 375: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 377: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 383: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 385: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 385: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 389: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 391: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 391: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 397: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 399: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 399: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 403: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 405: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 411: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILocaleService = createDecorator<ILocaleService>('localizationService');

export interface ILocaleService {
	readonly _serviceBrand: undefined;
	setLocale(languagePackItem: ILanguagePackItem, skipDialog?: boolean): Promise<void>;
	clearLocalePreference(): Promise<void>;
}

export const IActiveLanguagePackService = createDecorator<IActiveLanguagePackService>('activeLanguageService');

export interface IActiveLanguagePackService {
	readonly _serviceBrand: undefined;
	getExtensionIdProvidingCurrentLocale(): Promise<string | undefined>;
}
