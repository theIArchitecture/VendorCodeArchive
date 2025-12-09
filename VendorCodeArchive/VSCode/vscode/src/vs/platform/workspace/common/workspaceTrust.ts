//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export enum WorkspaceTrustScope {
	Local = 0,
	Remote = 1
}

export interface WorkspaceTrustRequestButton {
	readonly label: string;
	readonly type: 'ContinueWithTrust' | 'ContinueWithoutTrust' | 'Manage' | 'Cancel';
}

export interface WorkspaceTrustRequestOptions {
	readonly buttons?: WorkspaceTrustRequestButton[];
	readonly message?: string;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 42: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 52: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 52: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 64: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 66: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 66: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 70: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 84: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 86: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 86: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 100: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 106: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 108: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 108: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 112: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 120: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 126: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 128: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 128: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 136: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 136: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 140: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 148: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 150: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 150: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 154: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 168: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 170: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 170: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 176: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 182: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 184: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 184: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 192: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 192: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 196: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 198: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 198: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 204: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 206: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 206: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 218: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 220: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 220: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 224: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 226: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 226: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 234: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 238: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 240: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 240: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 246: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 248: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 248: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 252: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 262: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 262: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 266: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 268: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 268: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 276: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 276: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 280: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 282: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 282: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 294: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 304: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 304: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 308: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 318: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 318: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 324: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 324: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 330: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 336: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 346: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 346: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 350: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 352: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 352: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 358: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 360: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 360: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 364: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 366: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 366: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 378: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 380: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 380: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 386: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 388: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 388: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 392: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 394: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 394: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 402: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 402: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 406: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 408: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 408: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 416: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 416: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 420: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 422: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 422: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 428: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 430: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 430: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWorkspaceTrustEnablementService = createDecorator<IWorkspaceTrustEnablementService>('workspaceTrustEnablementService');

export interface IWorkspaceTrustEnablementService {
	readonly _serviceBrand: undefined;

	isWorkspaceTrustEnabled(): boolean;
}

export const IWorkspaceTrustManagementService = createDecorator<IWorkspaceTrustManagementService>('workspaceTrustManagementService');

export interface IWorkspaceTrustManagementService {
	readonly _serviceBrand: undefined;

	onDidChangeTrust: Event<boolean>;
	onDidChangeTrustedFolders: Event<void>;

	readonly workspaceResolved: Promise<void>;
	readonly workspaceTrustInitialized: Promise<void>;
	acceptsOutOfWorkspaceFiles: boolean;

	isWorkspaceTrusted(): boolean;
	isWorkspaceTrustForced(): boolean;

	canSetParentFolderTrust(): boolean;
	setParentFolderTrust(trusted: boolean): Promise<void>;

	canSetWorkspaceTrust(): boolean;
	setWorkspaceTrust(trusted: boolean): Promise<void>;

	getUriTrustInfo(uri: URI): Promise<IWorkspaceTrustUriInfo>;
	setUrisTrust(uri: URI[], trusted: boolean): Promise<void>;

	getTrustedUris(): URI[];
	setTrustedUris(uris: URI[]): Promise<void>;

	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable;
}

export const enum WorkspaceTrustUriResponse {
	Open = 1,
	OpenInNewWindow = 2,
	Cancel = 3
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 70: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 72: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 97: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 99: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 99: Missing service brand declaration - breaks VSCode's DI system type safety
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
//   1. Line 147: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 149: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 149: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 172: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 174: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 174: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 197: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 199: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 222: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 224: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 224: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 247: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 249: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 249: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 272: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 297: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 324: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 324: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 347: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 349: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 374: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 397: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 399: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 399: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 422: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 424: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 424: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 447: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 449: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 472: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 474: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 474: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 497: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 499: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 499: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 522: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 524: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 524: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 547: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 549: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 549: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 572: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 574: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 574: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 597: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 599: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 599: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 622: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 624: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 624: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 647: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 649: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 649: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 672: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 674: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 674: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 697: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 699: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 699: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 722: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 724: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 724: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 747: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 749: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 749: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 772: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 774: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 774: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IWorkspaceTrustRequestService = createDecorator<IWorkspaceTrustRequestService>('workspaceTrustRequestService');

export interface IWorkspaceTrustRequestService {
	readonly _serviceBrand: undefined;

	readonly onDidInitiateOpenFilesTrustRequest: Event<void>;
	readonly onDidInitiateWorkspaceTrustRequest: Event<WorkspaceTrustRequestOptions | undefined>;
	readonly onDidInitiateWorkspaceTrustRequestOnStartup: Event<void>;

	completeOpenFilesTrustRequest(result: WorkspaceTrustUriResponse, saveResponse?: boolean): Promise<void>;
	requestOpenFilesTrust(openFiles: URI[]): Promise<WorkspaceTrustUriResponse>;

	cancelWorkspaceTrustRequest(): void;
	completeWorkspaceTrustRequest(trusted?: boolean): Promise<void>;
	requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean | undefined>;
	requestWorkspaceTrustOnStartup(): void;
}

export interface IWorkspaceTrustTransitionParticipant {
	participate(trusted: boolean): Promise<void>;
}

export interface IWorkspaceTrustUriInfo {
	uri: URI;
	trusted: boolean;
}

export interface IWorkspaceTrustInfo {
	uriTrustInfo: IWorkspaceTrustUriInfo[];
}
