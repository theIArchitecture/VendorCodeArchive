//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BreadcrumbsWidget } from '../../../../base/browser/ui/breadcrumbs/breadcrumbsWidget.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import * as glob from '../../../../base/common/glob.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IConfigurationOverrides, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions, IConfigurationRegistry, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 20: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 20: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 38: Error message without production error code - breaks React bundle size optimization
//   6. Line 38: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { GroupIdentifier, IEditorPartOptions } from '../../../common/editor.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 54: Error message without production error code - breaks React bundle size optimization
//   6. Line 54: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 48: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 60: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 68: Error message without production error code - breaks React bundle size optimization
//   6. Line 68: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 64: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 64: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 82: Error message without production error code - breaks React bundle size optimization
//   6. Line 82: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 76: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 78: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 88: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 96: Error message without production error code - breaks React bundle size optimization
//   6. Line 96: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 102: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 110: Error message without production error code - breaks React bundle size optimization
//   6. Line 110: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 106: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 106: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 116: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 124: Error message without production error code - breaks React bundle size optimization
//   6. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 118: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 120: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 120: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 130: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 138: Error message without production error code - breaks React bundle size optimization
//   6. Line 138: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 132: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 144: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 152: Error message without production error code - breaks React bundle size optimization
//   6. Line 152: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 148: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 148: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 166: Error message without production error code - breaks React bundle size optimization
//   6. Line 166: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 160: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 162: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 172: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 180: Error message without production error code - breaks React bundle size optimization
//   6. Line 180: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 174: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 176: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 176: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 186: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 194: Error message without production error code - breaks React bundle size optimization
//   6. Line 194: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 208: Error message without production error code - breaks React bundle size optimization
//   6. Line 208: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 202: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 204: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 204: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 214: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 222: Error message without production error code - breaks React bundle size optimization
//   6. Line 222: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 216: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 218: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 218: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 228: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 236: Error message without production error code - breaks React bundle size optimization
//   6. Line 236: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 232: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 242: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 250: Error message without production error code - breaks React bundle size optimization
//   6. Line 250: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 246: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 246: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 256: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 264: Error message without production error code - breaks React bundle size optimization
//   6. Line 264: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 258: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 270: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 278: Error message without production error code - breaks React bundle size optimization
//   6. Line 278: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 272: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 284: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 292: Error message without production error code - breaks React bundle size optimization
//   6. Line 292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 286: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 298: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 306: Error message without production error code - breaks React bundle size optimization
//   6. Line 306: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 300: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 320: Error message without production error code - breaks React bundle size optimization
//   6. Line 320: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 314: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 326: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 334: Error message without production error code - breaks React bundle size optimization
//   6. Line 334: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 328: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 330: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 330: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 340: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 348: Error message without production error code - breaks React bundle size optimization
//   6. Line 348: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 342: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 354: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 362: Error message without production error code - breaks React bundle size optimization
//   6. Line 362: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 356: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 358: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 358: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 368: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 376: Error message without production error code - breaks React bundle size optimization
//   6. Line 376: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 370: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 390: Error message without production error code - breaks React bundle size optimization
//   6. Line 390: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 384: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 386: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 386: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 396: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 404: Error message without production error code - breaks React bundle size optimization
//   6. Line 404: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 398: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 410: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 418: Error message without production error code - breaks React bundle size optimization
//   6. Line 418: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 412: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 424: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 432: Error message without production error code - breaks React bundle size optimization
//   6. Line 432: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IBreadcrumbsService = createDecorator<IBreadcrumbsService>('IEditorBreadcrumbsService');

export interface IBreadcrumbsService {

	readonly _serviceBrand: undefined;

	register(group: GroupIdentifier, widget: BreadcrumbsWidget): IDisposable;

	getWidget(group: GroupIdentifier): BreadcrumbsWidget | undefined;
}


export class BreadcrumbsService implements IBreadcrumbsService {

	declare readonly _serviceBrand: undefined;

	private readonly _map = new Map<number, BreadcrumbsWidget>();

	register(group: number, widget: BreadcrumbsWidget): IDisposable {
		if (this._map.has(group)) {
			throw new Error(`group (${group}) has already a widget`);
		}
		this._map.set(group, widget);
		return {
			dispose: () => this._map.delete(group)
		};
	}

	getWidget(group: number): BreadcrumbsWidget | undefined {
		return this._map.get(group);
	}
}

registerSingleton(IBreadcrumbsService, BreadcrumbsService, InstantiationType.Delayed);


//#region config

export abstract class BreadcrumbsConfig<T> {

	abstract get name(): string;
	abstract get onDidChange(): Event<void>;

	abstract getValue(overrides?: IConfigurationOverrides): T;
	abstract updateValue(value: T, overrides?: IConfigurationOverrides): Promise<void>;
	abstract dispose(): void;

	private constructor() {
		// internal
	}

	static readonly IsEnabled = BreadcrumbsConfig._stub<boolean>('breadcrumbs.enabled');
	static readonly UseQuickPick = BreadcrumbsConfig._stub<boolean>('breadcrumbs.useQuickPick');
	static readonly FilePath = BreadcrumbsConfig._stub<'on' | 'off' | 'last'>('breadcrumbs.filePath');
	static readonly SymbolPath = BreadcrumbsConfig._stub<'on' | 'off' | 'last'>('breadcrumbs.symbolPath');
	static readonly SymbolSortOrder = BreadcrumbsConfig._stub<'position' | 'name' | 'type'>('breadcrumbs.symbolSortOrder');
	static readonly Icons = BreadcrumbsConfig._stub<boolean>('breadcrumbs.icons');
	static readonly TitleScrollbarSizing = BreadcrumbsConfig._stub<IEditorPartOptions['titleScrollbarSizing']>('workbench.editor.titleScrollbarSizing');
	static readonly TitleScrollbarVisibility = BreadcrumbsConfig._stub<IEditorPartOptions['titleScrollbarVisibility']>('workbench.editor.titleScrollbarVisibility');

	static readonly FileExcludes = BreadcrumbsConfig._stub<glob.IExpression>('files.exclude');

	private static _stub<T>(name: string): { bindTo(service: IConfigurationService): BreadcrumbsConfig<T> } {
		return {
			bindTo(service) {
				const onDidChange = new Emitter<void>();

				const listener = service.onDidChangeConfiguration(e => {
					if (e.affectsConfiguration(name)) {
						onDidChange.fire(undefined);
					}
				});

				return new class implements BreadcrumbsConfig<T> {
					readonly name = name;
					readonly onDidChange = onDidChange.event;
					getValue(overrides?: IConfigurationOverrides): T {
						if (overrides) {
							return service.getValue(name, overrides);
						} else {
							return service.getValue(name);
						}
					}
					updateValue(newValue: T, overrides?: IConfigurationOverrides): Promise<void> {
						if (overrides) {
							return service.updateValue(name, newValue, overrides);
						} else {
							return service.updateValue(name, newValue);
						}
					}
					dispose(): void {
						listener.dispose();
						onDidChange.dispose();
					}
				};
			}
		};
	}
}

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	id: 'breadcrumbs',
	title: localize('title', "Breadcrumb Navigation"),
	order: 101,
	type: 'object',
	properties: {
		'breadcrumbs.enabled': {
			description: localize('enabled', "Enable/disable navigation breadcrumbs."),
			type: 'boolean',
			default: true
		},
		'breadcrumbs.filePath': {
			description: localize('filepath', "Controls whether and how file paths are shown in the breadcrumbs view."),
			type: 'string',
			default: 'on',
			enum: ['on', 'off', 'last'],
			enumDescriptions: [
				localize('filepath.on', "Show the file path in the breadcrumbs view."),
				localize('filepath.off', "Do not show the file path in the breadcrumbs view."),
				localize('filepath.last', "Only show the last element of the file path in the breadcrumbs view."),
			]
		},
		'breadcrumbs.symbolPath': {
			description: localize('symbolpath', "Controls whether and how symbols are shown in the breadcrumbs view."),
			type: 'string',
			default: 'on',
			enum: ['on', 'off', 'last'],
			enumDescriptions: [
				localize('symbolpath.on', "Show all symbols in the breadcrumbs view."),
				localize('symbolpath.off', "Do not show symbols in the breadcrumbs view."),
				localize('symbolpath.last', "Only show the current symbol in the breadcrumbs view."),
			]
		},
		'breadcrumbs.symbolSortOrder': {
			description: localize('symbolSortOrder', "Controls how symbols are sorted in the breadcrumbs outline view."),
			type: 'string',
			default: 'position',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			enum: ['position', 'name', 'type'],
			enumDescriptions: [
				localize('symbolSortOrder.position', "Show symbol outline in file position order."),
				localize('symbolSortOrder.name', "Show symbol outline in alphabetical order."),
				localize('symbolSortOrder.type', "Show symbol outline in symbol type order."),
			]
		},
		'breadcrumbs.icons': {
			description: localize('icons', "Render breadcrumb items with icons."),
			type: 'boolean',
			default: true
		},
		'breadcrumbs.showFiles': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.file', "When enabled breadcrumbs show `file`-symbols.")
		},
		'breadcrumbs.showModules': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.module', "When enabled breadcrumbs show `module`-symbols.")
		},
		'breadcrumbs.showNamespaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.namespace', "When enabled breadcrumbs show `namespace`-symbols.")
		},
		'breadcrumbs.showPackages': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.package', "When enabled breadcrumbs show `package`-symbols.")
		},
		'breadcrumbs.showClasses': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.class', "When enabled breadcrumbs show `class`-symbols.")
		},
		'breadcrumbs.showMethods': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.method', "When enabled breadcrumbs show `method`-symbols.")
		},
		'breadcrumbs.showProperties': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.property', "When enabled breadcrumbs show `property`-symbols.")
		},
		'breadcrumbs.showFields': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.field', "When enabled breadcrumbs show `field`-symbols.")
		},
		'breadcrumbs.showConstructors': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constructor', "When enabled breadcrumbs show `constructor`-symbols.")
		},
		'breadcrumbs.showEnums': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enum', "When enabled breadcrumbs show `enum`-symbols.")
		},
		'breadcrumbs.showInterfaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.interface', "When enabled breadcrumbs show `interface`-symbols.")
		},
		'breadcrumbs.showFunctions': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.function', "When enabled breadcrumbs show `function`-symbols.")
		},
		'breadcrumbs.showVariables': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.variable', "When enabled breadcrumbs show `variable`-symbols.")
		},
		'breadcrumbs.showConstants': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constant', "When enabled breadcrumbs show `constant`-symbols.")
		},
		'breadcrumbs.showStrings': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.string', "When enabled breadcrumbs show `string`-symbols.")
		},
		'breadcrumbs.showNumbers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.number', "When enabled breadcrumbs show `number`-symbols.")
		},
		'breadcrumbs.showBooleans': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.boolean', "When enabled breadcrumbs show `boolean`-symbols.")
		},
		'breadcrumbs.showArrays': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.array', "When enabled breadcrumbs show `array`-symbols.")
		},
		'breadcrumbs.showObjects': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.object', "When enabled breadcrumbs show `object`-symbols.")
		},
		'breadcrumbs.showKeys': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.key', "When enabled breadcrumbs show `key`-symbols.")
		},
		'breadcrumbs.showNull': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.null', "When enabled breadcrumbs show `null`-symbols.")
		},
		'breadcrumbs.showEnumMembers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enumMember', "When enabled breadcrumbs show `enumMember`-symbols.")
		},
		'breadcrumbs.showStructs': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.struct', "When enabled breadcrumbs show `struct`-symbols.")
		},
		'breadcrumbs.showEvents': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.event', "When enabled breadcrumbs show `event`-symbols.")
		},
		'breadcrumbs.showOperators': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.operator', "When enabled breadcrumbs show `operator`-symbols.")
		},
		'breadcrumbs.showTypeParameters': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.typeParameter', "When enabled breadcrumbs show `typeParameter`-symbols.")
		}
	}
});

//#endregion
