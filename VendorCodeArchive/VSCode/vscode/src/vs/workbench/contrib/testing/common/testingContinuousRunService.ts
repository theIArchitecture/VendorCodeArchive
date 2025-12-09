//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorunIterableDelta, ISettableObservable, observableValue } from '../../../../base/common/observable.js';
import { WellDefinedPrefixTree } from '../../../../base/common/prefixTree.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { StoredValue } from './storedValue.js';
import { TestId } from './testId.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { ITestProfileService } from './testProfileService.js';
import { ITestService } from './testService.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 24: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 24: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ITestRunProfile, TestRunProfileBitset } from './testTypes.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 48: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 48: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 57: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 59: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 59: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 68: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 70: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 70: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 79: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 90: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 101: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 112: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 123: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 136: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 136: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 145: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 147: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 147: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 156: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 167: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 169: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 169: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 180: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 180: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 191: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 191: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 202: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 202: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 211: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 213: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 213: Missing service brand declaration - breaks VSCode's DI system type safety
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
//   1. Line 233: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 235: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 246: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 246: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 255: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 266: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 268: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 268: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 277: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 279: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 279: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 299: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 321: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 323: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 345: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 345: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 354: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 356: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 356: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 365: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 367: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 367: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 376: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 378: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 378: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ITestingContinuousRunService = createDecorator<ITestingContinuousRunService>('testingContinuousRunService');

export interface ITestingContinuousRunService {
	readonly _serviceBrand: undefined;

	/**
	 * Gets a list of the last test profiles that were continuously run in the workspace.
	 */
	readonly lastRunProfileIds: ReadonlySet<number>;

	/**
	 * Fired when a test is added or removed from continous run, or when
	 * enablement is changed globally.
	 */
	onDidChange: Event<string | undefined>;

	/**
	 * Gets whether continous run is specifically enabled for the given test ID.
	 */
	isSpecificallyEnabledFor(testId: string): boolean;

	/**
	 * Gets whether continous run is specifically enabled for
	 * the given test ID, or any of its parents.
	 */
	isEnabledForAParentOf(testId: string): boolean;

	/**
	 * Gets whether continous run is specifically enabled for
	 * the given test ID, or any of its parents.
	 */
	isEnabledForAChildOf(testId: string): boolean;

	/**
	 * Gets whether continuous run is turned on for the given profile.
	 */
	isEnabledForProfile(profile: ITestRunProfile): boolean;

	/**
	 * Gets whether it's enabled at all.
	 */
	isEnabled(): boolean;

	/**
	 * Starts a continuous auto run with a specific set of profiles, or all
	 * default profiles in a group. Globally if no test is given,
	 * for a specific test otherwise.
	 */
	start(profile: ITestRunProfile[] | TestRunProfileBitset, testId?: string): void;

	/**
	 * Stops a continuous run for the given test profile.
	 */
	stopProfile(profile: ITestRunProfile): void;

	/**
	 * Stops any continuous run
	 * Globally if no test is given, for a specific test otherwise.
	 */
	stop(testId?: string): void;
}

type RunningRef = { path: readonly string[]; profiles: ISettableObservable<ITestRunProfile[]>; autoSetDefault?: boolean; handle: DisposableStore };

export class TestingContinuousRunService extends Disposable implements ITestingContinuousRunService {
	declare readonly _serviceBrand: undefined;

	private readonly changeEmitter = new Emitter<string | undefined>();
	private readonly running = new WellDefinedPrefixTree<RunningRef>();
	private readonly lastRun: StoredValue<Set<number>>;

	public readonly onDidChange = this.changeEmitter.event;

	public get lastRunProfileIds() {
		return this.lastRun.get(new Set());
	}

	constructor(
		@ITestService private readonly testService: ITestService,
		@IStorageService storageService: IStorageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ITestProfileService private readonly testProfileService: ITestProfileService,
	) {
		super();
		const isGloballyOn = TestingContextKeys.isContinuousModeOn.bindTo(contextKeyService);
		this._register(this.onDidChange(() => {
			isGloballyOn.set(!!this.running.root.value);
		}));
		this.lastRun = this._register(new StoredValue<Set<number>>({
			key: 'lastContinuousRunProfileIds',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE,
			serialization: {
				deserialize: v => new Set(JSON.parse(v)),
				serialize: v => JSON.stringify([...v])
			},
		}, storageService));

		this._register(toDisposable(() => {
			for (const cts of this.running.values()) {
				cts.handle.dispose();
			}
		}));
	}

	/** @inheritdoc */
	public isSpecificallyEnabledFor(testId: string): boolean {
		return this.running.size > 0 && this.running.hasKey(TestId.fromString(testId).path);
	}

	/** @inheritdoc */
	public isEnabledForAParentOf(testId: string): boolean {
		return !!this.running.root.value || (this.running.size > 0 && this.running.hasKeyOrParent(TestId.fromString(testId).path));
	}

	/** @inheritdoc */
	public isEnabledForProfile({ profileId, controllerId }: ITestRunProfile): boolean {
		for (const node of this.running.values()) {
			if (node.profiles.get().some(p => p.profileId === profileId && p.controllerId === controllerId)) {
				return true;
			}
		}

		return false;
	}

	/** @inheritdoc */
	public isEnabledForAChildOf(testId: string): boolean {
		return !!this.running.root.value || (this.running.size > 0 && this.running.hasKeyOrChildren(TestId.fromString(testId).path));
	}

	/** @inheritdoc */
	public isEnabled(): boolean {
		return !!this.running.root.value || this.running.size > 0;
	}

	/** @inheritdoc */
	public start(profiles: ITestRunProfile[] | TestRunProfileBitset, testId?: string): void {
		const store = new DisposableStore();

		let actualProfiles: ISettableObservable<ITestRunProfile[]>;
		if (profiles instanceof Array) {
			actualProfiles = observableValue('crProfiles', profiles);
		} else {
			// restart the continuous run when default profiles change, if we were
			// asked to run for a group
			const getRelevant = () => this.testProfileService.getGroupDefaultProfiles(profiles)
				.filter(p => p.supportsContinuousRun && (!testId || TestId.root(testId) === p.controllerId));
			actualProfiles = observableValue('crProfiles', getRelevant());
			store.add(this.testProfileService.onDidChange(() => {
				if (ref.autoSetDefault) {
					const newRelevant = getRelevant();
					if (!arrays.equals(newRelevant, actualProfiles.get())) {
						actualProfiles.set(getRelevant(), undefined);
					}
				}
			}));
		}

		const path = testId ? TestId.fromString(testId).path : [];
		const ref: RunningRef = { profiles: actualProfiles, handle: store, path, autoSetDefault: typeof profiles === 'number' };

		// If we're already running this specific test, then add the profile and turn
		// off the auto-addition of bitset-based profiles.
		const existing = this.running.find(path);
		if (existing) {
			store.dispose();
			ref.autoSetDefault = existing.autoSetDefault = false;
			existing.profiles.set([...new Set([...actualProfiles.get(), ...existing.profiles.get()])], undefined);
			this.changeEmitter.fire(testId);
			return;
		}

		this.running.insert(path, ref);

		const cancellationStores = new DisposableMap<ITestRunProfile, CancellationTokenSource>();
		store.add(toDisposable(() => {
			for (const cts of cancellationStores.values()) {
				cts.cancel();
			}
			cancellationStores.dispose();
		}));
		store.add(autorunIterableDelta(reader => actualProfiles.read(reader), ({ addedValues, removedValues }) => {
			for (const profile of addedValues) {
				const cts = new CancellationTokenSource();
				this.testService.startContinuousRun({
					continuous: true,
					group: profile.group,
					targets: [{
						testIds: [testId ?? profile.controllerId],
						controllerId: profile.controllerId,
						profileId: profile.profileId
					}],
				}, cts.token);
				cancellationStores.set(profile, cts);
			}

			for (const profile of removedValues) {
				cancellationStores.get(profile)?.cancel();
				cancellationStores.deleteAndDispose(profile);
			}

			this.lastRun.store(new Set([...cancellationStores.keys()].map(p => p.profileId)));
		}));

		this.changeEmitter.fire(testId);
	}

	/** Stops a continuous run for the profile across all test items that are running it. */
	stopProfile({ profileId, controllerId }: ITestRunProfile): void {
		const toDelete: RunningRef[] = [];
		for (const node of this.running.values()) {
			const profs = node.profiles.get();
			const filtered = profs.filter(p => p.profileId !== profileId || p.controllerId !== controllerId);
			if (filtered.length === profs.length) {
				continue;
			} else if (filtered.length === 0) {
				toDelete.push(node);
			} else {
				node.profiles.set(filtered, undefined);
			}
		}

		for (let i = toDelete.length - 1; i >= 0; i--) {
			toDelete[i].handle.dispose();
			this.running.delete(toDelete[i].path);
		}

		this.changeEmitter.fire(undefined);
	}

	/** @inheritdoc */
	public stop(testId?: string): void {
		const cancellations = [...this.running.deleteRecursive(testId ? TestId.fromString(testId).path : [])];
		// deleteRecursive returns a BFS order, reverse it so children are cancelled before parents
		for (let i = cancellations.length - 1; i >= 0; i--) {
			cancellations[i].handle.dispose();
		}

		this.changeEmitter.fire(testId);
	}
}
